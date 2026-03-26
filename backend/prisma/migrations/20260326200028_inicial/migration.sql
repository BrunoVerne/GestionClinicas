-- CreateEnum
CREATE TYPE "Especialidad" AS ENUM ('CLINICA_MEDICA', 'CARDIOLOGIA', 'DERMATOLOGIA', 'NEUROLOGIA', 'PEDIATRIA', 'GINECOLOGIA', 'TRAUMATOLOGIA', 'OFTALMOLOGIA', 'PSIQUIATRIA', 'OTRA');

-- CreateEnum
CREATE TYPE "TipoAntecedente" AS ENUM ('ALERGIAS', 'ENFERMEDAD_CRONICA', 'CIRUGIA', 'MEDICACION', 'FAMILIAR', 'OTRO');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('ESTUDIO_LABORATORIO', 'IMAGEN_DIAGNOSTICA', 'RECETA', 'INFORME_MEDICO', 'CONSENTIMIENTO', 'OTRO');

-- CreateTable
CREATE TABLE "Medico" (
    "legajo" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "especialidad" "Especialidad" NOT NULL,

    CONSTRAINT "Medico_pkey" PRIMARY KEY ("legajo")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "dni" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "altura" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("dni")
);

-- CreateTable
CREATE TABLE "HistoriaClinica" (
    "expediente" SERIAL NOT NULL,
    "dniPaciente" INTEGER NOT NULL,

    CONSTRAINT "HistoriaClinica_pkey" PRIMARY KEY ("expediente")
);

-- CreateTable
CREATE TABLE "Consulta" (
    "numeroConsulta" SERIAL NOT NULL,
    "numeroExpediente" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "legajoMedico" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL,
    "diagnostico" TEXT NOT NULL,
    "observaciones" TEXT,

    CONSTRAINT "Consulta_pkey" PRIMARY KEY ("numeroConsulta")
);

-- CreateTable
CREATE TABLE "Tratamiento" (
    "numeroTratamiento" SERIAL NOT NULL,
    "numeroExpediente" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "legajoMedico" INTEGER NOT NULL,

    CONSTRAINT "Tratamiento_pkey" PRIMARY KEY ("numeroTratamiento")
);

-- CreateTable
CREATE TABLE "Antecedente" (
    "id" SERIAL NOT NULL,
    "numeroExpediente" INTEGER NOT NULL,
    "tipo" "TipoAntecedente" NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Antecedente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documento" (
    "numeroDocumento" SERIAL NOT NULL,
    "numeroExpediente" INTEGER NOT NULL,
    "tipo" "TipoDocumento" NOT NULL,
    "archivo" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Documento_pkey" PRIMARY KEY ("numeroDocumento")
);

-- CreateIndex
CREATE UNIQUE INDEX "HistoriaClinica_dniPaciente_key" ON "HistoriaClinica"("dniPaciente");

-- AddForeignKey
ALTER TABLE "HistoriaClinica" ADD CONSTRAINT "HistoriaClinica_dniPaciente_fkey" FOREIGN KEY ("dniPaciente") REFERENCES "Paciente"("dni") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_numeroExpediente_fkey" FOREIGN KEY ("numeroExpediente") REFERENCES "HistoriaClinica"("expediente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_legajoMedico_fkey" FOREIGN KEY ("legajoMedico") REFERENCES "Medico"("legajo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tratamiento" ADD CONSTRAINT "Tratamiento_numeroExpediente_fkey" FOREIGN KEY ("numeroExpediente") REFERENCES "HistoriaClinica"("expediente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tratamiento" ADD CONSTRAINT "Tratamiento_legajoMedico_fkey" FOREIGN KEY ("legajoMedico") REFERENCES "Medico"("legajo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Antecedente" ADD CONSTRAINT "Antecedente_numeroExpediente_fkey" FOREIGN KEY ("numeroExpediente") REFERENCES "HistoriaClinica"("expediente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documento" ADD CONSTRAINT "Documento_numeroExpediente_fkey" FOREIGN KEY ("numeroExpediente") REFERENCES "HistoriaClinica"("expediente") ON DELETE RESTRICT ON UPDATE CASCADE;
