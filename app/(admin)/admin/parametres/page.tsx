"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Bell, Shield, Database, Mail, Save } from "lucide-react"

export default function ParametresPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    newCandidat: true,
    documentSubmit: true,
    statusChange: false,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground">Configurez les paramètres de la plateforme</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Général</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Système</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de la plateforme</CardTitle>
              <CardDescription>Configurez les informations générales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Nom de la plateforme</Label>
                  <Input id="platform-name" defaultValue="Concours National" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organisation</Label>
                  <Input id="org-name" defaultValue="Ministère de l'Éducation" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  defaultValue="Plateforme de gestion des candidatures pour les concours nationaux"
                  rows={3}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email de contact</Label>
                  <Input id="contact-email" type="email" defaultValue="contact@concours.gov" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-phone">Téléphone support</Label>
                  <Input id="support-phone" defaultValue="+33 1 23 45 67 89" />
                </div>
              </div>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Période d&apos;inscription</CardTitle>
              <CardDescription>Définissez les dates limites</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Date de début</Label>
                  <Input id="start-date" type="date" defaultValue="2026-01-01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">Date de fin</Label>
                  <Input id="end-date" type="date" defaultValue="2026-03-31" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="registration-open" defaultChecked />
                <Label htmlFor="registration-open">Inscriptions ouvertes</Label>
              </div>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>Configurez comment vous souhaitez être notifié</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">Recevoir les notifications par email</p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nouveau candidat</Label>
                  <p className="text-sm text-muted-foreground">Notification lors d&apos;une nouvelle inscription</p>
                </div>
                <Switch
                  checked={notifications.newCandidat}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, newCandidat: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Soumission de document</Label>
                  <p className="text-sm text-muted-foreground">Notification lors du dépôt d&apos;un document</p>
                </div>
                <Switch
                  checked={notifications.documentSubmit}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, documentSubmit: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Changement de statut</Label>
                  <p className="text-sm text-muted-foreground">Notification lors du changement de statut</p>
                </div>
                <Switch
                  checked={notifications.statusChange}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, statusChange: checked })}
                />
              </div>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modèles d&apos;email</CardTitle>
              <CardDescription>Personnalisez les emails automatiques</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-template">Modèle de bienvenue</Label>
                <Select defaultValue="welcome">
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un modèle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Email de bienvenue</SelectItem>
                    <SelectItem value="confirmation">Confirmation d&apos;inscription</SelectItem>
                    <SelectItem value="reminder">Rappel de documents</SelectItem>
                    <SelectItem value="results">Annonce des résultats</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-subject">Sujet</Label>
                <Input id="email-subject" defaultValue="Bienvenue sur la plateforme Concours National" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-body">Contenu</Label>
                <Textarea
                  id="email-body"
                  rows={6}
                  defaultValue={`Bonjour {nom},

Bienvenue sur la plateforme de gestion des candidatures.

Votre compte a été créé avec succès. Vous pouvez maintenant accéder à votre espace candidat et soumettre votre dossier.

Cordialement,
L'équipe Concours National`}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Mail className="h-4 w-4" />
                Tester l&apos;envoi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Politique de mot de passe</CardTitle>
              <CardDescription>Configurez les exigences de sécurité</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="min-length">Longueur minimale</Label>
                <Select defaultValue="8">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 caractères</SelectItem>
                    <SelectItem value="8">8 caractères</SelectItem>
                    <SelectItem value="10">10 caractères</SelectItem>
                    <SelectItem value="12">12 caractères</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="require-uppercase" defaultChecked />
                <Label htmlFor="require-uppercase">Exiger une majuscule</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="require-number" defaultChecked />
                <Label htmlFor="require-number">Exiger un chiffre</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="require-special" />
                <Label htmlFor="require-special">Exiger un caractère spécial</Label>
              </div>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessions et accès</CardTitle>
              <CardDescription>Gérez les paramètres de session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Expiration de session</Label>
                <Select defaultValue="60">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 heure</SelectItem>
                    <SelectItem value="120">2 heures</SelectItem>
                    <SelectItem value="480">8 heures</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="single-session" />
                <Label htmlFor="single-session">Une seule session active par utilisateur</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="2fa" />
                <Label htmlFor="2fa">Authentification à deux facteurs</Label>
              </div>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Base de données</CardTitle>
              <CardDescription>Informations sur le système</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Candidats enregistrés</p>
                  <p className="text-2xl font-bold">1,234</p>
                </div>
                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Documents stockés</p>
                  <p className="text-2xl font-bold">3,567</p>
                </div>
                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Espace utilisé</p>
                  <p className="text-2xl font-bold">2.4 GB</p>
                </div>
                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Dernière sauvegarde</p>
                  <p className="text-2xl font-bold">Il y a 2h</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Exporter les données</Button>
                <Button variant="outline">Créer une sauvegarde</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maintenance</CardTitle>
              <CardDescription>Actions de maintenance du système</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Vider le cache</p>
                  <p className="text-sm text-muted-foreground">Supprime les fichiers temporaires</p>
                </div>
                <Button variant="outline" size="sm">Exécuter</Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Optimiser la base de données</p>
                  <p className="text-sm text-muted-foreground">Améliore les performances</p>
                </div>
                <Button variant="outline" size="sm">Exécuter</Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium text-destructive">Réinitialiser les données de test</p>
                  <p className="text-sm text-muted-foreground">Attention : action irréversible</p>
                </div>
                <Button variant="destructive" size="sm">Exécuter</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
