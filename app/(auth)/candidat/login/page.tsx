import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import LoginCandidatClient from "./_components/login-candidat-client"

export default async function CandidatLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ concoursId?: string }>
}) {
  const { concoursId } = await searchParams
  if (!concoursId) redirect("/candidat")

  const concours = await prisma.concours.findUnique({
    where:  { id: concoursId },
    select: { id: true, nom: true, statut: true, specialites: true },
  })

  if (!concours || concours.statut !== "open") redirect("/candidat")

  return (
    <LoginCandidatClient
      concoursId={concours.id}
      concoursNom={concours.nom}
      concoursSpecialites={concours.specialites}
    />
  )
}
