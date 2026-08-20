import { LocalNotifications } from '@capacitor/local-notifications'
import { Capacitor } from '@capacitor/core'
import { Program } from '@/store/useProgramStore'
import { Settings } from '@/store/useSettingsStore'

class NotificationService {
  private isInitialized = false

  async init() {
    if (!Capacitor.isNativePlatform() || this.isInitialized) return

    try {
      // 1. Demande de permissions
      const permission = await LocalNotifications.checkPermissions()
      if (permission.display !== 'granted') {
        await LocalNotifications.requestPermissions()
      }

      // 2. Création des canaux Android
      // Canal Alarme Système (Matin / Soir) avec sonnerie d'alarme par défaut du téléphone
      await LocalNotifications.createChannel({
        id: 'mudaplan-alarm-channel',
        name: 'My_MudaPlan Alarmes & Résumés',
        description: 'Briefings du matin et bilans du soir avec sonnerie système',
        importance: 5, // Importance MAX (sonne et réveille)
        visibility: 1,
        sound: 'default', // Sonnerie configurée sur le téléphone
        vibration: true,
        lights: true,
        lightColor: '#4F46E5',
      })

      // Canal Suivi des Tâches
      await LocalNotifications.createChannel({
        id: 'mudaplan-task-channel',
        name: 'My_MudaPlan Suivi des Tâches',
        description: 'Alertes pour le début et la fin des plages de travail',
        importance: 4,
        visibility: 1,
        vibration: true,
        lights: true,
      })

      this.isInitialized = true
    } catch (err) {
      console.warn('Erreur initialisation LocalNotifications:', err)
    }
  }

  // Programmer le briefing du matin et le bilan du soir selon les réglages
  async scheduleDailyReminders(settings: Settings, programs: Program[]) {
    if (!Capacitor.isNativePlatform()) return

    try {
      await this.init()

      // Annuler les anciennes notifications périodiques (IDs réservés 1000 pour matin, 1001 pour soir)
      await LocalNotifications.cancel({
        notifications: [{ id: 1000 }, { id: 1001 }],
      }).catch(() => {})

      const [morningHour, morningMin] = (settings.morningReminderTime || '05:15').split(':').map(Number)
      const [eveningHour, eveningMin] = (settings.eveningSummaryTime || '19:30').split(':').map(Number)

      const titleCivility = settings.title ? `${settings.title}. ` : ''

      // ☀️ Notification du Matin
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1000,
            title: `☀️ Briefing du Matin - My_MudaPlan`,
            body: `Bonjour ${titleCivility}! Votre programme du jour est prêt. Ouvrez l'application pour consulter vos priorités.`,
            schedule: {
              on: {
                hour: morningHour,
                minute: morningMin,
              },
              allowWhileIdle: true,
            },
            channelId: 'mudaplan-alarm-channel',
            smallIcon: 'ic_stat_icon',
            iconColor: '#4F46E5',
          },
          // 🌙 Bilan du Soir
          {
            id: 1001,
            title: `🌙 Bilan du Soir - My_MudaPlan`,
            body: `Bonsoir ${titleCivility}! C'est l'heure de clôturer vos tâches et de préparer demain.`,
            schedule: {
              on: {
                hour: eveningHour,
                minute: eveningMin,
              },
              allowWhileIdle: true,
            },
            channelId: 'mudaplan-alarm-channel',
            smallIcon: 'ic_stat_icon',
            iconColor: '#4F46E5',
          },
        ],
      })
    } catch (err) {
      console.warn('Erreur scheduleDailyReminders:', err)
    }
  }

  // Programmer les alertes de début de chaque tâche
  async scheduleTaskNotifications(programs: Program[], settings: Settings) {
    if (!Capacitor.isNativePlatform() || !settings.audioEnabled) return

    try {
      await this.init()

      const now = new Date()
      const upcomingPrograms = programs.filter(
        (p) => p.status !== 'FAIT' && p.status !== 'ABANDONNE' && new Date(p.startTime) > now
      )

      // Mapper les 30 prochaines tâches
      const notificationsToSchedule = upcomingPrograms.slice(0, 30).map((prog, idx) => {
        const notifId = 2000 + idx
        return {
          id: notifId,
          title: `🔔 Début de tâche : ${prog.title}`,
          body: `Votre plage horaire commence maintenant. Priorité : ${prog.priority}`,
          schedule: {
            at: new Date(prog.startTime),
            allowWhileIdle: true,
          },
          channelId: 'mudaplan-task-channel',
          smallIcon: 'ic_stat_icon',
          iconColor: '#4F46E5',
        }
      })

      if (notificationsToSchedule.length > 0) {
        await LocalNotifications.schedule({
          notifications: notificationsToSchedule,
        })
      }
    } catch (err) {
      console.warn('Erreur scheduleTaskNotifications:', err)
    }
  }
}

export const notificationService = new NotificationService()
