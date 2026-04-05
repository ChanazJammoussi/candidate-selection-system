"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CheckCircle,
  Clock,
  Download,
  FileText,
  AlertCircle,
  XCircle,
  Calendar,
  Mail,
  Search,
  Trophy,
  Medal,
  Award,
} from "lucide-react"
import { useState } from "react"

interface Candidate {
  rank: number
  name: string
  score: number
  status: "admis" | "liste_attente"
  isCurrentUser?: boolean
}

export default function ResultatsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data - In production this would come from an API
  const resultStatus: "admis" | "liste_attente" | "rejete" | "pending" = "liste_attente"
  const resultsPublished = true

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
    { rank: 12, name: "Jean Dupont", score: 78.5, status: "liste_attente", isCurrentUser: true },
  ]

  const filteredCandidates = candidates.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />
      case 3:
        return <Award className="h-4 w-4 text-amber-600" />
      default:
        return null
    }
  }

  const resultConfig = {
    admis: {
      title: "Félicitations ! Vous êtes admis(e)",
      description: "Votre candidature a été retenue pour le concours d'intégration 2026",
      icon: CheckCircle,
      color: "bg-success/10 border-success/20 text-success",
      iconColor: "text-success",
      badgeColor: "bg-success text-success-foreground",
    },
    liste_attente: {
      title: "Vous êtes sur liste d'attente",
      description: "Votre candidature est en attente. Vous serez notifié(e) si une place se libère.",
      icon: Clock,
      color: "bg-warning/10 border-warning/20 text-warning",
      iconColor: "text-warning",
      badgeColor: "bg-warning text-warning-foreground",
    },
    rejete: {
      title: "Candidature non retenue",
      description: "Malheureusement, votre candidature n'a pas été retenue cette année.",
      icon: XCircle,
      color: "bg-destructive/10 border-destructive/20 text-destructive",
      iconColor: "text-destructive",
      badgeColor: "bg-destructive text-destructive-foreground",
    },
    pending: {
      title: "Résultats en attente",
      description: "Les résultats du concours seront publiés prochainement.",
      icon: AlertCircle,
      color: "bg-muted border-border text-muted-foreground",
      iconColor: "text-muted-foreground",
      badgeColor: "bg-muted text-muted-foreground",
    },
  }

  const currentResult = resultConfig[resultStatus as keyof typeof resultConfig]
  const ResultIcon = currentResult.icon

  const nextSteps = {
    admis: [
      {
        title: "Télécharger la lettre d'admission",
        description: "Conservez ce document pour vos démarches administratives",
        action: "Télécharger",
        icon: Download,
      },
      {
        title: "Confirmer votre inscription",
        description: "Date limite: 15 Avril 2026",
        action: "Confirmer",
        icon: CheckCircle,
      },
      {
        title: "Compléter le dossier d'inscription",
        description: "Documents supplémentaires requis",
        action: "Voir détails",
        icon: FileText,
      },
    ],
    liste_attente: [
      {
        title: "Activer les notifications",
        description: "Recevez une alerte si une place se libère",
        action: "Activer",
        icon: Mail,
      },
      {
        title: "Consulter le classement",
        description: "Suivez l'évolution de votre position",
        action: "Voir",
        icon: FileText,
      },
    ],
    rejete: [
      {
        title: "Télécharger la notification",
        description: "Document officiel de refus",
        action: "Télécharger",
        icon: Download,
      },
      {
        title: "Consulter les autres concours",
        description: "D'autres opportunités sont disponibles",
        action: "Explorer",
        icon: FileText,
      },
    ],
    pending: [],
  }

  const steps = nextSteps[resultStatus as keyof typeof nextSteps]

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
              Les résultats du concours d'intégration 2026 seront publiés le 1er Avril 2026.
              Vous recevrez une notification par email dès leur publication.
            </p>
            <div className="flex items-center gap-2 mt-6 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Publication prévue: 1 Avril 2026</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Résultats</h2>
        <p className="text-muted-foreground">Consultez les résultats de votre candidature</p>
      </div>

      {/* Result Status */}
      <Alert className={currentResult.color}>
        <ResultIcon className={`h-5 w-5 ${currentResult.iconColor}`} />
        <AlertTitle className="text-lg">{currentResult.title}</AlertTitle>
        <AlertDescription>{currentResult.description}</AlertDescription>
      </Alert>

      {/* Result Details */}
      <Card>
        <CardHeader>
          <CardTitle>Détails de votre résultat</CardTitle>
          <CardDescription>Informations sur votre candidature</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Statut</span>
                <Badge className={currentResult.badgeColor}>
                  {{ admis: "Admis(e)", liste_attente: "Liste d'attente", rejete: "Non retenu(e)", pending: "En attente" }[resultStatus]}
                </Badge>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Concours</span>
                <span className="font-medium">Intégration 2026</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Score final</span>
                <span className="font-medium">78.5/100</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Classement</span>
                <span className="font-medium">12ème / 156</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Places disponibles</span>
                <span className="font-medium">10</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Date de publication</span>
                <span className="font-medium">15 Mars 2026</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Position liste d'attente</span>
                <span className="font-medium">2ème</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ranking Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Tableau de classement</CardTitle>
              <CardDescription>Candidats admis et en liste d'attente</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un candidat..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
              {filteredCandidates.map((candidate) => (
                <TableRow
                  key={candidate.rank}
                  className={candidate.isCurrentUser ? "bg-primary/5" : ""}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getRankIcon(candidate.rank)}
                      <span>{candidate.rank}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {candidate.name}
                      {candidate.isCurrentUser && (
                        <Badge variant="outline" className="text-xs">
                          Vous
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {candidate.score}
                  </TableCell>
                  <TableCell className="text-right">
                    {candidate.status === "admis"
                      ? <Badge className="bg-success text-success-foreground">Admis</Badge>
                      : <Badge className="bg-warning text-warning-foreground">Liste d'attente</Badge>
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Next Steps */}
      {steps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prochaines étapes</CardTitle>
            <CardDescription>Actions recommandées suite à votre résultat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {steps.map((step, index) => {
                const StepIcon = step.icon
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <StepIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{step.title}</p>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    <Button variant="outline">{step.action}</Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Download Section */}
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Téléchargez vos documents officiels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Notification officielle
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Récapitulatif de candidature
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Détail du score
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}