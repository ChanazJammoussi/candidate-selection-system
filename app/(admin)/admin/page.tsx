import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, CheckCircle, Clock, TrendingUp, ArrowRight, UserPlus, AlertCircle } from "lucide-react"
import Link from "next/link"
import { DashboardCharts } from "./_components/dashboard-charts"

const STATUS_LABELS: Record<string, string> = {
  acceptee:      "Admis",
  liste_attente: "Liste d'attente",
  en_attente:    "En attente",
  rejetee:       "Rejeté",
}
const STATUS_COLORS: Record<string, string> = {
  acceptee:      "hsl(var(--success))",
  liste_attente: "hsl(var(--warning))",
  en_attente:    "hsl(var(--muted-foreground))",
  rejetee:       "hsl(var(--destructive))",
}

export default async function AdminDashboard() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [
    totalCandidats,
    totalCandidatures,
    acceptees,
    enAttente,
    candidaturesRaw,
    statusGroups,
    recentRaw,
  ] = await Promise.all([
    prisma.candidat.count(),
    prisma.candidature.count(),
    prisma.candidature.count({ where: { statut: "acceptee" } }),
    prisma.candidature.count({ where: { statut: "en_attente" } }),
    prisma.candidature.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.candidature.groupBy({ by: ["statut"], _count: { _all: true } }),
    prisma.candidature.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { candidat: { select: { nom: true, prenom: true, email: true } } },
    }),
  ])

  // Trend : group by day
  const trendMap = new Map<string, number>()
  for (const c of candidaturesRaw) {
    const day = c.createdAt.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
    trendMap.set(day, (trendMap.get(day) ?? 0) + 1)
  }
  const trendData = Array.from(trendMap.entries()).map(([date, count]) => ({ date, count }))

  const statusData = statusGroups.map((g) => ({
    name:  STATUS_LABELS[g.statut] ?? g.statut,
    value: g._count._all,
    color: STATUS_COLORS[g.statut] ?? "hsl(var(--muted))",
  }))

  const recentCandidates = recentRaw.map((c) => ({
    name:   `${c.candidat.prenom} ${c.candidat.nom}`,
    email:  c.candidat.email,
    date:   c.createdAt.toLocaleDateString("fr-FR"),
    statut: c.statut as string,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Tableau de bord</h2>
          <p className="text-muted-foreground">Vue d'ensemble des candidatures</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/classement">Générer classement</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/candidats">
              <UserPlus className="mr-2 h-4 w-4" />
              Voir candidats
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total candidats</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCandidats}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-success" />
              {totalCandidatures} candidatures soumises
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Candidats acceptés</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acceptees}</div>
            <p className="text-xs text-muted-foreground">sur {totalCandidatures} candidatures</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">En attente de traitement</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enAttente}</div>
            <div className="flex items-center gap-1 text-xs text-warning">
              <AlertCircle className="h-3 w-3" />
              Nécessite attention
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <DashboardCharts trendData={trendData} statusData={statusData} />

      {/* Recent */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Candidatures récentes</CardTitle>
            <CardDescription>Dernières candidatures reçues</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/candidats">
              Voir tout
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentCandidates.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Aucune candidature pour le moment.</p>
          ) : (
            <div className="space-y-4">
              {recentCandidates.map((c, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                      {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-sm text-muted-foreground">{c.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{c.date}</span>
                    <Badge variant="outline"
                      className={
                        c.statut === "acceptee"
                          ? "bg-success/10 text-success border-success/20"
                          : c.statut === "rejetee"
                          ? "bg-destructive/10 text-destructive border-destructive/20"
                          : "bg-warning/10 text-warning border-warning/20"
                      }
                    >
                      {STATUS_LABELS[c.statut] ?? c.statut}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
