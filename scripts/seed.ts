import { prisma } from "../lib/prisma"

// Modèles de programmes réalistes
const taskTemplates = [
  { title: "Méditation & Réveil matinal", startHour: 6, startMin: 0, durationMin: 60, location: "Domicile", priority: "HAUTE", description: "Exercices de respiration et hydratation pour bien démarrer la journée." },
  { title: "Séance de stretching & Yoga", startHour: 6, startMin: 30, durationMin: 45, location: "Chambre", priority: "MOYENNE", description: "Échauffement musculaire et salutation au soleil." },
  { title: "Footing matinal 5km", startHour: 6, startMin: 30, durationMin: 60, location: "Parc de la ville", priority: "MOYENNE", description: "Course d'endurance fondamentale." },
  { title: "Briefing d'équipe & Planification", startHour: 8, startMin: 30, durationMin: 60, location: "Salle de Réunion A", priority: "HAUTE", description: "Tour de table sur les priorités et points de blocage." },
  { title: "Revue des objectifs & Sprint", startHour: 9, startMin: 0, durationMin: 90, location: "Bureau", priority: "HAUTE", description: "Alignement des objectifs et répartition des charges." },
  { title: "Développement application My_MudaPlan", startHour: 10, startMin: 0, durationMin: 120, location: "Poste de travail", priority: "HAUTE", description: "Implémentation des fonctionnalités hors-ligne et responsivité." },
  { title: "Rendez-vous client stratégique", startHour: 11, startMin: 0, durationMin: 75, location: "Centre d'affaires", priority: "HAUTE", description: "Présentation des avancées et validation des jalons." },
  { title: "Déjeuner d'équipe & Networking", startHour: 12, startMin: 30, durationMin: 60, location: "Restaurant Le Central", priority: "BASSE", description: "Échange informel avec les partenaires." },
  { title: "Tri des emails & Inbox Zero", startHour: 14, startMin: 0, durationMin: 45, location: "Bureau", priority: "BASSE", description: "Nettoyage des messages et traitement des urgences." },
  { title: "Session de tests utilisateurs mobile", startHour: 14, startMin: 30, durationMin: 90, location: "Espace Coworking", priority: "HAUTE", description: "Vérification des parcours sur écran mobile." },
  { title: "Atelier de conception UI/UX", startHour: 15, startMin: 0, durationMin: 120, location: "Salle de créativité", priority: "MOYENNE", description: "Wireframing et design system." },
  { title: "Revue de code & Optimisation", startHour: 16, startMin: 0, durationMin: 90, location: "Bureau", priority: "HAUTE", description: "Refactoring et amélioration des performances." },
  { title: "Formation en ligne & Veille tech", startHour: 17, startMin: 30, durationMin: 60, location: "Domicile", priority: "MOYENNE", description: "Étude des nouvelles fonctionnalités Next.js et SQLite." },
  { title: "Séance de sport & Musculation", startHour: 18, startMin: 0, durationMin: 75, location: "Salle de Gym", priority: "MOYENNE", description: "Entraînement haut du corps et cardio." },
  { title: "Courses & Ravitaillement", startHour: 18, startMin: 30, durationMin: 45, location: "Supermarché", priority: "BASSE", description: "Achat de produits frais pour la semaine." },
  { title: "Lecture & Développement personnel", startHour: 19, startMin: 30, durationMin: 60, location: "Salon", priority: "MOYENNE", description: "Lecture d'un ouvrage sur la productivité et la gestion du temps." },
  { title: "Bilan d'avancement & Clôture", startHour: 20, startMin: 30, durationMin: 45, location: "Bureau personnel", priority: "HAUTE", description: "Revue des accomplissements de la journée et préparation du lendemain." },
]

function formatDateISO(year: number, month: number, day: number, hour: number, min: number) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return new Date(`${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(min)}:00`)
}

async function main() {
  console.log("🌱 Début du remplissage complet de la base SQLite (Août & Septembre 2026)...")

  // Nettoyer la table des programmes
  await prisma.program.deleteMany({})

  const allPrograms: any[] = []
  const today = new Date("2026-08-20T00:00:00")

  // Générer Août (1 à 31) et Septembre (1 à 30) 2026
  const months = [
    { month: 8, days: 31 },
    { month: 9, days: 30 }
  ]

  let progCounter = 1

  for (const m of months) {
    for (let day = 1; day <= m.days; day++) {
      const currentDate = new Date(`2026-${String(m.month).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00`)
      const isPast = currentDate < today
      const isToday = currentDate.getTime() === today.getTime()
      const isFuture = currentDate > today

      // 2 à 4 programmes par jour
      const dayHash = (m.month * 31 + day)
      const numTasks = 2 + (dayHash % 3) // 2, 3 ou 4 tâches
      const templateIndices = [
        dayHash % 4, // Tâche du matin
        4 + (dayHash % 6), // Tâche de journée
        10 + (dayHash % 4), // Tâche d'après-midi
        14 + (dayHash % 3), // Tâche du soir
      ].slice(0, numTasks)

      templateIndices.forEach((tplIdx, taskIdx) => {
        const tpl = taskTemplates[tplIdx % taskTemplates.length]
        const startTime = formatDateISO(2026, m.month, day, tpl.startHour, tpl.startMin)
        const endTime = new Date(startTime.getTime() + tpl.durationMin * 60 * 1000)

        let status = "EN_ATTENTE"

        if (isPast) {
          // Statuts passés variés et réalistes
          const statusSeed = (day + taskIdx * 3) % 10
          if (statusSeed < 6) {
            status = "FAIT"
          } else if (statusSeed < 8) {
            status = "REPORTE"
          } else if (statusSeed === 8) {
            status = "ABANDONNE"
          } else {
            status = "EN_OBSERVATION"
          }
        } else if (isToday) {
          // Aujourd'hui (20 Août)
          if (tpl.startHour < 9) {
            status = "FAIT"
          } else if (tpl.startHour <= 14) {
            status = "EN_OBSERVATION"
          } else if (tpl.startHour <= 18) {
            status = "EN_COURS"
          } else {
            status = "EN_ATTENTE"
          }
        } else {
          // Dates futures : STRICTEMENT EN_ATTENTE
          status = "EN_ATTENTE"
        }

        allPrograms.push({
          id: `prog-2026${String(m.month).padStart(2, '0')}${String(day).padStart(2, '0')}-${taskIdx + 1}`,
          title: tpl.title,
          startTime,
          endTime,
          location: tpl.location,
          description: tpl.description,
          priority: tpl.priority,
          status,
          originalId: status === "REPORTE" ? `prog-orig-${progCounter}` : null,
        })

        progCounter++
      })
    }
  }

  // Insertion en base par lots
  console.log(`📦 Insertion de ${allPrograms.length} programmes au total...`)

  for (const p of allPrograms) {
    await prisma.program.create({ data: p })
  }

  // S'assurer que les Settings par défaut existent
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

  console.log(`\n🎉 Succès complet ! ${allPrograms.length} programmes insérés pour tout le mois d'Août et Septembre 2026.`)
}

main()
  .catch((e) => {
    console.error("❌ Erreur pendant le seed :", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })