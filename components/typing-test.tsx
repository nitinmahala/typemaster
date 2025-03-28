"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Clock, RotateCcw, LineChart, Keyboard, Trophy } from "lucide-react"
import KeyboardVisualizer from "@/components/keyboard-visualizer"
import SpeedGraph from "@/components/speed-graph"
import { paragraphs } from "@/data/paragraphs"
import PersonalBest from "@/components/personal-best"

type TestStatus = "idle" | "running" | "finished"

export default function TypingTest() {
  const [status, setStatus] = useState<TestStatus>("idle")
  const [timeOption, setTimeOption] = useState<number>(60)
  const [customTime, setCustomTime] = useState<number>(60)
  const [timeLeft, setTimeLeft] = useState<number>(timeOption)
  const [text, setText] = useState<string>("")
  const [currentParagraph, setCurrentParagraph] = useState<string>("")
  const [wpm, setWpm] = useState<number>(0)
  const [accuracy, setAccuracy] = useState<number>(100)
  const [errors, setErrors] = useState<number>(0)
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0)
  const [correctKeystrokes, setCorrectKeystrokes] = useState<number>(0)
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false)
  const [showGraph, setShowGraph] = useState<boolean>(false)
  const [testResults, setTestResults] = useState<Array<{ date: Date; wpm: number }>>([])
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Get random paragraph
  const getRandomParagraph = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * paragraphs.length)
    return paragraphs[randomIndex]
  }, [])

  // Initialize test
  const initTest = useCallback(() => {
    setCurrentParagraph(getRandomParagraph())
    setText("")
    setWpm(0)
    setAccuracy(100)
    setErrors(0)
    setTotalKeystrokes(0)
    setCorrectKeystrokes(0)
    setTimeLeft(timeOption)
    setStatus("idle")

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [getRandomParagraph, timeOption])

  // Start test
  const startTest = useCallback(() => {
    if (status === "running") return

    setStatus("running")
    setTimeLeft(timeOption)

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }
          setStatus("finished")

          // Save result to history
          const newResult = { date: new Date(), wpm }
          setTestResults((prev) => [...prev, newResult])

          // Save to local storage
          const storedResults = JSON.parse(localStorage.getItem("typingResults") || "[]")
          localStorage.setItem("typingResults", JSON.stringify([...storedResults, newResult]))

          return 0
        }
        return prev - 1
      })
    }, 1000)

    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [status, timeOption, wpm])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status !== "running") {
      startTest()
    }

    const inputValue = e.target.value
    setText(inputValue)

    // Calculate statistics
    const targetText = currentParagraph.substring(0, inputValue.length)
    let errorCount = 0
    let correctCount = 0

    for (let i = 0; i < inputValue.length; i++) {
      setTotalKeystrokes((prev) => prev + 1)
      if (inputValue[i] === currentParagraph[i]) {
        correctCount++
      } else {
        errorCount++
      }
    }

    setCorrectKeystrokes(correctCount)
    setErrors(errorCount)

    // Calculate accuracy
    const newAccuracy = inputValue.length > 0 ? Math.round((correctCount / inputValue.length) * 100) : 100
    setAccuracy(newAccuracy)

    // Calculate WPM: (characters typed / 5) / (time elapsed in minutes)
    const timeElapsed = (timeOption - timeLeft) / 60
    if (timeElapsed > 0) {
      const words = correctCount / 5
      const newWpm = Math.round(words / timeElapsed)
      setWpm(newWpm)
    }
  }

  // Reset test
  const resetTest = () => {
    initTest()
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Change time option
  const changeTimeOption = (time: number) => {
    setTimeOption(time)
    setTimeLeft(time)
    resetTest()
  }

  // Load test results from local storage
  useEffect(() => {
    const storedResults = JSON.parse(localStorage.getItem("typingResults") || "[]")
    setTestResults(
      storedResults.map((result: any) => ({
        ...result,
        date: new Date(result.date),
      })),
    )
  }, [])

  // Initialize test on mount
  useEffect(() => {
    initTest()
  }, [initTest])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="backdrop-blur-md bg-white/40 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl overflow-hidden transition-all duration-300 hover:shadow-primary/10 dark:shadow-lg dark:shadow-primary/20">
        <div className="p-6">
          {/* Timer options */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Time:</span>
              <div className="flex space-x-2">
                <Button
                  variant={timeOption === 30 ? "default" : "outline"}
                  size="sm"
                  onClick={() => changeTimeOption(30)}
                  className="rounded-full transition-all duration-300 hover:shadow-md"
                >
                  30s
                </Button>
                <Button
                  variant={timeOption === 60 ? "default" : "outline"}
                  size="sm"
                  onClick={() => changeTimeOption(60)}
                  className="rounded-full transition-all duration-300 hover:shadow-md"
                >
                  60s
                </Button>
                <Button
                  variant={timeOption !== 30 && timeOption !== 60 ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const time = prompt("Enter custom time in seconds:", "120")
                    if (time) {
                      const parsedTime = Number.parseInt(time)
                      if (!isNaN(parsedTime) && parsedTime > 0) {
                        changeTimeOption(parsedTime)
                      }
                    }
                  }}
                  className="rounded-full transition-all duration-300 hover:shadow-md"
                >
                  Custom
                </Button>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              {timeLeft}s
            </div>
          </div>

          {/* Mode selector */}
          <div className="mb-6"></div>

          {/* Stats display */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 text-center shadow-sm backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all duration-300">
              <div className="text-sm text-gray-500 dark:text-gray-400">WPM</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{wpm}</div>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 text-center shadow-sm backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all duration-300">
              <div className="text-sm text-gray-500 dark:text-gray-400">Accuracy</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{accuracy}%</div>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 text-center shadow-sm backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all duration-300">
              <div className="text-sm text-gray-500 dark:text-gray-400">Errors</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{errors}</div>
            </div>
          </div>

          {/* Text display */}
          <div className="mb-6 bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 font-mono text-lg leading-relaxed shadow-inner border border-gray-200 dark:border-gray-700 h-32 overflow-y-auto backdrop-blur-sm">
            {currentParagraph.split("").map((char, index) => {
              let className = "text-gray-400 dark:text-gray-500"

              if (index < text.length) {
                className =
                  text[index] === char
                    ? "text-green-500 dark:text-green-400"
                    : "text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30"
              }

              return (
                <span key={index} className={className}>
                  {char}
                </span>
              )
            })}
          </div>

          {/* Input field */}
          <div className="mb-6">
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={handleInputChange}
              disabled={status === "finished"}
              className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 font-mono text-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm focus:shadow-md"
              placeholder={status === "idle" ? "Type to start..." : ""}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center">
            <Button
              onClick={resetTest}
              variant="outline"
              className="flex items-center gap-2 rounded-full hover:shadow-md transition-all duration-300"
            >
              <RotateCcw className="h-4 w-4" />
              Restart
            </Button>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowKeyboard(!showKeyboard)}
                className={`rounded-full transition-all duration-300 hover:shadow-md ${showKeyboard ? "bg-primary/10 border-primary/20 text-primary" : ""}`}
              >
                <Keyboard className="h-4 w-4 mr-2" />
                Keyboard
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGraph(!showGraph)}
                className={`rounded-full transition-all duration-300 hover:shadow-md ${showGraph ? "bg-primary/10 border-primary/20 text-primary" : ""}`}
              >
                <LineChart className="h-4 w-4 mr-2" />
                Progress
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className={`rounded-full transition-all duration-300 hover:shadow-md ${showLeaderboard ? "bg-primary/10 border-primary/20 text-primary" : ""}`}
              >
                <Trophy className="h-4 w-4 mr-2" />
                Best
              </Button>
            </div>
          </div>
        </div>

        {/* Test results */}
        {status === "finished" && (
          <div className="p-6 bg-gray-50/80 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Test Results
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 text-center shadow-sm backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-sm text-gray-500 dark:text-gray-400">WPM</div>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{wpm}</div>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 text-center shadow-sm backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-sm text-gray-500 dark:text-gray-400">Accuracy</div>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{accuracy}%</div>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 text-center shadow-sm backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-sm text-gray-500 dark:text-gray-400">Keystrokes</div>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{totalKeystrokes}</div>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 text-center shadow-sm backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-sm text-gray-500 dark:text-gray-400">Correct</div>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{correctKeystrokes}</div>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <Button onClick={resetTest} className="rounded-full hover:shadow-md transition-all duration-300">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Keyboard visualizer */}
        {showKeyboard && (
          <div className="p-6 bg-gray-50/80 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 backdrop-blur-sm">
            <KeyboardVisualizer />
          </div>
        )}

        {/* Progress graph */}
        {showGraph && (
          <div className="p-6 bg-gray-50/80 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 backdrop-blur-sm">
            <SpeedGraph data={testResults} />
          </div>
        )}

        {/* Leaderboard / Personal Best */}
        {showLeaderboard && (
          <div className="p-6 bg-gray-50/80 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 backdrop-blur-sm">
            <PersonalBest data={testResults} />
          </div>
        )}
      </Card>
    </div>
  )
}

