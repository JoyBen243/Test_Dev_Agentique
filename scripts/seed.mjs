import { PrismaClient } from './lib/generated/prisma/client.js'

const prisma = new PrismaClient()

const mockPrograms = [
  // 17 Août 2026 (Lundi)
  {
    id: "prog-20260817-1",
    title: "Méditation & Réveil matinal",
    startTime: new Date("2026-08-17T06:00:00"),
    endTime: new Date("2026-08-17T07:00:00"),
    location: "Domicile",
    description: "Exercices de respiration et hydratation pour bien démarrer la semaine.",
    priority: "HAUTE",
    status: "FAIT",
  },
  {
    id: "prog-20260817-2",
    title: "Revue des objectifs hebdomadaires",
    startTime: new Date("2026-08-17T09:00:00"),
    endTime: new Date("2026-08-17T11:30:00"),
    location: "Bureau",
    description: "Alignement des priorités et planification détaillée des sprints.",
    priority: "MOYENNE",
    status: "FAIT",
  },
  {
    id: "prog-20260817-3",
    title: "Séance de sport & Cardio",
    startTime: new Date("2026-08-17T15:00:00"),
    endTime: new Date("2026-08-17T16:30:00"),
    location: "Salle de Gym",
    description: "Entraînement annulé suite à une réunion imprévue.",
    priority: "BASSE",
    status: "ABANDONNE",
  },
  {
    id: "prog-20260817-4",
    title: "Lecture du livre 'Atomic Habits'",
    startTime: new Date("2026-08-17T18:00:00"),
    endTime: new Date("2026-08-17T19:30:00"),
    location: "Salon",
    description: "Chapitres 3 et 4 sur les signaux d'habitude.",
    priority: "MOYENNE",
    status: "REPORTE",
  },

  // 18 Août 2026 (Mardi)
  {
    id: "prog-20260818-1",
    title: "Briefing d'équipe & Planification",
    startTime: new Date("2026-08-18T07:30:00"),
    endTime: new Date("2026-08-18T08:30:00"),
    location: "Salle de Réunion A",
    description: "Tour de table sur les blocages et les priorités du jour.",
    priority: "HAUTE",
    status: "FAIT",
  },
  {
    id: "prog-20260818-2",
    title: "Rendez-vous client stratégique",
    startTime: new Date("2026-08-18T11:00:00"),
    endTime: new Date("2026-08-18T12:30:00"),
    location: "Centre-ville",
    description: "Présentation des avancées et validation des jalons du contrat.",
    priority: "HAUTE",
    status: "FAIT",
  },
  {
    id: "prog-20260818-3",
    title: "Tri des emails et archivage",
    startTime: new Date("2026-08-18T14:30:00"),
    endTime: new Date("2026-08-18T16:00:00"),
    location: "Bureau",
    description: "Nettoyage de la boîte de réception (Inbox Zero).",
    priority: "BASSE",
    status: "REPORTE",
  },
  {
    id: "prog-20260818-4",
    title: "Formation en ligne TypeScript & Next.js",
    startTime: new Date("2026-08-18T17:00:00"),
    endTime: new Date("2026-08-18T18:30:00"),
    location: "Domicile",
    description: "Approfondissement des Server Actions et du Server Components lifecycle.",
    priority: "MOYENNE",
    status: "EN_OBSERVATION",
  },

  // 19 Août 2026 (Mercredi - Aujourd'hui)
  {
    id: "prog-20260819-1",
    title: "Séance de stretching & Yoga",
    startTime: new Date("2026-08-19T06:00:00"),
    endTime: new Date("2026-08-19T07:00:00"),
    location: "Chambre",
    description: "Échauffement musculaire et salutation au soleil.",
    priority: "MOYENNE",
    status: "FAIT",
  },
  {
    id: "prog-20260819-2",
    title: "Développement du module Offline SQLite",
    startTime: new Date("2026-08-19T09:30:00"),
    endTime: new Date("2026-08-19T11:00:00"),
    location: "Bureau",
    description: "Configuration du schéma Prisma et des Server Actions hybrides.",
    priority: "HAUTE",
    status: "FAIT",
  },
  {
    id: "prog-20260819-3",
    title: "Session de tests utilisateur mobile",
    startTime: new Date("2026-08-19T14:00:00"),
    endTime: new Date("2026-08-19T15:30:00"),
    location: "Espace Coworking",
    description: "Vérification de la réactivité sur mobile (viewport 100dvh).",
    priority: "HAUTE",
    status: "FAIT",
  },
  {
    id: "prog-20260819-4",
    title: "Bilan d'avancement du projet My_MudaPlan",
    startTime: new Date("2026-08-19T18:00:00"),
    endTime: new Date("2026-08-19T19:30:00"),
    location: "Bureau",
    description: "Revue complète des spécifications fonctionnelles et des statuts.",
    priority: "HAUTE",
    status: "EN_OBSERVATION",
  },
  {
    id: "prog-20260819-5",
    title: "Préparation de la journée du 20 Août",
    startTime: new Date("2026-08-19T21:00:00"),
    endTime: new Date("2026-08-19T22:30:00"),
    location: "Bureau personnel",
    description: "Anticipation des tâches du lendemain et validation de l'agenda.",
    priority: "MOYENNE",
    status: "EN_COURS",
  },

  // 20 Août 2026 (Jeudi - Demain)
  {
    id: "prog-20260820-1",
    title: "Footing matinal 5km",
    startTime: new Date("2026-08-20T06:30:00"),
    endTime: new Date("2026-08-20T07:30:00"),
    location: "Parc de la ville",
    description: "Course à pied d'endurance fondamentale.",
    priority: "MOYENNE",
    status: "EN_ATTENTE",
  },
  {
    id: "prog-20260820-2",
    title: "Atelier de conception UI/UX V2",
    startTime: new Date("2026-08-20T09:00:00"),
    endTime: new Date("2026-08-20T12:00:00"),
    location: "Salle de créativité",
    description: "Wireframing des bilans du soir et du support natif Capacitor.",
    priority: "HAUTE",
    status: "EN_ATTENTE",
  },
  {
    id: "prog-20260820-3",
    title: "Appel d'évaluation trimestrielle",
    startTime: new Date("2026-08-20T14:30:00"),
    endTime: new Date("2026-08-20T16:00:00"),
    location: "En ligne (Google Meet)",
    description: "Échange sur la roadmap produit et les métriques de satisfaction.",
    priority: "MOYENNE",
    status: "EN_ATTENTE",
  },
  {
    id: "prog-20260820-4",
    title: "Courses et ravitaillement",
    startTime: new Date("2026-08-20T18:00:00"),
    endTime: new Date("2026-08-20T19:00:00"),
    location: "Supermarché",
    description: "Achat de produits frais pour la fin de semaine.",
    priority: "BASSE",
    status: "EN_ATTENTE",
  },

  // 21 Août 2026 (Vendredi)
  {
    id: "prog-20260821-1",
    title: "Revue de code & Optimisation des performances",
    startTime: new Date("2026-08-21T08:00:00"),
    endTime: new Date("2026-08-21T09:30:00"),
    location: "Bureau",
    description: "Refactoring des requêtes SQLite et validation des bundles Next.js.",
    priority: "HAUTE",
    status: "EN_ATTENTE",
  },
  {
    id: "prog-20260821-2",
    title: "Réunion de clôture de sprint",
    startTime: new Date("2026-08-21T11:00:00"),
    endTime: new Date("2026-08-21T12:30:00"),
    location: "Salle B",
    description: "Démonstration des fonctionnalités livrées et bilan de vélocité.",
    priority: "HAUTE",
    status: "EN_ATTENTE",
  },
  {
    id: "prog-20260821-3",
    title: "Rétrospective hebdomadaire & Bilan personnel",
    startTime: new Date("2026-08-21T16:00:00"),
    endTime: new Date("2026-08-21T17:30:00"),
    location: "Domicile",
    description: "Synthèse des accomplissements, apprentissages et ajustements.",
    priority: "MOYENNE",
    status: "EN_ATTENTE",
  },
]

async function main() {
  console.log("🌱 Début du remplissage de la base SQLite...")
  
  await prisma.program.deleteMany({})

  for (const prog of mockPrograms) {
    await prisma.program.create({
      data: prog,
    })
    console.log("  ✓ Créé : [" + prog.status + "] " + prog.title)
  }

  await prisma.settings.upsert({
    where: { id: "default-settings" },
    update: {},
    create: {
      id: "default-settings",
      tone: "MASCULIN",
      title: "Mr",
      audioEnabled: true,
      language: "FR",
      theme: "CLAIR",
      viewType: "LISTE",
      morningReminderTime: "05:15",
      eveningSummaryTime: "19:30",
    }
  })

  console.log(`\n🎉 Succès ! ${mockPrograms.length} programmes insérés dans la base SQLite locale (dev.db).`)
}

main()
  .catch((e) => {
    console.error("❌ Erreur pendant le seed :", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })