import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import ProfilClient from "../_components/profil-client"

export default async function ProfilPage() {
  const session = await getSession()
  const candidat = session.candidatId
    ? await prisma.candidat.findUnique({
        where: { id: session.candidatId },
        select: {
          prenom: true, nom: true, cin: true, email: true, phone: true,
          birthDate: true, gouvernorat: true, ville: true, codePostal: true,
          adresse: true, diploma: true, institution: true, specialization: true,
          graduationYear: true, gpa: true,
        },
      })
    : null

  const initialData = {
    firstName:      candidat?.prenom         ?? "",
    lastName:       candidat?.nom            ?? "",
    cin:            candidat?.cin            ?? "",
    email:          candidat?.email          ?? "",
    phone:          candidat?.phone          ?? "",
    birthDate:      candidat?.birthDate      ?? "",
    gouvernorat:    candidat?.gouvernorat    ?? "",
    ville:          candidat?.ville          ?? "",
    codePostal:     candidat?.codePostal     ?? "",
    adresse:        candidat?.adresse        ?? "",
    diploma:        candidat?.diploma        ?? "",
    institution:    candidat?.institution    ?? "",
    specialization: candidat?.specialization ?? "",
    graduationYear: candidat?.graduationYear ?? "",
    gpa:            candidat?.gpa            ?? "",
  }

  return <ProfilClient initialData={initialData} />
}
