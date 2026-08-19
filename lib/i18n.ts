// Système d'Internationalisation (i18n) 100% hors-ligne pour My_MudaPlan (FR, EN, SW)

export type SupportedLanguage = 'FR' | 'EN' | 'SW'

export const translations = {
  FR: {
    // Navigation
    nav_dashboard: "Tableau de bord",
    nav_programmes: "Programmes",
    nav_settings: "Paramètres",

    // General & Common
    today: "Aujourd'hui",
    yesterday: "Hier",
    tomorrow: "Demain",
    add: "Ajouter",
    edit: "Modifier",
    edit_program: "Modifier le programme",
    new_program: "Nouveau programme",
    cancel: "Annuler",
    save: "Enregistrer les modifications",
    delete: "Supprimer",
    confirm_delete: "Voulez-vous vraiment supprimer ce programme ?",
    confirm_abandon: "Voulez-vous vraiment marquer cette tâche comme abandonnée ?",
    search_placeholder: "Rechercher une tâche, lieu...",
    all: "Tous",
    all_f: "Toutes",
    loading: "Chargement...",

    // Statuts (Formaté avec 1ère lettre en majuscule, reste en minuscule)
    status_EN_ATTENTE: "En attente",
    status_EN_COURS: "En cours",
    status_EN_OBSERVATION: "En observation",
    status_FAIT: "Fait",
    status_REPORTE: "Reporté",
    status_ABANDONNE: "Abandonné",

    // Priorités
    priority_BASSE: "Basse",
    priority_MOYENNE: "Moyenne",
    priority_HAUTE: "Haute",
    priority_high_badge: "🔥 Haute",

    // Actions sur tâches
    action_mark_done: "Fait",
    action_postpone: "Reporter",
    action_abandon: "Abandonner",
    action_confirm_postpone: "Confirmer le report",
    postpone_title: "Reporter la tâche",
    new_date: "Nouvelle date",
    start_time: "Heure de début",
    end_time: "Heure de fin",
    location: "Lieu / Emplacement",
    description: "Description / Notes",

    // Dashboard
    no_programs_today: "Il n'y a pas de programme prévu pour aujourd'hui, veuillez en ajouter si besoin.",
    no_programs_date: "Aucun programme prévu pour cette date.",
    no_programs_title: "Aucun programme",
    planned_tasks: "Tâches prévues",

    // Page Programmes
    programs_title: "Tous les programmes",
    view_grid: "Grille",
    view_list: "Liste",
    filter_status: "Statut",
    filter_priority: "Priorité",
    total_tasks: "tâche(s) au total",
    no_matching_programs: "Aucun programme ne correspond aux filtres",

    // Settings
    settings_title: "Paramètres",
    settings_subtitle: "Personnalisez votre expérience My_MudaPlan",
    identity_title: "Identité utilisateur",
    civility_title: "Titre de civilité",
    tone_title: "Ton d'interaction",
    tone_masculine: "Masculin",
    tone_feminine: "Féminin",
    language_title: "Langue",
    appearance_title: "Apparence & vue",
    theme_visual: "Thème visuel",
    theme_mode: "Mode clair ou sombre",
    default_view: "Vue par défaut",
    audio_title: "Notifications & horaires",
    sound_alerts: "Alertes sonores",
    sound_alerts_desc: "Au début & fin des plages horaires",
    morning_reminder: "Rappel du matin",
    morning_reminder_desc: "Notification avec résumé des tâches",
    evening_summary: "Résumé du soir",
    evening_summary_desc: "Bilan des tâches de la journée",
    finish_onboarding: "Terminer & accéder au tableau de bord",
    onboarding_step_3: "Étape 3 / 3 • Configuration obligatoire",
    onboarding_profile_desc: "Votre premier programme a été planifié ! Validez votre identité et vos horaires de rappels pour accéder au tableau de bord.",

    // Onboarding
    onboarding_step_2: "Étape 2 / 3",
    onboarding_first_launch: "Premier lancement",
    onboarding_add_first_title: "Ajouter un programme",
    onboarding_add_first_highlight: "pour commencer",
    onboarding_add_first_desc: "Créez votre première tâche. Dès sa planification, nous configurerons votre profil et vos alertes.",
    onboarding_mandatory_note: "Une configuration obligatoire suivra automatiquement.",
    next: "Suivant",
    start: "Commencer",
    skip: "Passer",

    // Slides
    slide1_badge: "Vision My_MudaPlan",
    slide1_title: "Maîtrisez votre Temps",
    slide1_highlight: "en toute liberté.",
    slide1_desc: "Une application de gestion d'agenda 100% hors-ligne conçue pour votre discipline personnelle sans faille.",
    
    slide2_badge: "Système de Statuts Strict",
    slide2_title: "Suivi Automatisé",
    slide2_highlight: "en temps réel.",
    slide2_desc: "Vos tâches basculent automatiquement entre En attente, En cours et En observation selon l'heure exacte.",

    slide3_badge: "Immersion & Discipline",
    slide3_title: "Signalisation Sonore",
    slide3_highlight: "& Bilan Quotidien.",
    slide3_desc: "Alertes sonores au début/fin de chaque tâche, résumé matinal des programmes à réaliser et bilan du soir pour ce qui a été fait, abandonné ou reporté.",
  },

  EN: {
    // Navigation
    nav_dashboard: "Dashboard",
    nav_programmes: "Schedules",
    nav_settings: "Settings",

    // General & Common
    today: "Today",
    yesterday: "Yesterday",
    tomorrow: "Tomorrow",
    add: "Add",
    edit: "Edit",
    edit_program: "Edit schedule",
    new_program: "New schedule",
    cancel: "Cancel",
    save: "Save changes",
    delete: "Delete",
    confirm_delete: "Are you sure you want to delete this schedule?",
    confirm_abandon: "Are you sure you want to mark this task as cancelled?",
    search_placeholder: "Search task, location...",
    all: "All",
    all_f: "All",
    loading: "Loading...",

    // Statuts
    status_EN_ATTENTE: "Pending",
    status_EN_COURS: "In progress",
    status_EN_OBSERVATION: "Under review",
    status_FAIT: "Completed",
    status_REPORTE: "Postponed",
    status_ABANDONNE: "Cancelled",

    // Priorités
    priority_BASSE: "Low",
    priority_MOYENNE: "Medium",
    priority_HAUTE: "High",
    priority_high_badge: "🔥 High",

    // Actions sur tâches
    action_mark_done: "Done",
    action_postpone: "Postpone",
    action_abandon: "Cancel",
    action_confirm_postpone: "Confirm postponement",
    postpone_title: "Postpone task",
    new_date: "New date",
    start_time: "Start time",
    end_time: "End time",
    location: "Location",
    description: "Description / Notes",

    // Dashboard
    no_programs_today: "There are no schedules planned for today. Please add one if needed.",
    no_programs_date: "No schedules planned for this date.",
    no_programs_title: "No schedules",
    planned_tasks: "Planned tasks",

    // Page Programmes
    programs_title: "All schedules",
    view_grid: "Grid",
    view_list: "List",
    filter_status: "Status",
    filter_priority: "Priority",
    total_tasks: "total task(s)",
    no_matching_programs: "No schedules match your filters",

    // Settings
    settings_title: "Settings",
    settings_subtitle: "Customize your My_MudaPlan experience",
    identity_title: "User identity",
    civility_title: "Title",
    tone_title: "Interaction tone",
    tone_masculine: "Masculine",
    tone_feminine: "Feminine",
    language_title: "Language",
    appearance_title: "Appearance & view",
    theme_visual: "Visual theme",
    theme_mode: "Light or dark mode",
    default_view: "Default view",
    audio_title: "Notifications & schedules",
    sound_alerts: "Sound alerts",
    sound_alerts_desc: "At the start & end of time slots",
    morning_reminder: "Morning reminder",
    morning_reminder_desc: "Notification with daily summary",
    evening_summary: "Evening summary",
    evening_summary_desc: "Review of daily completed/cancelled tasks",
    finish_onboarding: "Finish & go to dashboard",
    onboarding_step_3: "Step 3 / 3 • Mandatory setup",
    onboarding_profile_desc: "Your first schedule has been set! Please confirm your profile and reminder times to access the dashboard.",

    // Onboarding
    onboarding_step_2: "Step 2 / 3",
    onboarding_first_launch: "First launch",
    onboarding_add_first_title: "Add a schedule",
    onboarding_add_first_highlight: "to get started",
    onboarding_add_first_desc: "Create your first task. As soon as it's scheduled, we'll configure your profile and alerts.",
    onboarding_mandatory_note: "A mandatory setup will follow automatically.",
    next: "Next",
    start: "Get started",
    skip: "Skip",

    // Slides
    slide1_badge: "My_MudaPlan vision",
    slide1_title: "Master Your Time",
    slide1_highlight: "with total freedom.",
    slide1_desc: "A 100% offline schedule management app built for flawless personal discipline.",
    
    slide2_badge: "Strict status system",
    slide2_title: "Automated Tracking",
    slide2_highlight: "in real time.",
    slide2_desc: "Your tasks switch automatically between Pending, In progress, and Under review based on exact time.",

    slide3_badge: "Immersion & discipline",
    slide3_title: "Audio Alerts",
    slide3_highlight: "& Daily review.",
    slide3_desc: "Sound alerts at start/end of slots, morning reminder of tasks, and evening review of completed, cancelled, or postponed tasks.",
  },

  SW: {
    // Navigation (Swahili naturel d'Afrique de l'Est)
    nav_dashboard: "Dashboard",
    nav_programmes: "Ratiba",
    nav_settings: "Mipangilio",

    // General & Common
    today: "Leo",
    yesterday: "Jana",
    tomorrow: "Kesho",
    add: "Ongeza",
    edit: "Badilisha",
    edit_program: "Badilisha ratiba",
    new_program: "Mpango mpya",
    cancel: "Ghairi",
    save: "Hifadhi mabadiliko",
    delete: "Futa",
    confirm_delete: "Je, una uhakika unataka kufuta mpango huu?",
    confirm_abandon: "Je, una uhakika unataka kughairi kazi hii?",
    search_placeholder: "Tafuta kazi, mahali...",
    all: "Yote",
    all_f: "Yote",
    loading: "Inapakia...",

    // Statuts
    status_EN_ATTENTE: "Inasubiri",
    status_EN_COURS: "Inaendelea",
    status_EN_OBSERVATION: "Inachunguzwa",
    status_FAIT: "Imekamilika",
    status_REPORTE: "Imeahirishwa",
    status_ABANDONNE: "Imeghairiwa",

    // Priorités
    priority_BASSE: "Chini",
    priority_MOYENNE: "Kati",
    priority_HAUTE: "Juu",
    priority_high_badge: "🔥 Juu",

    // Actions sur tâches
    action_mark_done: "Imekamilika",
    action_postpone: "Ahirisha",
    action_abandon: "Ghairi",
    action_confirm_postpone: "Thibitisha kuahirisha",
    postpone_title: "Ahirisha kazi",
    new_date: "Tarehe mpya",
    start_time: "Muda wa anza",
    end_time: "Muda wa mwisho",
    location: "Mahali",
    description: "Maelezo / Notes",

    // Dashboard
    no_programs_today: "Hakuna ratiba iliyopangwa leo. Tafadhali ongeza ukihitaji.",
    no_programs_date: "Hakuna ratiba iliyopangwa kwa tarehe hii.",
    no_programs_title: "Hakuna ratiba",
    planned_tasks: "Ratiba zilizopangwa",

    // Page Programmes
    programs_title: "Ratiba zote",
    view_grid: "Gridi",
    view_list: "Orodha",
    filter_status: "Hali",
    filter_priority: "Umuhimu",
    total_tasks: "ratiba kwa jumla",
    no_matching_programs: "Hakuna ratiba inayolingana na vichujio vyako",

    // Settings
    settings_title: "Mipangilio",
    settings_subtitle: "Badilisha uzoefu wako wa My_MudaPlan",
    identity_title: "Utambulisho wa mtumiaji",
    civility_title: "Kichwa cha heshima",
    tone_title: "Aina ya mwingiliano",
    tone_masculine: "Kiume",
    tone_feminine: "Kike",
    language_title: "Lugha",
    appearance_title: "Muonekano & mtazamo",
    theme_visual: "Mandhari ya picha",
    theme_mode: "Nuru au giza",
    default_view: "Mtazamo wa kawaida",
    audio_title: "Arifa & muda",
    sound_alerts: "Arifa za sauti",
    sound_alerts_desc: "Mwanzo & mwisho wa nyakati zilizopangwa",
    morning_reminder: "Kikumbusho cha asubuhi",
    morning_reminder_desc: "Arifa yenye muhtasari wa ratiba",
    evening_summary: "Muhtasari wa jioni",
    evening_summary_desc: "Tathmini ya ratiba za siku",
    finish_onboarding: "Kamilisha & ingia kwenye dashboard",
    onboarding_step_3: "Hatua 3 / 3 • Mipangilio ya lazima",
    onboarding_profile_desc: "Mpango wako wa kwanza umepangwa! Thibitisha mipangilio yako ili uingie kwenye dashboard.",

    // Onboarding
    onboarding_step_2: "Hatua 2 / 3",
    onboarding_first_launch: "Kuanza kwa kwanza",
    onboarding_add_first_title: "Ongeza mpango",
    onboarding_add_first_highlight: "ili kuanza",
    onboarding_add_first_desc: "Tengeneza kazi yako ya kwanza. Mara inapopangwa, tutapanga profile yako na arifa.",
    onboarding_mandatory_note: "Mipangilio ya lazima ifuatazo moja kwa moja.",
    next: "Inayofuata",
    start: "Anza",
    skip: "Ruka",

    // Slides
    slide1_badge: "Maono ya My_MudaPlan",
    slide1_title: "Miliki Muda Wako",
    slide1_highlight: "kwa uhuru kamili.",
    slide1_desc: "Programu ya kupanga muda 100% bila mtandao iliyotengenezwa kwa nidhamu yako binafsi.",
    
    slide2_badge: "Mfumo thabiti wa hali",
    slide2_title: "Ufuatiliaji wa Moja kwa Moja",
    slide2_highlight: "kwa wakati halisi.",
    slide2_desc: "Ratiba zako zinabadilika kiotomatiki kati ya Inasubiri, Inaendelea na Inachunguzwa kulingana na muda halisi.",

    slide3_badge: "Nidhamu & sauti",
    slide3_title: "Arifa za Sauti",
    slide3_highlight: "& Tathmini ya Siku.",
    slide3_desc: "Sauti mwanzoni/mwishoni mwa kazi, muhtasari wa asubuhi na tathmini ya jioni kwa ratiba zote.",
  }
}

// Jours et Mois en Swahili pour un formatage parfait des dates
const swahiliDays = ['Jumapili', 'Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi']
const swahiliMonths = ['Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni', 'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba']

// Fonction de formatage des dates multilingue
export function formatLanguageDate(date: Date, lang: string = 'FR'): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  if (lang === 'SW') {
    const dayName = swahiliDays[d.getDay()]
    const dayNum = d.getDate()
    const monthName = swahiliMonths[d.getMonth()]
    const year = d.getFullYear()
    return `${dayName} ${dayNum} ${monthName} ${year}`
  }

  // Pour le français ou l'anglais
  const localeStr = lang === 'EN' ? 'en-US' : 'fr-FR'
  return d.toLocaleDateString(localeStr, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Fonction de traduction
export function useTranslation(lang: string = 'FR') {
  const selectedLang = (['FR', 'EN', 'SW'].includes(lang) ? lang : 'FR') as SupportedLanguage
  const dict = translations[selectedLang] || translations.FR

  return (key: keyof typeof translations.FR): string => {
    return dict[key] || translations.FR[key] || key
  }
}

// Helper pour garantir qu'un statut commence toujours par 1 majuscule puis des minuscules
export function formatStatusTitleCase(statusStr: string): string {
  if (!statusStr) return ''
  return statusStr.charAt(0).toUpperCase() + statusStr.slice(1).toLowerCase()
}
