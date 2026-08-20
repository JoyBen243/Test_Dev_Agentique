"use client"
import { useEffect } from "react"
import { useProgramStore } from "@/store/useProgramStore"
import { useSettingsStore } from "@/store/useSettingsStore"
import { notificationService } from "@/lib/notifications"
import { App as CapApp } from "@capacitor/app"
import { Capacitor } from "@capacitor/core"

export function AppInitializer() {
  const programs = useProgramStore((state) => state.programs)
  const refreshStatuses = useProgramStore((state) => state.refreshStatuses)
  const settings = useSettingsStore((state) => state.settings)

  // 1. Initialiser le rafraîchissement des statuts de tâches toutes les 30s
  useEffect(() => {
    refreshStatuses()
    const interval = setInterval(() => {
      refreshStatuses()
    }, 30000)

    return () => clearInterval(interval)
  }, [refreshStatuses])

  // 2. Programmer / Synchroniser les notifications natives (Capacitor Android)
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      notificationService.scheduleDailyReminders(settings, programs)
      notificationService.scheduleTaskNotifications(programs, settings)
    }
  }, [settings, programs])

  // 3. Gestionnaire natif Capacitor (retour au premier plan & bouton retour Android)
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    // Quand l'app revient au premier plan
    const appStateListener = CapApp.addListener("appStateChange", ({ isActive }) => {
      if (isActive) {
        refreshStatuses()
      }
    })

    // Bouton retour natif Android
    const backButtonListener = CapApp.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back()
      } else {
        CapApp.exitApp()
      }
    })

    return () => {
      appStateListener.then((l) => l.remove()).catch(() => {})
      backButtonListener.then((l) => l.remove()).catch(() => {})
    }
  }, [refreshStatuses])

  return null
}
