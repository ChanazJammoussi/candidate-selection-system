"use client"

import { use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Calendar,
  Trophy,
} from "lucide-react"
import Link from "next/link"

export default function CandidatConcoursDashboard({
  params,
}: {
  params: Promise<{ concourId: string }>
}) {
  const { concourId } = use(params)

  const candidatureStatus = "en_examen"
  const documentsProgress = 75

  const statusConfig = {
    pending: {
      label: "En attente",
      color: "bg-warning text-warning-foreground",
      icon: Clock,
      description: "Votre candidature est en attente de traitement",
    },
    en_examen: {
      label: "En cours d'examen",
      color: "bg-primary text-primary-foreground",
      icon: AlertCircle,
      description: "Votre candidature est actuellement examinée par le jury",
    },
    accepte: {
      label: "Acceptée",
      color: "bg-success text-success-foreground",
      icon: CheckCircle,
      description: "Félicitations ! Votre candidature a été acceptée",
    },
    rejete: {
      label: "Rejetée",
      color: "bg-destructive text-destructive-foreground",
      icon: AlertCircle,
      description: "Votre candidature n'a pas été retenue",
    },
  }

  const currentStatus = statusConfig[candidatureStatus as keyof typeof statusConfig]
  const StatusIcon = currentStatus.icon

  const quickActions = [
    {
      title: "Compléter ma candidature",
      description: "Finalisez votre dossier de candidature",
      icon: FileText,
      href: `/candidat/${concourId}/candidature`,
    },
    {
      title: "Voir le classement",
      description: "Consultez votre position",
      icon: Trophy,
      href: `/candidat/${concourId}/classement`,
    },
  ]

  const recentActivities = [
    {
      title: "CV validé",
      description: "Votre CV a été validé par l'administration",
      time: "Il y a 2 heures",
      type: "success",
    },
    {
      title: "Candidature mise à jour",
      description: "Informations académiques mises à jour",
      time: "Il y a 1 jour",
      type: "info",
    },
    {
      title: "Rappel",
      description: "Date limite de soumission dans 5 jours",
      time: "Il y a 2 jours",
      type: "warning",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Bienvenue, Jean</h2>
          <p className="text-muted-foreground">
            Voici un aperçu de votre candidature au concours d'intégration 2026
          </p>
        </div>
        <Button asChild>
          <Link href={`/candidat/${concourId}/candidature`}>
            Voir ma candidature
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Card className="border-l-4 border-l-primary">
        <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6">
          <div className="flex items-start gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${currentStatus.color}`}>
              <StatusIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">Statut de candidature</h3>
                <Badge className={currentStatus.color}>{currentStatus.label}</Badge>
              </div>
              <p className="text-muted-foreground mt-1">{currentStatus.description}</p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/candidat/${concourId}/suivi`}>
              Voir le suivi détaillé
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Documents soumis</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3/4</div>
            <Progress value={documentsProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">75% complété</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Votre classement</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12<span className="text-lg font-normal text-muted-foreground">e</span></div>
            <p className="text-xs text-muted-foreground mt-2">Sur 156 candidats</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Score actuel</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.5<span className="text-lg font-normal text-muted-foreground">/100</span></div>
            <p className="text-xs text-muted-foreground mt-2">Score calculé</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Date limite</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 jours</div>
            <p className="text-xs text-muted-foreground mt-2">31 Mars 2026</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Gérez votre candidature facilement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link
                  key={index}
                  href={action.href}
                  className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-secondary transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Les dernières mises à jour de votre dossier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`mt-1 h-2 w-2 rounded-full ${
                    activity.type === "success" ? "bg-success"
                    : activity.type === "warning" ? "bg-warning"
                    : "bg-primary"
                  }`} />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium leading-none">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}