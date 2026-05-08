"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Radio,
  Shield,
  Truck,
  Users,
  MapPin,
  Bell,
  BarChart3,
  HeartHandshake,
} from "lucide-react";

const features = [
  {
    icon: Radio,
    title: "Emergency Response Coordination",
    description:
      "Unified command center for real-time disaster response. Coordinate teams, track incidents, and manage resources from a single operational dashboard.",
    color: "red",
    tag: "Core System",
  },
  {
    icon: HeartHandshake,
    title: "Community Aid Network",
    description:
      "Peer-to-peer assistance ecosystem where civilians help each other. Request aid, offer supplies, and connect with neighbors during emergencies.",
    color: "purple",
    tag: "Community",
  },
  {
    icon: Truck,
    title: "Supply & Logistics Management",
    description:
      "End-to-end supply chain tracking. Monitor inventory levels, coordinate relief shipments, and optimize distribution routes in real-time.",
    color: "emerald",
    tag: "Logistics",
  },
  {
    icon: Shield,
    title: "Verified Disaster News",
    description:
      "Curated, verified disaster updates from trusted sources. Combat misinformation with authenticated reports and official communications.",
    color: "blue",
    tag: "Intelligence",
  },
  {
    icon: Bell,
    title: "Emergency Request Workflow",
    description:
      "Streamlined request-to-response pipeline. Create emergency requests, track progress, and receive status updates through automated workflows.",
    color: "amber",
    tag: "Workflow",
  },
  {
    icon: BarChart3,
    title: "Analytics & Monitoring",
    description:
      "Comprehensive disaster metrics and operational analytics. Visualize impact zones, resource allocation, and response effectiveness.",
    color: "cyan",
    tag: "Analytics",
  },
  {
    icon: MapPin,
    title: "Shelter & Resource Centers",
    description:
      "Real-time tracking of camps, shelters, and supply distribution centers. Monitor occupancy, resource levels, and operational status.",
    color: "rose",
    tag: "Resources",
  },
  {
    icon: Users,
    title: "Multi-Role Access System",
    description:
      "Tailored experiences for response teams, command centers, volunteers, civilians, and logistics operators. Everyone gets what they need.",
    color: "violet",
    tag: "Platform",
  },
];

const colorClasses: Record<string, { icon: string; bg: string; border: string; tag: string; glow: string }> = {
  red: { icon: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", tag: "bg-red-500/15 text-red-400", glow: "group-hover:shadow-red-500/5" },
  purple: { icon: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", tag: "bg-purple-500/15 text-purple-400", glow: "group-hover:shadow-purple-500/5" },
  emerald: { icon: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", tag: "bg-emerald-500/15 text-emerald-400", glow: "group-hover:shadow-emerald-500/5" },
  blue: { icon: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", tag: "bg-blue-500/15 text-blue-400", glow: "group-hover:shadow-blue-500/5" },
  amber: { icon: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", tag: "bg-amber-500/15 text-amber-400", glow: "group-hover:shadow-amber-500/5" },
  cyan: { icon: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", tag: "bg-cyan-500/15 text-cyan-400", glow: "group-hover:shadow-cyan-500/5" },
  rose: { icon: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", tag: "bg-rose-500/15 text-rose-400", glow: "group-hover:shadow-rose-500/5" },
  violet: { icon: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", tag: "bg-violet-500/15 text-violet-400", glow: "group-hover:shadow-violet-500/5" },
};

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const c = colorClasses[feature.color];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-all duration-500 hover:bg-white/[0.04] ${c.glow} hover:shadow-xl`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 p-3 rounded-xl ${c.bg} ${c.border} border`}>
          <feature.icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${c.tag}`}>
              {feature.tag}
            </span>
          </div>
          <h3 className="text-base font-semibold text-white mb-1.5 group-hover:text-white/95 transition-colors">
            {feature.title}
          </h3>
          <p className="text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#07070c]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(120,20,120,0.08),transparent)]" />

      <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Radio className="w-3 h-3" />
            Platform Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Built for{" "}
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Mission-Critical
            </span>{" "}
            Operations
          </h2>
          <p className="mt-4 text-lg text-zinc-500 max-w-2xl mx-auto">
            A comprehensive disaster management ecosystem designed to coordinate
            every aspect of emergency response — from first alert to full recovery.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
