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

      <div ref={ref} className="z-10 relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="items-center gap-12 lg:gap-16 grid grid-cols-1 lg:grid-cols-2">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-purple-500/10 mb-6 px-3 py-1 border border-purple-500/20 rounded-full font-semibold text-purple-400 text-xs uppercase tracking-wider">
              <HeartHandshake className="w-3 h-3" />
              Community Network
            </div>
            <h2 className="mb-4 font-black text-white text-3xl sm:text-4xl tracking-tight">
              Communities Helping{" "}
              <span className="bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 text-transparent">
                Communities
              </span>
            </h2>
            <p className="mb-8 text-zinc-500 text-base leading-relaxed">
              A peer-to-peer ecosystem where civilians can offer help, request supplies, open
              shelters, and coordinate with neighbors — turning communities into first responders.
            </p>


            <div className="gap-3 grid grid-cols-2">
              {aidCategories.map((cat, i) => (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 bg-white/[0.03] p-3.5 border border-white/[0.06] rounded-xl"
                >
                  <div className={`p-2 rounded-lg ${cat.bg}`}>
                    <cat.icon className={`w-4 h-4 ${cat.color}`} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{cat.count}</p>
                    <p className="text-[11px] text-zinc-500">{cat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-white/[0.02] p-5 sm:p-6 border border-white/[0.06] rounded-2xl"
          >
            <div className="flex justify-between items-center mb-5">
              <h4 className="font-semibold text-zinc-300 text-sm">Live Aid Activity</h4>
              <div className="flex items-center gap-1.5">
                <span className="bg-emerald-500 rounded-full w-2 h-2 animate-pulse" />
                <span className="text-emerald-400 text-xs">Live</span>
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
                    className="flex justify-between items-center bg-white/[0.02] p-3.5 border border-white/[0.04] hover:border-white/[0.08] rounded-xl transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-zinc-200 text-sm truncate">{item.action}</p>
                      <p className="mt-0.5 text-[11px] text-zinc-500">
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

      <div ref={ref} className="z-10 relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 mb-6 px-3 py-1 border border-cyan-500/20 rounded-full font-semibold text-cyan-400 text-xs uppercase tracking-wider">
            <MapPin className="w-3 h-3" />
            Resource Network
          </div>
          <h2 className="font-black text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            Shelter &{" "}
            <span className="bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent">
              Resource Tracking
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-500 text-lg">
            Real-time visibility into every shelter, supply center, and resource
            hub in the response network.
          </p>
        </motion.div>

        <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
          {shelters.map((shelter, i) => (
            <motion.div
              key={shelter.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
              className="group bg-white/[0.02] hover:bg-white/[0.03] p-6 border border-white/[0.06] hover:border-white/[0.1] rounded-2xl transition-all duration-500"
            >

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="mb-1 font-bold text-white text-base">{shelter.name}</h3>
                  <p className="flex items-center gap-1 text-zinc-500 text-xs">
                    <MapPin className="w-3 h-3" />
                    {shelter.location}
                  </p>
                </div>
                <span className={`text-xs font-semibold ${shelter.statusColor}`}>{shelter.status}</span>
              </div>


              <div className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] text-zinc-500">Occupancy</span>
                  <span className="font-semibold text-[11px] text-zinc-400">{shelter.capacity}%</span>
                </div>
                <div className="bg-white/[0.05] rounded-full w-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${shelter.capacity}%` } : {}}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    className={`h-full rounded-full ${shelter.capacity > 75
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                      }`}
                  />
                </div>
              </div>


              <div className="flex flex-wrap gap-2">
                {shelter.resources.map((res) => {
                  const Icon = resourceIcons[res] || Package;
                  return (
                    <span
                      key={res}
                      className="inline-flex items-center gap-1.5 bg-white/[0.04] px-2.5 py-1 border border-white/[0.06] rounded-lg text-[11px] text-zinc-400"
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


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="gap-3 grid grid-cols-2 sm:grid-cols-4 mt-8"
        >
          {[
            { label: "Active Shelters", value: "342", icon: Home },
            { label: "People Sheltered", value: "28,456", icon: Users },
            { label: "Supply Centers", value: "189", icon: Package },
            { label: "Verified Safe", value: "94.7%", icon: CheckCircle2 },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 bg-white/[0.02] p-4 border border-white/[0.06] rounded-xl"
            >
              <stat.icon className="w-4 h-4 text-zinc-500" />
              <div>
                <p className="font-bold text-white text-lg">{stat.value}</p>
                <p className="text-[11px] text-zinc-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
