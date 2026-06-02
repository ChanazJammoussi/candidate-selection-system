import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { getSession } from "@/lib/session"

const MAX_SIZE = 5 * 1024 * 1024 // 5 Mo
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.candidatId) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const formData = await req.formData()
  const file     = formData.get("file")     as File   | null
  const champId  = formData.get("champId")  as string | null
  const concoursId = formData.get("concoursId") as string | null

  if (!file || !champId || !concoursId) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Format non autorisé. Utilisez PDF, JPG ou PNG." }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Fichier trop volumineux (max 5 Mo)." }, { status: 400 })
  }

  const buffer   = Buffer.from(await file.arrayBuffer())
  const ext      = (file.name.split(".").pop() ?? "pdf").toLowerCase()
  const safeName = `${champId.replace(/[^a-z0-9_-]/gi, "_")}-${Date.now()}.${ext}`
  const dir      = path.join(process.cwd(), "public", "uploads", session.candidatId, concoursId)

  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, safeName), buffer)

  return NextResponse.json({
    url:      `/uploads/${session.candidatId}/${concoursId}/${safeName}`,
    fileName: file.name,
    champId,
    size:     `${(file.size / 1024).toFixed(0)} Ko`,
  })
}
