"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  User,
  GraduationCap,
  FileText,
  Upload,
  Check,
  X,
  Clock,
  AlertCircle,
  Trash2,
  Eye,
  Download,
  Plus,
} from "lucide-react"
import { getConcoursById } from "@/lib/mock-concours"
import { CONCOUR_TYPE_CONFIGS } from "@/lib/concours-types"

// ----------------------------------------------------------------
// Types locaux
// ----------------------------------------------------------------

interface AnneePrepa {
  id: string
  anneeScolaire: string
  niveau: "1ere" | "2eme" | ""
  etablissement: string
  moyenne: string
  resultat: "admis" | "refuse" | ""
  session: "principale" | "controle" | ""
}

interface AnneeLicence {
  id: string
  anneeScolaire: string
  niveau: "1ere" | "2eme" | "3eme" | ""
  etablissement: string
  moyenne: string
  resultat: "admis" | "refuse" | ""
  session: "principale" | "controle" | ""
  rang: string
  nbEtudiants: string
}

interface InfoBac {
  anneeObtention: string
  section: string
  moyenne: string
  mention: "passable" | "assez_bien" | "bien" | "tres_bien" | ""
  session: "principale" | "controle" | ""
}

interface RequiredDoc {
  id: string
  label: string
  sublabel?: string   // précision affichée sous le label (ex: "1ère année — 2022/2023")
}

interface UploadedFile {
  id: string
  champId: string
  label: string
  name: string
  status: "pending" | "approved" | "rejected" | "correction"
  uploadDate: string
  size: string
  feedback?: string
}

// ----------------------------------------------------------------
// Constantes
// ----------------------------------------------------------------

const STATUS_CONFIG = {
  pending:    { label: "En attente",  className: "bg-warning/10 text-warning border-warning/20" },
  approved:   { label: "Validé",      className: "bg-success/10 text-success border-success/20" },
  rejected:   { label: "Rejeté",      className: "bg-destructive/10 text-destructive border-destructive/20" },
  correction: { label: "À corriger",  className: "bg-primary/10 text-primary border-primary/20" },
}

function StatusIcon({ status }: { status: UploadedFile["status"] }) {
  switch (status) {
    case "approved":   return <Check       className="h-4 w-4 text-success" />
    case "rejected":   return <X           className="h-4 w-4 text-destructive" />
    case "correction": return <AlertCircle className="h-4 w-4 text-primary" />
    default:           return <Clock       className="h-4 w-4 text-warning" />
  }
}

const ANNEE_SCOLAIRE_OPTIONS = [
  "2018/2019", "2019/2020", "2020/2021", "2021/2022",
  "2022/2023", "2023/2024", "2024/2025", "2025/2026",
]

const ETABLISSEMENTS_PREPA = [
  "ISIMM — Institut Supérieur d'Informatique et de Mathématiques de Monastir",
  "Autre",
]

const SECTIONS_BAC_TN = [
  "Mathématiques",
  "Sciences expérimentales",
  "Sciences techniques",
  "Économie et gestion",
  "Lettres",
  "Informatique",
  "Sport",
  "Sciences de l'informatique",
]

// ----------------------------------------------------------------
// Page
// ----------------------------------------------------------------

export default function CandidaturePage() {
  const params = useParams()
  const concourId = params?.concourId as string
  const concours  = getConcoursById(concourId)
  const typeConfig = concours ? CONCOUR_TYPE_CONFIGS[concours.type] : null

  // Séparation des champs par catégorie (ing_prepa)
  const champsPerso  = typeConfig?.champs.filter((c) =>
    ["nom", "prenom", "cin", "dateNaissance"].includes(c.id)) ?? []

  // ── State navigation ──
  const [activeTab, setActiveTab] = useState("info")

  // ── State infos personnelles ──
  const [formData, setFormData] = useState<Record<string, string>>({
    email: "", telephone: "",
  })
  const handleField = (id: string, value: string) =>
    setFormData((prev) => ({ ...prev, [id]: value }))

  // ── State bac ──
  const [bac, setBac] = useState<InfoBac>({
    anneeObtention: "", section: "", moyenne: "", mention: "", session: "",
  })

  // ── State années prépa (au moins 1 ligne au départ) ──
  const [anneesPrepa, setAnneesPrepa] = useState<AnneePrepa[]>([
    { id: "1", anneeScolaire: "", niveau: "", etablissement: "", moyenne: "", resultat: "", session: "" },
  ])

  const addAnneePrepa = () =>
    setAnneesPrepa((prev) => [
      ...prev,
      { id: Date.now().toString(), anneeScolaire: "", niveau: "", etablissement: "", moyenne: "", resultat: "", session: "" },
    ])

  const removeAnneePrepa = (id: string) =>
    setAnneesPrepa((prev) => prev.filter((a) => a.id !== id))

  const updateAnneePrepa = (id: string, field: keyof AnneePrepa, value: string) =>
    setAnneesPrepa((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a
        const updated = { ...a, [field]: value }
        // Réinitialise la session si le résultat passe à "refuse"
        if (field === "resultat" && value === "refuse") updated.session = ""
        return updated
      })
    )

  // ── State années licence ──
  const [anneesLicence, setAnneesLicence] = useState<AnneeLicence[]>([
    { id: "1", anneeScolaire: "", niveau: "", etablissement: "", moyenne: "", resultat: "", session: "", rang: "", nbEtudiants: "" },
  ])

  const addAnneeLicence = () =>
    setAnneesLicence((prev) => [
      ...prev,
      { id: Date.now().toString(), anneeScolaire: "", niveau: "", etablissement: "", moyenne: "", resultat: "", session: "", rang: "", nbEtudiants: "" },
    ])

  const removeAnneeLicence = (id: string) =>
    setAnneesLicence((prev) => prev.filter((a) => a.id !== id))

  const updateAnneeLicence = (id: string, field: keyof AnneeLicence, value: string) =>
    setAnneesLicence((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a
        const updated = { ...a, [field]: value }
        if (field === "resultat" && value === "refuse") {
          updated.session = ""
          updated.rang = ""
          updated.nbEtudiants = ""
        }
        return updated
      })
    )

  // ── State années blanches ──
  const [aAnneeBlanches, setAAnneeBlanches] = useState<"" | "oui" | "non">("")
  const [nbAnneeBlanches, setNbAnneeBlanches] = useState("")
  const [anneesBlanches, setAnneesBlanches] = useState("")

  // ── State documents ──
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  // Documents requis : fixes (bac) + dynamiques selon le type
  const niveauLicenceLabel = (n: AnneeLicence["niveau"]) =>
    n === "1ere" ? "1ère année" : n === "2eme" ? "2ème année" : n === "3eme" ? "3ème année" : ""

  const niveauPrepaLabel = (n: AnneePrepa["niveau"]) =>
    n === "1ere" ? "1ère année" : n === "2eme" ? "2ème année" : ""

  const requiredDocs: RequiredDoc[] = [
    { id: "cin-recto",    label: "CIN (recto)" },
    { id: "cin-verso",    label: "CIN (verso)" },
    { id: "diplome-bac",  label: "Diplôme du baccalauréat" },
    { id: "releve-bac",   label: "Relevé de notes du baccalauréat" },
    ...(concours?.type === "ing_licence" || concours?.type === "master"
      ? anneesLicence.map((a) => ({
          id: `releve-licence-${a.id}`,
          label: "Relevé de notes — Licence",
          sublabel: [
            niveauLicenceLabel(a.niveau),
            a.anneeScolaire,
            a.etablissement ? `(${a.etablissement})` : "",
          ].filter(Boolean).join(" · ") || "Année non renseignée",
        }))
      : anneesPrepa.map((a) => ({
          id: `releve-prepa-${a.id}`,
          label: "Relevé de notes — Classes préparatoires",
          sublabel: [
            niveauPrepaLabel(a.niveau),
            a.anneeScolaire,
            a.etablissement ? `(${a.etablissement.split("—")[0].trim()})` : "",
          ].filter(Boolean).join(" · ") || "Année non renseignée",
        }))
    ),
  ]

  const validatedCount  = uploadedFiles.filter(
    (f) => f.status === "approved" && requiredDocs.some((r) => r.id === f.champId)
  ).length
  const progressPercent = requiredDocs.length > 0
    ? Math.round((validatedCount / requiredDocs.length) * 100)
    : 0

  const handleUpload = (champId: string, label: string) =>
    setUploadedFiles((prev) => [
      ...prev.filter((f) => f.champId !== champId),
      {
        id: Date.now().toString(),
        champId, label,
        name: `${label.replace(/\s+/g, "_")}.pdf`,
        status: "pending",
        uploadDate: new Date().toLocaleDateString("fr-FR"),
        size: "—",
      },
    ])

  const handleDelete = (id: string) =>
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))

  // ── Rendu champ générique (texte/nombre) ──
  const renderChamp = (champ: NonNullable<typeof typeConfig>["champs"][number]) => {
    if (champ.type === "select" && champ.options) {
      return (
        <Field key={champ.id}>
          <FieldLabel htmlFor={champ.id}>
            {champ.label}
            {champ.required && <span className="text-destructive ml-1">*</span>}
          </FieldLabel>
          <Select value={formData[champ.id] ?? ""} onValueChange={(v) => handleField(champ.id, v)}>
            <SelectTrigger id={champ.id}><SelectValue placeholder="Sélectionner…" /></SelectTrigger>
            <SelectContent>
              {champ.options.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
      )
    }
    return (
      <Field key={champ.id}>
        <FieldLabel htmlFor={champ.id}>
          {champ.label}
          {champ.unit && <span className="text-muted-foreground ml-1 text-xs">{champ.unit}</span>}
          {champ.required && <span className="text-destructive ml-1">*</span>}
        </FieldLabel>
        <Input
          id={champ.id}
          type={champ.type === "number" ? "number" : champ.type === "date" ? "date" : "text"}
          value={formData[champ.id] ?? ""}
          onChange={(e) => handleField(champ.id, e.target.value)}
          min={champ.type === "number" ? 0 : undefined}
          max={champ.unit === "/20" ? 20 : undefined}
          step={champ.type === "number" ? 0.5 : undefined}
        />
      </Field>
    )
  }

  if (!concours || !typeConfig) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Concours introuvable.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Ma Candidature</h2>
          <p className="text-muted-foreground">{concours.titre}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Documents soumis</p>
            <p className="text-lg font-semibold">{uploadedFiles.length} / {requiredDocs.length}</p>
          </div>
          <div className="w-24"><Progress value={progressPercent} /></div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <User className="h-4 w-4" />Informations
          </TabsTrigger>
          <TabsTrigger value="academic" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />Académique
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />Documents
          </TabsTrigger>
        </TabsList>

        {/* ══════════════════════════════════════════
            Onglet 1 — Informations personnelles
        ══════════════════════════════════════════ */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Identité et coordonnées du candidat</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-4 md:grid-cols-2">
                  {champsPerso.slice(0, 2).map(renderChamp)}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {champsPerso.slice(2).map(renderChamp)}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="email">
                      Adresse e-mail <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input id="email" type="email" value={formData.email}
                      onChange={(e) => handleField("email", e.target.value)}
                      placeholder="prenom.nom@example.com" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="telephone">
                      Téléphone <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input id="telephone" type="tel" value={formData.telephone}
                      onChange={(e) => handleField("telephone", e.target.value)}
                      placeholder="+216 XX XXX XXX" />
                  </Field>
                </div>
              </FieldGroup>
              <div className="flex justify-end mt-6">
                <Button onClick={() => setActiveTab("academic")}>Continuer</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ══════════════════════════════════════════
            Onglet 2 — Informations académiques
        ══════════════════════════════════════════ */}
        <TabsContent value="academic">
          <div className="space-y-6">

            {/* ── Section Baccalauréat ── */}
            <Card>
              <CardHeader>
                <CardTitle>Baccalauréat</CardTitle>
                <CardDescription>Informations relatives à l'obtention du bac</CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="bacAnnee">
                        Année d'obtention <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input id="bacAnnee" type="number" min={2000} max={2026}
                        value={bac.anneeObtention}
                        onChange={(e) => setBac({ ...bac, anneeObtention: e.target.value })}
                        placeholder="ex : 2022" />
                    </Field>
                    <Field>
                      <FieldLabel>Section <span className="text-destructive">*</span></FieldLabel>
                      <Select value={bac.section} onValueChange={(v) => setBac({ ...bac, section: v })}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner…" /></SelectTrigger>
                        <SelectContent>
                          {SECTIONS_BAC_TN.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="bacMoyenne">
                        Moyenne <span className="text-muted-foreground text-xs">/20</span>{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input id="bacMoyenne" type="number" min={0} max={20} step={0.01}
                        value={bac.moyenne}
                        onChange={(e) => setBac({ ...bac, moyenne: e.target.value })}
                        placeholder="ex : 14.50" />
                    </Field>
                    <Field>
                      <FieldLabel>Mention <span className="text-destructive">*</span></FieldLabel>
                      <Select value={bac.mention} onValueChange={(v) => setBac({ ...bac, mention: v as InfoBac["mention"] })}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner…" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="passable">Passable (10 – 12)</SelectItem>
                          <SelectItem value="assez_bien">Assez Bien (12 – 14)</SelectItem>
                          <SelectItem value="bien">Bien (14 – 16)</SelectItem>
                          <SelectItem value="tres_bien">Très Bien (≥ 16)</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field>
                      <FieldLabel>Session <span className="text-destructive">*</span></FieldLabel>
                      <Select value={bac.session} onValueChange={(v) => setBac({ ...bac, session: v as InfoBac["session"] })}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner…" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="principale">Principale</SelectItem>
                          <SelectItem value="controle">Contrôle</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </FieldGroup>
              </CardContent>
            </Card>

            {/* ── Section Parcours (prépa ou licence selon le type) ── */}
            {(concours.type === "ing_licence" || concours.type === "master") ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Parcours en licence</CardTitle>
                      <CardDescription>
                        Renseignez chaque année suivie, y compris les redoublements
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={addAnneeLicence}>
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter une année
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {anneesLicence.map((annee, idx) => (
                    <div key={annee.id} className="rounded-lg border border-border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">Année {idx + 1}</p>
                        {anneesLicence.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => removeAnneeLicence(annee.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {/* Année scolaire */}
                        <Field>
                          <FieldLabel>Année scolaire <span className="text-destructive">*</span></FieldLabel>
                          <Select value={annee.anneeScolaire} onValueChange={(v) => updateAnneeLicence(annee.id, "anneeScolaire", v)}>
                            <SelectTrigger><SelectValue placeholder="ex : 2022/2023" /></SelectTrigger>
                            <SelectContent>
                              {ANNEE_SCOLAIRE_OPTIONS.map((a) => (
                                <SelectItem key={a} value={a}>{a}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                        {/* Niveau */}
                        <Field>
                          <FieldLabel>Niveau <span className="text-destructive">*</span></FieldLabel>
                          <Select value={annee.niveau} onValueChange={(v) => updateAnneeLicence(annee.id, "niveau", v)}>
                            <SelectTrigger><SelectValue placeholder="Sélectionner…" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1ere">1ère année</SelectItem>
                              <SelectItem value="2eme">2ème année</SelectItem>
                              <SelectItem value="3eme">3ème année</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                        {/* Établissement */}
                        <Field className="md:col-span-2">
                          <FieldLabel>Établissement <span className="text-destructive">*</span></FieldLabel>
                          <Input
                            value={annee.etablissement}
                            onChange={(e) => updateAnneeLicence(annee.id, "etablissement", e.target.value)}
                            placeholder="ex : Faculté des Sciences de Monastir"
                          />
                        </Field>
                        {/* Moyenne */}
                        <Field>
                          <FieldLabel>
                            Moyenne générale{" "}
                            <span className="text-muted-foreground text-xs">/20</span>{" "}
                            <span className="text-destructive">*</span>
                          </FieldLabel>
                          <Input
                            type="number" min={0} max={20} step={0.01}
                            value={annee.moyenne}
                            onChange={(e) => updateAnneeLicence(annee.id, "moyenne", e.target.value)}
                            placeholder="ex : 13.25"
                          />
                        </Field>
                        {/* Résultat */}
                        <Field>
                          <FieldLabel>Résultat <span className="text-destructive">*</span></FieldLabel>
                          <Select value={annee.resultat} onValueChange={(v) => updateAnneeLicence(annee.id, "resultat", v)}>
                            <SelectTrigger><SelectValue placeholder="Sélectionner…" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admis">Admis</SelectItem>
                              <SelectItem value="refuse">Refusé</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                        {/* Champs visibles uniquement si Admis */}
                        {annee.resultat === "admis" && (
                          <>
                            <Field>
                              <FieldLabel>Session <span className="text-destructive">*</span></FieldLabel>
                              <Select value={annee.session} onValueChange={(v) => updateAnneeLicence(annee.id, "session", v)}>
                                <SelectTrigger><SelectValue placeholder="Sélectionner…" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="principale">Principale</SelectItem>
                                  <SelectItem value="controle">Contrôle</SelectItem>
                                </SelectContent>
                              </Select>
                            </Field>
                            <Field>
                              <FieldLabel>Rang dans la promotion <span className="text-destructive">*</span></FieldLabel>
                              <Input
                                type="number" min={1}
                                value={annee.rang}
                                onChange={(e) => updateAnneeLicence(annee.id, "rang", e.target.value)}
                                placeholder="ex : 5"
                              />
                            </Field>
                            <Field>
                              <FieldLabel>Nombre d'étudiants de la promotion <span className="text-destructive">*</span></FieldLabel>
                              <Input
                                type="number" min={1}
                                value={annee.nbEtudiants}
                                onChange={(e) => updateAnneeLicence(annee.id, "nbEtudiants", e.target.value)}
                                placeholder="ex : 120"
                              />
                            </Field>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Parcours en classe préparatoire</CardTitle>
                      <CardDescription>
                        Renseignez chaque année suivie, y compris les redoublements
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={addAnneePrepa}>
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter une année
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {anneesPrepa.map((annee, idx) => (
                    <div key={annee.id} className="rounded-lg border border-border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">Année {idx + 1}</p>
                        {anneesPrepa.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => removeAnneePrepa(annee.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <Field>
                          <FieldLabel>Année scolaire <span className="text-destructive">*</span></FieldLabel>
                          <Select value={annee.anneeScolaire} onValueChange={(v) => updateAnneePrepa(annee.id, "anneeScolaire", v)}>
                            <SelectTrigger><SelectValue placeholder="ex : 2022/2023" /></SelectTrigger>
                            <SelectContent>
                              {ANNEE_SCOLAIRE_OPTIONS.map((a) => (
                                <SelectItem key={a} value={a}>{a}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field>
                          <FieldLabel>Niveau <span className="text-destructive">*</span></FieldLabel>
                          <Select value={annee.niveau} onValueChange={(v) => updateAnneePrepa(annee.id, "niveau", v)}>
                            <SelectTrigger><SelectValue placeholder="Sélectionner…" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1ere">1ère année</SelectItem>
                              <SelectItem value="2eme">2ème année</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field className="md:col-span-2">
                          <FieldLabel>Établissement <span className="text-destructive">*</span></FieldLabel>
                          <Select value={annee.etablissement} onValueChange={(v) => updateAnneePrepa(annee.id, "etablissement", v)}>
                            <SelectTrigger><SelectValue placeholder="Sélectionner un établissement…" /></SelectTrigger>
                            <SelectContent>
                              {ETABLISSEMENTS_PREPA.map((e) => (
                                <SelectItem key={e} value={e}>{e}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field>
                          <FieldLabel>
                            Moyenne générale{" "}
                            <span className="text-muted-foreground text-xs">/20</span>{" "}
                            <span className="text-destructive">*</span>
                          </FieldLabel>
                          <Input
                            type="number" min={0} max={20} step={0.01}
                            value={annee.moyenne}
                            onChange={(e) => updateAnneePrepa(annee.id, "moyenne", e.target.value)}
                            placeholder="ex : 13.25"
                          />
                        </Field>
                        <Field>
                          <FieldLabel>Résultat <span className="text-destructive">*</span></FieldLabel>
                          <Select value={annee.resultat} onValueChange={(v) => updateAnneePrepa(annee.id, "resultat", v)}>
                            <SelectTrigger><SelectValue placeholder="Sélectionner…" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admis">Admis</SelectItem>
                              <SelectItem value="refuse">Refusé</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                        {annee.resultat === "admis" && (
                          <Field>
                            <FieldLabel>Session <span className="text-destructive">*</span></FieldLabel>
                            <Select value={annee.session} onValueChange={(v) => updateAnneePrepa(annee.id, "session", v)}>
                              <SelectTrigger><SelectValue placeholder="Sélectionner…" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="principale">Principale</SelectItem>
                                <SelectItem value="controle">Contrôle</SelectItem>
                              </SelectContent>
                            </Select>
                          </Field>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* ── Section Années blanches ── */}
            <Card>
              <CardHeader>
                <CardTitle>Années blanches</CardTitle>
                <CardDescription>
                  Indiquez si vous avez eu des années blanches depuis l'obtention du bac
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Avez-vous eu des années blanches ? <span className="text-destructive">*</span></FieldLabel>
                    <Select value={aAnneeBlanches} onValueChange={(v) => setAAnneeBlanches(v as typeof aAnneeBlanches)}>
                      <SelectTrigger className="max-w-xs"><SelectValue placeholder="Sélectionner…" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="non">Non</SelectItem>
                        <SelectItem value="oui">Oui</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  {aAnneeBlanches === "oui" && (
                    <>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field>
                          <FieldLabel>
                            Nombre d'années blanches <span className="text-destructive">*</span>
                          </FieldLabel>
                          <Input
                            type="number" min={1} max={5}
                            value={nbAnneeBlanches}
                            onChange={(e) => setNbAnneeBlanches(e.target.value)}
                            placeholder="ex : 1"
                            className="max-w-xs"
                          />
                        </Field>
                        <Field>
                          <FieldLabel>
                            Années concernées{" "}
                            <span className="text-muted-foreground text-xs">(optionnel)</span>
                          </FieldLabel>
                          <Input
                            value={anneesBlanches}
                            onChange={(e) => setAnneesBlanches(e.target.value)}
                            placeholder="ex : 2022/2023, 2023/2024"
                          />
                        </Field>
                      </div>
                    </>
                  )}
                </FieldGroup>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("info")}>Précédent</Button>
              <Button onClick={() => setActiveTab("documents")}>Continuer</Button>
            </div>
          </div>
        </TabsContent>

        {/* ══════════════════════════════════════════
            Onglet 3 — Documents
        ══════════════════════════════════════════ */}
        <TabsContent value="documents">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Documents requis</CardTitle>
                <CardDescription>
                  Téléversez les pièces justificatives de votre dossier — tous les champs marqués{" "}
                  <span className="text-destructive">*</span> sont obligatoires
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {requiredDocs.map((doc) => {
                    const uploaded = uploadedFiles.find((f) => f.champId === doc.id)
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary flex-shrink-0">
                            <FileText className="h-5 w-5 text-secondary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.label}</p>
                            {doc.sublabel && (
                              <p className="text-xs text-primary/80">{doc.sublabel}</p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              {uploaded ? uploaded.name : "Non téléversé"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {uploaded ? (
                            <Badge variant="outline" className={STATUS_CONFIG[uploaded.status].className}>
                              {STATUS_CONFIG[uploaded.status].label}
                            </Badge>
                          ) : (
                            <Button size="sm" onClick={() => handleUpload(doc.id, doc.label)}>
                              <Upload className="h-4 w-4 mr-1" />
                              Uploader
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {uploadedFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Fichiers téléversés</CardTitle>
                  <CardDescription>Statut de vos documents soumis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-4">
                          <StatusIcon status={file.status} />
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{file.label}</span>
                              <span>•</span>
                              <span>{file.uploadDate}</span>
                            </div>
                            {file.feedback && (
                              <p className="text-xs text-primary mt-1">
                                <AlertCircle className="inline h-3 w-3 mr-1" />
                                {file.feedback}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={STATUS_CONFIG[file.status].className}>
                            {STATUS_CONFIG[file.status].label}
                          </Badge>
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                          {file.status !== "approved" && (
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(file.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("academic")}>Précédent</Button>
              <Button
                disabled={requiredDocs.some((r) => !uploadedFiles.find((f) => f.champId === r.id))}
              >
                Soumettre ma candidature
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
