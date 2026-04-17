import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import AdminLayoutClient from "./_components/admin-layout-client"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  const admin = session.adminId
    ? await prisma.admin.findUnique({
        where: { id: session.adminId },
        select: { nom: true, email: true },
      })
    : null

  const user = {
    name:  admin?.nom   ?? "Administrateur",
    email: admin?.email ?? "",
    role:  "admin" as const,
  }

  return (
    <AdminLayoutClient user={user}>
      {children}
    </AdminLayoutClient>
  )
}
