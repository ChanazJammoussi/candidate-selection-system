"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  FileText,
  Clock,
} from "lucide-react"

interface Document {
  id: string
  candidateName: string
  candidateEmail: string
  documentType: string
  fileName: string
  fileSize: string
  uploadDate: string
  status: "pending" | "approved" | "rejected" | "correction"
  feedback?: string
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("pending")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [feedback, setFeedback] = useState("")

  const documents: Document[] = [
    {
      id: "1",
      candidateName: "Jean Dupont",
      candidateEmail: "jean.d@email.com",
      documentType: "CV",
      fileName: "CV_Jean_Dupont.pdf",
      fileSize: "245 KB",
      uploadDate: "15/03/2026",
      status: "pending",
    },
    {
      id: "2",
      candidateName: "Marie Martin",
      candidateEmail: "marie.m@email.com",
      documentType: "Relevé de notes",
      fileName: "Releve_Notes_M2.pdf",
      fileSize: "512 KB",
      uploadDate: "14/03/2026",
      status: "pending",
    },
    {
      id: "3",
      candidateName: "Pierre Durand",
      candidateEmail: "pierre.d@email.com",
      documentType: "Diplôme",
      fileName: "Diplome_Licence.pdf",
      fileSize: "1.2 MB",
      uploadDate: "13/03/2026",
      status: "approved",
    },
    {
      id: "4",
      candidateName: "Sophie Bernard",
      candidateEmail: "sophie.b@email.com",
      documentType: "Lettre de motivation",
      fileName: "Lettre_Motivation.pdf",
      fileSize: "128 KB",
      uploadDate: "12/03/2026",
      status: "correction",
      feedback: "Veuillez développer davantage vos objectifs professionnels.",
    },
    {
      id: "5",
      candidateName: "Lucas Petit",
      candidateEmail: "lucas.p@email.com",
      documentType: "CV",
      fileName: "CV_Lucas_Petit.pdf",
      fileSize: "198 KB",
      uploadDate: "11/03/2026",
      status: "rejected",
      feedback: "Document illisible. Veuillez soumettre une version de meilleure qualité.",
    },
    {
      id: "6",
      candidateName: "Emma Leroy",
      candidateEmail: "emma.l@email.com",
      documentType: "Relevé de notes",
      fileName: "Releve_L3.pdf",
      fileSize: "456 KB",
      uploadDate: "15/03/2026",
      status: "pending",
    },
  ]

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: Document["status"]) => {
    const config = {
      pending: { label: "En attente", className: "bg-warning/10 text-warning border-warning/20", icon: Clock },
      approved: { label: "Approuvé", className: "bg-success/10 text-success border-success/20", icon: CheckCircle },
      rejected: { label: "Rejeté", className: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
      correction: { label: "À corriger", className: "bg-primary/10 text-primary border-primary/20", icon: AlertCircle },
    }
    return config[status]
  }

  const stats = {
    pending: documents.filter((d) => d.status === "pending").length,
    approved: documents.filter((d) => d.status === "approved").length,
    rejected: documents.filter((d) => d.status === "rejected").length,
    correction: documents.filter((d) => d.status === "correction").length,
  }

  const openReviewDialog = (document: Document) => {
    setSelectedDocument(document)
    setFeedback(document.feedback || "")
    setShowReviewDialog(true)
  }

  const handleApprove = () => {
    // In production, this would call an API
    console.log("Approving document:", selectedDocument?.id)
    setShowReviewDialog(false)
  }

  const handleReject = () => {
    // In production, this would call an API
    console.log("Rejecting document:", selectedDocument?.id, "Feedback:", feedback)
    setShowReviewDialog(false)
  }

  const handleRequestCorrection = () => {
    // In production, this would call an API
    console.log("Requesting correction for:", selectedDocument?.id, "Feedback:", feedback)
    setShowReviewDialog(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Revue des documents</h2>
        <p className="text-muted-foreground">Vérifiez et validez les documents des candidats</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card
          className="cursor-pointer hover:border-warning transition-colors"
          onClick={() => setStatusFilter("pending")}
        >
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">En attente</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:border-success transition-colors"
          onClick={() => setStatusFilter("approved")}
        >
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.approved}</p>
              <p className="text-sm text-muted-foreground">Approuvés</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => setStatusFilter("correction")}
        >
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.correction}</p>
              <p className="text-sm text-muted-foreground">À corriger</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:border-destructive transition-colors"
          onClick={() => setStatusFilter("rejected")}
        >
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.rejected}</p>
              <p className="text-sm text-muted-foreground">Rejetés</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par candidat ou fichier..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrer par statut" />
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

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documents à examiner</CardTitle>
          <CardDescription>{filteredDocuments.length} document(s) trouvé(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidat</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-center">Taille</TableHead>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Statut</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => {
                const status = getStatusBadge(doc.status)
                const StatusIcon = status.icon
                return (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{doc.candidateName}</p>
                        <p className="text-sm text-muted-foreground">{doc.candidateEmail}</p>
                      </div>
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
                      <Badge variant="outline" className={status.className}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" title="Télécharger">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Examiner"
                          onClick={() => openReviewDialog(doc)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Examiner le document</DialogTitle>
            <DialogDescription>
              Vérifiez le document et prenez une décision
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Candidat</p>
                  <p className="font-medium">{selectedDocument.candidateName}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Type de document</p>
                  <p className="font-medium">{selectedDocument.documentType}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Fichier</p>
                  <p className="font-medium font-mono">{selectedDocument.fileName}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Date de soumission</p>
                  <p className="font-medium">{selectedDocument.uploadDate}</p>
                </div>
              </div>

              {/* Document Preview Placeholder */}
              <div className="h-48 rounded-lg border border-dashed border-border flex items-center justify-center bg-muted/50">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Aperçu du document</p>
                  <Button variant="link" className="text-sm">
                    Ouvrir dans un nouvel onglet
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Commentaire / Feedback</label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Ajoutez un commentaire pour le candidat..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
              Annuler
            </Button>
            <Button variant="outline" onClick={handleRequestCorrection}>
              <AlertCircle className="mr-2 h-4 w-4" />
              Demander correction
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              <XCircle className="mr-2 h-4 w-4" />
              Rejeter
            </Button>
            <Button onClick={handleApprove}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approuver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
