"use client"

import { useState, useEffect } from "react"
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
import type { ConcoursOption } from "@/components/ui/concours-selector"
import { fetchConcoursListAction, fetchCandidaturesByConcoursAction } from "@/lib/actions/concours"
import { updateCandidatureStatutAction } from "@/lib/actions/admin"
import {
  Dialog,
  DialogContent,
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
  ArrowLeft,
  Download,
  Award,
  Eye as EyeIcon,
} from "lucide-react"

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

type ReviewStatus = "pending" | "accepted" | "rejected"
type DocStatus = "pending" | "approved" | "rejected"

interface Document {
  id: string
  label: string
  fileName: string
  status: DocStatus
  url?: string
}

interface Candidature {
  id: string
  candidatId: string
  nom: string
  prenom: string
  cin: string
  email: string
  phone: string
  birthDate: string
  gouvernorat: string
  ville: string
  adresse: string
  concoursId: string
  specialite: string
  etablissement: string
  score: number
  submittedAt: string
  status: ReviewStatus
  commentaire?: string
  diplome: string
  moyenneGenerale: number
  anneesEtude: { niveau: string; annee: string; moyenne: number }[]
  documents: Document[]
}

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


function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-sm mt-0.5">{value || "—"}</p>
    </div>
  )
}

// ----------------------------------------------------------------
// Vue détail plein écran
// ----------------------------------------------------------------

function DetailView({
  candidature,
  onBack,
  onDecision,
}: {
  candidature: Candidature
  onBack: () => void
  onDecision: (decision: "accepted" | "rejected", commentaire: string) => void
}) {
  const [commentaire, setCommentaire] = useState(candidature.commentaire ?? "")
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null)

  return (
    <>
    {/* Dialog aperçu document */}
    <Dialog open={!!previewDoc} onOpenChange={(open) => { if (!open) setPreviewDoc(null) }}>
      <DialogContent className="max-w-[98vw] w-[98vw] h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            {previewDoc?.label}
            <span className="ml-1 text-sm font-normal text-muted-foreground">— {previewDoc?.fileName}</span>
          </DialogTitle>
        </DialogHeader>
        {previewDoc?.url ? (
          /\.(jpg|jpeg|png|gif|webp)$/i.test(previewDoc.url) ? (
            <div className="flex-1 flex items-center justify-center overflow-hidden rounded-md border bg-muted/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewDoc.url}
                alt={previewDoc.label}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <iframe
              src={previewDoc.url}
              className="flex-1 w-full rounded-md border"
              title={previewDoc.label}
            />
          )
        ) : (
          <div className="flex-1 rounded-md border bg-muted/30 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <FileText className="h-12 w-12 opacity-30" />
            <p className="text-sm">Aucun fichier disponible pour ce document</p>
            <p className="text-xs text-muted-foreground">{previewDoc?.fileName}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>

    <div className="space-y-6">
      {/* Barre de navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
        <StatusBadge status={candidature.status} />
      </div>

      {/* En-tête candidat */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b">
        <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 text-primary font-bold text-xl shrink-0">
          {candidature.prenom[0]}{candidature.nom[0]}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{candidature.prenom} {candidature.nom}</h2>
          <p className="text-muted-foreground text-sm">
            Candidature soumise le {candidature.submittedAt} · {candidature.specialite} · {candidature.etablissement}
          </p>
        </div>
      </div>

      {/* Corps : 2 colonnes */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Colonne principale (2/3) */}
        <div className="xl:col-span-2 space-y-6">

          {/* Informations personnelles */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4 text-muted-foreground" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                <InfoRow label="Prénom" value={candidature.prenom} />
                <InfoRow label="Nom" value={candidature.nom} />
                <InfoRow label="CIN" value={candidature.cin} />
                <InfoRow label="Email" value={candidature.email} />
                <InfoRow label="Téléphone" value={candidature.phone} />
                <InfoRow label="Date de naissance" value={candidature.birthDate} />
                <div className="md:col-span-2">
                  <InfoRow label="Adresse" value={`${candidature.adresse}, ${candidature.ville}, ${candidature.gouvernorat}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parcours académique */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                Parcours académique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                <InfoRow label="Diplôme" value={candidature.diplome} />
                <InfoRow label="Spécialité" value={candidature.specialite} />
                <InfoRow label="Établissement" value={candidature.etablissement} />
              </div>
              <div className="space-y-2 pt-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Relevés de notes</p>
                {candidature.anneesEtude.map((a, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md bg-muted/50 px-4 py-2.5 text-sm">
                    <div>
                      <span className="font-medium">{a.niveau}</span>
                      <span className="text-muted-foreground ml-2">({a.annee})</span>
                    </div>
                    <span className="font-semibold tabular-nums">{a.moyenne.toFixed(2)} / 20</span>
                  </div>
                ))}
                <div className="flex items-center justify-between rounded-md bg-primary/10 px-4 py-2.5 text-sm border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="font-semibold">Score calculé</span>
                  </div>
                  <span className="font-bold tabular-nums text-primary text-base">{candidature.score.toFixed(2)} / 20</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Documents fournis
                <span className="ml-auto text-sm font-normal text-muted-foreground">
                  {candidature.documents.filter(d => d.status === "approved").length} / {candidature.documents.length} validés
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {candidature.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between py-3 gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{doc.label}</p>
                        <p className="text-xs text-muted-foreground truncate">{doc.fileName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" onClick={() => setPreviewDoc(doc)}>
                        <EyeIcon className="h-3.5 w-3.5" />
                        Voir
                      </Button>
                      {doc.url ? (
                        <a href={doc.url} download={doc.fileName}>
                          <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" type="button">
                            <Download className="h-3.5 w-3.5" />
                            Télécharger
                          </Button>
                        </a>
                      ) : (
                        <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" disabled>
                          <Download className="h-3.5 w-3.5" />
                          Télécharger
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne décision (1/3) */}
        <div className="space-y-4">
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                Décision
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Statut actuel</p>
                <StatusBadge status={candidature.status} />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Commentaire interne (optionnel)</p>
                <Textarea
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  placeholder="Ajouter une note sur cette candidature…"
                  rows={5}
                />
                <p className="text-xs text-muted-foreground">Visible uniquement par l'administration.</p>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <Button
                  className="w-full bg-success hover:bg-success/90 text-success-foreground"
                  onClick={() => onDecision("accepted", commentaire)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Accepter la candidature
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => onDecision("rejected", commentaire)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Refuser la candidature
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  )
}

// ----------------------------------------------------------------
// Page principale
// ----------------------------------------------------------------

export default function CandidaturesPage() {
  const [concoursList,       setConcoursList]       = useState<ConcoursOption[]>([])
  const [selectedConcoursId, setSelectedConcoursId] = useState<string>("")
  const [filterStatus,       setFilterStatus]       = useState<ReviewStatus | "all">("all")
  const [search,             setSearch]             = useState("")
  const [candidatures,       setCandidatures]       = useState<Candidature[]>([])
  const [selected,           setSelected]           = useState<Candidature | null>(null)
  const [isLoading,          setIsLoading]          = useState(false)

  useEffect(() => { fetchConcoursListAction().then(setConcoursList) }, [])

  const concoursSelectionne = concoursList.find((c) => c.id === selectedConcoursId) ?? null

  const handleConcoursChange = async (id: string) => {
    setSelectedConcoursId(id)
    setCandidatures([])
    if (!id) return
    setIsLoading(true)
    const data = await fetchCandidaturesByConcoursAction(id)
    setCandidatures(data as Candidature[])
    setIsLoading(false)
  }

  const filtered = candidatures.filter((c) => {
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
    total:    candidatures.length,
    pending:  candidatures.filter((c) => c.status === "pending").length,
    accepted: candidatures.filter((c) => c.status === "accepted").length,
    rejected: candidatures.filter((c) => c.status === "rejected").length,
  }
  const traitees = stats.accepted + stats.rejected

  const handleDecision = async (decision: "accepted" | "rejected", commentaire: string) => {
    if (!selected) return
    const dbStatut = decision === "accepted" ? "acceptee" : "rejetee"
    await updateCandidatureStatutAction(selected.id, dbStatut)
    setCandidatures((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? { ...c, status: decision, commentaire: commentaire.trim() || undefined }
          : c
      )
    )
    setSelected(null)
  }

  // Vue détail plein écran
  if (selected) {
    return (
      <DetailView
        candidature={selected}
        onBack={() => setSelected(null)}
        onDecision={handleDecision}
      />
    )
  }

  // Vue liste
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Examen des candidatures</h2>
        <p className="text-muted-foreground">Sélectionnez un concours pour traiter les candidatures</p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Sélectionner un concours</p>
        <ConcoursSelector
          options={concoursList}
          value={selectedConcoursId}
          onChange={handleConcoursChange}
        />
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground text-center py-8">Chargement des candidatures…</p>
      )}

      {concoursSelectionne && !isLoading && (
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

          {/* Progression */}
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
                    <TableHead>Documents</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                        Aucune candidature trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((c) => (
                      <TableRow key={c.id} className={c.status === "pending" ? "bg-muted/20" : ""}>
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
                        <TableCell className="text-sm">
                          <span className={
                            c.documents.every(d => d.status === "approved")
                              ? "text-success"
                              : c.documents.some(d => d.status === "rejected")
                              ? "text-destructive"
                              : "text-muted-foreground"
                          }>
                            {c.documents.filter(d => d.status === "approved").length}/{c.documents.length}
                          </span>
                        </TableCell>
                        <TableCell><StatusBadge status={c.status} /></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => setSelected(c)}>
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
    </div>
  )
}
