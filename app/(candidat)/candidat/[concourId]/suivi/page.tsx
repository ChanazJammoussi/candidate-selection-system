import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, FileText, UserCheck, Award, AlertCircle } from "lucide-react"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"

type StepStatus = "completed" | "current" | "upcoming"

function getStepStyles(status: StepStatus) {
  switch (status) {
    case "completed":
      return { circle: "bg-success text-success-foreground", line: "bg-success", card: "border-success/20 bg-success/5" }
    case "current":
      return { circle: "bg-primary text-primary-foreground animate-pulse", line: "bg-border", card: "border-primary bg-primary/5" }
    default:
      return { circle: "bg-muted text-muted-foreground", line: "bg-border", card: "border-border" }
  }
}

function fmt(date: Date) {
  return date.toLocaleDateString("fr-TN", { day: "numeric", month: "long", year: "numeric" })
}

export default async function SuiviPage({
  params,
}: {
  params: Promise<{ concourId: string }>
}) {
  const { concourId } = await params
  const session = await getSession()

  const concours = await prisma.concours.findUnique({
    where: { id: concourId },
    select: { nom: true, statut: true, dateFin: true, dateResultats: true },
  })
  if (!concours) notFound()

  const candidature = session.candidatId
    ? await prisma.candidature.findUnique({
        where: { candidatId_concoursId: { candidatId: session.candidatId, concoursId: concourId } },
        select: { statut: true, createdAt: true },
      })
    : null

  // Dériver les statuts des étapes depuis l'état réel du concours
  const isSubmitted       = candidature !== null
  const concoursStatut    = concours.statut

  const step1: StepStatus = isSubmitted ? "completed" : "upcoming"
  const step2: StepStatus =
    concoursStatut === "results_published" || concoursStatut === "closed" ? "completed"
    : isSubmitted && concoursStatut === "open" ? "current"
    : "upcoming"
  const step3: StepStatus =
    concoursStatut === "results_published" ? "completed"
    : concoursStatut === "closed" ? "current"
    : "upcoming"
  const step4: StepStatus = concoursStatut === "results_published" ? "completed" : "upcoming"

  const steps = [
    {
      id: "1",
      title: "Candidature soumise",
      description: isSubmitted
        ? "Votre dossier a été enregistré avec succès"
        : "Vous n'avez pas encore soumis de candidature",
      date: isSubmitted && candidature ? fmt(candidature.createdAt) : "—",
      status: step1,
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: "2",
      title: "Examen du dossier",
      description: "Votre dossier est examiné par le jury",
      date: fmt(concours.dateFin),
      status: step2,
      icon: <UserCheck className="h-5 w-5" />,
    },
    {
      id: "3",
      title: "Délibération du jury",
      description: "Le jury délibère sur les candidatures reçues",
      date: concoursStatut === "closed" || concoursStatut === "results_published"
        ? "En cours"
        : "À venir",
      status: step3,
      icon: <Clock className="h-5 w-5" />,
    },
    {
      id: "4",
      title: "Publication des résultats",
      description: "Les résultats du concours sont disponibles",
      date: fmt(concours.dateResultats),
      status: step4,
      icon: <Award className="h-5 w-5" />,
    },
  ]

  const currentStep = steps.find((s) => s.status === "current")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Suivi de candidature</h2>
        <p className="text-muted-foreground">{concours.nom}</p>
      </div>

      {/* Statut actuel */}
      {currentStep ? (
        <Card className="border-primary bg-primary/5">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Statut actuel : {currentStep.title}</h3>
              <p className="text-muted-foreground">{currentStep.description}</p>
            </div>
            <Badge className="ml-auto bg-primary text-primary-foreground">En cours</Badge>
          </CardContent>
        </Card>
      ) : step4 === "completed" ? (
        <Card className="border-success bg-success/5">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success text-success-foreground">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Résultats publiés</h3>
              <p className="text-muted-foreground">Consultez vos résultats dans l'onglet Résultats.</p>
            </div>
            <Badge className="ml-auto bg-success text-success-foreground">Terminé</Badge>
          </CardContent>
        </Card>
      ) : null}

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline de votre candidature</CardTitle>
          <CardDescription>Historique et étapes à venir</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {steps.map((step, index) => {
              const styles = getStepStyles(step.status)
              const isLast = index === steps.length - 1
              return (
                <div key={step.id} className="relative flex gap-6 pb-8 last:pb-0">
                  {!isLast && (
                    <div className={`absolute left-[19px] top-10 h-[calc(100%-40px)] w-0.5 ${styles.line}`} />
                  )}
                  <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${styles.circle}`}>
                    {step.icon}
                  </div>
                  <div className={`flex-1 rounded-lg border p-4 ${styles.card}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h4 className="font-semibold">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm text-muted-foreground">{step.date}</span>
                        {step.status === "completed" && (
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">Complété</Badge>
                        )}
                        {step.status === "current" && (
                          <Badge className="bg-primary text-primary-foreground">En cours</Badge>
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

      {/* Dates importantes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dates importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date limite de candidature</span>
            <span className="font-medium">{fmt(concours.dateFin)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Publication des résultats</span>
            <span className="font-medium">{fmt(concours.dateResultats)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
