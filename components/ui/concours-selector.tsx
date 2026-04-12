"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, CheckCircle, Clock, Edit, Eye, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ConcoursOption {
  id: string
  name: string
  status: "draft" | "open" | "closed" | "results_published"
  startDate: string
  endDate: string
  places: number
  registeredCount: number
}

const STATUS_CONFIG = {
  draft:             { label: "Brouillon",         icon: Edit,        className: "bg-muted text-muted-foreground border-muted-foreground/20" },
  open:              { label: "Ouvert",             icon: CheckCircle, className: "bg-success/10 text-success border-success/20" },
  closed:            { label: "Fermé",              icon: Clock,       className: "bg-warning/10 text-warning border-warning/20" },
  results_published: { label: "Résultats publiés",  icon: Eye,         className: "bg-primary/10 text-primary border-primary/20" },
}

interface Props {
  options: ConcoursOption[]
  value: string
  onChange: (id: string) => void
}

function ConcoursCard({
  c,
  selected,
  onClick,
}: {
  c: ConcoursOption
  selected: boolean
  onClick?: () => void
}) {
  const { label, icon: Icon, className: badgeClass } = STATUS_CONFIG[c.status]
  const fillPct = Math.min((c.registeredCount / Math.max(c.places, 1)) * 100, 100)

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "text-left rounded-xl border p-4 space-y-3 transition-all duration-150 w-full",
        onClick && "hover:shadow-md hover:border-primary/40",
        selected
          ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/30"
          : "border-border bg-card",
        !onClick && "cursor-default"
      )}
    >
      {/* Nom + badge statut */}
      <div className="flex items-start justify-between gap-2">
        <p className={cn("font-semibold text-sm leading-snug", selected && "text-primary")}>
          {c.name}
        </p>
        <Badge variant="outline" className={cn("shrink-0 gap-1 text-xs", badgeClass)}>
          <Icon className="h-3 w-3" />
          {label}
        </Badge>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Calendar className="h-3.5 w-3.5 shrink-0" />
        <span>{c.startDate} – {c.endDate}</span>
      </div>

      {/* Inscrits / places */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5 shrink-0" />
          <span>{c.registeredCount} inscrits</span>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {c.places} place{c.places > 1 ? "s" : ""}
        </span>
      </div>

      {/* Barre de remplissage */}
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            selected ? "bg-primary" : "bg-muted-foreground/30"
          )}
          style={{ width: `${fillPct}%` }}
        />
      </div>
    </button>
  )
}

export function ConcoursSelector({ options, value, onChange }: Props) {
  const selected = options.find((c) => c.id === value)

  // ── Concours sélectionné : affiche uniquement la carte active + bouton retour ──
  if (selected) {
    const { label, icon: Icon, className: badgeClass } = STATUS_CONFIG[selected.status]
    const fillPct = Math.min((selected.registeredCount / Math.max(selected.places, 1)) * 100, 100)

    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-primary bg-primary/5 shadow-md ring-1 ring-primary/30 px-6 py-3 w-full flex items-center gap-8">
          {/* Nom + statut */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <p className="font-bold text-primary truncate">{selected.name}</p>
            <Badge variant="outline" className={cn("shrink-0 gap-1 text-xs", badgeClass)}>
              <Icon className="h-3 w-3" />
              {label}
            </Badge>
          </div>

          {/* Infos inline */}
          <div className="flex items-center gap-6 shrink-0 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{selected.startDate} – {selected.endDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>{selected.registeredCount} / {selected.places} places</span>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => onChange("")}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Changer de concours
        </Button>
      </div>
    )
  }

  // ── Aucun concours sélectionné : grille complète ──
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((c) => (
        <ConcoursCard
          key={c.id}
          c={c}
          selected={false}
          onClick={() => onChange(c.id)}
        />
      ))}
    </div>
  )
}
