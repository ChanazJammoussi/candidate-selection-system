import { prisma } from "@/lib/prisma"
import { CONCOUR_TYPE_LABELS } from "@/lib/concours-types"
import CandidatSelectClient from "./_components/candidat-select-client"
import type { ConcoursOuvert } from "./_components/candidat-select-client"

export default async function CandidatSelectPage() {
  const rows = await prisma.concours.findMany({
    where:   { statut: "open" },
    orderBy: { dateDebut: "asc" },
    include: { _count: { select: { candidatures: true } } },
  })

  const concours: ConcoursOuvert[] = rows.map((c) => ({
    id:               c.id,
    nom:              c.nom,
    description:      c.description ?? "",
    typeLabel:        CONCOUR_TYPE_LABELS[c.type],
    specialites:      c.specialites,
    dateCloture:      c.dateFin.toLocaleDateString("fr-FR", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                      }),
    places:           c.places,
    candidatsInscrits:c._count.candidatures,
  }))

  return <CandidatSelectClient concours={concours} />
}
