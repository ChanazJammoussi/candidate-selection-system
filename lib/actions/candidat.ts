"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

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

  // 1. Trouver le candidat par email
  const candidat = await prisma.candidat.findUnique({ where: { email } });
  if (!candidat) {
    return { success: false, error: "Aucun compte trouvé avec cette adresse email." };
  }

  // 2. Vérifier le mot de passe
  const valide = await bcrypt.compare(password, candidat.password);
  if (!valide) {
    return { success: false, error: "Mot de passe incorrect." };
  }

  // 3. Créer la session
  const session = await getSession();
  session.candidatId = candidat.id;
  session.candidatEmail = candidat.email;
  await session.save();

  return { success: true, data: { id: candidat.id } };
}
