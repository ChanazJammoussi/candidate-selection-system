"use client"

import { useState, useEffect } from "react"
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
import { ConcoursSelector } from "@/components/ui/concours-selector"
import type { ConcoursOption } from "@/components/ui/concours-selector"
import { fetchCandidaturesRanking, generateRankingAction, fetchConcoursListAction } from "@/lib/actions/concours"
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

// formules par concours (données locales à la page)
const FORMULES: Record<string, string> = {
  "1": "notesMaths * 0.40 + notesPhysique * 0.30 + notesInformatique * 0.15 + notesLangue * 0.15",
  "2": "notesMaths * 0.40 + notesPhysique * 0.30 + notesInformatique * 0.15 + notesLangue * 0.15",
  "3": "moyenneGenerale * 0.45 + noteMemoire * 0.25 + notesLangue * 0.20 + experiencePro * 0.10",
}

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
  const [concoursList, setConcoursList] = useState<ConcoursOption[]>([])
  const [selectedConcoursId, setSelectedConcoursId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => { fetchConcoursListAction().then(setConcoursList) }, [])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [lastGenerated, setLastGenerated] = useState<string | null>(null)
  const [rankedCandidates, setRankedCandidates] = useState<RankedCandidate[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const concoursSelectionne = concoursList.find((c) => c.id === selectedConcoursId) ?? null

  const handleConcoursChange = async (id: string) => {
    setSelectedConcoursId(id)
    if (!id) { setRankedCandidates([]); return }
    setIsLoading(true)
    const data = await fetchCandidaturesRanking(id)
    setRankedCandidates(data.map((c) => ({
      rank: c.rank, id: c.id, name: c.name, email: c.email,
      gpaScore: 0, documentsScore: 0, totalScore: c.totalScore,
      status: c.statut === "acceptee" ? "admis" : c.statut === "liste_attente" ? "liste_attente" : "en_attente",
    })))
    setIsLoading(false)
  }

  const filteredCandidates = rankedCandidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const placesAvailable = concoursSelectionne?.places ?? 10
  const formule = selectedConcoursId ? FORMULES[selectedConcoursId] ?? "" : ""

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

  const confirmGenerateRanking = async () => {
    setIsGenerating(true)
    setShowConfirmDialog(false)
    const result = await generateRankingAction(selectedConcoursId)
    if (result.candidates) {
      setRankedCandidates(result.candidates.map((c) => ({
        rank: c.rank, id: c.id, name: c.name, email: c.email,
        gpaScore: 0, documentsScore: 0, totalScore: c.totalScore,
        status: "en_attente" as const,
      })))
    }
    setLastGenerated(new Date().toLocaleString("fr-FR"))
    setIsGenerating(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Classement automatique</h2>
          <p className="text-muted-foreground">Génération et gestion du classement des candidats</p>
        </div>
        {concoursSelectionne && (
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
        )}
      </div>

      {/* Sélecteur de concours */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Sélectionner un concours</p>
        <ConcoursSelector
          options={concoursList}
          value={selectedConcoursId}
          onChange={handleConcoursChange}
        />
      </div>

      {concoursSelectionne && <>

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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <RefreshCw className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Dernière mise à jour</p>
              <p className="text-sm text-muted-foreground">{lastGenerated ?? "—"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Alert */}
      <Alert>
        <Calculator className="h-4 w-4" />
        <AlertTitle>Formule de calcul du score</AlertTitle>
        <AlertDescription>
          <span className="font-mono text-sm">score = {formule}</span>
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

      </>}

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
