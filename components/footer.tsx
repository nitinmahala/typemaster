import Link from "next/link"
import { Github, Twitter, Linkedin, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="mt-16 pb-8">
      <div className="backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 shadow-lg rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">TypeMaster</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Improve your typing speed and accuracy</p>
        </div>

        <div className="flex items-center gap-4">
          <Link href="https://github.com/nitinmahala" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-800/50">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Button>
          </Link>
          
          <Link href="https://www.linkedin.com/in/mahalanitin/" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-800/50">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </Link>
        </div>

        <div className="text-center md:text-right text-sm text-gray-600 dark:text-gray-400">
          <p>
            Made with <Heart className="inline-block h-3 w-3 text-red-500" /> by TypeMaster Team
          </p>
          <p>&copy; {new Date().getFullYear()} TypeMaster. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

