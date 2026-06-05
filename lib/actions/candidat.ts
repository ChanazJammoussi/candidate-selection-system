"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ── Schéma de validation ──────────────────────────────────────

const InscriptionSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName:  z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  cin:       z.string().min(8, "Le CIN est invalide"),
  email:     z.string().email("Email invalide"),
  phone:     z.string().optional(),
  password:  z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export type InscriptionInput = z.infer<typeof InscriptionSchema>;

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// ── Action : inscription d'un candidat ───────────────────────

export async function inscrireCandidatAction(
  input: InscriptionInput
): Promise<ActionResult<{ id: string }>> {
  // 1. Validation
  const parsed = InscriptionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const { firstName, lastName, cin, email, phone, password } = parsed.data;

  // 2. Vérifier que l'email ou le CIN n'existe pas déjà
  const existant = await prisma.candidat.findFirst({
    where: { OR: [{ email }, { cin }] },
  });
  if (existant) {
    const champ = existant.email === email ? "email" : "CIN";
    return { success: false, error: `Ce ${champ} est déjà utilisé.` };
  }

  // 3. Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Créer le candidat
  const candidat = await prisma.candidat.create({
    data: {
      prenom:   firstName,
      nom:      lastName,
      cin,
      email,
      phone:    phone ?? null,
      password: hashedPassword,
    },
  });

  return { success: true, data: { id: candidat.id } };
}

// ── Action : soumission d'une candidature ────────────────────

export async function submitCandidatureAction(
  concoursId: string,
  donnees: Record<string, unknown>
): Promise<ActionResult<{ id: string }>> {
  const session = await getSession();
  if (!session.candidatId) {
    return { success: false, error: "Vous devez être connecté pour soumettre une candidature." };
  }

  const concours = await prisma.concours.findUnique({ where: { id: concoursId } });
  if (!concours) return { success: false, error: "Concours introuvable." };
  if (concours.statut !== "open") {
    return { success: false, error: "Ce concours n'est plus ouvert aux candidatures." };
  }

  const docs = Array.isArray((donnees as Record<string, unknown>).documents)
    ? (donnees as Record<string, unknown>).documents
    : undefined

  const candidature = await prisma.candidature.upsert({
    where: { candidatId_concoursId: { candidatId: session.candidatId, concoursId } },
    update: { donnees, ...(docs !== undefined ? { documents: docs as never } : {}) },
    create: { candidatId: session.candidatId, concoursId, donnees, ...(docs !== undefined ? { documents: docs as never } : {}) },
  });

  revalidatePath(`/candidat/${concoursId}/candidature`);
  return { success: true, data: { id: candidature.id } };
}

// ── Action : mise à jour du profil ───────────────────────────

const UpdateProfilSchema = z.object({
  firstName:      z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName:       z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  cin:            z.string().min(8, "Le CIN est invalide"),
  email:          z.string().email("Email invalide"),
  phone:          z.string().optional(),
  birthDate:      z.string().optional(),
  gouvernorat:    z.string().optional(),
  ville:          z.string().optional(),
  codePostal:     z.string().optional(),
  adresse:        z.string().optional(),
  diploma:        z.string().optional(),
  institution:    z.string().optional(),
  specialization: z.string().optional(),
  graduationYear: z.string().optional(),
  gpa:            z.string().optional(),
});

export async function updateProfilAction(
  input: z.infer<typeof UpdateProfilSchema>
): Promise<ActionResult> {
  const session = await getSession();
  if (!session.candidatId) {
    return { success: false, error: "Vous devez être connecté." };
  }

  const parsed = UpdateProfilSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const {
    firstName, lastName, cin, email, phone,
    birthDate, gouvernorat, ville, codePostal, adresse,
    diploma, institution, specialization, graduationYear, gpa,
  } = parsed.data;

  const conflict = await prisma.candidat.findFirst({
    where: {
      OR: [{ email }, { cin }],
      NOT: { id: session.candidatId },
    },
  });
  if (conflict) {
    const champ = conflict.email === email ? "email" : "CIN";
    return { success: false, error: `Ce ${champ} est déjà utilisé par un autre compte.` };
  }

  await prisma.candidat.update({
    where: { id: session.candidatId },
    data: {
      prenom:         firstName,
      nom:            lastName,
      cin,
      email,
      phone:          phone          ?? null,
      birthDate:      birthDate      ?? null,
      gouvernorat:    gouvernorat    ?? null,
      ville:          ville          ?? null,
      codePostal:     codePostal     ?? null,
      adresse:        adresse        ?? null,
      diploma:        diploma        ?? null,
      institution:    institution    ?? null,
      specialization: specialization ?? null,
      graduationYear: graduationYear ?? null,
      gpa:            gpa            ?? null,
    },
  });

  revalidatePath("/candidat");
  return { success: true, data: undefined };
}

// ── Action : connexion d'un candidat ─────────────────────────

const LoginSchema = z.object({
  email:    z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export async function loginCandidatAction(
  input: z.infer<typeof LoginSchema>
): Promise<ActionResult<{ id: string }>> {
  const parsed = LoginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const { email, password } = parsed.data;

  const candidat = await prisma.candidat.findUnique({ where: { email } });
  if (!candidat) {
    return { success: false, error: "Aucun compte trouvé avec cette adresse email." };
  }

  if (!candidat.isActive) {
    return { success: false, error: "Ce compte a été désactivé. Contactez l'administrateur." };
  }

  const valide = await bcrypt.compare(password, candidat.password);
  if (!valide) {
    return { success: false, error: "Mot de passe incorrect." };
  }

  const session = await getSession();
  session.candidatId = candidat.id;
  session.candidatEmail = candidat.email;
  await session.save();

  return { success: true, data: { id: candidat.id } };
}

// ── Action : récupérer les infos du candidat connecté ────────

export async function fetchCurrentCandidatAction() {
  const session = await getSession();
  if (!session.candidatId) return null;
  return prisma.candidat.findUnique({
    where: { id: session.candidatId },
    select: { prenom: true, nom: true, email: true, phone: true },
  });
}

// ── Action : déconnexion ──────────────────────────────────────

export async function deconnecterSessionAction(): Promise<void> {
  const session = await getSession();
  await session.destroy();
  redirect("/candidat/login");
}

// ── Action : désactivation du compte ─────────────────────────

export async function desactiverCompteAction(): Promise<ActionResult> {
  const session = await getSession();
  if (!session.candidatId) {
    return { success: false, error: "Non authentifié." };
  }
  await prisma.candidat.update({
    where: { id: session.candidatId },
    data:  { isActive: false },
  });
  await session.destroy();
  redirect("/candidat/login");
}

// ── Action : suppression du compte ───────────────────────────

export async function supprimerCompteAction(): Promise<ActionResult> {
  const session = await getSession();
  if (!session.candidatId) {
    return { success: false, error: "Non authentifié." };
  }
  const candidatId = session.candidatId;
  await prisma.$transaction([
    prisma.candidature.deleteMany({ where: { candidatId } }),
    prisma.candidat.delete({ where: { id: candidatId } }),
  ]);
  await session.destroy();
  redirect("/");
}
