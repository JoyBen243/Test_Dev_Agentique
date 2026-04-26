export default function Home() {
  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-end pb-20 p-8 text-center text-white"
      style={{
        backgroundColor: '#0f172a',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url("/font.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Contenu principal décalé vers le bas */}
      <div className="relative z-10 max-w-4xl space-y-8 px-4 mb-10">

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-yellow-400 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] leading-none">
          BIENVENUE DANS VOTRE <br />
          <span className="text-blue-500">ETABLI ULTIME</span>
        </h1>

        <p className="text-3xl md:text-4xl font-extrabold text-purple-400 drop-shadow-md">
          Prêt à créer l'incroyable ?
        </p>

        <div className="h-2 w-48 bg-blue-600 mx-auto rounded-full shadow-[0_0_15px_rgba(37,99,235,0.6)]" />

        <div className="max-w-3xl mx-auto bg-black/60 p-8 rounded-3xl backdrop-blur-md border-2 border-white/20 shadow-2xl">
          <p className="text-xl md:text-2xl leading-relaxed text-gray-100 font-bold">
            <span className="text-green-400 text-3xl font-black block mb-2 underline decoration-blue-500">Template Next.js Pro</span>
            Base optimisée avec Next.js (App Router), TypeScript et Tailwind CSS.
            Inclut la bibliothèque Shadcn UI complète (48+ composants) et l'ORM Prisma (SQLite).
            Structure propre et prête pour l'IA.
          </p>
        </div>

        <button className="px-12 py-5 bg-green-500 hover:bg-green-400 text-black font-black text-2xl rounded-2xl shadow-[0_10px_30px_rgba(34,197,94,0.5)] transition-all transform hover:-translate-y-2 active:scale-95 uppercase tracking-widest">
          Lancer le projet
        </button>
      </div>

      {/* Effet de lumière pour l'ambiance */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
    </main>
  );
}