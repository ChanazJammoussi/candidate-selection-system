// Types de concours supportés par la plateforme SGCI
export type ConcoursTypeId = "ing_prepa" | "ing_licence" | "master"
/** Alias court utilisé dans les données mock et les formulaires */
export type ConcourType = ConcoursTypeId

// --- Champs de candidature ---

export type ChampType = "text" | "number" | "select" | "date" | "file"

export interface ChampCandidature {
  id: string
  label: string
  type: ChampType
  required: boolean
  options?: string[] // pour type "select"
  unit?: string      // pour type "number" (ex: "/20")
}

// --- Formule de score ---

export interface VariableScore {
  id: string       // correspond au ChampCandidature.id
  label: string
  coefficient: number
}
/** Alias court utilisé dans les données mock et les formulaires */
export type ScoreCritere = VariableScore

export interface FormuleScore {
  description: string
  variables: VariableScore[]
  // Calcule le score à partir d'un objet { [champId]: number }
  calculer: (valeurs: Record<string, number>) => number
}

// --- Définition d'un type de concours ---

export interface ConcoursTypeDef {
  id: ConcoursTypeId
  label: string
  description: string
  champs: ChampCandidature[]
  formuleScore: FormuleScore
}

// ============================================================
// 1. ING_PREPA — Cycle ingénieur sur concours prépa (Bac+2)
// ============================================================
const ing_prepa: ConcoursTypeDef = {
  id: "ing_prepa",
  label: "Ingénieur (Prépa)",
  description: "Concours d'intégration en cycle ingénieur pour candidats issus des classes préparatoires.",
  champs: [
    { id: "nom",              label: "Nom",                       type: "text",   required: true },
    { id: "prenom",           label: "Prénom",                    type: "text",   required: true },
    { id: "cin",              label: "N° CIN",                    type: "text",   required: true },
    { id: "dateNaissance",    label: "Date de naissance",         type: "date",   required: true },
    { id: "etablissementPrepa", label: "Établissement prépa",     type: "text",   required: true },
    { id: "filiere",          label: "Filière prépa",             type: "select", required: true,
      options: ["MP", "PC", "PT", "TSI", "BCPST", "Autre"] },
    { id: "notesMaths",       label: "Note Maths (/20)",          type: "number", required: true, unit: "/20" },
    { id: "notesPhysique",    label: "Note Physique (/20)",       type: "number", required: true, unit: "/20" },
    { id: "notesInformatique",label: "Note Informatique (/20)",   type: "number", required: false, unit: "/20" },
    { id: "notesLangue",      label: "Note Langue (Anglais /20)", type: "number", required: true, unit: "/20" },
    { id: "rangPrepa",        label: "Rang au classement prépa",  type: "number", required: true },
    { id: "diplomeBac",       label: "Diplôme Bac (scan)",        type: "file",   required: true },
    { id: "releveNotes",      label: "Relevé de notes prépa",     type: "file",   required: true },
  ],
  formuleScore: {
    description: "Score = 0.40×Maths + 0.30×Physique + 0.15×Informatique + 0.15×Langue",
    variables: [
      { id: "notesMaths",        label: "Maths",        coefficient: 0.40 },
      { id: "notesPhysique",     label: "Physique",     coefficient: 0.30 },
      { id: "notesInformatique", label: "Informatique", coefficient: 0.15 },
      { id: "notesLangue",       label: "Langue",       coefficient: 0.15 },
    ],
    calculer(valeurs) {
      return this.variables.reduce(
        (sum, v) => sum + (valeurs[v.id] ?? 0) * v.coefficient,
        0
      )
    },
  },
}

// ============================================================
// 2. ING_LICENCE — Cycle ingénieur sur concours licence (Bac+3)
// ============================================================
const ing_licence: ConcoursTypeDef = {
  id: "ing_licence",
  label: "Ingénieur (Licence)",
  description: "Concours d'intégration en cycle ingénieur pour titulaires d'une licence fondamentale ou appliquée.",
  champs: [
    { id: "nom",              label: "Nom",                         type: "text",   required: true },
    { id: "prenom",           label: "Prénom",                      type: "text",   required: true },
    { id: "cin",              label: "N° CIN",                      type: "text",   required: true },
    { id: "dateNaissance",    label: "Date de naissance",           type: "date",   required: true },
    { id: "etablissementLicence", label: "Établissement (licence)", type: "text",   required: true },
    { id: "specialite",       label: "Spécialité licence",          type: "text",   required: true },
    { id: "moyenneLicence",   label: "Moyenne générale licence (/20)", type: "number", required: true, unit: "/20" },
    { id: "notesMaths",       label: "Note Maths (S1+S2 /20)",      type: "number", required: true, unit: "/20" },
    { id: "notesAlgo",        label: "Note Algo/Prog (S1+S2 /20)",  type: "number", required: true, unit: "/20" },
    { id: "notesLangue",      label: "Note Langue (Anglais /20)",   type: "number", required: true, unit: "/20" },
    { id: "rangLicence",      label: "Rang dans la promotion",      type: "number", required: false },
    { id: "diplomeLicence",   label: "Diplôme Licence (scan)",      type: "file",   required: true },
    { id: "releveNotes",      label: "Relevés de notes (L1→L3)",    type: "file",   required: true },
  ],
  formuleScore: {
    description: "Score = 0.35×MoyenneLicence + 0.25×Maths + 0.25×Algo + 0.15×Langue",
    variables: [
      { id: "moyenneLicence", label: "Moyenne Licence", coefficient: 0.35 },
      { id: "notesMaths",     label: "Maths",           coefficient: 0.25 },
      { id: "notesAlgo",      label: "Algo/Prog",       coefficient: 0.25 },
      { id: "notesLangue",    label: "Langue",          coefficient: 0.15 },
    ],
    calculer(valeurs) {
      return this.variables.reduce(
        (sum, v) => sum + (valeurs[v.id] ?? 0) * v.coefficient,
        0
      )
    },
  },
}

// ============================================================
// 3. MASTER — Concours master (Bac+3 / Bac+4)
// ============================================================
const master: ConcoursTypeDef = {
  id: "master",
  label: "Master",
  description: "Concours d'admission en master pour candidats titulaires d'une licence ou d'un diplôme équivalent.",
  champs: [
    { id: "nom",              label: "Nom",                           type: "text",   required: true },
    { id: "prenom",           label: "Prénom",                        type: "text",   required: true },
    { id: "cin",              label: "N° CIN",                        type: "text",   required: true },
    { id: "dateNaissance",    label: "Date de naissance",             type: "date",   required: true },
    { id: "niveauEtudes",     label: "Niveau d'études actuel",        type: "select", required: true,
      options: ["Licence (Bac+3)", "Maîtrise (Bac+4)", "Autre"] },
    { id: "etablissement",    label: "Établissement d'origine",       type: "text",   required: true },
    { id: "specialite",       label: "Spécialité",                    type: "text",   required: true },
    { id: "moyenneGenerale",  label: "Moyenne générale (/20)",        type: "number", required: true, unit: "/20" },
    { id: "noteMemoire",      label: "Note mémoire / PFE (/20)",      type: "number", required: false, unit: "/20" },
    { id: "notesLangue",      label: "Note Langue (Anglais /20)",     type: "number", required: true, unit: "/20" },
    { id: "experiencePro",    label: "Expérience professionnelle (mois)", type: "number", required: false },
    { id: "diplome",          label: "Diplôme (scan)",                type: "file",   required: true },
    { id: "releveNotes",      label: "Relevés de notes",              type: "file",   required: true },
    { id: "cv",               label: "CV",                            type: "file",   required: false },
  ],
  formuleScore: {
    description: "Score = 0.45×MoyenneGénérale + 0.25×NoteMémoire + 0.20×Langue + 0.10×ExpériencePro (plafonnée à 20)",
    variables: [
      { id: "moyenneGenerale", label: "Moyenne générale", coefficient: 0.45 },
      { id: "noteMemoire",     label: "Mémoire/PFE",      coefficient: 0.25 },
      { id: "notesLangue",     label: "Langue",           coefficient: 0.20 },
      { id: "experiencePro",   label: "Expérience Pro",   coefficient: 0.10 },
    ],
    calculer(valeurs) {
      // L'expérience est en mois, on la ramène sur 20 (24 mois = 20/20)
      const expNormalisee = Math.min((valeurs["experiencePro"] ?? 0) / 24 * 20, 20)
      const valeursAjustees = { ...valeurs, experiencePro: expNormalisee }
      return this.variables.reduce(
        (sum, v) => sum + (valeursAjustees[v.id] ?? 0) * v.coefficient,
        0
      )
    },
  },
}

// ============================================================
// Registre central
// ============================================================

export const CONCOURS_TYPES: Record<ConcoursTypeId, ConcoursTypeDef> = {
  ing_prepa,
  ing_licence,
  master,
}

/** Alias destiné aux composants UI */
export const CONCOUR_TYPE_CONFIGS = CONCOURS_TYPES

/** Labels lisibles pour chaque type de concours */
export const CONCOUR_TYPE_LABELS: Record<ConcoursTypeId, string> = {
  ing_prepa:   "Ingénieur — Prépa (Bac+2)",
  ing_licence: "Ingénieur — Licence (Bac+3)",
  master:      "Master (Bac+3 / Bac+4)",
}

export function getConcoursType(id: ConcoursTypeId): ConcoursTypeDef {
  return CONCOURS_TYPES[id]
}
