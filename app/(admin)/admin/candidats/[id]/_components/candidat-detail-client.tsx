"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft, CheckCircle, XCircle, Clock, User, GraduationCap,
  FileText, Download, Eye, MapPin, Phone, Mail, Calendar, CreditCard, Loader2,
} from "lucide-react"
import { updateCandidatureStatutAction } from "@/lib/actions/admin"
import { CONCOURS_TYPES } from "@/lib/concours-types"
import type { ConcoursTypeId } from "@/lib/concours-types"

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
type DbStatut = "en_attente" | "acceptee" | "rejetee" | "liste_attente"

interface DocumentFile {
  url: string
  fileName: string
  champId: string
  size: string
}

interface CandidatureData {
  id: string
  statut: DbStatut
  score: number | null
  donnees: Record<string, unknown>
  documents: DocumentFile[] | null
  createdAt: string
  candidat: {
    prenom: string
    nom: string
    cin: string
    email: string
    phone: string | null
    birthDate: string | null
    adresse: string | null
    gouvernorat: string | null
    ville: string | null
  }
  concours: {
    nom: string
    type: ConcoursTypeId
    places: number
  }
}

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------
const STATUT_CONFIG: Record<DbStatut, { label: string; className: string }> = {
  en_attente:    { label: "En attente",     className: "bg-warning/10 text-warning border-warning/20" },
  acceptee:      { label: "Admis",          className: "bg-success/10 text-success border-success/20" },
  rejetee:       { label: "Rejeté",         className: "bg-destructive/10 text-destructive border-destructive/20" },
  liste_attente: { label: "Liste d'attente", className: "bg-primary/10 text-primary border-primary/20" },
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-muted-foreground mt-0.5">{icon}</span>
      <div className="flex-1 flex justify-between items-start">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-right max-w-[60%]">{value ?? <span className="text-muted-foreground/50 italic">—</span>}</span>
      </div>
    </div>
  )
}

// ----------------------------------------------------------------
// Page
// ----------------------------------------------------------------
export default function CandidatDetailClient({ candidature }: { candidature: CandidatureData }) {
  const router = useRouter()
  const [statut, setStatut] = useState<DbStatut>(candidature.statut)
  const [isPending, startTransition] = useTransition()

  const handleStatut = (next: DbStatut) => {
    startTransition(async () => {
      await updateCandidatureStatutAction(candidature.id, next)
      setStatut(next)
      router.refresh()
    })
  }

  const cfg = STATUT_CONFIG[statut]
  const concoursType = CONCOURS_TYPES[candidature.concours.type]
  const donnees = candidature.donnees
  const uploadedDocs = candidature.documents ?? []
  const docChamps = concoursType.champs.filter((c) => c.type === "file")
  const nonFileChamps = concoursType.champs.filter((c) => c.type !== "file" && !["nom","prenom","cin","dateNaissance"].includes(c.id))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()} disabled={isPending}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{candidature.candidat.prenom} {candidature.candidat.nom}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="font-mono text-sm text-muted-foreground">{candidature.candidat.cin}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">{candidature.concours.nom}</span>
              <span className="text-muted-foreground">·</span>
              <Badge variant="outline" className={cfg.className}>{cfg.label}</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            className="border-warning/40 text-warning hover:bg-warning/10"
            onClick={() => handleStatut("liste_attente")}
            disabled={isPending || statut === "liste_attente"}
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />}
            Liste d'attente
          </Button>
          <Button
            variant="outline"
            className="border-destructive/40 text-destructive hover:bg-destructive/10"
            onClick={() => handleStatut("rejetee")}
            disabled={isPending || statut === "rejetee"}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Rejeter
          </Button>
          <Button
            className="bg-success text-success-foreground hover:bg-success/90"
            onClick={() => handleStatut("acceptee")}
            disabled={isPending || statut === "acceptee"}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Accepter
          </Button>
        </div>
      </div>

      {/* Score cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Score calculé</p>
              <p className="text-4xl font-bold mt-1">
                {candidature.score !== null ? candidature.score.toFixed(2) : "—"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">/ 20</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Concours</p>
              <p className="text-lg font-bold mt-1 leading-tight">{concoursType.label}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Documents déposés</p>
              <p className="text-4xl font-bold mt-1">{uploadedDocs.length}/{docChamps.length}</p>
              <p className="text-xs text-muted-foreground mt-1">pièces justificatives</p>
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
            Données académiques
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="mr-2 h-4 w-4" />
            Documents
            {uploadedDocs.length < docChamps.length && (
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
                <InfoRow icon={<CreditCard className="h-4 w-4" />} label="CIN" value={<span className="font-mono">{candidature.candidat.cin}</span>} />
                <InfoRow icon={<User className="h-4 w-4" />} label="Nom complet" value={`${candidature.candidat.prenom} ${candidature.candidat.nom}`} />
                <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date de naissance" value={candidature.candidat.birthDate ?? (donnees.dateNaissance as string)} />
                <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={candidature.candidat.email} />
                <InfoRow icon={<Phone className="h-4 w-4" />} label="Téléphone" value={candidature.candidat.phone} />
                <InfoRow icon={<MapPin className="h-4 w-4" />} label="Adresse"
                  value={[candidature.candidat.adresse, candidature.candidat.ville, candidature.candidat.gouvernorat].filter(Boolean).join(", ") || null}
                />
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
                <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Concours" value={candidature.concours.nom} />
                <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Type" value={concoursType.label} />
                <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date de soumission" value={candidature.createdAt} />
                <InfoRow icon={<CheckCircle className="h-4 w-4" />} label="Statut"
                  value={<Badge variant="outline" className={cfg.className}>{cfg.label}</Badge>}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Académique */}
        <TabsContent value="academique" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Baccalauréat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Section</p>
                  <p className="font-medium">{(donnees.bac_section as string) ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Session</p>
                  <p className="font-medium">{(donnees.bac_session as string) ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Moyenne</p>
                  <p className="font-medium">{donnees.moyenne_bac !== undefined ? `${donnees.moyenne_bac}/20` : "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {nonFileChamps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Données spécifiques au concours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {nonFileChamps.map((champ) => (
                    <div key={champ.id}>
                      <p className="text-xs text-muted-foreground">{champ.label}</p>
                      <p className="font-medium">
                        {donnees[champ.id] !== undefined && donnees[champ.id] !== ""
                          ? `${donnees[champ.id]}${champ.unit ?? ""}`
                          : "—"}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Documents */}
        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pièces justificatives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {docChamps.map((champ) => {
                  const uploaded = uploadedDocs.find((d) => d.champId === champ.id)
                  return (
                    <div
                      key={champ.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded bg-muted flex items-center justify-center">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{champ.label}</p>
                          {uploaded
                            ? <p className="text-xs text-muted-foreground">{uploaded.fileName} · {uploaded.size}</p>
                            : <p className="text-xs text-muted-foreground italic">Non déposé{champ.required ? " (requis)" : ""}</p>
                          }
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {uploaded ? (
                          <>
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Déposé
                            </Badge>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                <a href={uploaded.url} target="_blank" rel="noopener noreferrer">
                                  <Eye className="h-4 w-4" />
                                </a>
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                <a href={uploaded.url} download={uploaded.fileName}>
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            </div>
                          </>
                        ) : (
                          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                            <Clock className="mr-1 h-3 w-3" />
                            Manquant
                          </Badge>
                        )}
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
