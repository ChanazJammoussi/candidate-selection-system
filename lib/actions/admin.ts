"use server"

import { z } from "zod"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

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
