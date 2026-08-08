/*
  Warnings:

  - You are about to drop the column `motivo` on the `Consulta` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[numeroTurno]` on the table `Consulta` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO');

-- CreateEnum
CREATE TYPE "EstadoTurno" AS ENUM ('PENDIENTE', 'CONFIRMADO', 'ATENDIDO', 'CANCELADO', 'AUSENTE');

-- AlterTable
ALTER TABLE "Consulta" DROP COLUMN "motivo",
ADD COLUMN     "numeroTurno" INTEGER;

-- CreateTable
CREATE TABLE "HorarioMedico" (
    "id" SERIAL NOT NULL,
    "diaSemana" "DiaSemana" NOT NULL,
    "horaInicio" TIME(0) NOT NULL,
    "horaFin" TIME(0) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "legajoMedico" INTEGER NOT NULL,

    CONSTRAINT "HorarioMedico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloqueoAgendaMedico" (
    "id" SERIAL NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "motivo" TEXT,
    "legajoMedico" INTEGER NOT NULL,

    CONSTRAINT "BloqueoAgendaMedico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Turno" (
    "numeroTurno" SERIAL NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoTurno" NOT NULL DEFAULT 'PENDIENTE',
    "especialidad" "Especialidad" NOT NULL,
    "motivo" TEXT,
    "observaciones" TEXT,
    "dniPaciente" INTEGER NOT NULL,
    "legajoMedico" INTEGER NOT NULL,

    CONSTRAINT "Turno_pkey" PRIMARY KEY ("numeroTurno")
);

-- CreateIndex
CREATE INDEX "HorarioMedico_legajoMedico_diaSemana_idx" ON "HorarioMedico"("legajoMedico", "diaSemana");

-- CreateIndex
CREATE UNIQUE INDEX "HorarioMedico_legajoMedico_diaSemana_horaInicio_horaFin_key" ON "HorarioMedico"("legajoMedico", "diaSemana", "horaInicio", "horaFin");

-- CreateIndex
CREATE INDEX "BloqueoAgendaMedico_legajoMedico_fechaInicio_fechaFin_idx" ON "BloqueoAgendaMedico"("legajoMedico", "fechaInicio", "fechaFin");

-- CreateIndex
CREATE INDEX "Turno_legajoMedico_fechaInicio_idx" ON "Turno"("legajoMedico", "fechaInicio");

-- CreateIndex
CREATE INDEX "Turno_legajoMedico_fechaFin_idx" ON "Turno"("legajoMedico", "fechaFin");

-- CreateIndex
CREATE INDEX "Turno_dniPaciente_fechaInicio_idx" ON "Turno"("dniPaciente", "fechaInicio");

-- CreateIndex
CREATE INDEX "Turno_especialidad_fechaInicio_idx" ON "Turno"("especialidad", "fechaInicio");

-- CreateIndex
CREATE INDEX "Turno_estado_idx" ON "Turno"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "Consulta_numeroTurno_key" ON "Consulta"("numeroTurno");

-- CreateIndex
CREATE INDEX "MedicoEspecialidad_especialidad_idx" ON "MedicoEspecialidad"("especialidad");

-- AddForeignKey
ALTER TABLE "HorarioMedico" ADD CONSTRAINT "HorarioMedico_legajoMedico_fkey" FOREIGN KEY ("legajoMedico") REFERENCES "Medico"("legajo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloqueoAgendaMedico" ADD CONSTRAINT "BloqueoAgendaMedico_legajoMedico_fkey" FOREIGN KEY ("legajoMedico") REFERENCES "Medico"("legajo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_dniPaciente_fkey" FOREIGN KEY ("dniPaciente") REFERENCES "Paciente"("dni") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_legajoMedico_fkey" FOREIGN KEY ("legajoMedico") REFERENCES "Medico"("legajo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_numeroTurno_fkey" FOREIGN KEY ("numeroTurno") REFERENCES "Turno"("numeroTurno") ON DELETE SET NULL ON UPDATE CASCADE;
