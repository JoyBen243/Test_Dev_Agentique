"use server"
import { prisma } from "@/lib/prisma"

export interface SettingsDto {
  id?: string
  tone: string
  title: string
  audioEnabled: boolean
  beepSound: string
  language: string
  theme: string
  viewType: string
  morningReminderTime: string
  eveningSummaryTime: string
}

// Récupérer les paramètres depuis SQLite
export async function fetchSettingsAction(): Promise<SettingsDto | null> {
  try {
    let settings = await prisma.settings.findFirst()

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: "default-settings",
          tone: "MASCULIN",
          title: "Mr",
          audioEnabled: true,
          beepSound: "MODERNE",
          language: "FR",
          theme: "CLAIR",
          viewType: "LISTE",
          morningReminderTime: "05:15",
          eveningSummaryTime: "19:30",
        },
      })
    }

    return {
      id: settings.id,
      tone: settings.tone,
      title: settings.title,
      audioEnabled: settings.audioEnabled,
      beepSound: (settings as any).beepSound || "MODERNE",
      language: settings.language,
      theme: settings.theme,
      viewType: settings.viewType,
      morningReminderTime: settings.morningReminderTime,
      eveningSummaryTime: settings.eveningSummaryTime,
    }
  } catch (error) {
    console.error("Erreur fetchSettingsAction SQLite:", error)
    return null
  }
}

// Mettre à jour les paramètres dans SQLite
export async function updateSettingsAction(data: Partial<SettingsDto>) {
  try {
    const updated = await prisma.settings.upsert({
      where: { id: "default-settings" },
      update: data,
      create: {
        id: "default-settings",
        tone: data.tone || "MASCULIN",
        title: data.title || "Mr",
        audioEnabled: data.audioEnabled !== undefined ? data.audioEnabled : true,
        beepSound: data.beepSound || "MODERNE",
        language: data.language || "FR",
        theme: data.theme || "CLAIR",
        viewType: data.viewType || "LISTE",
        morningReminderTime: data.morningReminderTime || "05:15",
        eveningSummaryTime: data.eveningSummaryTime || "19:30",
      },
    })
    return { success: true, settings: updated }
  } catch (error) {
    console.error("Erreur updateSettingsAction SQLite:", error)
    return { success: false, error }
  }
}