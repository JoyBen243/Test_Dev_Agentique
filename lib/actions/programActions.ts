"use server"
import { prisma } from "@/lib/prisma"

export interface ProgramDto {
  id: string
  title: string
  startTime: string | Date
  endTime: string | Date
  location: string | null
  description: string | null
  priority: string
  status: string
  originalId: string | null
  createdAt?: string | Date
  updatedAt?: string | Date
}

// Récupérer tous les programmes depuis SQLite
export async function fetchProgramsAction(): Promise<ProgramDto[]> {
  try {
    const records = await prisma.program.findMany({
      orderBy: { startTime: 'asc' },
    })

    return records.map((r: any) => ({
      id: r.id,
      title: r.title,
      startTime: r.startTime.toISOString(),
      endTime: r.endTime.toISOString(),
      location: r.location || null,
      description: r.description || null,
      priority: r.priority,
      status: r.status,
      originalId: r.originalId || null,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Erreur fetchProgramsAction SQLite:", error)
    return []
  }
}

// Créer ou insérer un programme dans SQLite
export async function createProgramAction(data: ProgramDto) {
  try {
    const created = await prisma.program.upsert({
      where: { id: data.id },
      update: {
        title: data.title,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        location: data.location || null,
        description: data.description || null,
        priority: data.priority,
        status: data.status,
        originalId: data.originalId || null,
      },
      create: {
        id: data.id,
        title: data.title,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        location: data.location || null,
        description: data.description || null,
        priority: data.priority,
        status: data.status,
        originalId: data.originalId || null,
      },
    })
    return { success: true, program: created }
  } catch (error) {
    console.error("Erreur createProgramAction SQLite:", error)
    return { success: false, error }
  }
}

// Mettre à jour un programme dans SQLite
export async function updateProgramAction(id: string, updates: Partial<ProgramDto>) {
  try {
    const dataToUpdate: any = {}
    if (updates.title !== undefined) dataToUpdate.title = updates.title
    if (updates.startTime !== undefined) dataToUpdate.startTime = new Date(updates.startTime)
    if (updates.endTime !== undefined) dataToUpdate.endTime = new Date(updates.endTime)
    if (updates.location !== undefined) dataToUpdate.location = updates.location
    if (updates.description !== undefined) dataToUpdate.description = updates.description
    if (updates.priority !== undefined) dataToUpdate.priority = updates.priority
    if (updates.status !== undefined) dataToUpdate.status = updates.status
    if (updates.originalId !== undefined) dataToUpdate.originalId = updates.originalId

    const updated = await prisma.program.update({
      where: { id },
      data: dataToUpdate,
    })
    return { success: true, program: updated }
  } catch (error) {
    console.error("Erreur updateProgramAction SQLite:", error)
    return { success: false, error }
  }
}

// Supprimer un programme de SQLite
export async function deleteProgramAction(id: string) {
  try {
    await prisma.program.delete({
      where: { id },
    })
    return { success: true }
  } catch (error) {
    console.error("Erreur deleteProgramAction SQLite:", error)
    return { success: false, error }
  }
}

// Synchroniser un lot de programmes
export async function syncAllProgramsAction(programs: ProgramDto[]) {
  try {
    for (const p of programs) {
      await prisma.program.upsert({
        where: { id: p.id },
        update: {
          title: p.title,
          startTime: new Date(p.startTime),
          endTime: new Date(p.endTime),
          location: p.location || null,
          description: p.description || null,
          priority: p.priority,
          status: p.status,
          originalId: p.originalId || null,
        },
        create: {
          id: p.id,
          title: p.title,
          startTime: new Date(p.startTime),
          endTime: new Date(p.endTime),
          location: p.location || null,
          description: p.description || null,
          priority: p.priority,
          status: p.status,
          originalId: p.originalId || null,
        },
      })
    }
    return { success: true }
  } catch (error) {
    console.error("Erreur syncAllProgramsAction SQLite:", error)
    return { success: false, error }
  }
}