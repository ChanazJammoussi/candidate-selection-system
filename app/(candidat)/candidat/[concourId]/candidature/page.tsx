import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"
import CandidatureClient from "./_components/candidature-no-ssr"

export default async function CandidaturePage({
  params,
}: {
  params: Promise<{ concourId: string }>
}) {
  const { concourId } = await params

  const [concours, session] = await Promise.all([
    prisma.concours.findUnique({
      where:  { id: concourId },
      select: { id: true, nom: true, type: true, statut: true },
    }),
    getSession(),
  ])

  if (!concours) notFound()

  if (session.candidatId) {
    const existing = await prisma.candidature.findUnique({
      where: {
        candidatId_concoursId: {
          candidatId: session.candidatId,
          concoursId: concourId,
        },
      },
      select: { id: true },
    })
    if (existing) redirect(`/candidat/${concourId}/suivi`)
  }

  return (
    <CandidatureClient
      concoursId={concours.id}
      concoursNom={concours.nom}
      concoursType={concours.type}
    />
  )
}
