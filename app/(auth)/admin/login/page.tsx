"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { GraduationCap, Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      router.push("/admin")
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-sidebar-foreground">SGCI</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-sidebar-foreground leading-tight text-balance">
            Système de Gestion des Concours d'Intégration
          </h1>
          <p className="text-lg text-sidebar-foreground/70 leading-relaxed">
            Espace d'administration pour la gestion des candidatures et la sélection des candidats.
          </p>
          <div className="flex flex-col gap-4 pt-4">
            <div className="flex items-center gap-3 text-sidebar-foreground/80">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span>Gestion des candidats et dossiers</span>
            </div>
            <div className="flex items-center gap-3 text-sidebar-foreground/80">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span>Suivi des concours en temps réel</span>
            </div>
            <div className="flex items-center gap-3 text-sidebar-foreground/80">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span>Publication des résultats et classements</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-sidebar-foreground/50">© 2026 SGCI. Tous droits réservés.</p>
      </div>

      {/* Right side - Login Form */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center gap-2 text-center lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">SGCI</span>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Administration</CardTitle>
              <CardDescription>Connectez-vous a votre espace administrateur</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Adresse email</FieldLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@sgci.fr"
                        className="pl-9"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Votre mot de passe"
                        className="pl-9 pr-10"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </Field>
                </FieldGroup>

                <div className="flex items-center justify-end">
                  <Link href="#" className="text-sm text-primary hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Connexion..." : "Se connecter"}
                </Button>
              </form>

              <div className="mt-4 text-center text-sm text-muted-foreground">
                Espace candidat ?{" "}
                <Link href="/candidat/login" className="text-primary hover:underline font-medium">
                  Connexion candidat
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}