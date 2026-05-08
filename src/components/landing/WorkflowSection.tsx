"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Workflow,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  Search,
  UserCheck,
} from "lucide-react";

const steps = [
  {
    step: "01",
    icon: AlertTriangle,
    title: "Disaster Detected",
    description: "Seismic sensors, weather systems, or citizen reports trigger an automated alert across the platform.",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    detail: "Auto-triggered in < 30s",
  },
  {
    step: "02",
    icon: Send,
    title: "Requests Created",
    description: "Affected civilians submit emergency requests. The system categorizes, prioritizes, and routes them automatically.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    detail: "AI-assisted triage",
  },
  {
    step: "03",
    icon: Search,
    title: "Resources Matched",
    description: "The platform identifies available resources, shelters, volunteers, and response teams nearest to the affected area.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    detail: "Geo-intelligent matching",
  },
  {
    step: "04",
    icon: UserCheck,
    title: "Teams Deployed",
    description: "Response teams receive assignments with full context — routes, risk assessments, and resource inventories.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    detail: "Real-time coordination",
  },
  {
    step: "05",
    icon: Clock,
    title: "Live Tracking",
    description: "Every request, resource, and team is tracked in real-time. Civilians receive status updates. Command centers see everything.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    detail: "360° visibility",
  },
  {
    step: "06",
    icon: CheckCircle2,
    title: "Resolution & Recovery",
    description: "Requests are resolved, resources restocked, and recovery operations begin — all tracked and documented for future preparedness.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    detail: "Complete audit trail",
  },
];

export default function WorkflowSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#07070c]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(180,30,30,0.06),transparent)]" />

      <div ref={ref} className="z-10 relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-amber-500/10 mb-6 px-3 py-1 border border-amber-500/20 rounded-full font-semibold text-amber-400 text-xs uppercase tracking-wider">
            <Workflow className="w-3 h-3" />
            Response Pipeline
          </div>
          <h2 className="font-black text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            From Alert to{" "}
            <span className="bg-clip-text bg-linear-to-r from-amber-400 to-red-500 text-transparent">
              Resolution
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-500 text-lg">
            A streamlined emergency response workflow that moves from detection to
            deployment in minutes — not hours.
          </p>
        </motion.div>


        <div className="relative">

          <div className="hidden sm:block top-0 bottom-0 left-[23px] md:left-1/2 absolute bg-linear-to-b from-transparent via-white/10 to-transparent w-px md:-translate-x-px" />

          <div className="space-y-6 sm:space-y-8">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30, y: 20 }}
                  animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex items-start gap-4 sm:gap-6 md:gap-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                >

                  <div className={`flex-1 md:w-[calc(50%-32px)] ${isLeft ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <div className={`p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-500 group`}>
                      <div className={`flex items-center gap-3 mb-3 ${isLeft ? "md:justify-end" : ""}`}>
                        <span className="font-bold text-[10px] text-zinc-600 uppercase tracking-widest">
                          Step {step.step}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${step.bg} ${step.color} border ${step.border}`}>
                          {step.detail}
                        </span>
                      </div>
                      <h3 className="mb-2 font-bold text-white group-hover:text-white/95 text-lg">
                        {step.title}
                      </h3>
                      <p className="text-zinc-500 group-hover:text-zinc-400 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>


                  <div className="hidden left-1/2 z-10 absolute md:flex justify-center items-center bg-[#0c0c14] border-2 border-white/10 rounded-full w-10 h-10 -translate-x-1/2">
                    <step.icon className={`w-4 h-4 ${step.color}`} />
                  </div>


                  <div className={`flex-shrink-0 md:hidden flex items-center justify-center w-12 h-12 rounded-xl ${step.bg} border ${step.border}`}>
                    <step.icon className={`w-5 h-5 ${step.color}`} />
                  </div>


                  <div className="hidden md:block flex-1 md:w-[calc(50%-32px)]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
