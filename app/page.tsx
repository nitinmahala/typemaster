import TypingTest from "@/components/typing-test"
import ThemeToggle from "@/components/theme-toggle"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 dark:via-purple-950/20 transition-colors duration-300">
      <div className="absolute inset-0 dark:bg-grid-white/[0.05] bg-grid-black/[0.02] pointer-events-none"></div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xs">
              TM
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300">
              TypeMaster
            </h1>
          </div>
          <ThemeToggle />
        </header>
        <main>
          <TypingTest />
        </main>
        <Footer />
      </div>
    </div>
  )
}

