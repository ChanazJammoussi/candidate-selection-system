import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, TrendingUp } from "lucide-react"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
  if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />
  return null
}

function getStatusBadge(statut: string) {
  if (statut === "acceptee")      return <Badge className="bg-success text-success-foreground">Admis</Badge>
  if (statut === "liste_attente") return <Badge className="bg-warning text-warning-foreground">Liste d'attente</Badge>
  return <Badge variant="outline">En cours</Badge>
}

export default async function ClassementPage({
  params,
}: {
  params: Promise<{ concourId: string }>
}) {
  const { concourId } = await params
  const session = await getSession()

  const concours = await prisma.concours.findUnique({
    where: { id: concourId },
    select: { nom: true, places: true },
  })
  if (!concours) notFound()

  const candidatures = await prisma.candidature.findMany({
    where: { concoursId: concourId, score: { not: null } },
    include: { candidat: { select: { id: true, prenom: true, nom: true } } },
    orderBy: { score: "desc" },
  })

  const ranked = candidatures.map((c, i) => ({
    rank:          i + 1,
    candidatureId: c.id,
    candidatId:    c.candidat.id,
    name:          `${c.candidat.prenom} ${c.candidat.nom}`,
    score:         c.score!,
    statut:        c.statut,
    isCurrentUser: c.candidat.id === session.candidatId,
  }))

  const currentUser = ranked.find((r) => r.isCurrentUser) ?? null
  const total = await prisma.candidature.count({ where: { concoursId: concourId } })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Classement</h2>
        <p className="text-muted-foreground">Classement provisoire — {concours.nom}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Votre position</CardTitle>
          </CardHeader>
          <CardContent>
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{currentUser.rank}</span>
                <span className="text-lg text-muted-foreground">/ {ranked.length}</span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-muted-foreground">—</span>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Votre score</CardTitle>
          </CardHeader>
          <CardContent>
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{currentUser.score.toFixed(2)}</span>
                <span className="text-lg text-muted-foreground">/ 20</span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-muted-foreground">—</span>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Places disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{concours.places}</span>
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total candidats</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">{total}</span>
          </CardContent>
        </Card>
      </div>

      {/* Position du candidat connecté */}
      {currentUser && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                {currentUser.rank}
              </div>
              <div>
                <h3 className="font-semibold">{currentUser.name} <span className="text-muted-foreground font-normal">(Vous)</span></h3>
                <p className="text-sm text-muted-foreground">Score : {currentUser.score.toFixed(2)}/20</p>
              </div>
            </div>
            {getStatusBadge(currentUser.statut)}
          </CardContent>
        </Card>
      )}

      {/* Tableau */}
      {ranked.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Le classement n'est pas encore disponible — les scores n'ont pas encore été calculés.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {ranked.map((r) => (
                <div
                  key={r.candidatureId}
                  className={`flex items-center gap-4 px-6 py-4 ${r.isCurrentUser ? "bg-primary/5" : ""}`}
                >
                  <div className="flex w-10 items-center justify-center shrink-0">
                    {getRankIcon(r.rank) ?? <span className="text-sm font-bold text-muted-foreground">{r.rank}</span>}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${r.isCurrentUser ? "text-primary" : ""}`}>
                      {r.name}
                      {r.isCurrentUser && <span className="ml-2 text-xs text-muted-foreground">(Vous)</span>}
                    </p>
                  </div>
                  <span className="tabular-nums font-medium text-sm">{r.score.toFixed(2)}/20</span>
                  <div className="w-28 text-right">{getStatusBadge(r.statut)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
