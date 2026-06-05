import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  FileText, Clock, CheckCircle, AlertCircle, ArrowRight,
  Calendar, Trophy, XCircle, ListOrdered,
} from "lucide-react"
import Link from "next/link"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { CONCOURS_TYPES } from "@/lib/concours-types"
import type { ConcoursTypeId } from "@/lib/concours-types"

// ─── Helpers ────────────────────────────────────────────────

const STATUT_CONFIG = {
  en_attente: {
    label: "En cours d'examen",
    color: "bg-primary text-primary-foreground",
    borderColor: "border-l-primary",
    icon: AlertCircle,
    description: "Votre candidature est examinée par le jury",
  },
  acceptee: {
    label: "Acceptée",
    color: "bg-success text-success-foreground",
    borderColor: "border-l-success",
    icon: CheckCircle,
    description: "Félicitations ! Votre candidature a été acceptée",
  },
  rejetee: {
    label: "Rejetée",
    color: "bg-destructive text-destructive-foreground",
    borderColor: "border-l-destructive",
    icon: XCircle,
    description: "Votre candidature n'a pas été retenue cette année",
  },
  liste_attente: {
    label: "Liste d'attente",
    color: "bg-warning text-warning-foreground",
    borderColor: "border-l-warning",
    icon: Clock,
    description: "Vous êtes sur liste d'attente — vous serez notifié si une place se libère",
  },
}

function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

// ─── Page ───────────────────────────────────────────────────

export default async function CandidatConcoursDashboard({
  params,
}: {
  params: Promise<{ concourId: string }>
}) {
  const { concourId } = await params
  const session = await getSession()

  const [candidat, concours] = await Promise.all([
    session.candidatId
      ? prisma.candidat.findUnique({
          where: { id: session.candidatId },
          select: { prenom: true, nom: true },
        })
      : null,
    prisma.concours.findUnique({
      where: { id: concourId },
      select: { nom: true, type: true, dateFin: true, dateResultats: true, places: true, statut: true },
    }),
  ])

  if (!concours) notFound()

  // Candidature du candidat connecté
  const candidature = session.candidatId
    ? await prisma.candidature.findUnique({
        where: {
          candidatId_concoursId: { candidatId: session.candidatId, concoursId: concourId },
        },
        select: { statut: true, score: true, documents: true, createdAt: true, updatedAt: true },
      })
    : null

  // Rang et total (seulement si le candidat a un score)
  const [totalCandidatures, candidatsDevant] = await Promise.all([
    prisma.candidature.count({ where: { concoursId: concourId } }),
    candidature?.score != null
      ? prisma.candidature.count({
          where: { concoursId: concourId, score: { gt: candidature.score } },
        })
      : Promise.resolve(null),
  ])

  const rank = candidatsDevant !== null ? candidatsDevant + 1 : null

  // Progression documents
  const concoursType = CONCOURS_TYPES[concours.type as ConcoursTypeId]
  const requiredDocs = concoursType.champs.filter((c) => c.type === "file" && c.required)
  const uploadedDocs = (candidature?.documents as Array<{ champId: string }> | null) ?? []
  const docsDeposés = uploadedDocs.filter((d) =>
    requiredDocs.some((r) => r.id === d.champId)
  ).length
  const docsProgress = requiredDocs.length > 0
    ? Math.round((docsDeposés / requiredDocs.length) * 100)
    : 0

  // Jours restants avant date limite
  const daysLeft = daysUntil(concours.dateFin)

  const prenom = candidat?.prenom ?? "Candidat"

  const statusCfg = candidature
    ? STATUT_CONFIG[candidature.statut as keyof typeof STATUT_CONFIG]
    : null
  const StatusIcon = statusCfg?.icon ?? Clock

  // Activité récente dérivée des vraies données
  const activities: { title: string; description: string; time: string; type: "success" | "info" | "warning" }[] = []
  if (candidature) {
    activities.push({
      title: "Candidature soumise",
      description: "Votre dossier a été enregistré",
      time: candidature.createdAt.toLocaleDateString("fr-TN", { day: "numeric", month: "long", year: "numeric" }),
      type: "success",
    })
    if (candidature.updatedAt.getTime() - candidature.createdAt.getTime() > 60_000) {
      activities.push({
        title: "Candidature modifiée",
        description: "Votre dossier a été mis à jour",
        time: candidature.updatedAt.toLocaleDateString("fr-TN", { day: "numeric", month: "long", year: "numeric" }),
        type: "info",
      })
    }
    if (candidature.score !== null) {
      activities.push({
        title: "Score calculé",
        description: `Votre score est de ${candidature.score.toFixed(2)}/20`,
        time: "",
        type: "info",
      })
    }
    if (daysLeft > 0 && daysLeft <= 7 && docsDeposés < requiredDocs.length) {
      activities.push({
        title: "Rappel — documents manquants",
        description: `${requiredDocs.length - docsDeposés} pièce(s) justificative(s) à déposer`,
        time: `${daysLeft} jour(s) restant(s)`,
        type: "warning",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Bienvenue, {prenom}</h2>
          <p className="text-muted-foreground">{concours.nom}</p>
        </div>
        <Button asChild>
          <Link href={`/candidat/${concourId}/candidature`}>
            {candidature ? "Voir ma candidature" : "Soumettre ma candidature"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Statut */}
      {candidature && statusCfg ? (
        <Card className={`border-l-4 ${statusCfg.borderColor}`}>
          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6">
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${statusCfg.color}`}>
                <StatusIcon className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">Statut de candidature</h3>
                  <Badge className={statusCfg.color}>{statusCfg.label}</Badge>
                </div>
                <p className="text-muted-foreground mt-1">{statusCfg.description}</p>
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
      ) : (
        <Card className="border-l-4 border-l-muted-foreground/30 border-dashed">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Aucune candidature</h3>
              <p className="text-muted-foreground">Vous n'avez pas encore soumis de candidature pour ce concours.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Documents soumis</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {candidature ? `${docsDeposés}/${requiredDocs.length}` : "—"}
            </div>
            <Progress value={docsProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">{docsProgress}% complété</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Classement actuel</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {rank !== null ? (
              <>
                <div className="text-2xl font-bold">
                  {rank}<span className="text-lg font-normal text-muted-foreground">e</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Sur {totalCandidatures} candidat(s)</p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-muted-foreground">—</div>
                <p className="text-xs text-muted-foreground mt-2">Score non encore calculé</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Score actuel</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {candidature?.score != null ? (
              <>
                <div className="text-2xl font-bold">
                  {candidature.score.toFixed(2)}
                  <span className="text-lg font-normal text-muted-foreground">/20</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Score calculé</p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-muted-foreground">—</div>
                <p className="text-xs text-muted-foreground mt-2">En attente de traitement</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Date limite</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {daysLeft > 0 ? (
              <>
                <div className="text-2xl font-bold">{daysLeft} j</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {concours.dateFin.toLocaleDateString("fr-TN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-muted-foreground">Clôturé</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {concours.dateFin.toLocaleDateString("fr-TN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides + Activité */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Gérez votre candidature facilement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                title: candidature ? "Voir ma candidature" : "Soumettre ma candidature",
                description: candidature
                  ? `${docsDeposés}/${requiredDocs.length} document(s) déposé(s)`
                  : "Déposez votre dossier avant la date limite",
                icon: FileText,
                href: `/candidat/${concourId}/candidature`,
              },
              {
                title: "Voir le classement",
                description: rank ? `Vous êtes ${rank}e sur ${totalCandidatures}` : "Classement provisoire",
                icon: Trophy,
                href: `/candidat/${concourId}/classement`,
              },
              {
                title: "Résultats",
                description: concours.statut === "results_published" ? "Résultats disponibles" : `Publication le ${concours.dateResultats.toLocaleDateString("fr-TN")}`,
                icon: ListOrdered,
                href: `/candidat/${concourId}/resultats`,
              },
            ].map((action, i) => {
              const Icon = action.icon
              return (
                <Link
                  key={i}
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
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((a, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                      a.type === "success" ? "bg-success"
                      : a.type === "warning" ? "bg-warning"
                      : "bg-primary"
                    }`} />
                    <div className="flex-1 space-y-0.5">
                      <p className="font-medium leading-none">{a.title}</p>
                      <p className="text-sm text-muted-foreground">{a.description}</p>
                      {a.time && <p className="text-xs text-muted-foreground">{a.time}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                Aucune activité pour l'instant. Soumettez votre candidature pour commencer.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
