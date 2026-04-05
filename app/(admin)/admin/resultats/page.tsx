"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Download,
  Upload,
  Send,
  CheckCircle,
  AlertCircle,
  Eye,
  FileText,
  Mail,
  Clock,
} from "lucide-react"

export default function AdminResultatsPage() {
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [showNotifyDialog, setShowNotifyDialog] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSendingNotifications, setIsSendingNotifications] = useState(false)

  const resultsStatus = {
    isPublished: false,
    publishedDate: null as string | null,
    totalCandidates: 156,
    admis: 10,
    listeAttente: 15,
    nonRetenus: 131,
    notificationsSent: false,
  }

  const resultsSummary = [
    { status: "admis", label: "Admis", count: 10, color: "bg-success/10 text-success" },
    { status: "liste_attente", label: "Liste d'attente", count: 15, color: "bg-warning/10 text-warning" },
    { status: "non_retenu", label: "Non retenus", count: 131, color: "bg-muted text-muted-foreground" },
  ]

  const topCandidates = [
    { rank: 1, name: "Marie Martin", score: 92.5, status: "admis" },
    { rank: 2, name: "Pierre Durand", score: 91.0, status: "admis" },
    { rank: 3, name: "Sophie Bernard", score: 89.5, status: "admis" },
    { rank: 4, name: "Lucas Petit", score: 88.0, status: "admis" },
    { rank: 5, name: "Emma Leroy", score: 87.5, status: "admis" },
  ]

  const handlePublishResults = () => {
    setIsPublishing(true)
    // Simulate publishing
    setTimeout(() => {
      setIsPublishing(false)
      setShowPublishDialog(false)
      // In production, would update the status
    }, 2000)
  }

  const handleSendNotifications = () => {
    setIsSendingNotifications(true)
    // Simulate sending notifications
    setTimeout(() => {
      setIsSendingNotifications(false)
      setShowNotifyDialog(false)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestion des résultats</h2>
          <p className="text-muted-foreground">Publiez et gérez les résultats du concours</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter PDF
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter Excel
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card className={resultsStatus.isPublished ? "border-success" : "border-warning"}>
        <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                resultsStatus.isPublished ? "bg-success/10" : "bg-warning/10"
              }`}
            >
              {resultsStatus.isPublished ? (
                <CheckCircle className="h-6 w-6 text-success" />
              ) : (
                <Clock className="h-6 w-6 text-warning" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {resultsStatus.isPublished ? "Résultats publiés" : "Résultats non publiés"}
              </h3>
              <p className="text-muted-foreground">
                {resultsStatus.isPublished
                  ? `Publiés le ${resultsStatus.publishedDate}`
                  : "Les résultats ne sont pas encore visibles par les candidats"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!resultsStatus.isPublished && (
              <Button onClick={() => setShowPublishDialog(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Publier les résultats
              </Button>
            )}
            <Button
              variant={resultsStatus.notificationsSent ? "outline" : "default"}
              onClick={() => setShowNotifyDialog(true)}
            >
              <Mail className="mr-2 h-4 w-4" />
              {resultsStatus.notificationsSent ? "Notifications envoyées" : "Envoyer notifications"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {resultsSummary.map((item) => (
          <Card key={item.status}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-3xl font-bold">{item.count}</p>
              </div>
              <Badge className={item.color}>{item.label}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Candidates */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 des admis</CardTitle>
            <CardDescription>Meilleurs scores du concours</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rang</TableHead>
                  <TableHead>Candidat</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCandidates.map((candidate) => (
                  <TableRow key={candidate.rank}>
                    <TableCell className="font-bold">{candidate.rank}</TableCell>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell className="text-right font-medium">{candidate.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Gérez la publication des résultats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Liste des admis</p>
                  <p className="text-sm text-muted-foreground">Document PDF officiel</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Liste d'attente</p>
                  <p className="text-sm text-muted-foreground">Document PDF officiel</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Statistiques complètes</p>
                  <p className="text-sm text-muted-foreground">Rapport détaillé Excel</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Aperçu public</p>
                  <p className="text-sm text-muted-foreground">Voir ce que les candidats voient</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Aperçu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques du concours</CardTitle>
          <CardDescription>Vue d'ensemble des résultats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold">{resultsStatus.totalCandidates}</p>
              <p className="text-sm text-muted-foreground">Total candidats</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold">82.3</p>
              <p className="text-sm text-muted-foreground">Score moyen</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold">92.5</p>
              <p className="text-sm text-muted-foreground">Score max</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold">74.0</p>
              <p className="text-sm text-muted-foreground">Seuil admission</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Publish Dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publier les résultats</DialogTitle>
            <DialogDescription>
              Cette action rendra les résultats visibles à tous les candidats.
            </DialogDescription>
          </DialogHeader>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Une fois publiés, les résultats seront immédiatement accessibles aux candidats.
              Assurez-vous que le classement est définitif avant de publier.
            </AlertDescription>
          </Alert>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-2">Récapitulatif:</p>
            <ul className="text-sm space-y-1">
              <li>- {resultsStatus.admis} candidats admis</li>
              <li>- {resultsStatus.listeAttente} candidats en liste d'attente</li>
              <li>- {resultsStatus.nonRetenus} candidats non retenus</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPublishDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handlePublishResults} disabled={isPublishing}>
              {isPublishing ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-bounce" />
                  Publication...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Publier maintenant
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notify Dialog */}
      <Dialog open={showNotifyDialog} onOpenChange={setShowNotifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Envoyer les notifications</DialogTitle>
            <DialogDescription>
              Envoyer un email personnalisé à chaque candidat avec son résultat.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
              <span>Admis</span>
              <span className="font-medium">{resultsStatus.admis} emails</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10">
              <span>Liste d'attente</span>
              <span className="font-medium">{resultsStatus.listeAttente} emails</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <span>Non retenus</span>
              <span className="font-medium">{resultsStatus.nonRetenus} emails</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border font-medium">
              <span>Total</span>
              <span>{resultsStatus.totalCandidates} emails</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotifyDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleSendNotifications} disabled={isSendingNotifications}>
              {isSendingNotifications ? (
                <>
                  <Send className="mr-2 h-4 w-4 animate-pulse" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer les emails
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
