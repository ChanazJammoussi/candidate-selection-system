"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  User,
  GraduationCap,
  FileText,
  Upload,
  Check,
  X,
  Clock,
  AlertCircle,
  Trash2,
  Eye,
  Download,
} from "lucide-react"

interface Document {
  id: string
  name: string
  type: string
  status: "pending" | "approved" | "rejected" | "correction"
  uploadDate: string
  size: string
  feedback?: string
}

export default function CandidaturePage() {
  const [activeTab, setActiveTab] = useState("info")
  
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@email.com",
    phone: "+33 6 12 34 56 78",
    // Academic Info
    diploma: "Licence",
    institution: "Université Paris-Saclay",
    specialization: "Informatique",
    graduationYear: "2024",
    gpa: "15.5",
  })

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "CV_Jean_Dupont.pdf",
      type: "CV",
      status: "approved",
      uploadDate: "15/03/2026",
      size: "245 KB",
    },
    {
      id: "2",
      name: "Releve_Notes_L3.pdf",
      type: "Relevé de notes",
      status: "approved",
      uploadDate: "15/03/2026",
      size: "512 KB",
    },
    {
      id: "3",
      name: "Diplome_Licence.pdf",
      type: "Diplôme",
      status: "pending",
      uploadDate: "16/03/2026",
      size: "1.2 MB",
    },
    
  ])

  const requiredDocuments = [
    { type: "CV", label: "Curriculum Vitae" },
    { type: "Relevé de notes", label: "Relevé de notes" },
    { type: "Diplôme", label: "Copie du diplôme" },
  ]

  const getStatusBadge = (status: Document["status"]) => {
    const statusConfig = {
      pending: { label: "En attente", className: "bg-warning/10 text-warning border-warning/20" },
      approved: { label: "Validé", className: "bg-success/10 text-success border-success/20" },
      rejected: { label: "Rejeté", className: "bg-destructive/10 text-destructive border-destructive/20" },
      correction: { label: "À corriger", className: "bg-primary/10 text-primary border-primary/20" },
    }
    return statusConfig[status]
  }

  const getStatusIcon = (status: Document["status"]) => {
    switch (status) {
      case "approved":
        return <Check className="h-4 w-4 text-success" />
      case "rejected":
        return <X className="h-4 w-4 text-destructive" />
      case "correction":
        return <AlertCircle className="h-4 w-4 text-primary" />
      default:
        return <Clock className="h-4 w-4 text-warning" />
    }
  }

  const completedDocs = documents.filter((d) => d.status === "approved").length
  const totalDocs = requiredDocuments.length
  const progressPercent = (completedDocs / totalDocs) * 100

  const handleFileUpload = (docType: string) => {
    // In production, this would handle actual file upload
    const newDoc: Document = {
      id: Date.now().toString(),
      name: `Document_${docType}.pdf`,
      type: docType,
      status: "pending",
      uploadDate: new Date().toLocaleDateString("fr-FR"),
      size: "0 KB",
    }
    setDocuments([...documents, newDoc])
  }

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Ma Candidature</h2>
          <p className="text-muted-foreground">Complétez et soumettez votre dossier de candidature</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Progression</p>
            <p className="text-lg font-semibold">{completedDocs}/{totalDocs} documents validés</p>
          </div>
          <div className="w-24">
            <Progress value={progressPercent} />
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Informations
          </TabsTrigger>
          <TabsTrigger value="academic" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Académique
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Vérifiez et complétez vos informations personnelles</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="firstName">Prénom</FieldLabel>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lastName">Nom</FieldLabel>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="phone">Téléphone</FieldLabel>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </Field>
                </div>

                
              </FieldGroup>

              <div className="flex justify-end mt-6">
                <Button onClick={() => setActiveTab("academic")}>
                  Continuer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic Information */}
        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle>Informations académiques</CardTitle>
              <CardDescription>Renseignez votre parcours académique</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="diploma">Diplôme</FieldLabel>
                    <Select
                      value={formData.diploma}
                      onValueChange={(value) => setFormData({ ...formData, diploma: value })}
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
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="institution">Établissement</FieldLabel>
                  <Input
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="graduationYear">Année d'obtention</FieldLabel>
                    <Input
                      id="graduationYear"
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                    />
                  </Field>
<Field>
                  <FieldLabel htmlFor="gpa">Moyenne générale (/20)</FieldLabel>
                  <Input
                    id="gpa"
                    value={formData.gpa}
                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                    placeholder="ex: 15.5"
                  />
                </Field>
                </div>
              </FieldGroup>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveTab("info")}>
                  Précédent
                </Button>
                <Button onClick={() => setActiveTab("documents")}>
                  Continuer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents" id="documents">
          <div className="space-y-6">
            {/* Required Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Documents requis</CardTitle>
                <CardDescription>Téléversez les documents nécessaires à votre candidature</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {requiredDocuments.map((doc) => {
                    const uploadedDoc = documents.find((d) => d.type === doc.type)
                    const status = uploadedDoc ? getStatusBadge(uploadedDoc.status) : null

                    return (
                      <div
                        key={doc.type}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                            <FileText className="h-5 w-5 text-secondary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.label}</p>
                            {uploadedDoc ? (
                              <p className="text-sm text-muted-foreground">{uploadedDoc.name}</p>
                            ) : (
                              <p className="text-sm text-muted-foreground">Non téléversé</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {uploadedDoc ? (
                            <span className="text-sm text-muted-foreground">Televerse</span>
                          ) : (
                            <Button size="sm" onClick={() => handleFileUpload(doc.type)}>
                              <Upload className="h-4 w-4 mr-1" />
                              Upload
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Documents téléversés</CardTitle>
                <CardDescription>Liste de tous vos documents soumis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((doc) => {
                    const status = getStatusBadge(doc.status)
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-4">
                          {getStatusIcon(doc.status)}
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{doc.type}</span>
                              <span>•</span>
                              <span>{doc.size}</span>
                              <span>•</span>
                              <span>{doc.uploadDate}</span>
                            </div>
                            {doc.feedback && (
                              <p className="text-sm text-primary mt-1">
                                <AlertCircle className="inline h-3 w-3 mr-1" />
                                {doc.feedback}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={status.className}>
                            {status.label}
                          </Badge>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          {doc.status !== "approved" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteDocument(doc.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("academic")}>
                Précédent
              </Button>
              <Button disabled={completedDocs < totalDocs}>
                Soumettre ma candidature
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
