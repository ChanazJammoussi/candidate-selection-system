"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { ConcoursOption } from "@/components/ui/concours-selector"

function fmt(d: Date) {
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export async function fetchConcoursListAction(): Promise<ConcoursOption[]> {
  const rows = await prisma.concours.findMany({
    orderBy: { dateDebut: "desc" },
    include: { _count: { select: { candidatures: true } } },
  })
  return rows.map((c) => ({
    id:             c.id,
    name:           c.nom,
    status:         c.statut,
    startDate:      fmt(c.dateDebut),
    endDate:        fmt(c.dateFin),
    places:         c.places,
    registeredCount:c._count.candidatures,
  }))
}

export async function fetchCandidaturesByConcoursAction(concoursId: string) {
  const rows = await prisma.candidature.findMany({
    where: { concoursId },
    include: { candidat: { select: { nom: true, prenom: true, cin: true, email: true, phone: true } } },
    orderBy: { score: "desc" },
  })

  return rows.map((c) => {
    const d = (c.donnees as Record<string, unknown>) ?? {}
    const anneesPrepa   = (d.anneesPrepa   as { niveau?: string; anneeScolaire?: string; moyenne?: string; etablissement?: string }[]) ?? []
    const anneesLicence = (d.anneesLicence as { niveau?: string; anneeScolaire?: string; moyenne?: string; etablissement?: string }[]) ?? []
    const anneesEtude   = [...anneesPrepa, ...anneesLicence].map((a) => ({
      niveau:  a.niveau  ?? "",
      annee:   a.anneeScolaire ?? "",
      moyenne: parseFloat(a.moyenne ?? "0") || 0,
    }))
    const docs = (Array.isArray(c.documents) ? c.documents : []) as {
      id?: string; champId?: string; label: string; fileName: string; url?: string; status?: string
    }[]

    const STATUT_MAP: Record<string, "pending" | "accepted" | "rejected"> = {
      en_attente:    "pending",
      acceptee:      "accepted",
      rejetee:       "rejected",
      liste_attente: "pending",
    }

    return {
      id:             c.id,
      candidatId:     c.candidatId,
      nom:            c.candidat.nom,
      prenom:         c.candidat.prenom,
      cin:            c.candidat.cin,
      email:          c.candidat.email,
      phone:          c.candidat.phone ?? "—",
      birthDate:      (d.dateNaissance as string) ?? "—",
      gouvernorat:    "—",
      ville:          "—",
      adresse:        "—",
      concoursId:     c.concoursId,
      specialite:     (d.filiere_prepa as string) ?? (d.specialite as string) ?? "—",
      etablissement:  anneesPrepa[0]?.etablissement ?? anneesLicence[0]?.etablissement ?? "—",
      score:          c.score ?? 0,
      submittedAt:    c.createdAt.toLocaleDateString("fr-FR"),
      status:         STATUT_MAP[c.statut] ?? "pending",
      commentaire:    undefined as string | undefined,
      diplome:        (d.bac as Record<string, unknown>)?.section as string ?? "—",
      moyenneGenerale:c.score ?? 0,
      anneesEtude,
      documents: docs.map((doc, i) => ({
        id:       doc.id ?? doc.champId ?? String(i),
        label:    doc.label,
        fileName: doc.fileName,
        status:   (doc.status ?? "pending") as "pending" | "approved" | "rejected",
        url:      doc.url,
      })),
    }
  })
}

export async function fetchResultatsAction(concoursId: string) {
  const [concours, groups, agg] = await Promise.all([
    prisma.concours.findUnique({ where: { id: concoursId }, select: { statut: true } }),
    prisma.candidature.groupBy({ by: ["statut"], where: { concoursId }, _count: { _all: true } }),
    prisma.candidature.aggregate({
      where: { concoursId, score: { not: null } },
      _avg: { score: true }, _max: { score: true }, _min: { score: true },
    }),
  ])

  const cnt = (s: string) => groups.find((g) => g.statut === s)?._count._all ?? 0
  const total     = groups.reduce((sum, g) => sum + g._count._all, 0)
  const admis     = cnt("acceptee")
  const attente   = cnt("liste_attente")
  const nonRetenus = total - admis - attente

  return {
    isPublished:      concours?.statut === "results_published",
    totalCandidates:  total,
    admis,
    listeAttente:     attente,
    nonRetenus:       Math.max(nonRetenus, 0),
    scoreMoyen:       Math.round((agg._avg.score ?? 0) * 100) / 100,
    scoreMax:         Math.round((agg._max.score ?? 0) * 100) / 100,
    scoreMin:         Math.round((agg._min.score ?? 0) * 100) / 100,
  }
}

export async function publishResultatsAction(concoursId: string) {
  await prisma.concours.update({ where: { id: concoursId }, data: { statut: "results_published" } })
  revalidatePath("/admin/resultats")
  revalidatePath("/admin")
  return { success: true }
}

const CreateSchema = z.object({
  nom:          z.string().min(1),
  description:  z.string().optional(),
  type:         z.enum(["ing_prepa", "ing_licence", "master"]),
  dateDebut:    z.string().min(1),
  dateFin:      z.string().min(1),
  dateResultats:z.string().min(1),
  places:       z.coerce.number().int().positive(),
  specialites:  z.array(z.string()),
  formule:      z.string().min(1),
})

export async function createConcoursAction(data: {
  nom: string
  description: string
  type: string
  dateDebut: string
  dateFin: string
  dateResultats: string
  places: number
  specialites: string[]
  formule: string
}) {
  const parsed = CreateSchema.safeParse(data)
  if (!parsed.success) return { error: "Données invalides." }

  await prisma.concours.create({
    data: {
      nom:          parsed.data.nom,
      description:  parsed.data.description,
      type:         parsed.data.type,
      statut:       "draft",
      dateDebut:    new Date(parsed.data.dateDebut),
      dateFin:      new Date(parsed.data.dateFin),
      dateResultats:new Date(parsed.data.dateResultats),
      places:       parsed.data.places,
      specialites:  parsed.data.specialites,
      formule:      parsed.data.formule,
    },
  })

  revalidatePath("/admin/concours")
  return { success: true }
}

export async function updateConcoursConfigAction(
  id: string,
  specialites: string[],
  formule: string,
  placesAttente: number
) {
  await prisma.concours.update({
    where: { id },
    data:  { specialites, formule, placesAttente },
  })
  revalidatePath("/admin/concours")
  return { success: true }
}

export async function deleteConcoursAction(id: string) {
  await prisma.concours.delete({ where: { id } })
  revalidatePath("/admin/concours")
  return { success: true }
}

function evalFormule(formule: string, donnees: Record<string, unknown>): number {
  let expr = formule
  for (const [key, val] of Object.entries(donnees)) {
    const num = typeof val === "number" ? val : parseFloat(String(val)) || 0
    expr = expr.replace(new RegExp(`\\b${key}\\b`, "g"), String(num))
  }
  expr = expr.replace(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g, "0")
  try {
    // eslint-disable-next-line no-new-func
    const result = new Function(`return ${expr}`)()
    return typeof result === "number" && isFinite(result) ? Math.round(result * 100) / 100 : 0
  } catch {
    return 0
  }
}

export async function fetchCandidaturesRanking(concoursId: string) {
  const candidatures = await prisma.candidature.findMany({
    where: { concoursId },
    include: { candidat: { select: { prenom: true, nom: true, email: true } } },
    orderBy: { score: "desc" },
  })
  return candidatures.map((c, i) => ({
    rank: i + 1,
    id: c.id,
    name: `${c.candidat.prenom} ${c.candidat.nom}`,
    email: c.candidat.email,
    totalScore: c.score ?? 0,
    statut: c.statut as string,
  }))
}

export async function generateRankingAction(concoursId: string) {
  const concours = await prisma.concours.findUnique({
    where: { id: concoursId },
    include: {
      candidatures: {
        include: { candidat: { select: { prenom: true, nom: true, email: true } } },
      },
    },
  })
  if (!concours) return { error: "Concours introuvable." }

  const scored = concours.candidatures.map((c) => ({
    id: c.id,
    name: `${c.candidat.prenom} ${c.candidat.nom}`,
    email: c.candidat.email,
    score: evalFormule(concours.formule, (c.donnees as Record<string, unknown>) ?? {}),
  }))

  scored.sort((a, b) => b.score - a.score)

  await Promise.all(
    scored.map(({ id, score }) =>
      prisma.candidature.update({ where: { id }, data: { score } })
    )
  )

  revalidatePath("/admin/classement")
  revalidatePath("/admin")

  return {
    success: true,
    candidates: scored.map((c, i) => ({ ...c, rank: i + 1, totalScore: c.score })),
  }
}

export async function updateConcoursStatutAction(
  id: string,
  statut: "draft" | "open" | "closed" | "results_published"
) {
  await prisma.concours.update({ where: { id }, data: { statut } })
  revalidatePath("/admin/concours")
  return { success: true }
}
