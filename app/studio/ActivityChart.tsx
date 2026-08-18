"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

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
      <div className="bg-card border border-border rounded-lg p-3 text-xs font-mono shadow-xl">
        <p className="text-muted-foreground mb-2 uppercase tracking-widest text-[10px]">{label}</p>
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground capitalize">{entry.dataKey}:</span>
            <span className="text-foreground font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ActivityChart({ data }: { data: ChartPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-52 flex items-center justify-center text-muted-foreground text-xs font-mono">
        No activity data recorded yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="projectsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#C9A24B" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#C9A24B" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="messagesGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8FA0B3" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#8FA0B3" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="applicationsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#E8CD84" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#E8CD84" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis 
          dataKey="name" 
          tick={{ fill: "#8FA0B3", fontSize: 10, fontFamily: "monospace" }} 
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          tick={{ fill: "#8FA0B3", fontSize: 10, fontFamily: "monospace" }} 
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(201,162,75,0.3)", strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="projects"
          stroke="#C9A24B"
          strokeWidth={2}
          fill="url(#projectsGrad)"
          dot={{ fill: "#C9A24B", strokeWidth: 0, r: 3 }}
          activeDot={{ r: 5, fill: "#C9A24B", stroke: "#0B2036" }}
        />
        <Area
          type="monotone"
          dataKey="messages"
          stroke="#8FA0B3"
          strokeWidth={2}
          fill="url(#messagesGrad)"
          dot={{ fill: "#8FA0B3", strokeWidth: 0, r: 3 }}
          activeDot={{ r: 5, fill: "#8FA0B3", stroke: "#0B2036" }}
        />
        <Area
          type="monotone"
          dataKey="applications"
          stroke="#E8CD84"
          strokeWidth={2}
          fill="url(#applicationsGrad)"
          dot={{ fill: "#E8CD84", strokeWidth: 0, r: 3 }}
          activeDot={{ r: 5, fill: "#E8CD84", stroke: "#0B2036" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
