"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Save, User, GraduationCap, Mail, Phone, MapPin, Calendar, Loader2 } from "lucide-react"
import { updateProfilAction } from "@/lib/actions/candidat"

const TUNISIE_DATA: Record<string, { ville: string; codePostal: string }[]> = {
  "Tunis": [
    { ville: "Tunis (Médina)", codePostal: "1000" },
    { ville: "Bab El Bhar", codePostal: "1006" },
    { ville: "Bab Souika", codePostal: "1008" },
    { ville: "El Omrane", codePostal: "1005" },
    { ville: "El Omrane Supérieur", codePostal: "1091" },
    { ville: "Ettahrir", codePostal: "1007" },
    { ville: "Ezzouhour", codePostal: "2010" },
    { ville: "Séjoumi", codePostal: "1002" },
    { ville: "Jebel Jelloud", codePostal: "1004" },
    { ville: "Cité El Khadra", codePostal: "1003" },
    { ville: "Le Bardo", codePostal: "2000" },
    { ville: "La Goulette", codePostal: "2060" },
    { ville: "La Marsa", codePostal: "2070" },
    { ville: "Carthage", codePostal: "2016" },
    { ville: "Sidi Bou Saïd", codePostal: "2026" },
    { ville: "Sidi Hassine", codePostal: "2086" },
  ],
  "Ariana": [
    { ville: "Ariana", codePostal: "2080" },
    { ville: "La Soukra", codePostal: "2036" },
    { ville: "Raoued", codePostal: "2056" },
    { ville: "Ettadhamen", codePostal: "2041" },
    { ville: "Mnihla", codePostal: "2094" },
    { ville: "Borj Louzir", codePostal: "2080" },
    { ville: "Sidi Thabet", codePostal: "2020" },
    { ville: "Kalâat el-Andalous", codePostal: "2022" },
  ],
  "Ben Arous": [
    { ville: "Ben Arous", codePostal: "2013" },
    { ville: "Mégrine", codePostal: "2033" },
    { ville: "Radès", codePostal: "2040" },
    { ville: "Ezzahra", codePostal: "2034" },
    { ville: "Boumhel el-Bassatine", codePostal: "2094" },
    { ville: "Hammam Lif", codePostal: "2050" },
    { ville: "Hammam Chott", codePostal: "2082" },
    { ville: "El Mourouj", codePostal: "2074" },
    { ville: "Nouvelle Médina", codePostal: "2063" },
    { ville: "Fouchana", codePostal: "2082" },
    { ville: "Mohamedia", codePostal: "2042" },
  ],
  "Manouba": [
    { ville: "Manouba", codePostal: "2010" },
    { ville: "Den Den", codePostal: "2041" },
    { ville: "Douar Hicher", codePostal: "2086" },
    { ville: "Oued Ellil", codePostal: "2011" },
    { ville: "El Battan", codePostal: "2013" },
    { ville: "Tebourba", codePostal: "1130" },
    { ville: "Jedaida", codePostal: "7014" },
    { ville: "Borj El Amri", codePostal: "2012" },
  ],
  "Nabeul": [
    { ville: "Nabeul", codePostal: "8000" },
    { ville: "Hammamet", codePostal: "8050" },
    { ville: "Kelibia", codePostal: "8090" },
    { ville: "Grombalia", codePostal: "8030" },
    { ville: "Korba", codePostal: "8070" },
    { ville: "Menzel Temime", codePostal: "8080" },
    { ville: "El Haouaria", codePostal: "8045" },
    { ville: "Soliman", codePostal: "8020" },
    { ville: "Beni Khalled", codePostal: "8011" },
    { ville: "Béni Khiar", codePostal: "8042" },
    { ville: "Dar Chaabane", codePostal: "8011" },
    { ville: "Menzel Bouzelfa", codePostal: "8010" },
    { ville: "Hammam Ghezèze", codePostal: "8032" },
    { ville: "Korbous", codePostal: "8063" },
  ],
  "Zaghouan": [
    { ville: "Zaghouan", codePostal: "1100" },
    { ville: "El Fahs", codePostal: "1140" },
    { ville: "Nadhour", codePostal: "1130" },
    { ville: "Zriba", codePostal: "1114" },
    { ville: "Bir Mcherga", codePostal: "1142" },
    { ville: "Saouaf", codePostal: "1143" },
  ],
  "Bizerte": [
    { ville: "Bizerte", codePostal: "7000" },
    { ville: "Menzel Bourguiba", codePostal: "7080" },
    { ville: "Mateur", codePostal: "7030" },
    { ville: "Ras Jebel", codePostal: "7040" },
    { ville: "Sejnane", codePostal: "7050" },
    { ville: "Menzel Jemil", codePostal: "7080" },
    { ville: "Ghar El Melh", codePostal: "7016" },
    { ville: "Utique", codePostal: "7034" },
    { ville: "Joumine", codePostal: "7031" },
    { ville: "Ghezala", codePostal: "7073" },
    { ville: "Tinja", codePostal: "7071" },
    { ville: "El Aousja", codePostal: "7010" },
  ],
  "Béja": [
    { ville: "Béja", codePostal: "9000" },
    { ville: "Medjez el-Bab", codePostal: "9070" },
    { ville: "Testour", codePostal: "9040" },
    { ville: "Téboursouk", codePostal: "9040" },
    { ville: "Goubellat", codePostal: "9060" },
    { ville: "Nefza", codePostal: "9010" },
    { ville: "Amdoun", codePostal: "9010" },
    { ville: "Thibar", codePostal: "9050" },
  ],
  "Jendouba": [
    { ville: "Jendouba", codePostal: "8100" },
    { ville: "Tabarka", codePostal: "8110" },
    { ville: "Aïn Draham", codePostal: "8142" },
    { ville: "Fernana", codePostal: "8130" },
    { ville: "Ghardimaou", codePostal: "8130" },
    { ville: "Oued Meliz", codePostal: "8140" },
    { ville: "Bou Salem", codePostal: "8140" },
    { ville: "Balta-Bou Aouane", codePostal: "8113" },
  ],
  "Le Kef": [
    { ville: "Le Kef", codePostal: "7100" },
    { ville: "Tajerouine", codePostal: "7140" },
    { ville: "Dahmani", codePostal: "7150" },
    { ville: "Nebeur", codePostal: "7112" },
    { ville: "Sers", codePostal: "7140" },
    { ville: "El Ksour", codePostal: "7160" },
    { ville: "Jerissa", codePostal: "7120" },
    { ville: "Kalaat Senan", codePostal: "7180" },
    { ville: "Kalaa Khasba", codePostal: "7170" },
    { ville: "Sakiet Sidi Youssef", codePostal: "7130" },
  ],
  "Siliana": [
    { ville: "Siliana", codePostal: "6100" },
    { ville: "Gaafour", codePostal: "6110" },
    { ville: "El Aroussa", codePostal: "6111" },
    { ville: "Sidi Bou Rouis", codePostal: "6152" },
    { ville: "Rouhia", codePostal: "6120" },
    { ville: "Makthar", codePostal: "6140" },
    { ville: "Kesra", codePostal: "6142" },
    { ville: "Bouarada", codePostal: "6160" },
    { ville: "Le Krib", codePostal: "6170" },
    { ville: "Bargou", codePostal: "6180" },
  ],
  "Sousse": [
    { ville: "Sousse", codePostal: "4000" },
    { ville: "Zaouiet Sousse", codePostal: "4001" },
    { ville: "Hammam Sousse", codePostal: "4011" },
    { ville: "Akouda", codePostal: "4022" },
    { ville: "Kalaa Sghira", codePostal: "4021" },
    { ville: "Kalaa Kebira", codePostal: "4060" },
    { ville: "Sidi Bou Ali", codePostal: "4040" },
    { ville: "Hergla", codePostal: "4057" },
    { ville: "Enfidha", codePostal: "4030" },
    { ville: "Bouficha", codePostal: "4033" },
    { ville: "Kondar", codePostal: "4070" },
    { ville: "Msaken", codePostal: "4070" },
    { ville: "Sidi El Hani", codePostal: "4062" },
    { ville: "M'saken", codePostal: "4070" },
  ],
  "Monastir": [
    { ville: "Monastir", codePostal: "5000" },
    { ville: "Sahline", codePostal: "5012" },
    { ville: "Lamta", codePostal: "5017" },
    { ville: "Bembla", codePostal: "5021" },
    { ville: "Jemmal", codePostal: "5020" },
    { ville: "Zeramdine", codePostal: "5022" },
    { ville: "Béni Hassen", codePostal: "5030" },
    { ville: "Sayada", codePostal: "5016" },
    { ville: "Ksibet el-Médiouni", codePostal: "5015" },
    { ville: "Ouerdanine", codePostal: "5010" },
    { ville: "Téboulba", codePostal: "5040" },
    { ville: "Bekalta", codePostal: "5060" },
    { ville: "Moknine", codePostal: "5050" },
    { ville: "Ksar Hellal", codePostal: "5070" },
  ],
  "Mahdia": [
    { ville: "Mahdia", codePostal: "5100" },
    { ville: "Ksour Essef", codePostal: "5170" },
    { ville: "El Jem", codePostal: "5160" },
    { ville: "Chebba", codePostal: "5130" },
    { ville: "Melloulèche", codePostal: "5110" },
    { ville: "Sidi Alouane", codePostal: "5111" },
    { ville: "Bou Merdes", codePostal: "5142" },
    { ville: "Ouled Chamekh", codePostal: "5180" },
    { ville: "Souassi", codePostal: "5120" },
    { ville: "Hebira", codePostal: "5113" },
  ],
  "Sfax": [
    { ville: "Sfax", codePostal: "3000" },
    { ville: "Sakiet Eddaier", codePostal: "3041" },
    { ville: "Sakiet Ezzit", codePostal: "3021" },
    { ville: "Chihia", codePostal: "3012" },
    { ville: "Thyna", codePostal: "3013" },
    { ville: "El Ain", codePostal: "3082" },
    { ville: "Agareb", codePostal: "3011" },
    { ville: "Jebeniana", codePostal: "3016" },
    { ville: "El Hencha", codePostal: "3060" },
    { ville: "Menzel Chaker", codePostal: "3014" },
    { ville: "Ghraiba", codePostal: "3030" },
    { ville: "Bir Ali Ben Khelifa", codePostal: "3080" },
    { ville: "Skhira", codePostal: "3040" },
    { ville: "Mahres", codePostal: "3067" },
    { ville: "Kerkenah", codePostal: "3070" },
    { ville: "El Amra", codePostal: "3015" },
  ],
  "Kairouan": [
    { ville: "Kairouan", codePostal: "3100" },
    { ville: "Haffouz", codePostal: "3113" },
    { ville: "El Alaa", codePostal: "3105" },
    { ville: "Sbikha", codePostal: "3130" },
    { ville: "Oueslatia", codePostal: "3190" },
    { ville: "Chebika", codePostal: "3100" },
    { ville: "Nasrallah", codePostal: "3150" },
    { ville: "Echrarda", codePostal: "3160" },
    { ville: "Bouhajla", codePostal: "3170" },
    { ville: "Menzel Mhiri", codePostal: "3180" },
  ],
  "Kasserine": [
    { ville: "Kasserine", codePostal: "1200" },
    { ville: "Sbeitla", codePostal: "1250" },
    { ville: "Thala", codePostal: "1220" },
    { ville: "Feriana", codePostal: "1240" },
    { ville: "Foussana", codePostal: "1212" },
    { ville: "Haïdra", codePostal: "1252" },
    { ville: "El Ayoun", codePostal: "1230" },
    { ville: "Jedeliane", codePostal: "1222" },
    { ville: "Majel Bel Abbès", codePostal: "1260" },
    { ville: "Hidra", codePostal: "1270" },
    { ville: "Ezzouhour", codePostal: "1280" },
    { ville: "Hassi El Frid", codePostal: "1290" },
  ],
  "Sidi Bouzid": [
    { ville: "Sidi Bouzid", codePostal: "9100" },
    { ville: "Jilma", codePostal: "9110" },
    { ville: "Cebalet Ouled Asker", codePostal: "9102" },
    { ville: "Bir El Hafey", codePostal: "9142" },
    { ville: "Sidi Ali Ben Aoun", codePostal: "9130" },
    { ville: "Menzel Bouzaiane", codePostal: "9140" },
    { ville: "El Meknassi", codePostal: "9120" },
    { ville: "Souk Jedid", codePostal: "9150" },
    { ville: "Mezzouna", codePostal: "9134" },
    { ville: "Regueb", codePostal: "9110" },
    { ville: "Ouled Haffouz", codePostal: "9160" },
  ],
  "Gabès": [
    { ville: "Gabès", codePostal: "6000" },
    { ville: "Gabès Médina", codePostal: "6010" },
    { ville: "Ghannouch", codePostal: "6011" },
    { ville: "El Hamma", codePostal: "6020" },
    { ville: "Mareth", codePostal: "6030" },
    { ville: "Métouia", codePostal: "6012" },
    { ville: "Menzel El Habib", codePostal: "6013" },
    { ville: "Kettana", codePostal: "6014" },
    { ville: "Matmata", codePostal: "6070" },
    { ville: "Nouvelle Matmata", codePostal: "6022" },
  ],
  "Médenine": [
    { ville: "Médenine", codePostal: "4100" },
    { ville: "Zarzis", codePostal: "4170" },
    { ville: "Ben Gardane", codePostal: "4160" },
    { ville: "Houmt Souk (Djerba)", codePostal: "4180" },
    { ville: "Djerba — Midoun", codePostal: "4116" },
    { ville: "Djerba — Ajim", codePostal: "4135" },
    { ville: "Sidi Makhlouf", codePostal: "4100" },
    { ville: "Beni Khedache", codePostal: "4100" },
  ],
  "Tataouine": [
    { ville: "Tataouine", codePostal: "3200" },
    { ville: "Ghomrassen", codePostal: "3200" },
    { ville: "Bir Lahmar", codePostal: "3212" },
    { ville: "Smar", codePostal: "3214" },
    { ville: "Remada", codePostal: "3240" },
    { ville: "Dehiba", codePostal: "3256" },
  ],
  "Tozeur": [
    { ville: "Tozeur", codePostal: "2200" },
    { ville: "Nefta", codePostal: "2240" },
    { ville: "Degache", codePostal: "2244" },
    { ville: "Hazoua", codePostal: "2242" },
  ],
  "Kébili": [
    { ville: "Kébili", codePostal: "4200" },
    { ville: "Douz", codePostal: "4260" },
    { ville: "Douz El Jedid", codePostal: "4261" },
    { ville: "El Faouar", codePostal: "4261" },
    { ville: "Souk Lahad", codePostal: "4262" },
  ],
  "Gafsa": [
    { ville: "Gafsa", codePostal: "2100" },
    { ville: "El Guettar", codePostal: "2114" },
    { ville: "Métlaoui", codePostal: "2130" },
    { ville: "Mdhilla", codePostal: "2119" },
    { ville: "El Ksar", codePostal: "2110" },
    { ville: "Snad", codePostal: "2112" },
    { ville: "Belkhir", codePostal: "2116" },
    { ville: "Moularès", codePostal: "2115" },
    { ville: "Redeyef", codePostal: "2115" },
    { ville: "Om El Araies", codePostal: "2120" },
  ],
}

export interface ProfilData {
  firstName: string
  lastName: string
  cin: string
  email: string
  phone: string
  birthDate: string
  gouvernorat: string
  ville: string
  codePostal: string
  adresse: string
  diploma: string
  institution: string
  specialization: string
  graduationYear: string
  gpa: string
}

// Indicateur affiché à côté du label si le champ est vide et non en édition
function EmptyBadge({ value, editing }: { value: string; editing: boolean }) {
  if (editing || value) return null
  return (
    <span className="ml-2 text-xs font-normal text-amber-500">— à remplir</span>
  )
}

export default function ProfilClient({ initialData }: { initialData: ProfilData }) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<ProfilData>(initialData)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const initials = `${profileData.firstName.charAt(0)}${profileData.lastName.charAt(0)}`.toUpperCase()

  const handleSave = () => {
    setError(null)
    startTransition(async () => {
      const result = await updateProfilAction(profileData)
      if (result.success) {
        setIsEditing(false)
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Mon Profil</h2>
          <p className="text-muted-foreground">Gérez vos informations personnelles et académiques</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => { setIsEditing(false); setError(null) }} disabled={isPending}>
                  Annuler
                </Button>
                <Button onClick={handleSave} disabled={isPending}>
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Enregistrer
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Modifier le profil</Button>
            )}
          </div>
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
                  {initials || "?"}
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
                {profileData.diploma ? (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    {profileData.diploma}{profileData.specialization ? ` en ${profileData.specialization}` : ""}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-500">
                    <GraduationCap className="h-4 w-4" />
                    Diplôme non renseigné
                  </span>
                )}
                {profileData.ville ? (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profileData.ville}{profileData.gouvernorat ? `, ${profileData.gouvernorat}` : ""}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-500">
                    <MapPin className="h-4 w-4" />
                    Adresse non renseignée
                  </span>
                )}
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

                <div className="grid gap-4 md:grid-cols-2">
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
                  <Field>
                    <FieldLabel htmlFor="birthDate">
                      Date de naissance
                      <EmptyBadge value={profileData.birthDate} editing={isEditing} />
                    </FieldLabel>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="birthDate"
                        type="date"
                        value={profileData.birthDate}
                        onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                        placeholder="Non renseignée"
                      />
                    </div>
                  </Field>
                </div>

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
                    <FieldLabel htmlFor="phone">
                      Téléphone
                      <EmptyBadge value={profileData.phone} editing={isEditing} />
                    </FieldLabel>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                        placeholder="Non renseigné"
                      />
                    </div>
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="gouvernorat">
                      Gouvernorat
                      <EmptyBadge value={profileData.gouvernorat} editing={isEditing} />
                    </FieldLabel>
                    <Select
                      value={profileData.gouvernorat || undefined}
                      onValueChange={(v) =>
                        setProfileData({ ...profileData, gouvernorat: v, ville: "", codePostal: "" })
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger id="gouvernorat">
                        <SelectValue placeholder="Sélectionner…" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(TUNISIE_DATA).map((gov) => (
                          <SelectItem key={gov} value={gov}>{gov}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="ville">
                      Ville
                      <EmptyBadge value={profileData.ville} editing={isEditing} />
                    </FieldLabel>
                    <Input
                      id="ville"
                      value={profileData.ville}
                      onChange={(e) => setProfileData({ ...profileData, ville: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Saisir votre ville"
                    />
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="codePostal">
                      Code postal
                      <EmptyBadge value={profileData.codePostal} editing={isEditing} />
                    </FieldLabel>
                    <Input
                      id="codePostal"
                      value={profileData.codePostal}
                      onChange={(e) => setProfileData({ ...profileData, codePostal: e.target.value })}
                      disabled={!isEditing}
                      placeholder="ex : 3000"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="adresse">
                      Adresse complète
                      <EmptyBadge value={profileData.adresse} editing={isEditing} />
                    </FieldLabel>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="adresse"
                        value={profileData.adresse}
                        onChange={(e) => setProfileData({ ...profileData, adresse: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Rue, numéro, appartement…"
                        className="pl-10"
                      />
                    </div>
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
                    <FieldLabel htmlFor="diploma">
                      Diplôme
                      <EmptyBadge value={profileData.diploma} editing={isEditing} />
                    </FieldLabel>
                    <Select
                      value={profileData.diploma || undefined}
                      onValueChange={(value) => setProfileData({ ...profileData, diploma: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger id="diploma">
                        <SelectValue placeholder="Sélectionner…" />
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
                    <FieldLabel htmlFor="specialization">
                      Spécialisation
                      <EmptyBadge value={profileData.specialization} editing={isEditing} />
                    </FieldLabel>
                    <Input
                      id="specialization"
                      value={profileData.specialization}
                      onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                      disabled={!isEditing}
                      placeholder="ex : Informatique"
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="institution">
                    Établissement
                    <EmptyBadge value={profileData.institution} editing={isEditing} />
                  </FieldLabel>
                  <Input
                    id="institution"
                    value={profileData.institution}
                    onChange={(e) => setProfileData({ ...profileData, institution: e.target.value })}
                    disabled={!isEditing}
                    placeholder="ex : Université de Tunis"
                  />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="graduationYear">
                      Année d'obtention
                      <EmptyBadge value={profileData.graduationYear} editing={isEditing} />
                    </FieldLabel>
                    <Input
                      id="graduationYear"
                      value={profileData.graduationYear}
                      onChange={(e) => setProfileData({ ...profileData, graduationYear: e.target.value })}
                      disabled={!isEditing}
                      placeholder="ex : 2024"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="gpa">
                      Moyenne générale
                      <EmptyBadge value={profileData.gpa} editing={isEditing} />
                    </FieldLabel>
                    <Input
                      id="gpa"
                      value={profileData.gpa}
                      onChange={(e) => setProfileData({ ...profileData, gpa: e.target.value })}
                      disabled={!isEditing}
                      placeholder="ex : 15.5"
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
