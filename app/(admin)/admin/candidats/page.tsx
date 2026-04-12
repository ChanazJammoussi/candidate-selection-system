"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Download,
  Mail,
} from "lucide-react"

interface Candidate {
  id: string
  cin: string
  name: string
  email: string
  concours: string
  diploma: string
  specialization: string
  gpa: number
  score: number
  status: "pending" | "en_examen" | "admis" | "liste_attente" | "rejete"
  documentsStatus: "complete" | "incomplete" | "pending"
  submittedAt: string
}

export default function CandidatsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const candidates: Candidate[] = [
    {
      id: "1",
      cin: "12345678",
      name: "Marie Martin",
      email: "marie.m@email.com",
      concours: "Concours Ingénierie 2026",
      diploma: "Master",
      specialization: "Informatique",
      gpa: 16.5,
      score: 92.5,
      status: "admis",
      documentsStatus: "complete",
      submittedAt: "10/03/2026",
    },
    {
      id: "2",
      cin: "23456789",
      name: "Pierre Durand",
      email: "pierre.d@email.com",
      concours: "Concours Mathématiques 2026",
      diploma: "Licence",
      specialization: "Mathématiques",
      gpa: 15.8,
      score: 91.0,
      status: "admis",
      documentsStatus: "complete",
      submittedAt: "08/03/2026",
    },
    {
      id: "3",
      cin: "34567890",
      name: "Sophie Bernard",
      email: "sophie.b@email.com",
      concours: "Concours Ingénierie 2026",
      diploma: "Master",
      specialization: "Physique",
      gpa: 15.2,
      score: 89.5,
      status: "liste_attente",
      documentsStatus: "complete",
      submittedAt: "12/03/2026",
    },
    {
      id: "4",
      cin: "45678901",
      name: "Lucas Petit",
      email: "lucas.p@email.com",
      concours: "Concours Ingénierie 2026",
      diploma: "Licence",
      specialization: "Informatique",
      gpa: 14.8,
      score: 85.0,
      status: "en_examen",
      documentsStatus: "pending",
      submittedAt: "14/03/2026",
    },
    {
      id: "5",
      cin: "56789012",
      name: "Emma Leroy",
      email: "emma.l@email.com",
      concours: "Concours Électronique 2026",
      diploma: "Master",
      specialization: "Électronique",
      gpa: 14.5,
      score: 82.5,
      status: "pending",
      documentsStatus: "incomplete",
      submittedAt: "15/03/2026",
    },
    {
      id: "6",
      cin: "67890123",
      name: "Jean Dupont",
      email: "jean.d@email.com",
      concours: "Concours Ingénierie 2026",
      diploma: "Licence",
      specialization: "Informatique",
      gpa: 15.5,
      score: 78.5,
      status: "en_examen",
      documentsStatus: "complete",
      submittedAt: "10/03/2026",
    },
    {
      id: "7",
      cin: "78901234",
      name: "Camille Roux",
      email: "camille.r@email.com",
      concours: "Concours IA 2026",
      diploma: "Master",
      specialization: "IA",
      gpa: 13.8,
      score: 75.0,
      status: "rejete",
      documentsStatus: "complete",
      submittedAt: "05/03/2026",
    },
  ]

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.cin.includes(searchQuery)
    const matchesStatus = statusFilter === "all" || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: Candidate["status"]) => {
    const config = {
      pending: { label: "En attente", className: "bg-warning/10 text-warning border-warning/20" },
      en_examen: { label: "En examen", className: "bg-primary/10 text-primary border-primary/20" },
      admis: { label: "Admis", className: "bg-success/10 text-success border-success/20" },
      liste_attente: { label: "Liste d'attente", className: "bg-warning/10 text-warning border-warning/20" },
      rejete: { label: "Rejeté", className: "bg-destructive/10 text-destructive border-destructive/20" },
    }
    return config[status]
  }

  const getDocsBadge = (status: Candidate["documentsStatus"]) => {
    const config = {
      complete: { label: "Complet", className: "bg-success/10 text-success border-success/20" },
      incomplete: { label: "Incomplet", className: "bg-destructive/10 text-destructive border-destructive/20" },
      pending: { label: "En vérification", className: "bg-warning/10 text-warning border-warning/20" },
    }
    return config[status]
  }

  const handleStatusChange = (candidateId: string, newStatus: Candidate["status"]) => {
    console.log(`Changing status of ${candidateId} to ${newStatus}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestion des candidats</h2>
          <p className="text-muted-foreground">Gérez et évaluez les candidatures</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Envoyer notifications
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email ou CIN..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="en_examen">En examen</SelectItem>
                <SelectItem value="admis">Admis</SelectItem>
                <SelectItem value="liste_attente">Liste d'attente</SelectItem>
                <SelectItem value="rejete">Rejeté</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des candidats</CardTitle>
          <CardDescription>
            {filteredCandidates.length} candidat(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CIN</TableHead>
                <TableHead>Candidat</TableHead>
                <TableHead>Concours</TableHead>
                <TableHead>Formation</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="text-center">Statut</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => {
                const status = getStatusBadge(candidate.status)
                return (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-mono text-sm">{candidate.cin}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground">{candidate.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{candidate.concours}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{candidate.diploma}</p>
                        <p className="text-sm text-muted-foreground">{candidate.specialization}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {candidate.score}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={status.className}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => router.push(`/admin/candidats/${candidate.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleStatusChange(candidate.id, "admis")}>
                            <CheckCircle className="mr-2 h-4 w-4 text-success" />
                            Accepter
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(candidate.id, "liste_attente")}>
                            <CheckCircle className="mr-2 h-4 w-4 text-warning" />
                            Liste d'attente
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(candidate.id, "rejete")}>
                            <XCircle className="mr-2 h-4 w-4 text-destructive" />
                            Rejeter
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  )
}
