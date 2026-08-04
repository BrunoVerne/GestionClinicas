/*
  Warnings:

  - You are about to drop the column `especialidad` on the `Medico` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[matricula]` on the table `Medico` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `matricula` to the `Medico` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Especialidad" AS ENUM ('CARDIOLOGIA', 'CLINICA_MEDICA', 'DERMATOLOGIA', 'GINECOLOGIA', 'NEUROLOGIA', 'OFTALMOLOGIA', 'OTRA', 'PEDIATRIA', 'PSIQUIATRIA', 'TRAUMATOLOGIA');

-- AlterTable
ALTER TABLE "Medico" DROP COLUMN "especialidad",
ADD COLUMN     "domicilio" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "fechaDeNacimiento" TIMESTAMP(3),
ADD COLUMN     "genero" "Genero",
ADD COLUMN     "matricula" TEXT NOT NULL,
ADD COLUMN     "rol" "RolUsuario" NOT NULL DEFAULT 'MEDICO',
ADD COLUMN     "telefono" TEXT,
ADD COLUMN     "telefonoDeEmergencia" TEXT;

-- CreateTable
CREATE TABLE "MedicoEspecialidad" (
    "id" SERIAL NOT NULL,
    "especialidad" "Especialidad" NOT NULL,
    "legajoMedico" INTEGER NOT NULL,

    CONSTRAINT "MedicoEspecialidad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MedicoEspecialidad_legajoMedico_idx" ON "MedicoEspecialidad"("legajoMedico");

-- CreateIndex
CREATE UNIQUE INDEX "MedicoEspecialidad_legajoMedico_especialidad_key" ON "MedicoEspecialidad"("legajoMedico", "especialidad");

-- CreateIndex
CREATE UNIQUE INDEX "Medico_matricula_key" ON "Medico"("matricula");

-- AddForeignKey
ALTER TABLE "MedicoEspecialidad" ADD CONSTRAINT "MedicoEspecialidad_legajoMedico_fkey" FOREIGN KEY ("legajoMedico") REFERENCES "Medico"("legajo") ON DELETE CASCADE ON UPDATE CASCADE;
