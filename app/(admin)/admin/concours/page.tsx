import { prisma } from "@/lib/prisma"
import ConcoursClient from "./_components/concours-no-ssr"
import type { Competition } from "./_components/concours-client"

function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    day:   "2-digit",
    month: "2-digit",
    year:  "numeric",
  })
}

export default async function ConcoursPage() {
  const rows = await prisma.concours.findMany({
    orderBy: { dateDebut: "desc" },
    include: { _count: { select: { candidatures: true } } },
  })

  const competitions: Competition[] = rows.map((c) => ({
    id:             c.id,
    name:           c.nom,
    description:    c.description ?? "",
    startDate:      formatDate(c.dateDebut),
    endDate:        formatDate(c.dateFin),
    resultsDate:    formatDate(c.dateResultats),
    places:         c.places,
    placesAttente:  c.placesAttente,
    registeredCount:c._count.candidatures,
    status:         c.statut,
    type:           c.type,
    specialites:    c.specialites,
    formule:        c.formule,
  }))

  return <ConcoursClient competitions={competitions} />
}
