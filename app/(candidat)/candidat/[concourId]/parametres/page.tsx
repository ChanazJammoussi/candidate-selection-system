"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Lock, User, Globe, Shield, Eye, EyeOff, Check } from "lucide-react"

export default function CandidatParametresPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [saved, setSaved] = useState(false)

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    statusUpdate: true,
    resultsPublished: true,
    deadlineReminder: true,
    newsletter: false,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Parametres</h1>
        <p className="text-muted-foreground">Gerez vos preferences et la securite de votre compte</p>
      </div>

      <Tabs defaultValue="compte" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="compte" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Compte</span>
          </TabsTrigger>
          <TabsTrigger value="securite" className="gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Securite</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compte" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations du compte</CardTitle>
              <CardDescription>Mettez a jour vos informations de connexion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <Input id="email" type="email" defaultValue="ahmed.benali@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Numero de telephone</Label>
                  <Input id="phone" type="tel" defaultValue="+213 555 123 456" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Nom d&apos;utilisateur</Label>
                <Input id="username" defaultValue="ahmed.benali" />
              </div>
              <Button onClick={handleSave} className="gap-2">
                {saved ? <Check className="h-4 w-4" /> : null}
                {saved ? "Enregistre" : "Enregistrer les modifications"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Zone dangereuse</CardTitle>
              <CardDescription>Actions irreversibles sur votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">Desactiver le compte</p>
                  <p className="text-sm text-muted-foreground">
                    Votre compte sera temporairement desactive
                  </p>
                </div>
                <Button variant="outline">Desactiver</Button>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">Supprimer le compte</p>
                  <p className="text-sm text-muted-foreground">
                    Cette action est irreversible et supprimera toutes vos donnees
                  </p>
                </div>
                <Button variant="destructive">Supprimer</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="securite" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Changer le mot de passe</CardTitle>
              <CardDescription>Assurez-vous d&apos;utiliser un mot de passe fort et unique</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Entrez votre mot de passe actuel"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Entrez votre nouveau mot de passe"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmez votre nouveau mot de passe"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-medium mb-2">Le mot de passe doit contenir :</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Au moins 8 caracteres</li>
                  <li>Une lettre majuscule et une minuscule</li>
                  <li>Un chiffre</li>
                  <li>Un caractere special (@, #, $, etc.)</li>
                </ul>
              </div>
              <Button onClick={handleSave} className="gap-2">
                {saved ? <Check className="h-4 w-4" /> : null}
                {saved ? "Mot de passe modifie" : "Modifier le mot de passe"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Authentification a deux facteurs
              </CardTitle>
              <CardDescription>Ajoutez une couche de securite supplementaire a votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Activer la 2FA</p>
                  <p className="text-sm text-muted-foreground">
                    Utilisez une application d&apos;authentification pour generer des codes
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS de verification</p>
                  <p className="text-sm text-muted-foreground">
                    Recevez un code par SMS lors de la connexion
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessions actives</CardTitle>
              <CardDescription>Gerez vos sessions de connexion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div>
                  <p className="font-medium">Chrome sur Windows</p>
                  <p className="text-sm text-muted-foreground">Alger, Algerie - Actif maintenant</p>
                </div>
                <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">Session actuelle</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">Safari sur iPhone</p>
                  <p className="text-sm text-muted-foreground">Alger, Algerie - Il y a 2 jours</p>
                </div>
                <Button variant="outline" size="sm">Deconnecter</Button>
              </div>
              <Button variant="outline" className="w-full">Deconnecter toutes les autres sessions</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferences de notification</CardTitle>
              <CardDescription>Choisissez comment vous souhaitez etre notifie</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Canaux de notification</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications par email</p>
                    <p className="text-sm text-muted-foreground">Recevez les mises a jour par email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications par SMS</p>
                    <p className="text-sm text-muted-foreground">Recevez les alertes importantes par SMS</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                  />
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h4 className="font-medium">Types de notifications</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mise a jour du statut</p>
                    <p className="text-sm text-muted-foreground">Quand le statut de votre candidature change</p>
                  </div>
                  <Switch
                    checked={notifications.statusUpdate}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, statusUpdate: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Publication des resultats</p>
                    <p className="text-sm text-muted-foreground">Quand les resultats du concours sont publies</p>
                  </div>
                  <Switch
                    checked={notifications.resultsPublished}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, resultsPublished: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rappels d&apos;echeances</p>
                    <p className="text-sm text-muted-foreground">Rappels avant les dates limites importantes</p>
                  </div>
                  <Switch
                    checked={notifications.deadlineReminder}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, deadlineReminder: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Newsletter</p>
                    <p className="text-sm text-muted-foreground">Actualites et informations generales</p>
                  </div>
                  <Switch
                    checked={notifications.newsletter}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, newsletter: checked })}
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="gap-2">
                {saved ? <Check className="h-4 w-4" /> : null}
                {saved ? "Preferences enregistrees" : "Enregistrer les preferences"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferences d&apos;affichage</CardTitle>
              <CardDescription>Personnalisez l&apos;apparence de l&apos;application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Langue</Label>
                <Select defaultValue="fr">
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionnez une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Francais</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fuseau horaire</Label>
                <Select defaultValue="africa-algiers">
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionnez un fuseau horaire" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="africa-algiers">Afrique/Alger (GMT+1)</SelectItem>
                    <SelectItem value="europe-paris">Europe/Paris (GMT+1)</SelectItem>
                    <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Format de date</Label>
                <Select defaultValue="dd-mm-yyyy">
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionnez un format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd-mm-yyyy">JJ/MM/AAAA</SelectItem>
                    <SelectItem value="mm-dd-yyyy">MM/JJ/AAAA</SelectItem>
                    <SelectItem value="yyyy-mm-dd">AAAA-MM-JJ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSave} className="gap-2">
                {saved ? <Check className="h-4 w-4" /> : null}
                {saved ? "Preferences enregistrees" : "Enregistrer les preferences"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accessibilite</CardTitle>
              <CardDescription>Options d&apos;accessibilite pour ameliorer votre experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mode contraste eleve</p>
                  <p className="text-sm text-muted-foreground">Augmente le contraste pour une meilleure lisibilite</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Reduire les animations</p>
                  <p className="text-sm text-muted-foreground">Minimise les effets de mouvement</p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label>Taille du texte</Label>
                <Select defaultValue="normal">
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionnez une taille" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Petit</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="large">Grand</SelectItem>
                    <SelectItem value="xlarge">Tres grand</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
