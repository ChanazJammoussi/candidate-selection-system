"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Search,
  RefreshCw,
  Download,
  Trophy,
  Medal,
  Award,
  AlertCircle,
  CheckCircle,
  Calculator,
  ArrowUpDown,
} from "lucide-react"

interface RankedCandidate {
  rank: number
  id: string
  name: string
  email: string
  gpaScore: number
  documentsScore: number
  totalScore: number
  status: "admis" | "liste_attente" | "en_attente"
  previousRank?: number
}

export default function AdminClassementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [lastGenerated, setLastGenerated] = useState("15/03/2026 à 14:30")

  const rankedCandidates: RankedCandidate[] = [
    { rank: 1, id: "1", name: "Marie Martin", email: "marie.m@email.com", gpaScore: 45, documentsScore: 27, totalScore: 92.5, status: "admis", previousRank: 1 },
    { rank: 2, id: "2", name: "Pierre Durand", email: "pierre.d@email.com", gpaScore: 44, documentsScore: 28, totalScore: 91.0, status: "admis", previousRank: 3 },
    { rank: 3, id: "3", name: "Sophie Bernard", email: "sophie.b@email.com", gpaScore: 43, documentsScore: 26, totalScore: 89.5, status: "admis", previousRank: 2 },
    { rank: 4, id: "4", name: "Lucas Petit", email: "lucas.p@email.com", gpaScore: 42, documentsScore: 26, totalScore: 88.0, status: "admis", previousRank: 4 },
    { rank: 5, id: "5", name: "Emma Leroy", email: "emma.l@email.com", gpaScore: 41, documentsScore: 27, totalScore: 87.5, status: "admis", previousRank: 5 },
    { rank: 6, id: "6", name: "Thomas Moreau", email: "thomas.m@email.com", gpaScore: 40, documentsScore: 26, totalScore: 86.0, status: "admis", previousRank: 6 },
    { rank: 7, id: "7", name: "Julie Simon", email: "julie.s@email.com", gpaScore: 40, documentsScore: 25, totalScore: 85.5, status: "admis", previousRank: 8 },
    { rank: 8, id: "8", name: "Nicolas Laurent", email: "nicolas.l@email.com", gpaScore: 39, documentsScore: 25, totalScore: 84.0, status: "admis", previousRank: 7 },
    { rank: 9, id: "9", name: "Camille Roux", email: "camille.r@email.com", gpaScore: 38, documentsScore: 26, totalScore: 83.5, status: "admis", previousRank: 9 },
    { rank: 10, id: "10", name: "Alexandre Fournier", email: "alex.f@email.com", gpaScore: 38, documentsScore: 24, totalScore: 82.0, status: "admis", previousRank: 10 },
    { rank: 11, id: "11", name: "Léa Girard", email: "lea.g@email.com", gpaScore: 37, documentsScore: 24, totalScore: 80.5, status: "liste_attente", previousRank: 11 },
    { rank: 12, id: "12", name: "Jean Dupont", email: "jean.d@email.com", gpaScore: 36, documentsScore: 24, totalScore: 78.5, status: "liste_attente", previousRank: 13 },
    { rank: 13, id: "13", name: "Manon Bonnet", email: "manon.b@email.com", gpaScore: 35, documentsScore: 23, totalScore: 77.0, status: "en_attente", previousRank: 12 },
    { rank: 14, id: "14", name: "Hugo Dubois", email: "hugo.d@email.com", gpaScore: 34, documentsScore: 22, totalScore: 75.5, status: "en_attente", previousRank: 14 },
    { rank: 15, id: "15", name: "Chloé Michel", email: "chloe.m@email.com", gpaScore: 33, documentsScore: 22, totalScore: 74.0, status: "en_attente", previousRank: 15 },
  ]

  const filteredCandidates = rankedCandidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const placesAvailable = 10
  const admisCount = rankedCandidates.filter((c) => c.status === "admis").length
  const listeAttenteCount = rankedCandidates.filter((c) => c.status === "liste_attente").length

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: RankedCandidate["status"]) => {
    switch (status) {
      case "admis":
        return <Badge className="bg-success text-success-foreground">Admis</Badge>
      case "liste_attente":
        return <Badge className="bg-warning text-warning-foreground">Liste d'attente</Badge>
      default:
        return <Badge variant="outline">En attente</Badge>
    }
  }

  const getRankChange = (current: number, previous?: number) => {
    if (!previous || current === previous) return null
    const diff = previous - current
    if (diff > 0) {
      return <span className="text-xs text-success">+{diff}</span>
    }
    return <span className="text-xs text-destructive">{diff}</span>
  }

  const handleGenerateRanking = () => {
    setShowConfirmDialog(true)
  }

  const confirmGenerateRanking = () => {
    setIsGenerating(true)
    setShowConfirmDialog(false)
    // Simulate ranking generation
    setTimeout(() => {
      setIsGenerating(false)
      setLastGenerated(new Date().toLocaleString("fr-FR"))
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Classement automatique</h2>
          <p className="text-muted-foreground">Génération et gestion du classement des candidats</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button onClick={handleGenerateRanking} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-4 w-4" />
                Générer classement
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{placesAvailable}</p>
              <p className="text-sm text-muted-foreground">Places disponibles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{admisCount}</p>
              <p className="text-sm text-muted-foreground">Candidats admis</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <AlertCircle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{listeAttenteCount}</p>
              <p className="text-sm text-muted-foreground">Liste d'attente</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <RefreshCw className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Dernière mise à jour</p>
              <p className="text-sm text-muted-foreground">{lastGenerated}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Alert */}
      <Alert>
        <Calculator className="h-4 w-4" />
        <AlertTitle>Formule de calcul du score</AlertTitle>
        <AlertDescription>
          Score total = (Moyenne × 50%) + (Documents × 30%) + (Motivation × 20%)
          <br />
          <span className="text-xs text-muted-foreground">
            Les coefficients sont définis dans les paramètres du concours.
          </span>
        </AlertDescription>
      </Alert>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un candidat..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Ranking Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5" />
            Classement des candidats
          </CardTitle>
          <CardDescription>Triés par score décroissant</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Rang</TableHead>
                <TableHead>Candidat</TableHead>
                <TableHead className="text-center">Score GPA (50%)</TableHead>
                <TableHead className="text-center">Score Docs (30%)</TableHead>
                <TableHead className="text-center">Score Total</TableHead>
                <TableHead className="text-center">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow
                  key={candidate.id}
                  className={candidate.rank <= placesAvailable ? "bg-success/5" : ""}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRankIcon(candidate.rank)}
                      <span className="font-bold">{candidate.rank}</span>
                      {getRankChange(candidate.rank, candidate.previousRank)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{candidate.name}</p>
                      <p className="text-sm text-muted-foreground">{candidate.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{candidate.gpaScore}</TableCell>
                  <TableCell className="text-center">{candidate.documentsScore}</TableCell>
                  <TableCell className="text-center">
                    <span className="font-bold text-lg">{candidate.totalScore}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(candidate.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Générer le classement</DialogTitle>
            <DialogDescription>
              Cette action va recalculer les scores et mettre à jour le classement de tous les candidats.
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Attention</AlertTitle>
            <AlertDescription>
              Le classement actuel sera remplacé. Cette action est irréversible.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Annuler
            </Button>
            <Button onClick={confirmGenerateRanking}>
              Confirmer la génération
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
