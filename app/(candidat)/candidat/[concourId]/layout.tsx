import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import CandidatLayoutClient from "./_components/candidat-layout-client"

export default async function CandidatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  const candidat = session.candidatId
    ? await prisma.candidat.findUnique({
        where: { id: session.candidatId },
        select: { prenom: true, nom: true, email: true },
      })
    : null

  const user = {
    name:  candidat ? `${candidat.prenom} ${candidat.nom}` : "Candidat",
    email: candidat?.email ?? "",
    role:  "candidat" as const,
  }

  return (
    <CandidatLayoutClient user={user}>
      {children}
    </CandidatLayoutClient>
  )
}
