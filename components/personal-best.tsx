"use client"
import { Trophy, Medal, Award } from "lucide-react"

interface PersonalBestProps {
  data: Array<{ date: Date; wpm: number }>
}

export default function PersonalBest({ data }: PersonalBestProps) {
  // Sort data by WPM in descending order
  const sortedData = [...data].sort((a, b) => b.wpm - a.wpm)

  // Get top 5 results
  const topResults = sortedData.slice(0, 5)

  // Get all-time best
  const bestResult = sortedData.length > 0 ? sortedData[0] : null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Personal Best
        </h3>
      </div>

      {bestResult ? (
        <>
          <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 dark:from-yellow-500/20 dark:to-amber-500/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-900/50 shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white p-3 rounded-full">
                <Trophy className="h-8 w-8" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">All-time Best</div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-500">
                  {bestResult.wpm} WPM
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {bestResult.date.toLocaleDateString()} at {bestResult.date.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Top 5 Results</h4>
            {topResults.map((result, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 shadow-sm backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
              >
                <div
                  className={`
                  rounded-full w-8 h-8 flex items-center justify-center text-white
                  ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-amber-700" : "bg-gray-500/70"}
                `}
                >
                  {index === 0 ? (
                    <Trophy className="h-4 w-4" />
                  ) : index === 1 ? (
                    <Medal className="h-4 w-4" />
                  ) : index === 2 ? (
                    <Award className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800 dark:text-gray-200">{result.wpm} WPM</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{result.date.toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="h-64 w-full flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">Complete a test to see your personal best</p>
        </div>
      )}
    </div>
  )
}

