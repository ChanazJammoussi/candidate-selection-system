"use server"

import { z } from "zod"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { CONCOURS_TYPES } from "@/lib/concours-types"
import type { ConcoursTypeId } from "@/lib/concours-types"

const LoginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

export async function loginAdminAction(formData: FormData) {
  const parsed = LoginSchema.safeParse({
    email:    formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) {
    return { error: "Données invalides." }
  }

  const { email, password } = parsed.data

  const admin = await prisma.admin.findUnique({ where: { email } })
  if (!admin) {
    return { error: "Aucun compte administrateur trouvé avec cette adresse email." }
  }

  const valid = await bcrypt.compare(password, admin.password)
  if (!valid) {
    return { error: "Mot de passe incorrect." }
  }

  const session = await getSession()
  session.adminId    = admin.id
  session.adminEmail = admin.email
  await session.save()

  redirect("/admin")
}

// ── Action : vider le cache Next.js ──────────────────────────

export async function viderCacheAction() {
  const session = await getSession()
  if (!session.adminId) return { success: false, error: "Non autorisé." }
  revalidatePath("/", "layout")
  return { success: true }
}

// ── Action : optimiser la base de données ────────────────────

export async function optimiserDbAction() {
  const session = await getSession()
  if (!session.adminId) return { success: false, error: "Non autorisé." }
  await prisma.$executeRawUnsafe("VACUUM ANALYZE")
  return { success: true }
}

// ── Action : réinitialiser les données de test ───────────────

export async function reinitialiserDonneesAction() {
  const session = await getSession()
  if (!session.adminId) return { success: false, error: "Non autorisé." }
  await prisma.$transaction([
    prisma.candidature.deleteMany(),
    prisma.candidat.deleteMany(),
  ])
  revalidatePath("/admin", "layout")
  return { success: true }
}

// ── Action : stats système ───────────────────────────────────

export async function fetchSystemStatsAction() {
  const session = await getSession()
  if (!session.adminId) return null

  const [candidats, candidatures] = await Promise.all([
    prisma.candidat.count(),
    prisma.candidature.findMany({ select: { documents: true } }),
  ])

  const totalDocs = candidatures.reduce((sum, c) => {
    const docs = c.documents as Array<unknown> | null
    return sum + (Array.isArray(docs) ? docs.length : 0)
  }, 0)

  return { candidats, documents: totalDocs }
}

// ── Action : liste des documents à examiner ───────────────────

export type DocumentRow = {
  candidatureId: string
  champId: string
  candidateName: string
  candidateEmail: string
  documentType: string
  fileName: string
  fileSize: string
  url: string
  uploadDate: string
  status: "pending" | "approved" | "rejected" | "correction"
  feedback?: string
}

export async function fetchAllDocumentsAction(): Promise<DocumentRow[]> {
  const session = await getSession()
  if (!session.adminId) return []

  type CandidatureWithRelations = Awaited<ReturnType<typeof prisma.candidature.findMany>> extends Array<infer T> ? T : never

  const raw = await prisma.$queryRaw<Array<{
    id: string; documents: unknown; createdAt: Date;
    candidat_prenom: string; candidat_nom: string; candidat_email: string;
    concours_type: string;
  }>>`
    SELECT c.id, c.documents, c."createdAt",
           ca.prenom AS candidat_prenom, ca.nom AS candidat_nom, ca.email AS candidat_email,
           co.type AS concours_type
    FROM "Candidature" c
    JOIN "Candidat" ca ON ca.id = c."candidatId"
    JOIN "Concours" co ON co.id = c."concoursId"
    WHERE c.documents IS NOT NULL
  `

  const rows: DocumentRow[] = []

  for (const c of raw) {
    const docs = c.documents as Array<{
      champId: string; url: string; fileName: string; size: string;
      status?: string; feedback?: string
    }> | null
    if (!Array.isArray(docs)) continue

    const concoursType = CONCOURS_TYPES[c.concours_type as ConcoursTypeId]

    for (const doc of docs) {
      const champ = concoursType?.champs.find((ch) => ch.id === doc.champId)
      rows.push({
        candidatureId:  c.id,
        champId:        doc.champId,
        candidateName:  `${c.candidat_prenom} ${c.candidat_nom}`,
        candidateEmail: c.candidat_email,
        documentType:   champ?.label ?? doc.champId,
        fileName:       doc.fileName,
        fileSize:       doc.size,
        url:            doc.url,
        uploadDate:     new Date(c.createdAt).toLocaleDateString("fr-TN"),
        status:         (doc.status ?? "pending") as DocumentRow["status"],
        feedback:       doc.feedback,
      })
    }
  }

  return rows
}

// ── Action : révision d'un document ─────────────────────────

export async function reviewDocumentAction(
  candidatureId: string,
  champId: string,
  status: "approved" | "rejected" | "correction",
  feedback: string
): Promise<{ success: boolean }> {
  const session = await getSession()
  if (!session.adminId) return { success: false }

  const candidature = await prisma.candidature.findUnique({
    where: { id: candidatureId },
    select: { documents: true },
  })
  if (!candidature?.documents) return { success: false }

  const docs = candidature.documents as Array<{ champId: string; [key: string]: unknown }>
  const updated = docs.map((d) =>
    d.champId === champId
      ? { ...d, status, ...(feedback ? { feedback } : {}) }
      : d
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await prisma.candidature.update({ where: { id: candidatureId }, data: { documents: updated as any } })
  revalidatePath("/admin/documents")
  return { success: true }
}

// ── Action : update statut candidature ───────────────────────

export async function updateCandidatureStatutAction(
  candidatureId: string,
  statut: "en_attente" | "acceptee" | "rejetee" | "liste_attente"
) {
  await prisma.candidature.update({
    where: { id: candidatureId },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { statut: statut as any },
  })
  revalidatePath("/admin/candidats")
  revalidatePath("/admin/candidatures")
  revalidatePath("/admin")
  return { success: true }
}
