"use server"

import { z } from "zod"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

const LoginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

export async function loginAdminAction(formData: FormData) {
  const parsed = LoginSchema.safeParse({
    email:    formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) {
    return { error: "Données invalides." }
  }

  const { email, password } = parsed.data

  const admin = await prisma.admin.findUnique({ where: { email } })
  if (!admin) {
    return { error: "Aucun compte administrateur trouvé avec cette adresse email." }
  }

  const valid = await bcrypt.compare(password, admin.password)
  if (!valid) {
    return { error: "Mot de passe incorrect." }
  }

  const session = await getSession()
  session.adminId    = admin.id
  session.adminEmail = admin.email
  await session.save()

  redirect("/admin")
}

export async function updateCandidatureStatutAction(
  candidatureId: string,
  statut: "en_attente" | "acceptee" | "rejetee" | "liste_attente"
) {
  await prisma.candidature.update({
    where: { id: candidatureId },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { statut: statut as any },
  })
  revalidatePath("/admin/candidats")
  revalidatePath("/admin/candidatures")
  revalidatePath("/admin")
  return { success: true }
}
