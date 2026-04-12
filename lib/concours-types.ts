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
    // — Identité —
    { id: "nom",            label: "Nom",                 type: "text",   required: true },
    { id: "prenom",         label: "Prénom",              type: "text",   required: true },
    { id: "cin",            label: "N° CIN",              type: "text",   required: true },
    { id: "dateNaissance",  label: "Date de naissance",   type: "date",   required: true },
    // — Baccalauréat —
    { id: "bac_section",    label: "Section bac",         type: "select", required: true,
      options: ["Sciences", "Maths", "Technique", "Économie", "Lettres", "Informatique", "Sport"] },
    { id: "bac_session",    label: "Session bac",         type: "select", required: true,
      options: ["Principale", "Contrôle"] },
    { id: "moyenne_bac",    label: "Moyenne bac",         type: "number", required: true, unit: "/20" },
    // — Prépa —
    { id: "filiere_prepa",  label: "Filière prépa",       type: "select", required: true,
      options: ["MP", "PC", "PT", "TSI", "BCPST", "Autre"] },
    { id: "moyenne_prepa_1", label: "Moyenne prépa — 1ère année", type: "number", required: true,  unit: "/20" },
    { id: "moyenne_prepa_2", label: "Moyenne prépa — 2ème année", type: "number", required: false, unit: "/20" },
    // — Documents —
    { id: "cin_recto",      label: "CIN (recto)",         type: "file",   required: true },
    { id: "cin_verso",      label: "CIN (verso)",         type: "file",   required: true },
    { id: "diplome_bac",    label: "Diplôme bac",         type: "file",   required: true },
    { id: "releve_prepa",   label: "Relevés de notes prépa", type: "file", required: true },
  ],
  formuleScore: {
    description: "Score = moyenne_bac × 0.30 + moyenne_prepa_1 × 0.30 + moyenne_prepa_2 × 0.40",
    variables: [
      { id: "moyenne_bac",     label: "Moyenne bac",              coefficient: 0.30 },
      { id: "moyenne_prepa_1", label: "Moyenne prépa 1ère année", coefficient: 0.30 },
      { id: "moyenne_prepa_2", label: "Moyenne prépa 2ème année", coefficient: 0.40 },
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
    // — Identité —
    { id: "nom",            label: "Nom",                 type: "text",   required: true },
    { id: "prenom",         label: "Prénom",              type: "text",   required: true },
    { id: "cin",            label: "N° CIN",              type: "text",   required: true },
    { id: "dateNaissance",  label: "Date de naissance",   type: "date",   required: true },
    // — Baccalauréat —
    { id: "bac_section",    label: "Section bac",         type: "select", required: true,
      options: ["Sciences", "Maths", "Technique", "Économie", "Lettres", "Informatique", "Sport"] },
    { id: "bac_session",    label: "Session bac",         type: "select", required: true,
      options: ["Principale", "Contrôle"] },
    { id: "moyenne_bac",    label: "Moyenne bac",         type: "number", required: true, unit: "/20" },
    // — Licence —
    { id: "specialite",     label: "Spécialité licence",  type: "text",   required: true },
    { id: "moyenne_licence_1", label: "Moyenne licence — 1ère année", type: "number", required: true,  unit: "/20" },
    { id: "moyenne_licence_2", label: "Moyenne licence — 2ème année", type: "number", required: true,  unit: "/20" },
    { id: "moyenne_licence_3", label: "Moyenne licence — 3ème année", type: "number", required: false, unit: "/20" },
    // — Documents —
    { id: "cin_recto",         label: "CIN (recto)",             type: "file", required: true },
    { id: "cin_verso",         label: "CIN (verso)",             type: "file", required: true },
    { id: "diplome_bac",       label: "Diplôme bac",             type: "file", required: true },
    { id: "diplome_licence",   label: "Diplôme licence",         type: "file", required: true },
    { id: "releves_licence",   label: "Relevés de notes (L1→L3)", type: "file", required: true },
  ],
  formuleScore: {
    description: "Score = moyenne_bac × 0.20 + moyenne_licence_1 × 0.20 + moyenne_licence_2 × 0.25 + moyenne_licence_3 × 0.35",
    variables: [
      { id: "moyenne_bac",       label: "Moyenne bac",              coefficient: 0.20 },
      { id: "moyenne_licence_1", label: "Moyenne licence 1ère année", coefficient: 0.20 },
      { id: "moyenne_licence_2", label: "Moyenne licence 2ème année", coefficient: 0.25 },
      { id: "moyenne_licence_3", label: "Moyenne licence 3ème année", coefficient: 0.35 },
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
  description: "Concours d'admission en master pour candidats titulaires d'une licence (Bac+3).",
  champs: [
    // — Identité —
    { id: "nom",            label: "Nom",                 type: "text",   required: true },
    { id: "prenom",         label: "Prénom",              type: "text",   required: true },
    { id: "cin",            label: "N° CIN",              type: "text",   required: true },
    { id: "dateNaissance",  label: "Date de naissance",   type: "date",   required: true },
    // — Baccalauréat —
    { id: "bac_section",    label: "Section bac",         type: "select", required: true,
      options: ["Sciences", "Maths", "Technique", "Économie", "Lettres", "Informatique", "Sport"] },
    { id: "bac_session",    label: "Session bac",         type: "select", required: true,
      options: ["Principale", "Contrôle"] },
    { id: "moyenne_bac",    label: "Moyenne bac",         type: "number", required: true, unit: "/20" },
    // — Licence —
    { id: "specialite",        label: "Spécialité",              type: "text",   required: true },
    { id: "moyenne_licence_1", label: "Moyenne — 1ère année",   type: "number", required: true,  unit: "/20" },
    { id: "moyenne_licence_2", label: "Moyenne — 2ème année",   type: "number", required: true,  unit: "/20" },
    { id: "moyenne_licence_3", label: "Moyenne — 3ème année",   type: "number", required: true,  unit: "/20" },
    // — Documents —
    { id: "cin_recto",       label: "CIN (recto)",          type: "file", required: true },
    { id: "cin_verso",       label: "CIN (verso)",          type: "file", required: true },
    { id: "diplome_bac",     label: "Diplôme bac",          type: "file", required: true },
    { id: "diplome_licence", label: "Diplôme licence",      type: "file", required: true },
    { id: "releves_notes",   label: "Relevés de notes",     type: "file", required: true },
    { id: "cv",              label: "CV",                   type: "file", required: false },
  ],
  formuleScore: {
    description: "Score = moyenne_bac × 0.20 + moyenne_licence_1 × 0.20 + moyenne_licence_2 × 0.25 + moyenne_licence_3 × 0.35",
    variables: [
      { id: "moyenne_bac",       label: "Moyenne bac",        coefficient: 0.20 },
      { id: "moyenne_licence_1", label: "Moyenne 1ère année", coefficient: 0.20 },
      { id: "moyenne_licence_2", label: "Moyenne 2ème année", coefficient: 0.25 },
      { id: "moyenne_licence_3", label: "Moyenne 3ème année", coefficient: 0.35 },
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
