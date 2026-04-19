import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import CandidatureClient from "./_components/candidature-no-ssr"

export default async function CandidaturePage({
  params,
}: {
  params: Promise<{ concourId: string }>
}) {
  const { concourId } = await params

  const concours = await prisma.concours.findUnique({
    where:  { id: concourId },
    select: { id: true, nom: true, type: true, statut: true },
  })

  if (!concours) notFound()

  return (
    <CandidatureClient
      concoursId={concours.id}
      concoursNom={concours.nom}
      concoursType={concours.type}
    />
  )
}
