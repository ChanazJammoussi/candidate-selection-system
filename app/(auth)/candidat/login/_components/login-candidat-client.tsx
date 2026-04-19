"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap, Eye, EyeOff, Mail, Lock, ChevronLeft, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { loginCandidatAction } from "@/lib/actions/candidat"

interface Props {
  concoursId:         string
  concoursNom:        string
  concoursSpecialites:string[]
}

export default function LoginCandidatClient({ concoursId, concoursNom, concoursSpecialites }: Props) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading]       = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const [formData, setFormData]         = useState({ email: "", password: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    const result = await loginCandidatAction(formData)
    setIsLoading(false)
    if (!result.success) {
      setError(result.error)
      return
    }
    router.push(`/candidat/${concoursId}`)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:flex lg:w-2/5 bg-sidebar flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-sidebar-foreground">SGCI</span>
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-sidebar-foreground leading-tight">
            Système de Gestion des Concours d'Intégration
          </h1>
          <p className="text-lg text-sidebar-foreground/70 leading-relaxed">
            Connectez-vous pour accéder à votre espace candidat et gérer votre dossier.
          </p>
        </div>
        <p className="text-sm text-sidebar-foreground/50">© 2026 SGCI. Tous droits réservés.</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          <button
            type="button"
            onClick={() => router.push("/candidat")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Changer de concours
          </button>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{concoursNom}</p>
              {concoursSpecialites.length > 0 && (
                <p className="text-sm text-muted-foreground truncate">
                  {concoursSpecialites.join(" · ")}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground">Connexion</h2>
            <p className="text-muted-foreground">Connectez-vous pour accéder à votre candidature</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Adresse email</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="votre@email.com" className="pl-9"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required autoFocus />
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type={showPassword ? "text" : "password"}
                    placeholder="Votre mot de passe" className="pl-9 pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>
            </FieldGroup>

            <div className="flex items-center justify-end">
              <a href="#" className="text-sm text-primary hover:underline">Mot de passe oublié ?</a>
            </div>

            {error && <p className="text-sm text-destructive text-center">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <a href={`/inscription?concoursId=${concoursId}`} className="text-primary hover:underline font-medium">
              Créer un compte
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
