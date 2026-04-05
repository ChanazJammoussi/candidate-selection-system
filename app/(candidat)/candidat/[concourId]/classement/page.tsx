"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, TrendingUp } from "lucide-react"

interface Candidate {
  rank: number
  name: string
  score: number
  status: "admis" | "liste_attente" | "en_cours"
  isCurrentUser?: boolean
}

export default function ClassementPage() {
  const candidates: Candidate[] = [
    { rank: 1, name: "Marie Martin", score: 92.5, status: "admis" },
    { rank: 2, name: "Pierre Durand", score: 91.0, status: "admis" },
    { rank: 3, name: "Sophie Bernard", score: 89.5, status: "admis" },
    { rank: 4, name: "Lucas Petit", score: 88.0, status: "admis" },
    { rank: 5, name: "Emma Leroy", score: 87.5, status: "admis" },
    { rank: 6, name: "Thomas Moreau", score: 86.0, status: "admis" },
    { rank: 7, name: "Julie Simon", score: 85.5, status: "admis" },
    { rank: 8, name: "Nicolas Laurent", score: 84.0, status: "admis" },
    { rank: 9, name: "Camille Roux", score: 83.5, status: "admis" },
    { rank: 10, name: "Alexandre Fournier", score: 82.0, status: "liste_attente" },
    { rank: 11, name: "Léa Girard", score: 80.5, status: "liste_attente" },
    { rank: 12, name: "Jean Dupont", score: 78.5, status: "en_cours", isCurrentUser: true },
    { rank: 13, name: "Manon Bonnet", score: 77.0, status: "en_cours" },
    { rank: 14, name: "Hugo Dubois", score: 75.5, status: "en_cours" },
    { rank: 15, name: "Chloé Michel", score: 74.0, status: "en_cours" },
  ]

  const currentUser = candidates.find((c) => c.isCurrentUser)
  const totalCandidates = 156
  const placesAvailable = 10

  const getStatusBadge = (status: Candidate["status"]) => {
    switch (status) {
      case "admis":
        return <Badge className="bg-success text-success-foreground">Admis</Badge>
      case "liste_attente":
        return <Badge className="bg-warning text-warning-foreground">Liste d'attente</Badge>
      default:
        return <Badge variant="outline">En cours</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Classement</h2>
        <p className="text-muted-foreground">Consultez le classement des candidats au concours</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Votre position
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{currentUser?.rank}</span>
              <span className="text-lg text-muted-foreground">/ {totalCandidates}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Votre score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{currentUser?.score}</span>
              <span className="text-lg text-muted-foreground">/ 100</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Places disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{placesAvailable}</span>
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total candidats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">{totalCandidates}</span>
          </CardContent>
        </Card>
      </div>

      {/* Your Position Highlight */}
      {currentUser && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                {currentUser.rank}
              </div>
              <div>
                <h3 className="font-semibold">{currentUser.name} (Vous)</h3>
                <p className="text-sm text-muted-foreground">
                  Score: {currentUser.score}/100
                </p>
              </div>
            </div>
            {getStatusBadge(currentUser.status)}
          </CardContent>
        </Card>
      )}
    </div>
  )
}