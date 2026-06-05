import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session.adminId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const concoursId = req.nextUrl.searchParams.get("concoursId") ?? undefined

  const candidatures = await prisma.candidature.findMany({
    where: concoursId ? { concoursId } : undefined,
    include: {
      candidat: { select: { prenom: true, nom: true, cin: true, email: true, phone: true } },
      concours: { select: { nom: true, type: true } },
    },
    orderBy: { score: "desc" },
  })

  const rows = candidatures.map((c, i) => ({
    rang:        c.score !== null ? i + 1 : "",
    prenom:      c.candidat.prenom,
    nom:         c.candidat.nom,
    cin:         c.candidat.cin,
    email:       c.candidat.email,
    phone:       c.candidat.phone ?? "",
    concours:    c.concours.nom,
    type:        c.concours.type,
    statut:      c.statut,
    score:       c.score ?? "",
    soumis_le:   c.createdAt.toISOString(),
  }))

  const slug = concoursId ? `-concours-${concoursId.slice(0, 8)}` : ""
  const filename = `export-sgci${slug}-${new Date().toISOString().slice(0, 10)}.json`

  return new NextResponse(JSON.stringify(rows, null, 2), {
    headers: {
      "Content-Type":        "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
