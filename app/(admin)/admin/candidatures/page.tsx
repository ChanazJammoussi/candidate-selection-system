"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ConcoursSelector } from "@/components/ui/concours-selector"
import { MOCK_CONCOURS } from "@/lib/mock-concours"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  XCircle,
  Clock,
  Eye,
  Search,
  User,
  GraduationCap,
  FileText,
  MessageSquare,
} from "lucide-react"
import { FieldLabel } from "@/components/ui/field"

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

type ReviewStatus = "pending" | "accepted" | "rejected"

interface Candidature {
  id: string
  candidatId: string
  nom: string
  prenom: string
  cin: string
  email: string
  concoursId: string
  specialite: string
  etablissement: string
  score: number
  submittedAt: string
  status: ReviewStatus
  commentaire?: string
  // Détails académiques
  diplome: string
  moyenneGenerale: number
  anneesEtude: { niveau: string; annee: string; moyenne: number }[]
}

interface Concours {
  id: string
  name: string
  type: string
  status: string
}

// ----------------------------------------------------------------
// Mock data
// ----------------------------------------------------------------

const mockConcours: Concours[] = [
  { id: "1", name: "Concours d'Intégration 2026", type: "ing_prepa", status: "open" },
  { id: "2", name: "Concours d'Intégration 2025", type: "ing_prepa", status: "results_published" },
  { id: "3", name: "Concours Spécial Master", type: "master", status: "draft" },
]

const mockCandidatures: Candidature[] = [
  {
    id: "c1", candidatId: "1", nom: "Martin", prenom: "Lucas", cin: "12345678",
    email: "lucas.m@email.com", concoursId: "1", specialite: "MP",
    etablissement: "Lycée Carnot", score: 17.4, submittedAt: "05/03/2026",
    status: "pending", diplome: "Baccalauréat + Prépa MP",
    moyenneGenerale: 17.4,
    anneesEtude: [
      { niveau: "Prépa 1ère année", annee: "2023/2024", moyenne: 16.8 },
      { niveau: "Prépa 2ème année", annee: "2024/2025", moyenne: 17.9 },
    ],
  },
  {
    id: "c2", candidatId: "2", nom: "Bernard", prenom: "Emma", cin: "23456789",
    email: "emma.b@email.com", concoursId: "1", specialite: "PC",
    etablissement: "Lycée Louis-le-Grand", score: 16.1, submittedAt: "06/03/2026",
    status: "accepted", commentaire: "Excellent dossier, très bonne moyenne.",
    diplome: "Baccalauréat + Prépa PC",
    moyenneGenerale: 16.1,
    anneesEtude: [
      { niveau: "Prépa 1ère année", annee: "2023/2024", moyenne: 15.5 },
      { niveau: "Prépa 2ème année", annee: "2024/2025", moyenne: 16.7 },
    ],
  },
  {
    id: "c3", candidatId: "3", nom: "Petit", prenom: "Hugo", cin: "34567890",
    email: "hugo.p@email.com", concoursId: "1", specialite: "TSI",
    etablissement: "Lycée Évariste Galois", score: 12.3, submittedAt: "07/03/2026",
    status: "rejected", commentaire: "Score insuffisant pour cette promotion.",
    diplome: "Baccalauréat + Prépa TSI",
    moyenneGenerale: 12.3,
    anneesEtude: [
      { niveau: "Prépa 1ère année", annee: "2023/2024", moyenne: 12.0 },
      { niveau: "Prépa 2ème année", annee: "2024/2025", moyenne: 12.6 },
    ],
  },
  {
    id: "c4", candidatId: "4", nom: "Dubois", prenom: "Léa", cin: "45678901",
    email: "lea.d@email.com", concoursId: "1", specialite: "MP",
    etablissement: "Lycée Henri IV", score: 18.2, submittedAt: "08/03/2026",
    status: "pending",
    diplome: "Baccalauréat + Prépa MP",
    moyenneGenerale: 18.2,
    anneesEtude: [
      { niveau: "Prépa 1ère année", annee: "2023/2024", moyenne: 17.8 },
      { niveau: "Prépa 2ème année", annee: "2024/2025", moyenne: 18.6 },
    ],
  },
  {
    id: "c5", candidatId: "5", nom: "Simon", prenom: "Tom", cin: "56789012",
    email: "tom.s@email.com", concoursId: "1", specialite: "PC",
    etablissement: "Lycée Fénelon", score: 14.7, submittedAt: "09/03/2026",
    status: "pending",
    diplome: "Baccalauréat + Prépa PC",
    moyenneGenerale: 14.7,
    anneesEtude: [
      { niveau: "Prépa 1ère année", annee: "2023/2024", moyenne: 14.2 },
      { niveau: "Prépa 2ème année", annee: "2024/2025", moyenne: 15.2 },
    ],
  },
  {
    id: "c6", candidatId: "6", nom: "Leroy", prenom: "Chloé", cin: "67890123",
    email: "chloe.l@email.com", concoursId: "2", specialite: "MP",
    etablissement: "Lycée Pasteur", score: 15.9, submittedAt: "10/03/2025",
    status: "accepted",
    diplome: "Baccalauréat + Prépa MP",
    moyenneGenerale: 15.9,
    anneesEtude: [
      { niveau: "Prépa 1ère année", annee: "2022/2023", moyenne: 15.2 },
      { niveau: "Prépa 2ème année", annee: "2023/2024", moyenne: 16.6 },
    ],
  },
]

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

const STATUS_CONFIG: Record<ReviewStatus, { label: string; className: string; icon: React.ElementType }> = {
  pending:  { label: "En attente", className: "bg-muted text-muted-foreground border-muted-foreground/20", icon: Clock },
  accepted: { label: "Acceptée",   className: "bg-success/10 text-success border-success/20",              icon: CheckCircle },
  rejected: { label: "Refusée",    className: "bg-destructive/10 text-destructive border-destructive/20",  icon: XCircle },
}

function StatusBadge({ status }: { status: ReviewStatus }) {
  const { label, className, icon: Icon } = STATUS_CONFIG[status]
  return (
    <Badge variant="outline" className={`gap-1 ${className}`}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}

// ----------------------------------------------------------------
// Page
// ----------------------------------------------------------------

export default function CandidaturesPage() {
  const [selectedConcoursId, setSelectedConcoursId] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState<ReviewStatus | "all">("all")
  const [search, setSearch] = useState("")

  const [candidatures, setCandidatures] = useState<Candidature[]>(mockCandidatures)

  // Dialog détail / examen
  const [selected, setSelected] = useState<Candidature | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [commentaire, setCommentaire] = useState("")

  // ----------------------------------------------------------------

  const concoursSelectionne = MOCK_CONCOURS.find((c) => c.id === selectedConcoursId) ?? null

  const filtered = candidatures.filter((c) => {
    if (c.concoursId !== selectedConcoursId) return false
    if (filterStatus !== "all" && c.status !== filterStatus) return false
    if (search) {
      const q = search.toLowerCase()
      if (
        !c.nom.toLowerCase().includes(q) &&
        !c.prenom.toLowerCase().includes(q) &&
        !c.cin.includes(q) &&
        !c.email.toLowerCase().includes(q)
      ) return false
    }
    return true
  })

  const stats = {
    total:    candidatures.filter((c) => c.concoursId === selectedConcoursId).length,
    pending:  candidatures.filter((c) => c.concoursId === selectedConcoursId && c.status === "pending").length,
    accepted: candidatures.filter((c) => c.concoursId === selectedConcoursId && c.status === "accepted").length,
    rejected: candidatures.filter((c) => c.concoursId === selectedConcoursId && c.status === "rejected").length,
  }
  const traitees = stats.accepted + stats.rejected

  const openDetail = (c: Candidature) => {
    setSelected(c)
    setCommentaire(c.commentaire ?? "")
    setDialogOpen(true)
  }

  const applyDecision = (decision: "accepted" | "rejected") => {
    if (!selected) return
    setCandidatures((prev) =>
      prev.map((c) =>
        c.id === selected.id ? { ...c, status: decision, commentaire: commentaire.trim() || undefined } : c
      )
    )
    setDialogOpen(false)
  }

  // ----------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Examen des candidatures</h2>
        <p className="text-muted-foreground">Sélectionnez un concours pour traiter les candidatures</p>
      </div>

      {/* Sélecteur de concours */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Sélectionner un concours</p>
        <ConcoursSelector
          options={MOCK_CONCOURS}
          value={selectedConcoursId}
          onChange={setSelectedConcoursId}
        />
      </div>

      {/* Contenu affiché seulement si un concours est sélectionné */}
      {concoursSelectionne && (
        <>
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">candidatures reçues</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Traitées</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{traitees}</p>
                <p className="text-xs text-muted-foreground">
                  {stats.total > 0 ? Math.round((traitees / stats.total) * 100) : 0}% du total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-success">Acceptées</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-success">{stats.accepted}</p>
                <p className="text-xs text-muted-foreground">candidatures acceptées</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-destructive">Refusées</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-destructive">{stats.rejected}</p>
                <p className="text-xs text-muted-foreground">candidatures refusées</p>
              </CardContent>
            </Card>
          </div>

          {/* Barre de progression du traitement */}
          {stats.total > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progression du traitement</span>
                <span className="font-medium">{traitees} / {stats.total} traitées</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${stats.total > 0 ? (traitees / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}

          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher (nom, CIN, email)…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as ReviewStatus | "all")}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="accepted">Acceptées</SelectItem>
                <SelectItem value="rejected">Refusées</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tableau */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidat</TableHead>
                    <TableHead>CIN</TableHead>
                    <TableHead>Spécialité</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead>Soumise le</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                        Aucune candidature trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((c) => (
                      <TableRow
                        key={c.id}
                        className={c.status === "pending" ? "bg-muted/20" : ""}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{c.prenom} {c.nom}</p>
                            <p className="text-xs text-muted-foreground">{c.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{c.cin}</TableCell>
                        <TableCell>{c.specialite}</TableCell>
                        <TableCell className="text-right font-medium tabular-nums">
                          {c.score.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{c.submittedAt}</TableCell>
                        <TableCell><StatusBadge status={c.status} /></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => openDetail(c)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Examiner
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {/* ── Dialog examen ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Examen de candidature</DialogTitle>
            <DialogDescription>
              {selected && `${selected.prenom} ${selected.nom} — soumise le ${selected.submittedAt}`}
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-5">
              {/* Statut actuel */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Statut actuel :</span>
                <StatusBadge status={selected.status} />
              </div>

              {/* Infos candidat */}
              <div className="rounded-md border p-4 space-y-3">
                <div className="flex items-center gap-2 font-medium">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Informations personnelles
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nom complet</span>
                    <p className="font-medium">{selected.prenom} {selected.nom}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CIN</span>
                    <p className="font-medium font-mono">{selected.cin}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email</span>
                    <p className="font-medium">{selected.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Établissement</span>
                    <p className="font-medium">{selected.etablissement}</p>
                  </div>
                </div>
              </div>

              {/* Parcours académique */}
              <div className="rounded-md border p-4 space-y-3">
                <div className="flex items-center gap-2 font-medium">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  Parcours académique
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                    <div>
                      <span className="text-muted-foreground">Diplôme</span>
                      <p className="font-medium">{selected.diplome}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Spécialité</span>
                      <p className="font-medium">{selected.specialite}</p>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    {selected.anneesEtude.map((a, i) => (
                      <div key={i} className="flex items-center justify-between rounded bg-muted/50 px-3 py-1.5 text-sm">
                        <span>{a.niveau} <span className="text-muted-foreground">({a.annee})</span></span>
                        <span className="font-medium tabular-nums">{a.moyenne.toFixed(2)} / 20</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between rounded bg-primary/10 px-3 py-1.5 text-sm">
                      <span className="font-medium">Score calculé</span>
                      <span className="font-bold tabular-nums text-primary">{selected.score.toFixed(2)} / 20</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Commentaire admin */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  Commentaire (optionnel)
                </div>
                <Textarea
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  placeholder="Ajouter une note interne sur cette candidature…"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Ce commentaire est uniquement visible par l'administration.
                </p>
              </div>

              {/* Décision */}
              <div className="flex gap-3 pt-1">
                <Button
                  className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
                  onClick={() => applyDecision("accepted")}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Accepter
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => applyDecision("rejected")}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Refuser
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
