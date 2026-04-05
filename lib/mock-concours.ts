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
}

export const CONCOURS_OUVERTS: Concours[] = [
  {
    id: "ingenieur-civil-2026",
    titre: "Concours Ingénieur Civil",
    institution: "École Nationale d'Ingénieurs de Tunis",
    domaine: "Génie Civil",
    dateClotureInscription: "30 Mars 2026",
    dateEpreuve: "15 Avril 2026",
    placesDisponibles: 40,
    candidatsInscrits: 142,
    description: "Concours d'intégration pour le cycle ingénieur en génie civil",
  },
  {
    id: "informatique-2026",
    titre: "Concours Informatique & Réseaux",
    institution: "École Supérieure des Communications",
    domaine: "Informatique",
    dateClotureInscription: "28 Mars 2026",
    dateEpreuve: "12 Avril 2026",
    placesDisponibles: 60,
    candidatsInscrits: 289,
    description: "Concours d'intégration pour le cycle ingénieur en informatique et réseaux",
  },
  {
    id: "finance-2026",
    titre: "Concours Finance & Comptabilité",
    institution: "Institut Supérieur de Finance",
    domaine: "Finance",
    dateClotureInscription: "1 Avril 2026",
    dateEpreuve: "20 Avril 2026",
    placesDisponibles: 35,
    candidatsInscrits: 98,
    description: "Concours d'intégration pour le master en finance et comptabilité",
  },
  {
    id: "medecine-2026",
    titre: "Concours Médecine Générale",
    institution: "Faculté de Médecine de Sfax",
    domaine: "Médecine",
    dateClotureInscription: "25 Mars 2026",
    dateEpreuve: "10 Avril 2026",
    placesDisponibles: 25,
    candidatsInscrits: 412,
    description: "Concours d'intégration pour le cycle de médecine générale",
  },
]

export function getConcoursById(id: string): Concours | undefined {
  return CONCOURS_OUVERTS.find((c) => c.id === id)
}