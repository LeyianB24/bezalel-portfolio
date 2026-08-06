"use client"

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts"

interface ChartPoint {
  name: string;
  projects?: number;
  messages?: number;
  applications?: number;
  [key: string]: string | number | undefined;
}

interface TooltipPayloadEntry {
  dataKey: string;
  value: number;
  color: string;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadEntry[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-xs font-mono shadow-xl">
        <p className="text-zinc-400 mb-2 uppercase tracking-widest text-[10px]">{label}</p>
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-zinc-300 capitalize">{entry.dataKey}:</span>
            <span className="text-white font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function ActivityChart({ data }: { data: ChartPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-52 flex items-center justify-center text-zinc-600 text-xs font-mono">
        No activity data yet.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="projectsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="messagesGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="applicationsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#c084fc" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
        <XAxis 
          dataKey="name" 
          tick={{ fill: "#71717a", fontSize: 10, fontFamily: "monospace" }} 
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          tick={{ fill: "#71717a", fontSize: 10, fontFamily: "monospace" }} 
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#3f3f46", strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="projects"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#projectsGrad)"
          dot={{ fill: "#10b981", strokeWidth: 0, r: 3 }}
          activeDot={{ r: 5, fill: "#10b981", stroke: "#065f46" }}
        />
        <Area
          type="monotone"
          dataKey="messages"
          stroke="#60a5fa"
          strokeWidth={2}
          fill="url(#messagesGrad)"
          dot={{ fill: "#60a5fa", strokeWidth: 0, r: 3 }}
          activeDot={{ r: 5, fill: "#60a5fa", stroke: "#1e3a5f" }}
        />
        <Area
          type="monotone"
          dataKey="applications"
          stroke="#c084fc"
          strokeWidth={2}
          fill="url(#applicationsGrad)"
          dot={{ fill: "#c084fc", strokeWidth: 0, r: 3 }}
          activeDot={{ r: 5, fill: "#c084fc", stroke: "#4a1d96" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
