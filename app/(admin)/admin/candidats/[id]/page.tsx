"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  GraduationCap,
  FileText,
  Download,
  Eye,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
} from "lucide-react"

// ----------------------------------------------------------------
// Mock data (à remplacer par des appels API)
// ----------------------------------------------------------------
const mockCandidates: Record<string, CandidateDetail> = {
  "1": {
    id: "1",
    cin: "12345678",
    name: "Marie Martin",
    email: "marie.m@email.com",
    phone: "+216 55 123 456",
    dateNaissance: "15/04/1999",
    adresse: "12 Rue de la République, Tunis 1000",
    concours: "Concours Ingénierie 2026",
    diploma: "Master",
    specialization: "Informatique",
    etablissement: "Université de Tunis El Manar",
    gpa: 16.5,
    score: 92.5,
    status: "admis",
    documentsStatus: "complete",
    submittedAt: "10/03/2026",
    bac: { annee: "2017", section: "Sciences", mention: "Très bien", moyenne: "18.5" },
    anneesEtude: [
      { niveau: "1ère Licence", etablissement: "FST Tunis", annee: "2017/2018", moyenne: "16.2", resultat: "Admis" },
      { niveau: "2ème Licence", etablissement: "FST Tunis", annee: "2018/2019", moyenne: "16.8", resultat: "Admis" },
      { niveau: "3ème Licence", etablissement: "FST Tunis", annee: "2019/2020", moyenne: "17.1", resultat: "Admis" },
      { niveau: "1ère Master", etablissement: "FST Tunis", annee: "2020/2021", moyenne: "16.5", resultat: "Admis" },
    ],
    documents: [
      { id: "d1", label: "CIN (recto/verso)", filename: "cin_marie_martin.pdf", size: "1.2 MB", status: "valide", uploadedAt: "08/03/2026" },
      { id: "d2", label: "Baccalauréat", filename: "bac_marie_martin.pdf", size: "800 KB", status: "valide", uploadedAt: "08/03/2026" },
      { id: "d3", label: "Relevé de notes — 1ère Licence", filename: "releve_l1.pdf", size: "650 KB", status: "valide", uploadedAt: "08/03/2026" },
      { id: "d4", label: "Relevé de notes — 2ème Licence", filename: "releve_l2.pdf", size: "680 KB", status: "valide", uploadedAt: "08/03/2026" },
      { id: "d5", label: "Relevé de notes — 3ème Licence", filename: "releve_l3.pdf", size: "700 KB", status: "valide", uploadedAt: "08/03/2026" },
      { id: "d6", label: "Relevé de notes — 1ère Master", filename: "releve_m1.pdf", size: "720 KB", status: "valide", uploadedAt: "09/03/2026" },
      { id: "d7", label: "Attestation d'inscription", filename: "attestation.pdf", size: "400 KB", status: "en_attente", uploadedAt: "10/03/2026" },
    ],
  },
  "2": {
    id: "2",
    cin: "23456789",
    name: "Pierre Durand",
    email: "pierre.d@email.com",
    phone: "+216 55 234 567",
    dateNaissance: "22/07/2000",
    adresse: "45 Avenue Habib Bourguiba, Sfax 3000",
    concours: "Concours Mathématiques 2026",
    diploma: "Licence",
    specialization: "Mathématiques",
    etablissement: "Faculté des Sciences de Sfax",
    gpa: 15.8,
    score: 91.0,
    status: "admis",
    documentsStatus: "complete",
    submittedAt: "08/03/2026",
    bac: { annee: "2018", section: "Mathématiques", mention: "Bien", moyenne: "17.2" },
    anneesEtude: [
      { niveau: "1ère Licence", etablissement: "FS Sfax", annee: "2018/2019", moyenne: "15.5", resultat: "Admis" },
      { niveau: "2ème Licence", etablissement: "FS Sfax", annee: "2019/2020", moyenne: "16.0", resultat: "Admis" },
      { niveau: "3ème Licence", etablissement: "FS Sfax", annee: "2020/2021", moyenne: "15.8", resultat: "Admis" },
    ],
    documents: [
      { id: "d1", label: "CIN (recto/verso)", filename: "cin_pierre_durand.pdf", size: "1.1 MB", status: "valide", uploadedAt: "06/03/2026" },
      { id: "d2", label: "Baccalauréat", filename: "bac_pierre_durand.pdf", size: "750 KB", status: "valide", uploadedAt: "06/03/2026" },
      { id: "d3", label: "Relevé de notes — 1ère Licence", filename: "releve_l1.pdf", size: "620 KB", status: "valide", uploadedAt: "07/03/2026" },
      { id: "d4", label: "Relevé de notes — 2ème Licence", filename: "releve_l2.pdf", size: "640 KB", status: "valide", uploadedAt: "07/03/2026" },
      { id: "d5", label: "Relevé de notes — 3ème Licence", filename: "releve_l3.pdf", size: "660 KB", status: "valide", uploadedAt: "07/03/2026" },
    ],
  },
}

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
interface Document {
  id: string
  label: string
  filename: string
  size: string
  status: "valide" | "en_attente" | "rejete"
  uploadedAt: string
}

interface AnneeEtude {
  niveau: string
  etablissement: string
  annee: string
  moyenne: string
  resultat: string
}

interface CandidateDetail {
  id: string
  cin: string
  name: string
  email: string
  phone: string
  dateNaissance: string
  adresse: string
  concours: string
  diploma: string
  specialization: string
  etablissement: string
  gpa: number
  score: number
  status: "pending" | "en_examen" | "admis" | "liste_attente" | "rejete"
  documentsStatus: "complete" | "incomplete" | "pending"
  submittedAt: string
  bac: { annee: string; section: string; mention: string; moyenne: string }
  anneesEtude: AnneeEtude[]
  documents: Document[]
}

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------
const statusConfig = {
  pending: { label: "En attente", className: "bg-warning/10 text-warning border-warning/20" },
  en_examen: { label: "En examen", className: "bg-primary/10 text-primary border-primary/20" },
  admis: { label: "Admis", className: "bg-success/10 text-success border-success/20" },
  liste_attente: { label: "Liste d'attente", className: "bg-warning/10 text-warning border-warning/20" },
  rejete: { label: "Rejeté", className: "bg-destructive/10 text-destructive border-destructive/20" },
}

const docStatusConfig = {
  valide: { label: "Validé", className: "bg-success/10 text-success border-success/20", icon: CheckCircle },
  en_attente: { label: "En attente", className: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  rejete: { label: "Rejeté", className: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
}

// ----------------------------------------------------------------
// Page
// ----------------------------------------------------------------
export default function CandidatDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const candidate = mockCandidates[id]
  const [candidateStatus, setCandidateStatus] = useState(candidate?.status)

  if (!candidate) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Candidat introuvable.</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>
    )
  }

  const currentStatus = statusConfig[candidateStatus]
  const docsValidated = candidate.documents.filter((d) => d.status === "valide").length
  const docsTotal = candidate.documents.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{candidate.name}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="font-mono text-sm text-muted-foreground">{candidate.cin}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">{candidate.concours}</span>
              <span className="text-muted-foreground">·</span>
              <Badge variant="outline" className={currentStatus.className}>
                {currentStatus.label}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            className="border-warning/40 text-warning hover:bg-warning/10"
            onClick={() => setCandidateStatus("liste_attente")}
          >
            <Clock className="mr-2 h-4 w-4" />
            Liste d'attente
          </Button>
          <Button
            variant="outline"
            className="border-destructive/40 text-destructive hover:bg-destructive/10"
            onClick={() => setCandidateStatus("rejete")}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Rejeter
          </Button>
          <Button
            className="bg-success text-success-foreground hover:bg-success/90"
            onClick={() => setCandidateStatus("admis")}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Accepter
          </Button>
        </div>
      </div>

      {/* Score card */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Score calculé</p>
              <p className="text-4xl font-bold mt-1">{candidate.score}</p>
              <p className="text-xs text-muted-foreground mt-1">/ 100</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Moyenne générale</p>
              <p className="text-4xl font-bold mt-1">{candidate.gpa}</p>
              <p className="text-xs text-muted-foreground mt-1">/ 20</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Documents</p>
              <p className="text-4xl font-bold mt-1">{docsValidated}/{docsTotal}</p>
              <p className="text-xs text-muted-foreground mt-1">validés</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="infos">
        <TabsList>
          <TabsTrigger value="infos">
            <User className="mr-2 h-4 w-4" />
            Informations
          </TabsTrigger>
          <TabsTrigger value="academique">
            <GraduationCap className="mr-2 h-4 w-4" />
            Parcours académique
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="mr-2 h-4 w-4" />
            Documents
            {candidate.documents.some((d) => d.status === "en_attente") && (
              <span className="ml-2 h-2 w-2 rounded-full bg-warning inline-block" />
            )}
          </TabsTrigger>
        </TabsList>

        {/* Onglet Informations */}
        <TabsContent value="infos" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow icon={<CreditCard className="h-4 w-4" />} label="CIN" value={<span className="font-mono">{candidate.cin}</span>} />
                <InfoRow icon={<User className="h-4 w-4" />} label="Nom complet" value={candidate.name} />
                <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date de naissance" value={candidate.dateNaissance} />
                <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={candidate.email} />
                <InfoRow icon={<Phone className="h-4 w-4" />} label="Téléphone" value={candidate.phone} />
                <InfoRow icon={<MapPin className="h-4 w-4" />} label="Adresse" value={candidate.adresse} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Informations de candidature
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Concours" value={candidate.concours} />
                <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Diplôme" value={candidate.diploma} />
                <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Spécialisation" value={candidate.specialization} />
                <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Établissement" value={candidate.etablissement} />
                <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date de soumission" value={candidate.submittedAt} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Académique */}
        <TabsContent value="academique" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Baccalauréat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">Année</p>
                  <p className="font-medium">{candidate.bac.annee}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Section</p>
                  <p className="font-medium">{candidate.bac.section}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Moyenne</p>
                  <p className="font-medium">{candidate.bac.moyenne}/20</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Mention</p>
                  <p className="font-medium">{candidate.bac.mention}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Années d'études supérieures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {candidate.anneesEtude.map((annee, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium">{annee.niveau}</p>
                        <p className="text-sm text-muted-foreground">{annee.etablissement} — {annee.annee}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-right">
                        <p className="text-muted-foreground text-xs">Moyenne</p>
                        <p className="font-medium">{annee.moyenne}/20</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          annee.resultat === "Admis"
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }
                      >
                        {annee.resultat}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Documents */}
        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pièces justificatives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {candidate.documents.map((doc) => {
                  const docStatus = docStatusConfig[doc.status]
                  const Icon = docStatus.icon
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded bg-muted flex items-center justify-center">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{doc.label}</p>
                          <p className="text-xs text-muted-foreground">{doc.filename} · {doc.size} · Déposé le {doc.uploadedAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={docStatus.className}>
                          <Icon className="mr-1 h-3 w-3" />
                          {docStatus.label}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ----------------------------------------------------------------
// Helper component
// ----------------------------------------------------------------
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-muted-foreground mt-0.5">{icon}</span>
      <div className="flex-1 flex justify-between items-start">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-right max-w-[60%]">{value}</span>
      </div>
    </div>
  )
}
