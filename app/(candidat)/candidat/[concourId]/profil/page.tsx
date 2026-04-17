import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import ProfilClient from "../_components/profil-client"

export default async function ProfilPage() {
  const session = await getSession()
  const candidat = session.candidatId
    ? await prisma.candidat.findUnique({
        where: { id: session.candidatId },
        select: { prenom: true, nom: true, cin: true, email: true, phone: true },
      })
    : null

  const initialData = {
    firstName:      candidat?.prenom      ?? "",
    lastName:       candidat?.nom         ?? "",
    cin:            candidat?.cin         ?? "",
    email:          candidat?.email       ?? "",
    phone:          candidat?.phone       ?? "",
    // Champs non encore en base — vides, marqués "à remplir"
    birthDate:      "",
    gouvernorat:    "",
    ville:          "",
    codePostal:     "",
    adresse:        "",
    diploma:        "",
    institution:    "",
    specialization: "",
    graduationYear: "",
    gpa:            "",
  }

  return <ProfilClient initialData={initialData} />
}
