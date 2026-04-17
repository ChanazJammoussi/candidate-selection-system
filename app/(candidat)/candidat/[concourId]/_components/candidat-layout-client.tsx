"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Sheet, SheetContent } from "@/components/ui/sheet"

interface Props {
  children: React.ReactNode
  user: { name: string; email: string; role: "candidat" }
}

export default function CandidatLayoutClient({ children, user }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const params = useParams()
  const concourId = params?.concourId as string | undefined

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar role="candidat" concourId={concourId} />
      </div>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar role="candidat" concourId={concourId} />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          title="Espace Candidat"
          user={user}
          onMenuClick={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
