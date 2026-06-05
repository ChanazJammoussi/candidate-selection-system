"use client"

import { useState, useEffect, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Eye, CheckCircle, XCircle, AlertCircle, Download, FileText, Clock, Loader2 } from "lucide-react"
import { fetchAllDocumentsAction, reviewDocumentAction } from "@/lib/actions/admin"
import type { DocumentRow } from "@/lib/actions/admin"
import { toast } from "sonner"

const STATUS_CONFIG = {
  pending:    { label: "En attente", className: "bg-warning/10 text-warning border-warning/20",         icon: Clock },
  approved:   { label: "Approuvé",   className: "bg-success/10 text-success border-success/20",         icon: CheckCircle },
  rejected:   { label: "Rejeté",     className: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
  correction: { label: "À corriger", className: "bg-primary/10 text-primary border-primary/20",         icon: AlertCircle },
}

export default function DocumentsPage() {
  const [documents, setDocuments]               = useState<DocumentRow[]>([])
  const [isLoading, setIsLoading]               = useState(true)
  const [searchQuery, setSearchQuery]           = useState("")
  const [statusFilter, setStatusFilter]         = useState("pending")
  const [selectedDoc, setSelectedDoc]           = useState<DocumentRow | null>(null)
  const [showDialog, setShowDialog]             = useState(false)
  const [feedback, setFeedback]                 = useState("")
  const [isPending, startTransition]            = useTransition()

  useEffect(() => {
    fetchAllDocumentsAction().then((data) => { setDocuments(data); setIsLoading(false) })
  }, [])

  const filtered = documents.filter((d) => {
    const q = searchQuery.toLowerCase()
    const matchSearch = d.candidateName.toLowerCase().includes(q) || d.fileName.toLowerCase().includes(q)
    const matchStatus = statusFilter === "all" || d.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    pending:    documents.filter((d) => d.status === "pending").length,
    approved:   documents.filter((d) => d.status === "approved").length,
    rejected:   documents.filter((d) => d.status === "rejected").length,
    correction: documents.filter((d) => d.status === "correction").length,
  }

  const openDialog = (doc: DocumentRow) => {
    setSelectedDoc(doc)
    setFeedback(doc.feedback ?? "")
    setShowDialog(true)
  }

  const handleReview = (status: "approved" | "rejected" | "correction") => {
    if (!selectedDoc) return
    startTransition(async () => {
      const result = await reviewDocumentAction(selectedDoc.candidatureId, selectedDoc.champId, status, feedback)
      if (result.success) {
        setDocuments((prev) =>
          prev.map((d) =>
            d.candidatureId === selectedDoc.candidatureId && d.champId === selectedDoc.champId
              ? { ...d, status, feedback: feedback || undefined }
              : d
          )
        )
        toast.success(`Document ${STATUS_CONFIG[status].label.toLowerCase()} avec succès`)
        setShowDialog(false)
      } else {
        toast.error("Erreur lors de la mise à jour du document")
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Revue des documents</h2>
        <p className="text-muted-foreground">Vérifiez et validez les documents des candidats</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {(["pending", "approved", "correction", "rejected"] as const).map((s) => {
          const cfg = STATUS_CONFIG[s]
          const Icon = cfg.icon
          return (
            <Card key={s} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setStatusFilter(s)}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${cfg.className.split(" ").slice(0, 2).join(" ")}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{isLoading ? "…" : stats[s]}</p>
                  <p className="text-sm text-muted-foreground">{cfg.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Rechercher par candidat ou fichier..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvés</SelectItem>
                <SelectItem value="correction">À corriger</SelectItem>
                <SelectItem value="rejected">Rejetés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documents à examiner</CardTitle>
          <CardDescription>
            {isLoading ? "Chargement…" : `${filtered.length} document(s) trouvé(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">Aucun document trouvé.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidat</TableHead>
                  <TableHead>Fichier</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">Taille</TableHead>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">Statut</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((doc, i) => {
                  const cfg = STATUS_CONFIG[doc.status]
                  const Icon = cfg.icon
                  return (
                    <TableRow key={`${doc.candidatureId}-${doc.champId}-${i}`}>
                      <TableCell>
                        <p className="font-medium">{doc.candidateName}</p>
                        <p className="text-sm text-muted-foreground">{doc.candidateEmail}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-sm">{doc.fileName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{doc.documentType}</TableCell>
                      <TableCell className="text-center">{doc.fileSize}</TableCell>
                      <TableCell className="text-center">{doc.uploadDate}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={cfg.className}>
                          <Icon className="mr-1 h-3 w-3" />{cfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" title="Télécharger" asChild>
                            <a href={doc.url} download={doc.fileName}><Download className="h-4 w-4" /></a>
                          </Button>
                          <Button variant="ghost" size="icon" title="Examiner" onClick={() => openDialog(doc)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog examen */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Examiner le document</DialogTitle>
            <DialogDescription>Vérifiez le document et prenez une décision</DialogDescription>
          </DialogHeader>
          {selectedDoc && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div><p className="text-sm text-muted-foreground">Candidat</p><p className="font-medium">{selectedDoc.candidateName}</p></div>
                <div><p className="text-sm text-muted-foreground">Type de document</p><p className="font-medium">{selectedDoc.documentType}</p></div>
                <div><p className="text-sm text-muted-foreground">Fichier</p><p className="font-medium font-mono">{selectedDoc.fileName}</p></div>
                <div><p className="text-sm text-muted-foreground">Date de soumission</p><p className="font-medium">{selectedDoc.uploadDate}</p></div>
              </div>

              <div className="h-48 rounded-lg border border-dashed border-border flex items-center justify-center bg-muted/50">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Aperçu du document</p>
                  <Button variant="link" className="text-sm" asChild>
                    <a href={selectedDoc.url} target="_blank" rel="noopener noreferrer">Ouvrir dans un nouvel onglet</a>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Commentaire / Feedback</label>
                <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Ajoutez un commentaire pour le candidat..." rows={3} />
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowDialog(false)} disabled={isPending}>Annuler</Button>
            <Button variant="outline" onClick={() => handleReview("correction")} disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertCircle className="mr-2 h-4 w-4" />}
              Demander correction
            </Button>
            <Button variant="destructive" onClick={() => handleReview("rejected")} disabled={isPending}>
              <XCircle className="mr-2 h-4 w-4" />Rejeter
            </Button>
            <Button onClick={() => handleReview("approved")} disabled={isPending}>
              <CheckCircle className="mr-2 h-4 w-4" />Approuver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
