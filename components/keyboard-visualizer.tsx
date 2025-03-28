"use client"

import { useState, useEffect } from "react"

const keyboardLayout = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
]

export default function KeyboardVisualizer() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      setPressedKeys((prev) => new Set(prev).add(key))
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      setPressedKeys((prev) => {
        const newSet = new Set(prev)
        newSet.delete(key)
        return newSet
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-2">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Keyboard Visualizer</h3>
      <div className="flex flex-col gap-2 w-full max-w-2xl">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1" style={{ marginLeft: rowIndex * 10 }}>
            {row.map((key) => (
              <div
                key={key}
                className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium text-sm transition-all duration-150 ${
                  pressedKeys.has(key)
                    ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/20 scale-105 transform"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                }`}
              >
                {key.toUpperCase()}
              </div>
            ))}
          </div>
        ))}
        <div className="flex justify-center mt-2">
          <div
            className={`w-64 h-10 flex items-center justify-center rounded-lg font-medium text-sm transition-all duration-150 ${
              pressedKeys.has(" ")
                ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/20 scale-105 transform"
                : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
            }`}
          >
            Space
          </div>
        </div>
      </div>
    </div>
  )
}

