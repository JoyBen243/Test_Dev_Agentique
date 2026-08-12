import { ListTodo } from "lucide-react"

export default function ProgrammesPage() {
  return (
    <div className="flex flex-col min-h-full p-6 pb-24">
      <header className="mb-8 mt-4">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Programmes
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Grille et liste de vos tâches</p>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center mt-20 text-slate-400">
        <ListTodo className="w-16 h-16 mb-4 opacity-50" strokeWidth={1} />
        <p>Les vues Liste et Grille arrivent bientôt...</p>
      </div>
    </div>
  )
}
