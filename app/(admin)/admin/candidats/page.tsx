import { prisma } from "@/lib/prisma"
import CandidatsClient from "./_components/candidats-client"

export default async function CandidatsPage() {
  const rows = await prisma.candidature.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      candidat: { select: { cin: true, nom: true, prenom: true, email: true } },
      concours: { select: { nom: true } },
    },
  })

  const candidatures = rows.map((r) => ({
    id:        r.id,
    candidat:  r.candidat,
    concours:  r.concours,
    statut:    r.statut as "en_attente" | "acceptee" | "rejetee" | "liste_attente",
    score:     r.score,
    createdAt: r.createdAt.toLocaleDateString("fr-FR"),
  }))

  return <CandidatsClient candidatures={candidatures} />
}
