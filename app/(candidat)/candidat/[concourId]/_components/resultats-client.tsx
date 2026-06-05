"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  CheckCircle, Clock, XCircle, AlertCircle, Calendar,
  Search, Trophy, Medal, Award,
} from "lucide-react"

type Statut = "acceptee" | "liste_attente" | "rejetee" | "en_attente"

interface RankRow {
  rank: number
  name: string
  score: number
  statut: Statut
  isCurrentUser: boolean
}

interface Props {
  myCandidature: {
    statut: Statut
    score: number | null
  } | null
  concours: {
    nom: string
    places: number
    dateResultats: string
  }
  ranking: RankRow[]
}

const STATUT_LABEL: Record<Statut, string> = {
  acceptee:      "Admis(e)",
  liste_attente: "Liste d'attente",
  rejetee:       "Non retenu(e)",
  en_attente:    "En attente",
}

const resultConfig = {
  acceptee: {
    title: "Félicitations ! Vous êtes admis(e)",
    description: "Votre candidature a été retenue.",
    icon: CheckCircle,
    color: "bg-success/10 border-success/20 text-success",
    iconColor: "text-success",
    badgeClass: "bg-success text-success-foreground",
  },
  liste_attente: {
    title: "Vous êtes sur liste d'attente",
    description: "Vous serez notifié(e) si une place se libère.",
    icon: Clock,
    color: "bg-warning/10 border-warning/20 text-warning",
    iconColor: "text-warning",
    badgeClass: "bg-warning text-warning-foreground",
  },
  rejetee: {
    title: "Candidature non retenue",
    description: "Malheureusement votre candidature n'a pas été retenue cette année.",
    icon: XCircle,
    color: "bg-destructive/10 border-destructive/20 text-destructive",
    iconColor: "text-destructive",
    badgeClass: "bg-destructive text-destructive-foreground",
  },
  en_attente: {
    title: "Résultats en cours de traitement",
    description: "Votre candidature est en cours d'examen.",
    icon: AlertCircle,
    color: "bg-muted border-border text-muted-foreground",
    iconColor: "text-muted-foreground",
    badgeClass: "bg-muted text-muted-foreground",
  },
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy className="h-4 w-4 text-yellow-500" />
  if (rank === 2) return <Medal className="h-4 w-4 text-gray-400" />
  if (rank === 3) return <Award className="h-4 w-4 text-amber-600" />
  return null
}

export default function ResultatsClient({ myCandidature, concours, ranking }: Props) {
  const [search, setSearch] = useState("")

  const filtered = ranking.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  const myRank = myCandidature
    ? ranking.find((r) => r.isCurrentUser)?.rank ?? null
    : null

  if (!myCandidature) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Résultats</h2>
          <p className="text-muted-foreground">Consultez les résultats de votre candidature</p>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucune candidature trouvée</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Vous n'avez pas encore soumis de candidature pour ce concours.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const cfg = resultConfig[myCandidature.statut]
  const ResultIcon = cfg.icon

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Résultats</h2>
        <p className="text-muted-foreground">Consultez les résultats de votre candidature</p>
      </div>

      {/* Alerte résultat */}
      <Alert className={cfg.color}>
        <ResultIcon className={`h-5 w-5 ${cfg.iconColor}`} />
        <AlertTitle className="text-lg">{cfg.title}</AlertTitle>
        <AlertDescription>{cfg.description}</AlertDescription>
      </Alert>

      {/* Détails */}
      <Card>
        <CardHeader>
          <CardTitle>Détails de votre résultat</CardTitle>
          <CardDescription>{concours.nom}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Statut</span>
                <Badge className={cfg.badgeClass}>{STATUT_LABEL[myCandidature.statut]}</Badge>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Score final</span>
                <span className="font-medium">
                  {myCandidature.score !== null ? `${myCandidature.score.toFixed(2)}/20` : "—"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Classement</span>
                <span className="font-medium">
                  {myRank !== null ? `${myRank}ème / ${ranking.length}` : "—"}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Places disponibles</span>
                <span className="font-medium">{concours.places}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Date de publication</span>
                <span className="font-medium">{concours.dateResultats}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Classement */}
      {ranking.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Tableau de classement</CardTitle>
                <CardDescription>Candidats classés par score</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un candidat..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Rang</TableHead>
                  <TableHead>Nom du candidat</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.rank} className={row.isCurrentUser ? "bg-primary/5" : ""}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getRankIcon(row.rank)}
                        <span>{row.rank}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {row.name}
                        {row.isCurrentUser && (
                          <Badge variant="outline" className="text-xs">Vous</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {row.score.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.statut === "acceptee"
                        ? <Badge className="bg-success text-success-foreground">Admis</Badge>
                        : row.statut === "liste_attente"
                          ? <Badge className="bg-warning text-warning-foreground">Liste d'attente</Badge>
                          : <Badge variant="outline">{STATUT_LABEL[row.statut as Statut]}</Badge>
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Dates importantes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Dates importantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Publication des résultats</span>
            <span className="font-medium">{concours.dateResultats}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
