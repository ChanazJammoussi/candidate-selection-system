"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import {
  Plus,
  Settings,
  Calendar,
  Users,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  X,
  AlertCircle,
} from "lucide-react"
import {
  ConcourType,
  CONCOUR_TYPE_CONFIGS,
  CONCOUR_TYPE_LABELS,
} from "@/lib/concours-types"

// ----------------------------------------------------------------
// Types locaux
// ----------------------------------------------------------------

interface Competition {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  resultsDate: string
  places: number
  registeredCount: number
  status: "draft" | "open" | "closed" | "results_published"
  type: ConcourType
  specialites: string[]
  formule: string // ex: "notesMaths * 0.4 + notesPhysique * 0.3 + notesLangue * 0.3"
}

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

const CHAMP_TYPE_LABELS: Record<string, string> = {
  text:   "Texte",
  number: "Nombre",
  select: "Liste",
  date:   "Date",
  file:   "Fichier",
}

/**
 * Vérifie que la formule :
 * - n'est pas vide
 * - ne contient que des identifiants, chiffres, opérateurs arithmétiques et parenthèses
 * - peut être évaluée sans erreur (test avec des valeurs fictives = 0)
 */
function validateFormule(formule: string, availableIds: string[]): string | null {
  if (!formule.trim()) return "La formule ne peut pas être vide."
  // Remplacer les ids connus par "0" et tenter d'évaluer
  let expr = formule
  for (const id of availableIds) {
    expr = expr.replace(new RegExp(`\\b${id}\\b`, "g"), "0")
  }
  // Vérifier qu'il ne reste que des caractères arithmétiques valides
  if (/[^0-9\s\+\-\*\/\.\(\)]/g.test(expr)) {
    return "La formule contient des variables inconnues ou des caractères invalides."
  }
  try {
    // eslint-disable-next-line no-new-func
    const result = new Function(`return ${expr}`)()
    if (typeof result !== "number" || !isFinite(result)) throw new Error()
  } catch {
    return "La formule est invalide (erreur de syntaxe)."
  }
  return null
}

// ----------------------------------------------------------------
// Composant réutilisable : section formule
// ----------------------------------------------------------------

function FormulaSection({
  type,
  formule,
  onChange,
}: {
  type: ConcourType
  formule: string
  onChange: (v: string) => void
}) {
  const config = CONCOUR_TYPE_CONFIGS[type]
  const numericChamps = config.champs.filter((c) => c.type === "number")
  const availableIds = numericChamps.map((c) => c.id)
  const error = formule.trim() ? validateFormule(formule, availableIds) : null

  return (
    <div className="space-y-3">
      <FieldLabel>Formule de calcul du score</FieldLabel>
      <p className="text-xs text-muted-foreground -mt-1">
        Utilisez les identifiants ci-dessous. Opérateurs autorisés : <code className="font-mono">+ - * / ( )</code>
      </p>

      {/* Variables disponibles — cliquables pour insérer */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Variables disponibles :</p>
        <div className="flex flex-wrap gap-1.5">
          {numericChamps.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onChange(formule ? `${formule} + ${c.id}` : c.id)}
              className="rounded border border-border bg-muted/60 px-2 py-0.5 text-xs font-mono hover:bg-muted transition-colors"
              title={c.label}
            >
              {c.id}
              <span className="ml-1 text-muted-foreground font-sans">({c.label})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Saisie libre */}
      <Textarea
        value={formule}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Ex : ${numericChamps[0]?.id ?? "champ1"} * 0.4 + ${numericChamps[1]?.id ?? "champ2"} * 0.6`}
        rows={3}
        className="font-mono text-sm"
      />

      {/* Validation */}
      {formule.trim() && error && (
        <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}
      {formule.trim() && !error && (
        <div className="rounded-md border bg-muted/40 p-3 space-y-0.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Formule enregistrée</p>
          <p className="text-sm font-mono break-words">score = {formule}</p>
        </div>
      )}
    </div>
  )
}

// ----------------------------------------------------------------
// Page
// ----------------------------------------------------------------

export default function ConcoursPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showCriteriaDialog, setShowCriteriaDialog] = useState(false)
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null)

  // — Formulaire de création —
  const [newCompetition, setNewCompetition] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    resultsDate: "",
    places: 10,
  })
  const [selectedType, setSelectedType] = useState<ConcourType | "">("")
  const [formule, setFormule] = useState("")
  const [specialites, setSpecialites] = useState<string[]>([])
  const [specialiteInput, setSpecialiteInput] = useState("")

  // — Dialog configuration (édition) —
  const [editFormule, setEditFormule] = useState("")
  const [editSpecialites, setEditSpecialites] = useState<string[]>([])
  const [editSpecialiteInput, setEditSpecialiteInput] = useState("")

  // ----------------------------------------------------------------

  const handleTypeChange = (value: ConcourType) => {
    setSelectedType(value)
    setFormule("")
  }

  const addTag = (
    input: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    inputSetter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const v = input.trim()
    if (v) { setter((prev) => [...prev, v]); inputSetter("") }
  }

  const createFormulaError =
    selectedType && formule.trim()
      ? validateFormule(formule, CONCOUR_TYPE_CONFIGS[selectedType].champs.filter(c => c.type === "number").map(c => c.id))
      : null

  const editFormulaError =
    selectedCompetition && editFormule.trim()
      ? validateFormule(editFormule, CONCOUR_TYPE_CONFIGS[selectedCompetition.type].champs.filter(c => c.type === "number").map(c => c.id))
      : null

  const handleCreateCompetition = () => {
    console.log("Creating competition:", { ...newCompetition, type: selectedType, formule, specialites })
    setShowCreateDialog(false)
    setNewCompetition({ name: "", description: "", startDate: "", endDate: "", resultsDate: "", places: 10 })
    setSelectedType("")
    setFormule("")
    setSpecialites([])
    setSpecialiteInput("")
  }

  const openCriteriaDialog = (competition: Competition) => {
    setSelectedCompetition(competition)
    setEditFormule(competition.formule ?? "")
    setEditSpecialites(competition.specialites ?? [])
    setShowCriteriaDialog(true)
  }

  const handleSaveCriteria = () => {
    console.log("Saving:", { formule: editFormule, specialites: editSpecialites })
    setShowCriteriaDialog(false)
  }

  // ----------------------------------------------------------------

  const competitions: Competition[] = [
    {
      id: "1",
      name: "Concours d'Intégration 2026",
      description: "Concours annuel pour l'intégration des nouveaux étudiants",
      startDate: "01/03/2026",
      endDate: "31/03/2026",
      resultsDate: "01/04/2026",
      places: 10,
      registeredCount: 156,
      status: "open",
      type: "ing_prepa",
      specialites: ["MP", "PC", "PT"],
      formule: "notesMaths * 0.40 + notesPhysique * 0.30 + notesInformatique * 0.15 + notesLangue * 0.15",
    },
    {
      id: "2",
      name: "Concours d'Intégration 2025",
      description: "Concours de l'année précédente",
      startDate: "01/03/2025",
      endDate: "31/03/2025",
      resultsDate: "01/04/2025",
      places: 10,
      registeredCount: 142,
      status: "results_published",
      type: "ing_prepa",
      specialites: ["MP", "PC"],
      formule: "notesMaths * 0.40 + notesPhysique * 0.30 + notesInformatique * 0.15 + notesLangue * 0.15",
    },
    {
      id: "3",
      name: "Concours Spécial Master",
      description: "Concours réservé aux titulaires de Master",
      startDate: "15/04/2026",
      endDate: "15/05/2026",
      resultsDate: "01/06/2026",
      places: 5,
      registeredCount: 0,
      status: "draft",
      type: "master",
      specialites: ["Informatique", "Génie logiciel"],
      formule: "moyenneGenerale * 0.45 + noteMemoire * 0.25 + notesLangue * 0.20 + experiencePro * 0.10",
    },
  ]

  const getStatusBadge = (status: Competition["status"]) => {
    const config = {
      draft:             { label: "Brouillon",        className: "bg-muted text-muted-foreground",     icon: Edit },
      open:              { label: "Ouvert",            className: "bg-success text-success-foreground", icon: CheckCircle },
      closed:            { label: "Fermé",             className: "bg-warning text-warning-foreground", icon: Clock },
      results_published: { label: "Résultats publiés", className: "bg-primary text-primary-foreground", icon: Eye },
    }
    return config[status]
  }

  const typeConfig = selectedType ? CONCOUR_TYPE_CONFIGS[selectedType] : null

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestion des concours</h2>
          <p className="text-muted-foreground">Créez et gérez les concours d'intégration</p>
        </div>

        {/* ── Dialog création ── */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau concours
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un concours</DialogTitle>
              <DialogDescription>Définissez les paramètres du nouveau concours</DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nom du concours</FieldLabel>
                <Input
                  id="name"
                  value={newCompetition.name}
                  onChange={(e) => setNewCompetition({ ...newCompetition, name: e.target.value })}
                  placeholder="Concours d'Intégration 2027"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  value={newCompetition.description}
                  onChange={(e) => setNewCompetition({ ...newCompetition, description: e.target.value })}
                  placeholder="Description du concours..."
                  rows={3}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="type">Type de concours</FieldLabel>
                <Select value={selectedType} onValueChange={(v) => handleTypeChange(v as ConcourType)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Sélectionner un type…" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(CONCOUR_TYPE_LABELS) as ConcourType[]).map((key) => (
                      <SelectItem key={key} value={key}>{CONCOUR_TYPE_LABELS[key]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* Spécialités */}
              {typeConfig && (
                <div className="space-y-2">
                  <FieldLabel>Spécialités acceptées</FieldLabel>
                  <div className="flex gap-2">
                    <Input
                      value={specialiteInput}
                      onChange={(e) => setSpecialiteInput(e.target.value)}
                      placeholder="Ex : MP, Informatique…"
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addTag(specialiteInput, setSpecialites, setSpecialiteInput))
                      }
                    />
                    <Button type="button" variant="outline"
                      onClick={() => addTag(specialiteInput, setSpecialites, setSpecialiteInput)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {specialites.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {specialites.map((s) => (
                        <Badge key={s} variant="secondary" className="flex items-center gap-1">
                          {s}
                          <button onClick={() => setSpecialites((prev) => prev.filter((x) => x !== s))}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Aucune spécialité → toutes acceptées</p>
                  )}
                </div>
              )}

              {/* Aperçu champs */}
              {typeConfig && (
                <div className="space-y-2">
                  <FieldLabel>Champs de candidature</FieldLabel>
                  <div className="rounded-md border bg-muted/40 p-3 space-y-1">
                    {typeConfig.champs.map((champ) => (
                      <div
                        key={champ.id}
                        className="flex items-center justify-between text-sm py-1 border-b last:border-0 border-border/50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{champ.label}</span>
                          {champ.required && <span className="text-destructive text-xs">*</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          {champ.unit && <span className="text-muted-foreground text-xs">{champ.unit}</span>}
                          <Badge variant="outline" className="text-xs">
                            {CHAMP_TYPE_LABELS[champ.type] ?? champ.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground pt-1">* champ obligatoire — aperçu en lecture seule</p>
                  </div>
                </div>
              )}

              {/* Formule manuelle */}
              {typeConfig && (
                <FormulaSection
                  type={selectedType as ConcourType}
                  formule={formule}
                  onChange={setFormule}
                />
              )}

              {/* Dates & places */}
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="startDate">Date de début</FieldLabel>
                  <Input id="startDate" type="date" value={newCompetition.startDate}
                    onChange={(e) => setNewCompetition({ ...newCompetition, startDate: e.target.value })} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="endDate">Date de fin</FieldLabel>
                  <Input id="endDate" type="date" value={newCompetition.endDate}
                    onChange={(e) => setNewCompetition({ ...newCompetition, endDate: e.target.value })} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="resultsDate">Publication résultats</FieldLabel>
                  <Input id="resultsDate" type="date" value={newCompetition.resultsDate}
                    onChange={(e) => setNewCompetition({ ...newCompetition, resultsDate: e.target.value })} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="places">Nombre de places</FieldLabel>
                  <Input id="places" type="number" value={newCompetition.places}
                    onChange={(e) => setNewCompetition({ ...newCompetition, places: parseInt(e.target.value) })} />
                </Field>
              </div>
            </FieldGroup>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Annuler</Button>
              <Button
                onClick={handleCreateCompetition}
                disabled={!selectedType || !formule.trim() || !!createFormulaError}
              >
                Créer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Cartes concours ── */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {competitions.map((competition) => {
          const status = getStatusBadge(competition.status)
          const StatusIcon = status.icon
          return (
            <Card key={competition.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{competition.name}</CardTitle>
                    <CardDescription>{competition.description}</CardDescription>
                  </div>
                  <Badge className={status.className}>
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {status.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Période</p>
                      <p className="font-medium">{competition.startDate} – {competition.endDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Inscrits / Places</p>
                      <p className="font-medium">{competition.registeredCount} / {competition.places}</p>
                    </div>
                  </div>
                </div>

                {/* Spécialités */}
                <div className="space-y-1">
                  <p className="text-sm font-medium">Spécialités acceptées</p>
                  {competition.specialites.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {competition.specialites.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Toutes spécialités acceptées</p>
                  )}
                </div>

                {/* Formule */}
                <div className="space-y-1">
                  <p className="text-sm font-medium">Formule de score</p>
                  <p className="text-xs text-muted-foreground font-mono break-words">
                    score = {competition.formule}
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1"
                    onClick={() => openCriteriaDialog(competition)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configurer
                  </Button>
                  <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* ── Dialog configuration ── */}
      <Dialog open={showCriteriaDialog} onOpenChange={setShowCriteriaDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configuration — {selectedCompetition?.name}</DialogTitle>
            <DialogDescription>
              Modifiez les spécialités acceptées et la formule de calcul du score
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {/* Spécialités */}
            <div className="space-y-2">
              <FieldLabel>Spécialités acceptées</FieldLabel>
              <div className="flex gap-2">
                <Input
                  value={editSpecialiteInput}
                  onChange={(e) => setEditSpecialiteInput(e.target.value)}
                  placeholder="Ajouter une spécialité…"
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), addTag(editSpecialiteInput, setEditSpecialites, setEditSpecialiteInput))
                  }
                />
                <Button type="button" variant="outline"
                  onClick={() => addTag(editSpecialiteInput, setEditSpecialites, setEditSpecialiteInput)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {editSpecialites.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {editSpecialites.map((s) => (
                    <Badge key={s} variant="secondary" className="flex items-center gap-1">
                      {s}
                      <button onClick={() => setEditSpecialites((prev) => prev.filter((x) => x !== s))}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Aucune spécialité → toutes acceptées</p>
              )}
            </div>

            {/* Formule manuelle */}
            {selectedCompetition && (
              <FormulaSection
                type={selectedCompetition.type}
                formule={editFormule}
                onChange={setEditFormule}
              />
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCriteriaDialog(false)}>Annuler</Button>
            <Button
              onClick={handleSaveCriteria}
              disabled={!editFormule.trim() || !!editFormulaError}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
