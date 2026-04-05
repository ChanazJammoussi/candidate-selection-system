"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Save, User, GraduationCap, Mail, Phone, MapPin, Calendar } from "lucide-react"

export default function ProfilPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "Jean",
    lastName: "Dupont",
    cin: "AB123456",
    email: "jean.dupont@email.com",
    phone: "+33 6 12 34 56 78",
    birthDate: "1998-05-15",
    address: "12 Rue de la République",
    city: "Paris",
    postalCode: "75001",
    country: "France",
    // Academic info
    diploma: "Licence",
    institution: "Université Paris-Saclay",
    specialization: "Informatique",
    graduationYear: "2024",
    gpa: "15.5",
  })

  const handleSave = () => {
    setIsEditing(false)
    // In production, this would call an API to save the data
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Mon Profil</h2>
          <p className="text-muted-foreground">Gérez vos informations personnelles et académiques</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Annuler
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Modifier le profil</Button>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" alt="Photo de profil" />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  JD
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold">
                {profileData.firstName} {profileData.lastName}
              </h3>
              <p className="text-muted-foreground">{profileData.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  {profileData.diploma} en {profileData.specialization}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profileData.city}, {profileData.country}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Informations personnelles
          </TabsTrigger>
          <TabsTrigger value="academic" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Informations académiques
          </TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Vos coordonnées et informations de contact</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="firstName">Prénom</FieldLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lastName">Nom</FieldLabel>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="cin">CIN</FieldLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="cin"
                      value={profileData.cin}
                      onChange={(e) => setProfileData({ ...profileData, cin: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="phone">Téléphone</FieldLabel>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="birthDate">Date de naissance</FieldLabel>
                  <div className="relative max-w-xs">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="birthDate"
                      type="date"
                      value={profileData.birthDate}
                      onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="address">Adresse</FieldLabel>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </Field>

                <div className="grid gap-4 md:grid-cols-3">
                  <Field>
                    <FieldLabel htmlFor="city">Ville</FieldLabel>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="postalCode">Code postal</FieldLabel>
                    <Input
                      id="postalCode"
                      value={profileData.postalCode}
                      onChange={(e) => setProfileData({ ...profileData, postalCode: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="country">Pays</FieldLabel>
                    <Input
                      id="country"
                      value={profileData.country}
                      onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic Information */}
        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle>Informations académiques</CardTitle>
              <CardDescription>Votre parcours et vos diplômes</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="diploma">Diplôme</FieldLabel>
                    <Select
                      value={profileData.diploma}
                      onValueChange={(value) => setProfileData({ ...profileData, diploma: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger id="diploma">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baccalauréat">Baccalauréat</SelectItem>
                        <SelectItem value="Licence">Licence</SelectItem>
                        <SelectItem value="Master">Master</SelectItem>
                        <SelectItem value="Doctorat">Doctorat</SelectItem>
                        <SelectItem value="Ingénieur">Diplôme d'Ingénieur</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="specialization">Spécialisation</FieldLabel>
                    <Input
                      id="specialization"
                      value={profileData.specialization}
                      onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="institution">Établissement</FieldLabel>
                  <Input
                    id="institution"
                    value={profileData.institution}
                    onChange={(e) => setProfileData({ ...profileData, institution: e.target.value })}
                    disabled={!isEditing}
                  />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="graduationYear">Année d'obtention</FieldLabel>
                    <Input
                      id="graduationYear"
                      value={profileData.graduationYear}
                      onChange={(e) => setProfileData({ ...profileData, graduationYear: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="gpa">Moyenne générale</FieldLabel>
                    <Input
                      id="gpa"
                      value={profileData.gpa}
                      onChange={(e) => setProfileData({ ...profileData, gpa: e.target.value })}
                      disabled={!isEditing}
                      placeholder="ex: 15.5"
                    />
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
