"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowRight,
  UserPlus,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"

export default function AdminDashboard() {
  // Mock data
  const stats = {
    totalCandidats: 156,
    candidaturesSoumises: 142,
    candidatsAcceptes: 10,
    enAttente: 28,
  }

  const candidaturesTrend = [
    { date: "1 Mar", count: 12 },
    { date: "5 Mar", count: 28 },
    { date: "10 Mar", count: 45 },
    { date: "15 Mar", count: 78 },
    { date: "20 Mar", count: 112 },
    { date: "25 Mar", count: 142 },
  ]

  const statusDistribution = [
    { name: "Admis", value: 10, color: "hsl(var(--success))" },
    { name: "Liste d'attente", value: 15, color: "hsl(var(--warning))" },
    { name: "En examen", value: 45, color: "hsl(var(--primary))" },
    { name: "En attente", value: 28, color: "hsl(var(--muted))" },
  ]

  const documentStats = [
    { name: "CV", validated: 120, pending: 22 },
    { name: "Relevé", validated: 115, pending: 27 },
    { name: "Diplôme", validated: 100, pending: 42 },
    { name: "Lettre", validated: 95, pending: 47 },
  ]

  const recentCandidates = [
    { name: "Lucas Martin", email: "lucas.m@email.com", date: "Il y a 2h", status: "pending" },
    { name: "Emma Bernard", email: "emma.b@email.com", date: "Il y a 3h", status: "en_examen" },
    { name: "Hugo Petit", email: "hugo.p@email.com", date: "Il y a 5h", status: "pending" },
    { name: "Léa Dubois", email: "lea.d@email.com", date: "Il y a 6h", status: "en_examen" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Tableau de bord</h2>
          <p className="text-muted-foreground">Vue d'ensemble des candidatures au concours 2026</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/classement">
              Générer classement
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/candidats">
              <UserPlus className="mr-2 h-4 w-4" />
              Voir candidats
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total candidats
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCandidats}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-success" />
              +12% depuis hier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Candidatures soumises
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.candidaturesSoumises}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.candidaturesSoumises / stats.totalCandidats) * 100)}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Candidats acceptés
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.candidatsAcceptes}</div>
            <p className="text-xs text-muted-foreground">10 places disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En attente de traitement
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enAttente}</div>
            <div className="flex items-center gap-1 text-xs text-warning">
              <AlertCircle className="h-3 w-3" />
              Nécessite attention
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Candidatures Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution des candidatures</CardTitle>
            <CardDescription>Nombre de candidatures sur le mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={candidaturesTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par statut</CardTitle>
            <CardDescription>Distribution des candidatures par statut</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {statusDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Stats & Recent */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Document Validation Stats */}
        <Card>
          <CardHeader>
            <CardTitle>État des documents</CardTitle>
            <CardDescription>Documents validés vs en attente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={documentStats}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="validated" fill="hsl(var(--success))" name="Validés" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" fill="hsl(var(--warning))" name="En attente" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Candidates */}
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
            <div className="space-y-4">
              {recentCandidates.map((candidate, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {candidate.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium">{candidate.name}</p>
                      <p className="text-sm text-muted-foreground">{candidate.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{candidate.date}</span>
                    <Badge
                      variant="outline"
                      className={
                        candidate.status === "pending"
                          ? "bg-warning/10 text-warning border-warning/20"
                          : "bg-primary/10 text-primary border-primary/20"
                      }
                    >
                      {candidate.status === "pending" ? "En attente" : "En examen"}
                    </Badge>
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
