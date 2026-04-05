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
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Slider } from "@/components/ui/slider"
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
} from "lucide-react"

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
  criteria: {
    gpaWeight: number
    documentsWeight: number
    interviewWeight: number
  }
}

export default function ConcoursPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showCriteriaDialog, setShowCriteriaDialog] = useState(false)
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null)

  const [newCompetition, setNewCompetition] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    resultsDate: "",
    places: 10,
  })

  const [criteria, setCriteria] = useState({
    gpaWeight: 50,
    documentsWeight: 30,
    interviewWeight: 20,
  })

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
      criteria: { gpaWeight: 50, documentsWeight: 30, interviewWeight: 20 },
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
      criteria: { gpaWeight: 50, documentsWeight: 30, interviewWeight: 20 },
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
      criteria: { gpaWeight: 60, documentsWeight: 25, interviewWeight: 15 },
    },
  ]

  const getStatusBadge = (status: Competition["status"]) => {
    const config = {
      draft: { label: "Brouillon", className: "bg-muted text-muted-foreground", icon: Edit },
      open: { label: "Ouvert", className: "bg-success text-success-foreground", icon: CheckCircle },
      closed: { label: "Fermé", className: "bg-warning text-warning-foreground", icon: Clock },
      results_published: { label: "Résultats publiés", className: "bg-primary text-primary-foreground", icon: Eye },
    }
    return config[status]
  }

  const handleCreateCompetition = () => {
    // In production, this would call an API
    console.log("Creating competition:", newCompetition)
    setShowCreateDialog(false)
    setNewCompetition({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      resultsDate: "",
      places: 10,
    })
  }

  const openCriteriaDialog = (competition: Competition) => {
    setSelectedCompetition(competition)
    setCriteria(competition.criteria)
    setShowCriteriaDialog(true)
  }

  const handleSaveCriteria = () => {
    // In production, this would call an API
    console.log("Saving criteria:", criteria)
    setShowCriteriaDialog(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestion des concours</h2>
          <p className="text-muted-foreground">Créez et gérez les concours d'intégration</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau concours
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Créer un concours</DialogTitle>
              <DialogDescription>
                Définissez les paramètres du nouveau concours
              </DialogDescription>
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
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="startDate">Date de début</FieldLabel>
                  <Input
                    id="startDate"
                    type="date"
                    value={newCompetition.startDate}
                    onChange={(e) => setNewCompetition({ ...newCompetition, startDate: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="endDate">Date de fin</FieldLabel>
                  <Input
                    id="endDate"
                    type="date"
                    value={newCompetition.endDate}
                    onChange={(e) => setNewCompetition({ ...newCompetition, endDate: e.target.value })}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="resultsDate">Publication résultats</FieldLabel>
                  <Input
                    id="resultsDate"
                    type="date"
                    value={newCompetition.resultsDate}
                    onChange={(e) => setNewCompetition({ ...newCompetition, resultsDate: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="places">Nombre de places</FieldLabel>
                  <Input
                    id="places"
                    type="number"
                    value={newCompetition.places}
                    onChange={(e) => setNewCompetition({ ...newCompetition, places: parseInt(e.target.value) })}
                  />
                </Field>
              </div>
            </FieldGroup>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateCompetition}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Competition Cards */}
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
                      <p className="font-medium">{competition.startDate} - {competition.endDate}</p>
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

                <div className="space-y-2">
                  <p className="text-sm font-medium">Critères d'évaluation</p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      Moyenne: {competition.criteria.gpaWeight}%
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Documents: {competition.criteria.documentsWeight}%
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Entretien: {competition.criteria.interviewWeight}%
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openCriteriaDialog(competition)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Critères
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Criteria Dialog */}
      <Dialog open={showCriteriaDialog} onOpenChange={setShowCriteriaDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Critères d'évaluation</DialogTitle>
            <DialogDescription>
              Définissez les poids de chaque critère pour le calcul du score
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <FieldLabel>Moyenne générale</FieldLabel>
                  <span className="text-sm font-medium">{criteria.gpaWeight}%</span>
                </div>
                <Slider
                  value={[criteria.gpaWeight]}
                  onValueChange={([value]) => setCriteria({ ...criteria, gpaWeight: value })}
                  max={100}
                  step={5}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <FieldLabel>Qualité des documents</FieldLabel>
                  <span className="text-sm font-medium">{criteria.documentsWeight}%</span>
                </div>
                <Slider
                  value={[criteria.documentsWeight]}
                  onValueChange={([value]) => setCriteria({ ...criteria, documentsWeight: value })}
                  max={100}
                  step={5}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <FieldLabel>Entretien / Motivation</FieldLabel>
                  <span className="text-sm font-medium">{criteria.interviewWeight}%</span>
                </div>
                <Slider
                  value={[criteria.interviewWeight]}
                  onValueChange={([value]) => setCriteria({ ...criteria, interviewWeight: value })}
                  max={100}
                  step={5}
                />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm">
                <strong>Total: {criteria.gpaWeight + criteria.documentsWeight + criteria.interviewWeight}%</strong>
                {criteria.gpaWeight + criteria.documentsWeight + criteria.interviewWeight !== 100 && (
                  <span className="text-destructive ml-2">(doit être égal à 100%)</span>
                )}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCriteriaDialog(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleSaveCriteria}
              disabled={criteria.gpaWeight + criteria.documentsWeight + criteria.interviewWeight !== 100}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
