"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SpeedGraphProps {
  data: Array<{ date: Date; wpm: number }>
}

export default function SpeedGraph({ data }: SpeedGraphProps) {
  const formattedData = data.map((item) => ({
    date: item.date.toLocaleDateString(),
    wpm: item.wpm,
  }))

  // Calculate average WPM
  const averageWpm = data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item.wpm, 0) / data.length) : 0

  // Find highest WPM
  const highestWpm = data.length > 0 ? Math.max(...data.map((item) => item.wpm)) : 0

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <LineChart className="h-5 w-5 text-primary" />
          Speed Progress
        </h3>
        <div className="flex space-x-4">
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">Average: </span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{averageWpm} WPM</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">Best: </span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{highestWpm} WPM</span>
          </div>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="h-64 w-full bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 shadow-sm backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} domain={[0, "dataMax + 20"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="wpm"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 w-full flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">Complete a test to see your progress</p>
        </div>
      )}
    </div>
  )
}

