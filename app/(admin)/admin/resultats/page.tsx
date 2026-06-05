"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ConcoursSelector } from "@/components/ui/concours-selector"
import type { ConcoursOption } from "@/components/ui/concours-selector"
import {
  fetchConcoursListAction,
  fetchResultatsAction,
  publishResultatsAction,
} from "@/lib/actions/concours"
import { Download, Upload, Send, CheckCircle, AlertCircle, Eye, FileText, Mail, Clock } from "lucide-react"
import { toast } from "sonner"

type ResultatData = Awaited<ReturnType<typeof fetchResultatsAction>>

export default function AdminResultatsPage() {
  const [concoursList,        setConcoursList]        = useState<ConcoursOption[]>([])
  const [selectedConcoursId,  setSelectedConcoursId]  = useState("")
  const [resultats,           setResultats]           = useState<ResultatData | null>(null)
  const [showPublishDialog,   setShowPublishDialog]   = useState(false)
  const [showNotifyDialog,    setShowNotifyDialog]    = useState(false)
  const [isPublishing,        setIsPublishing]        = useState(false)
  const [isSendingNotifications, setIsSendingNotifications] = useState(false)
  const [isLoading,           setIsLoading]           = useState(false)

  useEffect(() => { fetchConcoursListAction().then(setConcoursList) }, [])

  const handleConcoursChange = async (id: string) => {
    setSelectedConcoursId(id)
    setResultats(null)
    if (!id) return
    setIsLoading(true)
    const data = await fetchResultatsAction(id)
    setResultats(data)
    setIsLoading(false)
  }

  const concoursSelectionne = concoursList.find((c) => c.id === selectedConcoursId) ?? null

  const handlePublishResults = async () => {
    setIsPublishing(true)
    const result = await publishResultatsAction(selectedConcoursId)
    setIsPublishing(false)
    setShowPublishDialog(false)
    if (result.success) {
      setResultats((prev) => prev ? { ...prev, isPublished: true } : prev)
      setConcoursList((prev) =>
        prev.map((c) => c.id === selectedConcoursId ? { ...c, status: "results_published" } : c)
      )
      toast.success("Résultats publiés avec succès.")
    }
  }

  const handleSendNotifications = () => {
    setShowNotifyDialog(false)
    toast.info("Envoi d'emails non encore configuré — intégration SMTP requise.")
  }

  const r = resultats

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestion des résultats</h2>
          <p className="text-muted-foreground">Publiez et gérez les résultats du concours</p>
        </div>
        {concoursSelectionne && (
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href={`/api/admin/export?concoursId=${selectedConcoursId}`} download>
                <Download className="mr-2 h-4 w-4" />Exporter JSON
              </a>
            </Button>
          </div>
        )}
      </div>

      {/* Sélecteur */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Sélectionner un concours</p>
        <ConcoursSelector options={concoursList} value={selectedConcoursId} onChange={handleConcoursChange} />
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground text-center py-8">Chargement des résultats…</p>
      )}

      {concoursSelectionne && r && !isLoading && <>

      {/* Statut publication */}
      <Card className={r.isPublished ? "border-success" : "border-warning"}>
        <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${r.isPublished ? "bg-success/10" : "bg-warning/10"}`}>
              {r.isPublished
                ? <CheckCircle className="h-6 w-6 text-success" />
                : <Clock className="h-6 w-6 text-warning" />}
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {r.isPublished ? "Résultats publiés" : "Résultats non publiés"}
              </h3>
              <p className="text-muted-foreground text-sm">
                {r.isPublished
                  ? "Les candidats peuvent consulter leurs résultats."
                  : "Les résultats ne sont pas encore visibles par les candidats."}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!r.isPublished && (
              <Button onClick={() => setShowPublishDialog(true)}>
                <Upload className="mr-2 h-4 w-4" />Publier les résultats
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowNotifyDialog(true)}>
              <Mail className="mr-2 h-4 w-4" />Envoyer notifications
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats résumé */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Admis</p>
              <p className="text-3xl font-bold">{r.admis}</p>
            </div>
            <Badge className="bg-success/10 text-success">Admis</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Liste d'attente</p>
              <p className="text-3xl font-bold">{r.listeAttente}</p>
            </div>
            <Badge className="bg-warning/10 text-warning">Liste d'attente</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Non retenus</p>
              <p className="text-3xl font-bold">{r.nonRetenus}</p>
            </div>
            <Badge className="bg-muted text-muted-foreground">Non retenus</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques du concours</CardTitle>
          <CardDescription>Vue d'ensemble des résultats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold">{r.totalCandidates}</p>
              <p className="text-sm text-muted-foreground">Total candidats</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold">{r.scoreMoyen > 0 ? r.scoreMoyen : "—"}</p>
              <p className="text-sm text-muted-foreground">Score moyen</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold">{r.scoreMax > 0 ? r.scoreMax : "—"}</p>
              <p className="text-sm text-muted-foreground">Score max</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold">{r.scoreMin > 0 ? r.scoreMin : "—"}</p>
              <p className="text-sm text-muted-foreground">Score min</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions documents */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Gérez la publication des résultats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Liste des admis",      sublabel: "Document PDF officiel" },
              { label: "Liste d'attente",       sublabel: "Document PDF officiel" },
              { label: "Statistiques complètes",sublabel: "Rapport détaillé Excel" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.sublabel}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />Télécharger
                </Button>
              </div>
            ))}
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Aperçu public</p>
                  <p className="text-sm text-muted-foreground">Voir ce que les candidats voient</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Aperçu</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      </>}

      {/* Dialog publication */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publier les résultats</DialogTitle>
            <DialogDescription>Cette action rendra les résultats visibles à tous les candidats.</DialogDescription>
          </DialogHeader>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Une fois publiés, les résultats seront immédiatement accessibles aux candidats.
              Assurez-vous que le classement est définitif avant de publier.
            </AlertDescription>
          </Alert>
          {r && (
            <div className="py-4">
              <p className="text-sm text-muted-foreground mb-2">Récapitulatif :</p>
              <ul className="text-sm space-y-1">
                <li>— {r.admis} candidat(s) admis</li>
                <li>— {r.listeAttente} candidat(s) en liste d'attente</li>
                <li>— {r.nonRetenus} candidat(s) non retenus</li>
              </ul>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPublishDialog(false)}>Annuler</Button>
            <Button onClick={handlePublishResults} disabled={isPublishing}>
              {isPublishing ? <><Upload className="mr-2 h-4 w-4 animate-bounce" />Publication…</> : <><Upload className="mr-2 h-4 w-4" />Publier maintenant</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog notifications */}
      <Dialog open={showNotifyDialog} onOpenChange={setShowNotifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Envoyer les notifications</DialogTitle>
            <DialogDescription>Envoyer un email à chaque candidat avec son résultat.</DialogDescription>
          </DialogHeader>
          {r && (
            <div className="py-4 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
                <span>Admis</span><span className="font-medium">{r.admis} emails</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10">
                <span>Liste d'attente</span><span className="font-medium">{r.listeAttente} emails</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <span>Non retenus</span><span className="font-medium">{r.nonRetenus} emails</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border font-medium">
                <span>Total</span><span>{r.totalCandidates} emails</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotifyDialog(false)}>Annuler</Button>
            <Button onClick={handleSendNotifications} disabled={isSendingNotifications}>
              {isSendingNotifications ? <><Send className="mr-2 h-4 w-4 animate-pulse" />Envoi…</> : <><Send className="mr-2 h-4 w-4" />Envoyer les emails</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
