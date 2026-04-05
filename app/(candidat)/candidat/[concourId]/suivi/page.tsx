"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Clock,
  FileText,
  UserCheck,
  Award,
  AlertCircle,
} from "lucide-react"

interface TimelineStep {
  id: string
  title: string
  description: string
  date: string
  status: "completed" | "current" | "upcoming"
  icon: React.ReactNode
}

export default function SuiviPage() {
  const timelineSteps: TimelineStep[] = [
    {
      id: "1",
      title: "Candidature soumise",
      description: "Votre dossier de candidature a été soumis avec succès",
      date: "10 Mars 2026",
      status: "completed",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: "2",
      title: "Vérification des documents",
      description: "Vos documents sont en cours de vérification par l'administration",
      date: "12 Mars 2026",
      status: "completed",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      id: "3",
      title: "Examen du dossier",
      description: "Votre dossier est actuellement examiné par le jury",
      date: "15 Mars 2026",
      status: "current",
      icon: <UserCheck className="h-5 w-5" />,
    },
    {
      id: "4",
      title: "Délibération du jury",
      description: "Le jury délibère sur les candidatures reçues",
      date: "À venir",
      status: "upcoming",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      id: "5",
      title: "Publication des résultats",
      description: "Les résultats du concours seront publiés",
      date: "1 Avril 2026",
      status: "upcoming",
      icon: <Award className="h-5 w-5" />,
    },
  ]

  const getStepStyles = (status: TimelineStep["status"]) => {
    switch (status) {
      case "completed":
        return {
          circle: "bg-success text-success-foreground",
          line: "bg-success",
          card: "border-success/20 bg-success/5",
        }
      case "current":
        return {
          circle: "bg-primary text-primary-foreground animate-pulse",
          line: "bg-border",
          card: "border-primary bg-primary/5",
        }
      default:
        return {
          circle: "bg-muted text-muted-foreground",
          line: "bg-border",
          card: "border-border",
        }
    }
  }

  const currentStep = timelineSteps.find((step) => step.status === "current")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Suivi de candidature</h2>
        <p className="text-muted-foreground">Suivez l'avancement de votre dossier en temps réel</p>
      </div>

      {/* Current Status Card */}
      {currentStep && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Statut actuel: {currentStep.title}</h3>
              <p className="text-muted-foreground">{currentStep.description}</p>
            </div>
            <Badge className="ml-auto bg-primary text-primary-foreground">En cours</Badge>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline de votre candidature</CardTitle>
          <CardDescription>Historique et étapes à venir de votre processus de candidature</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {timelineSteps.map((step, index) => {
              const styles = getStepStyles(step.status)
              const isLast = index === timelineSteps.length - 1

              return (
                <div key={step.id} className="relative flex gap-6 pb-8 last:pb-0">
                  {/* Line */}
                  {!isLast && (
                    <div
                      className={`absolute left-[19px] top-10 h-[calc(100%-40px)] w-0.5 ${styles.line}`}
                    />
                  )}

                  {/* Circle */}
                  <div
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${styles.circle}`}
                  >
                    {step.icon}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 rounded-lg border p-4 ${styles.card}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h4 className="font-semibold">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{step.date}</span>
                        {step.status === "completed" && (
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            Complété
                          </Badge>
                        )}
                        {step.status === "current" && (
                          <Badge className="bg-primary text-primary-foreground">
                            En cours
                          </Badge>
                        )}
                        {step.status === "upcoming" && (
                          <Badge variant="outline">À venir</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dates importantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date limite de candidature</span>
              <span className="font-medium">31 Mars 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Annonce des résultats</span>
              <span className="font-medium">1 Avril 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Début des cours</span>
              <span className="font-medium">1 Septembre 2026</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service des admissions</span>
              <span className="font-medium">admissions@sgci.fr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Téléphone</span>
              <span className="font-medium">+33 1 23 45 67 89</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Horaires</span>
              <span className="font-medium">Lun-Ven 9h-17h</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
