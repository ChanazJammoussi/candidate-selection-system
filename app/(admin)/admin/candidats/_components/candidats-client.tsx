"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, MoreHorizontal, Eye, CheckCircle, XCircle, Clock } from "lucide-react"
import { updateCandidatureStatutAction } from "@/lib/actions/admin"

type Statut = "en_attente" | "acceptee" | "rejetee" | "liste_attente"

interface CandidatureRow {
  id: string
  candidat: { cin: string; nom: string; prenom: string; email: string }
  concours: { nom: string }
  statut: Statut
  score: number | null
  createdAt: string
}

const STATUT_CONFIG: Record<Statut, { label: string; className: string }> = {
  en_attente:    { label: "En attente",    className: "bg-warning/10 text-warning border-warning/20" },
  acceptee:      { label: "Admis",         className: "bg-success/10 text-success border-success/20" },
  rejetee:       { label: "Rejeté",        className: "bg-destructive/10 text-destructive border-destructive/20" },
  liste_attente: { label: "Liste d'attente", className: "bg-primary/10 text-primary border-primary/20" },
}

export default function CandidatsClient({ candidatures }: { candidatures: CandidatureRow[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = candidatures.filter((c) => {
    const q = search.toLowerCase()
    const matchSearch =
      c.candidat.nom.toLowerCase().includes(q) ||
      c.candidat.prenom.toLowerCase().includes(q) ||
      c.candidat.email.toLowerCase().includes(q) ||
      c.candidat.cin.includes(q)
    const matchStatus = statusFilter === "all" || c.statut === statusFilter
    return matchSearch && matchStatus
  })

  const handleStatut = (id: string, statut: Statut) => {
    startTransition(async () => {
      await updateCandidatureStatutAction(id, statut)
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestion des candidats</h2>
          <p className="text-muted-foreground">Gérez et évaluez les candidatures</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Rechercher par nom, email ou CIN…" className="pl-9"
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="acceptee">Admis</SelectItem>
                <SelectItem value="liste_attente">Liste d'attente</SelectItem>
                <SelectItem value="rejetee">Rejeté</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des candidats</CardTitle>
          <CardDescription>{filtered.length} candidature(s) trouvée(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CIN</TableHead>
                <TableHead>Candidat</TableHead>
                <TableHead>Concours</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                    Aucune candidature trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((c) => {
                  const cfg = STATUT_CONFIG[c.statut]
                  return (
                    <TableRow key={c.id}>
                      <TableCell className="font-mono text-sm">{c.candidat.cin}</TableCell>
                      <TableCell>
                        <p className="font-medium">{c.candidat.prenom} {c.candidat.nom}</p>
                        <p className="text-sm text-muted-foreground">{c.candidat.email}</p>
                      </TableCell>
                      <TableCell className="text-sm">{c.concours.nom}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {c.score !== null ? c.score.toFixed(2) : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.createdAt}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cfg.className}>{cfg.label}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={isPending}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push(`/admin/candidats/${c.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleStatut(c.id, "acceptee")}>
                              <CheckCircle className="mr-2 h-4 w-4 text-success" />Accepter
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatut(c.id, "liste_attente")}>
                              <Clock className="mr-2 h-4 w-4 text-warning" />Liste d'attente
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatut(c.id, "rejetee")}>
                              <XCircle className="mr-2 h-4 w-4 text-destructive" />Rejeter
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatut(c.id, "en_attente")}>
                              Remettre en attente
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
