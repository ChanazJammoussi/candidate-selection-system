"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const CreateSchema = z.object({
  nom:          z.string().min(1),
  description:  z.string().optional(),
  type:         z.enum(["ing_prepa", "ing_licence", "master"]),
  dateDebut:    z.string().min(1),
  dateFin:      z.string().min(1),
  dateResultats:z.string().min(1),
  places:       z.coerce.number().int().positive(),
  specialites:  z.array(z.string()),
  formule:      z.string().min(1),
})

export async function createConcoursAction(data: {
  nom: string
  description: string
  type: string
  dateDebut: string
  dateFin: string
  dateResultats: string
  places: number
  specialites: string[]
  formule: string
}) {
  const parsed = CreateSchema.safeParse(data)
  if (!parsed.success) return { error: "Données invalides." }

  await prisma.concours.create({
    data: {
      nom:          parsed.data.nom,
      description:  parsed.data.description,
      type:         parsed.data.type,
      statut:       "draft",
      dateDebut:    new Date(parsed.data.dateDebut),
      dateFin:      new Date(parsed.data.dateFin),
      dateResultats:new Date(parsed.data.dateResultats),
      places:       parsed.data.places,
      specialites:  parsed.data.specialites,
      formule:      parsed.data.formule,
    },
  })

  revalidatePath("/admin/concours")
  return { success: true }
}

export async function updateConcoursConfigAction(
  id: string,
  specialites: string[],
  formule: string
) {
  await prisma.concours.update({
    where: { id },
    data:  { specialites, formule },
  })
  revalidatePath("/admin/concours")
  return { success: true }
}

export async function deleteConcoursAction(id: string) {
  await prisma.concours.delete({ where: { id } })
  revalidatePath("/admin/concours")
  return { success: true }
}

export async function updateConcoursStatutAction(
  id: string,
  statut: "draft" | "open" | "closed" | "results_published"
) {
  await prisma.concours.update({ where: { id }, data: { statut } })
  revalidatePath("/admin/concours")
  return { success: true }
}
