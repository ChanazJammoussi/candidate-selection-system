import type { ConcoursOption } from "@/components/ui/concours-selector"
import type { ConcourType } from "@/lib/concours-types"

// ----------------------------------------------------------------
// Type côté candidat
// ----------------------------------------------------------------

export interface Concours {
  id: string
  titre: string
  type: ConcourType
  domaine: string
  institution: string
  dateClotureInscription: string
  placesDisponibles: number
  candidatsInscrits: number
}

// ----------------------------------------------------------------
// Données candidat — concours ouverts
// ----------------------------------------------------------------

export const CONCOURS_OUVERTS: Concours[] = [
  {
    id: "1",
    titre: "Cycle Ingénieur — Prépa (Bac+2)",
    type: "ing_prepa",
    domaine: "Informatique",
    institution: "École Nationale d'Ingénieurs de Tunis",
    dateClotureInscription: "31/03/2026",
    placesDisponibles: 10,
    candidatsInscrits: 156,
  },
  {
    id: "2",
    titre: "Cycle Ingénieur — Licence (Bac+3)",
    type: "ing_licence",
    domaine: "Informatique",
    institution: "École Nationale d'Ingénieurs de Tunis",
    dateClotureInscription: "31/03/2026",
    placesDisponibles: 10,
    candidatsInscrits: 98,
  },
  {
    id: "3",
    titre: "Concours Master (Bac+3 / Bac+4)",
    type: "master",
    domaine: "Informatique",
    institution: "École Nationale d'Ingénieurs de Tunis",
    dateClotureInscription: "15/05/2026",
    placesDisponibles: 5,
    candidatsInscrits: 0,
  },
]

export function getConcoursById(id: string): Concours | undefined {
  return CONCOURS_OUVERTS.find((c) => c.id === id)
}

// ----------------------------------------------------------------
// Données admin — sélecteur de concours
// ----------------------------------------------------------------

export const MOCK_CONCOURS: ConcoursOption[] = [
  {
    id: "1",
    name: "Concours d'Intégration 2026",
    status: "open",
    startDate: "01/03/2026",
    endDate: "31/03/2026",
    places: 10,
    registeredCount: 156,
  },
  {
    id: "2",
    name: "Concours d'Intégration 2025",
    status: "results_published",
    startDate: "01/03/2025",
    endDate: "31/03/2025",
    places: 10,
    registeredCount: 142,
  },
  {
    id: "3",
    name: "Concours Spécial Master",
    status: "draft",
    startDate: "15/04/2026",
    endDate: "15/05/2026",
    places: 5,
    registeredCount: 0,
  },
]
