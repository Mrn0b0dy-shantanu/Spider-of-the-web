"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  HeartHandshake,
  Package,
  MapPin,
  Home,
  Droplets,
  Stethoscope,
  Utensils,
  BatteryCharging,
  Wifi,
  Users,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

/* ─── Community Aid Section ─── */
const aidCategories = [
  { icon: Package, label: "Supply Donations", count: "12,847", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: Home, label: "Shelter Offered", count: "3,290", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: Stethoscope, label: "Medical Volunteers", count: "1,456", color: "text-red-400", bg: "bg-red-500/10" },
  { icon: Utensils, label: "Meal Programs", count: "847", color: "text-amber-400", bg: "bg-amber-500/10" },
];

const recentAid = [
  { action: "Offered 200 blankets", user: "R. Patel", time: "2m ago", status: "matched" },
  { action: "Requested medical supplies", user: "Emergency Center 4", time: "5m ago", status: "pending" },
  { action: "Opened community shelter", user: "Civic Center", time: "12m ago", status: "active" },
  { action: "Donated 500 water bottles", user: "S. Ahmed", time: "18m ago", status: "delivered" },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  matched: { bg: "bg-blue-500/15", text: "text-blue-400" },
  pending: { bg: "bg-amber-500/15", text: "text-amber-400" },
  active: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  delivered: { bg: "bg-purple-500/15", text: "text-purple-400" },
};

export function CommunityAidSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#07070c]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_70%_50%,rgba(120,20,120,0.06),transparent)]" />

      <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-6">
              <HeartHandshake className="w-3 h-3" />
              Community Network
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
              Communities Helping{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Communities
              </span>
            </h2>
            <p className="text-base text-zinc-500 leading-relaxed mb-8">
              A peer-to-peer ecosystem where civilians can offer help, request supplies, open
              shelters, and coordinate with neighbors — turning communities into first responders.
            </p>

            {/* Aid categories */}
            <div className="grid grid-cols-2 gap-3">
              {aidCategories.map((cat, i) => (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                >
                  <div className={`p-2 rounded-lg ${cat.bg}`}>
                    <cat.icon className={`w-4 h-4 ${cat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{cat.count}</p>
                    <p className="text-[11px] text-zinc-500">{cat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Live feed mock */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
          >
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-sm font-semibold text-zinc-300">Live Aid Activity</h4>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-emerald-400">Live</span>
              </div>
            </div>
            <div className="space-y-3">
              {recentAid.map((item, i) => {
                const sc = statusColors[item.status];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.12 }}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-zinc-200 font-medium truncate">{item.action}</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        {item.user} · {item.time}
                      </p>
                    </div>
                    <span className={`flex-shrink-0 text-[10px] font-semibold px-2 py-1 rounded-full ${sc.bg} ${sc.text} capitalize`}>
                      {item.status}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Shelter & Resource Section ─── */
const shelters = [
  {
    name: "Central Emergency Shelter",
    location: "District 4, Block C",
    capacity: 85,
    resources: ["Water", "Medical", "Power"],
    status: "Operational",
    statusColor: "text-emerald-400",
  },
  {
    name: "North Relief Center",
    location: "Zone 2, Sector 7",
    capacity: 62,
    resources: ["Food", "Water", "Connectivity"],
    status: "Near Capacity",
    statusColor: "text-amber-400",
  },
  {
    name: "Eastside Community Hub",
    location: "East Zone, Area 12",
    capacity: 34,
    resources: ["Medical", "Food", "Power"],
    status: "Operational",
    statusColor: "text-emerald-400",
  },
];

const resourceIcons: Record<string, typeof Droplets> = {
  Water: Droplets,
  Medical: Stethoscope,
  Food: Utensils,
  Power: BatteryCharging,
  Connectivity: Wifi,
};

export function ShelterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#07070c]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_30%_50%,rgba(30,100,180,0.06),transparent)]" />

      <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <MapPin className="w-3 h-3" />
            Resource Network
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Shelter &{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Resource Tracking
            </span>
          </h2>
          <p className="mt-4 text-lg text-zinc-500 max-w-2xl mx-auto">
            Real-time visibility into every shelter, supply center, and resource
            hub in the response network.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shelters.map((shelter, i) => (
            <motion.div
              key={shelter.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
              className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-500"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white mb-1">{shelter.name}</h3>
                  <p className="text-xs text-zinc-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {shelter.location}
                  </p>
                </div>
                <span className={`text-xs font-semibold ${shelter.statusColor}`}>{shelter.status}</span>
              </div>

              {/* Capacity bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-zinc-500">Occupancy</span>
                  <span className="text-[11px] font-semibold text-zinc-400">{shelter.capacity}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.05]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${shelter.capacity}%` } : {}}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    className={`h-full rounded-full ${
                      shelter.capacity > 75
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                  />
                </div>
              </div>

              {/* Resources */}
              <div className="flex flex-wrap gap-2">
                {shelter.resources.map((res) => {
                  const Icon = resourceIcons[res] || Package;
                  return (
                    <span
                      key={res}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] text-zinc-400"
                    >
                      <Icon className="w-3 h-3" />
                      {res}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { label: "Active Shelters", value: "342", icon: Home },
            { label: "People Sheltered", value: "28,456", icon: Users },
            { label: "Supply Centers", value: "189", icon: Package },
            { label: "Verified Safe", value: "94.7%", icon: CheckCircle2 },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
            >
              <stat.icon className="w-4 h-4 text-zinc-500" />
              <div>
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-[11px] text-zinc-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
