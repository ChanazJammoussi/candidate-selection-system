import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import CandidatDetailClient from "./_components/candidat-detail-client"

export default async function CandidatDetailPage({ params }: { params: { id: string } }) {
  const candidature = await prisma.candidature.findUnique({
    where: { id: params.id },
    include: { candidat: true, concours: true },
  })

  if (!candidature) notFound()

  return (
    <CandidatDetailClient
      candidature={{
        id: candidature.id,
        statut: candidature.statut as "en_attente" | "acceptee" | "rejetee" | "liste_attente",
        score: candidature.score,
        donnees: candidature.donnees as Record<string, unknown>,
        documents: candidature.documents as Array<{ url: string; fileName: string; champId: string; size: string }> | null,
        createdAt: candidature.createdAt.toLocaleDateString("fr-TN"),
        candidat: {
          prenom:      candidature.candidat.prenom,
          nom:         candidature.candidat.nom,
          cin:         candidature.candidat.cin,
          email:       candidature.candidat.email,
          phone:       candidature.candidat.phone,
          birthDate:   candidature.candidat.birthDate,
          adresse:     candidature.candidat.adresse,
          gouvernorat: candidature.candidat.gouvernorat,
          ville:       candidature.candidat.ville,
        },
        concours: {
          nom:    candidature.concours.nom,
          type:   candidature.concours.type as "ing_prepa" | "ing_licence" | "master",
          places: candidature.concours.places,
        },
      }}
    />
  )
}
