import { ConcourType, ScoreCritere, CONCOURS_TYPES } from "./concours-types"

export type Concours = {
  id: string
  titre: string
  institution: string
  domaine: string
  dateClotureInscription: string
  dateEpreuve: string
  placesDisponibles: number
  candidatsInscrits: number
  description: string
  type: ConcourType
  scoreFormula: ScoreCritere[]
}

export const CONCOURS_OUVERTS: Concours[] = [
  {
    id: "ing-info-prepa-2026",
    titre: "Cycle Ingénieur Informatique — Prépa",
    institution: "École Nationale d'Ingénieurs de Tunis",
    domaine: "Informatique",
    dateClotureInscription: "30 Mars 2026",
    dateEpreuve: "15 Avril 2026",
    placesDisponibles: 50,
    candidatsInscrits: 187,
    description: "Concours d'intégration en cycle ingénieur informatique, ouvert aux étudiants issus des classes préparatoires intégrées.",
    type: "ing_prepa",
    scoreFormula: CONCOURS_TYPES["ing_prepa"].formuleScore.variables,
  },
  {
    id: "ing-info-licence-2026",
    titre: "Cycle Ingénieur Informatique — Licence",
    institution: "École Nationale d'Ingénieurs de Tunis",
    domaine: "Informatique",
    dateClotureInscription: "28 Mars 2026",
    dateEpreuve: "12 Avril 2026",
    placesDisponibles: 40,
    candidatsInscrits: 214,
    description: "Concours d'intégration en cycle ingénieur informatique, ouvert aux titulaires d'une licence en informatique ou domaine connexe.",
    type: "ing_licence",
    scoreFormula: CONCOURS_TYPES["ing_licence"].formuleScore.variables,
  },
  {
    id: "master-electronique-2026",
    titre: "Master Électronique & Systèmes Embarqués",
    institution: "École Supérieure des Sciences et Technologies de Tunis",
    domaine: "Électronique",
    dateClotureInscription: "5 Avril 2026",
    dateEpreuve: "22 Avril 2026",
    placesDisponibles: 30,
    candidatsInscrits: 96,
    description: "Concours d'admission en master électronique et systèmes embarqués, ouvert aux titulaires d'une licence en électronique, électrotechnique ou informatique industrielle.",
    type: "master",
    scoreFormula: CONCOURS_TYPES["master"].formuleScore.variables,
  },
]

export function getConcoursById(id: string): Concours | undefined {
  return CONCOURS_OUVERTS.find((c) => c.id === id)
}
