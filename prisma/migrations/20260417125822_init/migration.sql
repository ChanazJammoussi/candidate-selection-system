-- CreateEnum
CREATE TYPE "ConcoursType" AS ENUM ('ing_prepa', 'ing_licence', 'master');

-- CreateEnum
CREATE TYPE "ConcoursStatut" AS ENUM ('draft', 'open', 'closed', 'results_published');

-- CreateEnum
CREATE TYPE "CandidatureStatut" AS ENUM ('en_attente', 'acceptee', 'rejetee');

-- CreateTable
CREATE TABLE "Candidat" (
    "id" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "cin" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Concours" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "type" "ConcoursType" NOT NULL,
    "statut" "ConcoursStatut" NOT NULL DEFAULT 'draft',
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "dateResultats" TIMESTAMP(3) NOT NULL,
    "places" INTEGER NOT NULL,
    "specialites" TEXT[],
    "formule" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Concours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidature" (
    "id" TEXT NOT NULL,
    "statut" "CandidatureStatut" NOT NULL DEFAULT 'en_attente',
    "score" DOUBLE PRECISION,
    "donnees" JSONB NOT NULL,
    "documents" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "candidatId" TEXT NOT NULL,
    "concoursId" TEXT NOT NULL,

    CONSTRAINT "Candidature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidat_cin_key" ON "Candidat"("cin");

-- CreateIndex
CREATE UNIQUE INDEX "Candidat_email_key" ON "Candidat"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Candidature_candidatId_concoursId_key" ON "Candidature"("candidatId", "concoursId");

-- AddForeignKey
ALTER TABLE "Candidature" ADD CONSTRAINT "Candidature_candidatId_fkey" FOREIGN KEY ("candidatId") REFERENCES "Candidat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidature" ADD CONSTRAINT "Candidature_concoursId_fkey" FOREIGN KEY ("concoursId") REFERENCES "Concours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
