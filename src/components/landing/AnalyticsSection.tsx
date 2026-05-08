"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  MapPin,
  Layers,
  Activity,
  Timer,
} from "lucide-react";


const liveMetrics = [
  { label: "Active Incidents", value: "47", change: "-12%", trend: "down", icon: Activity, color: "text-red-400" },
  { label: "Resources Deployed", value: "2,341", change: "+18%", trend: "up", icon: Layers, color: "text-emerald-400" },
  { label: "Avg Response Time", value: "3.2m", change: "-24%", trend: "down", icon: Timer, color: "text-blue-400" },
  { label: "Areas Monitored", value: "1,892", change: "+6%", trend: "up", icon: MapPin, color: "text-purple-400" },
];

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className="flex items-end gap-[3px] h-8">
      {data.map((val, i) => {
        const height = ((val - min) / range) * 100;
        return (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${Math.max(height, 10)}%` }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            className={`w-[6px] rounded-full ${color} opacity-60`}
          />
        );
      })}
    </div>
  );
}

const chartColors = [
  "bg-red-500",
  "bg-emerald-500",
  "bg-blue-500",
  "bg-purple-500",
];

const chartData = [
  [30, 45, 38, 52, 48, 60, 55, 70, 62, 75, 68, 82],
  [20, 35, 42, 38, 55, 48, 62, 58, 72, 65, 78, 85],
  [50, 42, 35, 28, 32, 25, 20, 22, 18, 15, 12, 10],
  [40, 48, 52, 58, 55, 62, 68, 72, 75, 80, 82, 88],
];

export default function AnalyticsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="analytics" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#07070c]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(60,60,180,0.06),transparent)]" />

      <div ref={ref} className="z-10 relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 mb-6 px-3 py-1 border border-blue-500/20 rounded-full font-semibold text-blue-400 text-xs uppercase tracking-wider">
            <BarChart3 className="w-3 h-3" />
            Operational Intelligence
          </div>
          <h2 className="font-black text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            Data-Driven{" "}
            <span className="bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 text-transparent">
              Disaster Response
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-500 text-lg">
            Real-time analytics and monitoring dashboards that give command
            centers the intelligence they need to save lives.
          </p>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/[0.02] backdrop-blur-sm p-4 sm:p-6 lg:p-8 border border-white/[0.08] rounded-2xl overflow-hidden"
        >

          <div className="flex justify-between items-center mb-6 pb-4 border-white/[0.06] border-b">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="bg-red-500/60 rounded-full w-3 h-3" />
                <div className="bg-amber-500/60 rounded-full w-3 h-3" />
                <div className="bg-emerald-500/60 rounded-full w-3 h-3" />
              </div>
              <span className="font-mono text-zinc-500 text-xs">operations-dashboard.antiquake.app</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500 rounded-full w-2 h-2 animate-pulse" />
              <span className="font-medium text-emerald-400 text-xs">Live</span>
            </div>
          </div>


          <div className="gap-3 sm:gap-4 grid grid-cols-2 lg:grid-cols-4 mb-6">
            {liveMetrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="bg-white/[0.03] p-4 border border-white/[0.06] rounded-xl"
              >
                <div className="flex justify-between items-center mb-2">
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                  <div className={`flex items-center gap-1 text-xs font-medium ${metric.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                    <TrendingUp className={`w-3 h-3 ${metric.trend === "down" ? "rotate-180" : ""}`} />
                    {metric.change}
                  </div>
                </div>
                <p className="font-bold text-white text-2xl">{metric.value}</p>
                <p className="mt-1 text-[11px] text-zinc-500">{metric.label}</p>
              </motion.div>
            ))}
          </div>


          <div className="gap-4 grid grid-cols-1 lg:grid-cols-3">

            <div className="lg:col-span-2 bg-white/[0.02] p-5 border border-white/[0.06] rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-zinc-300 text-sm">Response Performance</h4>
                <div className="flex gap-4 text-[10px]">
                  {["Incidents", "Resolved", "Response Time", "Coverage"].map((label, i) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${chartColors[i]}`} />
                      <span className="text-zinc-500">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="gap-3 grid grid-cols-4 mt-6">
                {chartData.map((data, i) => (
                  <MiniChart key={i} data={data} color={chartColors[i]} />
                ))}
              </div>
              <div className="flex justify-between mt-3 text-[10px] text-zinc-600">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>


            <div className="bg-white/[0.02] p-5 border border-white/[0.06] rounded-xl">
              <h4 className="mb-4 font-semibold text-zinc-300 text-sm">Regional Status</h4>
              <div className="space-y-3">
                {[
                  { region: "North Zone", status: "Elevated", level: 72, color: "bg-amber-500" },
                  { region: "South Zone", status: "Normal", level: 35, color: "bg-emerald-500" },
                  { region: "East Zone", status: "Critical", level: 92, color: "bg-red-500" },
                  { region: "West Zone", status: "Normal", level: 28, color: "bg-emerald-500" },
                  { region: "Central", status: "Watch", level: 58, color: "bg-amber-500" },
                ].map((zone) => (
                  <div key={zone.region}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-zinc-400 text-xs">{zone.region}</span>
                      <span className="text-[10px] text-zinc-500">{zone.status}</span>
                    </div>
                    <div className="bg-white/[0.05] rounded-full w-full h-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${zone.level}%` } : {}}
                        transition={{ duration: 1, delay: 0.6 }}
                        className={`h-full rounded-full ${zone.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
