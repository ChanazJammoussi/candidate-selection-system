import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Calendar } from "lucide-react"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import ResultatsClient from "../_components/resultats-client"

export default async function ResultatsPage({ params }: { params: { concourId: string } }) {
  const session = await getSession()

  const concours = await prisma.concours.findUnique({
    where: { id: params.concourId },
    select: { nom: true, statut: true, places: true, dateResultats: true },
  })

  if (!concours) notFound()

  const resultsPublished = concours.statut === "results_published"

  if (!resultsPublished) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Résultats</h2>
          <p className="text-muted-foreground">Consultez les résultats de votre candidature</p>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Résultats non encore publiés</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Les résultats du concours seront publiés le{" "}
              {concours.dateResultats.toLocaleDateString("fr-TN", { day: "numeric", month: "long", year: "numeric" })}.
              Vous recevrez une notification dès leur publication.
            </p>
            <div className="flex items-center gap-2 mt-6 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Publication prévue :{" "}
                {concours.dateResultats.toLocaleDateString("fr-TN", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Résultats publiés : fetch toutes les données
  const [maCandidature, toutes] = await Promise.all([
    session.candidatId
      ? prisma.candidature.findUnique({
          where: {
            candidatId_concoursId: {
              candidatId: session.candidatId,
              concoursId: params.concourId,
            },
          },
          select: { statut: true, score: true },
        })
      : null,
    prisma.candidature.findMany({
      where: { concoursId: params.concourId, score: { not: null } },
      include: { candidat: { select: { id: true, prenom: true, nom: true } } },
      orderBy: { score: "desc" },
    }),
  ])

  const ranking = toutes.map((c, index) => ({
    rank: index + 1,
    name: `${c.candidat.prenom} ${c.candidat.nom}`,
    score: c.score!,
    statut: c.statut as "acceptee" | "liste_attente" | "rejetee" | "en_attente",
    isCurrentUser: c.candidat.id === session.candidatId,
  }))

  return (
    <ResultatsClient
      myCandidature={
        maCandidature
          ? {
              statut: maCandidature.statut as "acceptee" | "liste_attente" | "rejetee" | "en_attente",
              score: maCandidature.score,
            }
          : null
      }
      concours={{
        nom: concours.nom,
        places: concours.places,
        dateResultats: concours.dateResultats.toLocaleDateString("fr-TN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      }}
      ranking={ranking}
    />
  )
}
