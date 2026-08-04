/*
  Warnings:

  - You are about to drop the column `altura` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `peso` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `activo` on the `Tratamiento` table. All the data in the column will be lost.
  - Changed the type of `tipo` on the `Antecedente` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `mimeType` to the `Documento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombreOriginal` to the `Documento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tamanio` to the `Documento` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `tipo` on the `Documento` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `especialidad` on the `Medico` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `fechaFin` to the `Tratamiento` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('FEMENINO', 'MASCULINO', 'NO_BINARIO', 'NO_ESPECIFICA', 'OTRO');

-- CreateEnum
CREATE TYPE "NombreObraSocial" AS ENUM ('ACCORD_SALUD', 'AVALIAN', 'GALENO', 'HOMINIS', 'HOSPITAL_ITALIANO', 'IOMA', 'LUIS_PASTEUR', 'MEDICUS', 'MEDIFE', 'OMINT', 'OSAPM', 'OSBA', 'OSCHOCA', 'OSDE', 'OSDEPYM', 'OSECAC', 'OSFATLYF', 'OSFFENTOS', 'OSPE', 'OSPACA', 'OSPAT', 'OSPEDYC', 'OSPERYH', 'OSPIA', 'OSPIC', 'OSPIL', 'OSPIM', 'OSPJN', 'OSPLAD', 'OSPOCE', 'OSPSA', 'OSSEG', 'OSUTHGRA', 'OTRA', 'PAMI', 'PREVENCION_SALUD', 'SANCOR_SALUD', 'SIN_COBERTURA', 'SWISS_MEDICAL', 'UNION_PERSONAL');

-- DropForeignKey
ALTER TABLE "Antecedente" DROP CONSTRAINT "Antecedente_numeroExpediente_fkey";

-- DropForeignKey
ALTER TABLE "Consulta" DROP CONSTRAINT "Consulta_numeroExpediente_fkey";

-- DropForeignKey
ALTER TABLE "Documento" DROP CONSTRAINT "Documento_numeroExpediente_fkey";

-- DropForeignKey
ALTER TABLE "HistoriaClinica" DROP CONSTRAINT "HistoriaClinica_dniPaciente_fkey";

-- DropForeignKey
ALTER TABLE "Tratamiento" DROP CONSTRAINT "Tratamiento_numeroExpediente_fkey";

-- AlterTable
ALTER TABLE "Antecedente" DROP COLUMN "tipo",
ADD COLUMN     "tipo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Documento" ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "nombreOriginal" TEXT NOT NULL,
ADD COLUMN     "tamanio" INTEGER NOT NULL,
DROP COLUMN "tipo",
ADD COLUMN     "tipo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Medico" DROP COLUMN "especialidad",
ADD COLUMN     "especialidad" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Paciente" DROP COLUMN "altura",
DROP COLUMN "peso",
ADD COLUMN     "domicilio" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "fechaDeNacimiento" TIMESTAMP(3),
ADD COLUMN     "genero" "Genero",
ADD COLUMN     "telefono" TEXT,
ADD COLUMN     "telefonoDeEmergencia" TEXT;

-- AlterTable
ALTER TABLE "Tratamiento" DROP COLUMN "activo",
ADD COLUMN     "fechaFin" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "Especialidad";

-- DropEnum
DROP TYPE "TipoAntecedente";

-- DropEnum
DROP TYPE "TipoDocumento";

-- CreateTable
CREATE TABLE "Institucion" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Institucion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObraSocial" (
    "id" SERIAL NOT NULL,
    "nombre" "NombreObraSocial" NOT NULL,
    "numeroDeAfiliado" TEXT,
    "plan" TEXT,
    "dniPaciente" INTEGER NOT NULL,

    CONSTRAINT "ObraSocial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ObraSocial_dniPaciente_key" ON "ObraSocial"("dniPaciente");

-- CreateIndex
CREATE INDEX "Antecedente_numeroExpediente_idx" ON "Antecedente"("numeroExpediente");

-- CreateIndex
CREATE INDEX "Consulta_numeroExpediente_idx" ON "Consulta"("numeroExpediente");

-- CreateIndex
CREATE INDEX "Consulta_legajoMedico_idx" ON "Consulta"("legajoMedico");

-- CreateIndex
CREATE INDEX "Consulta_fecha_idx" ON "Consulta"("fecha");

-- CreateIndex
CREATE INDEX "Documento_numeroExpediente_idx" ON "Documento"("numeroExpediente");

-- CreateIndex
CREATE INDEX "Tratamiento_numeroExpediente_idx" ON "Tratamiento"("numeroExpediente");

-- CreateIndex
CREATE INDEX "Tratamiento_legajoMedico_idx" ON "Tratamiento"("legajoMedico");

-- AddForeignKey
ALTER TABLE "ObraSocial" ADD CONSTRAINT "ObraSocial_dniPaciente_fkey" FOREIGN KEY ("dniPaciente") REFERENCES "Paciente"("dni") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoriaClinica" ADD CONSTRAINT "HistoriaClinica_dniPaciente_fkey" FOREIGN KEY ("dniPaciente") REFERENCES "Paciente"("dni") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_numeroExpediente_fkey" FOREIGN KEY ("numeroExpediente") REFERENCES "HistoriaClinica"("expediente") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tratamiento" ADD CONSTRAINT "Tratamiento_numeroExpediente_fkey" FOREIGN KEY ("numeroExpediente") REFERENCES "HistoriaClinica"("expediente") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Antecedente" ADD CONSTRAINT "Antecedente_numeroExpediente_fkey" FOREIGN KEY ("numeroExpediente") REFERENCES "HistoriaClinica"("expediente") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documento" ADD CONSTRAINT "Documento_numeroExpediente_fkey" FOREIGN KEY ("numeroExpediente") REFERENCES "HistoriaClinica"("expediente") ON DELETE CASCADE ON UPDATE CASCADE;
