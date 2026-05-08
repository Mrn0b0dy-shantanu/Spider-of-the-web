"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Heart,
  Lightbulb,
  Gauge,
  ShieldCheck,
  Globe2,
  Sparkles,
  ArrowRight,
  Quote,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


const reasons = [
  {
    icon: Heart,
    title: "Human-First Design",
    description: "Every feature is designed with empathy — for panicked civilians, exhausted responders, and overwhelmed coordinators.",
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    icon: Gauge,
    title: "Operational Efficiency",
    description: "Reduce response times by up to 60%. Automated workflows eliminate bottlenecks that cost lives.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Disaster Resilience",
    description: "Build institutional preparedness with post-disaster analytics, resource planning, and community training tools.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Globe2,
    title: "Universal Access",
    description: "Works in low-connectivity environments. Offline-capable. Accessible to all literacy levels and languages.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Lightbulb,
    title: "Intelligent Automation",
    description: "Smart resource matching, predictive risk assessment, and automated supply chain optimization.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Sparkles,
    title: "Transparent Operations",
    description: "Every action is logged, every resource is tracked, every decision is auditable. Full accountability.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
];

export function WhySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="resources" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#07070c]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_30%_50%,rgba(180,30,30,0.05),transparent)]" />

      <div ref={ref} className="z-10 relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 mb-6 px-3 py-1 border border-emerald-500/20 rounded-full font-semibold text-emerald-400 text-xs uppercase tracking-wider">
            <Heart className="w-3 h-3" />
            Our Mission
          </div>
          <h2 className="font-black text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            Why This Platform{" "}
            <span className="bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 text-transparent">
              Matters
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-500 text-lg">
            Because when disaster strikes, the difference between chaos and
            coordination can save thousands of lives.
          </p>
        </motion.div>

        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group bg-white/[0.02] hover:bg-white/[0.04] p-6 border border-white/[0.06] hover:border-white/[0.1] rounded-2xl transition-all duration-500"
            >
              <div className={`inline-flex p-3 rounded-xl ${reason.bg} mb-4`}>
                <reason.icon className={`w-5 h-5 ${reason.color}`} />
              </div>
              <h3 className="mb-2 font-bold text-white text-lg">{reason.title}</h3>
              <p className="text-zinc-500 group-hover:text-zinc-400 text-sm leading-relaxed transition-colors">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


const testimonials = [
  {
    quote: "AntiQuake transformed how our district handles flood response. What used to take 6 hours now takes under 40 minutes.",
    author: "Col. Rahman K.",
    role: "District Emergency Director",
    org: "National Disaster Response Force",
  },
  {
    quote: "During the last earthquake, this platform helped us coordinate 200+ volunteers and distribute relief to 12,000 families in 48 hours.",
    author: "Dr. Sarah Chen",
    role: "Operations Lead",
    org: "International Relief Coalition",
  },
  {
    quote: "As a civilian, being able to request help and track my status in real-time gave my family hope when we had nothing else.",
    author: "Amirul Hasan",
    role: "Flood Survivor",
    org: "Community Member",
  },
];

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#07070c]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(120,20,120,0.06),transparent)]" />

      <div ref={ref} className="z-10 relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-purple-500/10 mb-6 px-3 py-1 border border-purple-500/20 rounded-full font-semibold text-purple-400 text-xs uppercase tracking-wider">
            <Quote className="w-3 h-3" />
            Impact Stories
          </div>
          <h2 className="font-black text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            Trusted by Those Who{" "}
            <span className="bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 text-transparent">
              Respond First
            </span>
          </h2>
        </motion.div>

        <div className="gap-4 sm:gap-6 grid grid-cols-1 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              className="group relative bg-white/[0.02] p-6 sm:p-8 border border-white/[0.06] hover:border-white/[0.1] rounded-2xl transition-all duration-500"
            >
              <Quote className="mb-4 w-8 h-8 text-white/[0.06]" />
              <blockquote className="mb-6 text-zinc-300 group-hover:text-zinc-200 text-sm sm:text-base leading-relaxed transition-colors">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-white/[0.06] border-t">
                <div className="flex justify-center items-center bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-full w-10 h-10 font-bold text-white text-xs">
                  {t.author.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{t.author}</p>
                  <p className="text-zinc-500 text-xs">{t.role} · {t.org}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#07070c]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(180,30,30,0.1),transparent)]" />

      <div ref={ref} className="z-10 relative mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="relative bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 sm:p-12 lg:p-16 border border-white/[0.08] rounded-3xl overflow-hidden">

            <div className="top-0 left-1/2 absolute bg-gradient-to-r from-transparent via-red-500/50 to-transparent w-64 h-px -translate-x-1/2" />
            <div className="bottom-0 left-1/2 absolute bg-gradient-to-r from-transparent via-purple-500/30 to-transparent w-64 h-px -translate-x-1/2" />

            <h2 className="mb-4 font-black text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              Ready to{" "}
              <span className="bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-transparent">
                Save Lives
              </span>
              ?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-zinc-400 text-lg">
              Join the network of disaster response teams, relief organizations,
              and communities using AntiQuake to coordinate when it matters most.
            </p>

            <div className="flex sm:flex-row flex-col justify-center items-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-red-600 hover:bg-red-500 shadow-red-900/25 shadow-xl hover:shadow-red-800/40 px-8 rounded-xl h-13 font-semibold text-white text-base transition-all"
              >
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm px-8 border-white/10 rounded-xl h-13 text-zinc-200 text-base"
              >
                <Link href="/login">Open Dashboard</Link>
              </Button>
            </div>


            <div className="mt-10 pt-8 border-white/[0.06] border-t">
              <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-zinc-500 text-xs">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  End-to-end encrypted
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-blue-500" />
                  Available in 12+ languages
                </span>
                <span className="flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-amber-500" />
                  99.99% uptime SLA
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


const footerLinks = {
  Platform: ["Features", "Analytics", "Integrations", "Security"],
  Resources: ["Documentation", "API Reference", "Community", "Status"],
  Organization: ["About Us", "Careers", "Press", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Compliance"],
};

export function LandingFooter() {
  return (
    <footer id="help" className="relative bg-[#07070c] border-white/[0.06] border-t">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
        <div className="gap-8 grid grid-cols-2 md:grid-cols-5">

          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex justify-center items-center bg-gradient-to-br from-red-600 to-red-800 rounded-lg w-8 h-8">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-base">
                Anti<span className="font-medium text-red-400">Quake</span>
              </span>
            </div>
            <p className="max-w-[200px] text-zinc-500 text-xs leading-relaxed">
              Building resilience through technology. Coordinating disaster response for a safer world.
            </p>
          </div>


          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 font-semibold text-zinc-300 text-xs uppercase tracking-wider">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>


        <div className="flex sm:flex-row flex-col justify-between items-center gap-4 mt-12 pt-6 border-white/[0.06] border-t">
          <p className="text-zinc-600 text-xs">
            © {new Date().getFullYear()} AntiQuake. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="bg-emerald-500 rounded-full w-2 h-2 animate-pulse" />
            <span className="font-medium text-emerald-500/80 text-xs">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
