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

/* ─── Why This Platform Section ─── */
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

      <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Heart className="w-3 h-3" />
            Our Mission
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Why This Platform{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
              Matters
            </span>
          </h2>
          <p className="mt-4 text-lg text-zinc-500 max-w-2xl mx-auto">
            Because when disaster strikes, the difference between chaos and
            coordination can save thousands of lives.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-500"
            >
              <div className={`inline-flex p-3 rounded-xl ${reason.bg} mb-4`}>
                <reason.icon className={`w-5 h-5 ${reason.color}`} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{reason.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials Section ─── */
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

      <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Quote className="w-3 h-3" />
            Impact Stories
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Trusted by Those Who{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Respond First
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              className="relative p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-all duration-500 group"
            >
              <Quote className="w-8 h-8 text-white/[0.06] mb-4" />
              <blockquote className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6 group-hover:text-zinc-200 transition-colors">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-xs font-bold text-white">
                  {t.author.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.author}</p>
                  <p className="text-xs text-zinc-500">{t.role} · {t.org}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Section ─── */
export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#07070c]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(180,30,30,0.1),transparent)]" />

      <div ref={ref} className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
              Ready to{" "}
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                Save Lives
              </span>
              ?
            </h2>
            <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-8">
              Join the network of disaster response teams, relief organizations,
              and communities using AntiQuake to coordinate when it matters most.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-900/25 hover:shadow-red-800/40 h-13 px-8 text-base font-semibold rounded-xl transition-all"
              >
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-200 h-13 px-8 text-base rounded-xl backdrop-blur-sm"
              >
                <Link href="/login">Open Dashboard</Link>
              </Button>
            </div>

            {/* Trust row */}
            <div className="mt-10 pt-8 border-t border-white/[0.06]">
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-zinc-500">
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

/* ─── Footer ─── */
const footerLinks = {
  Platform: ["Features", "Analytics", "Integrations", "Security"],
  Resources: ["Documentation", "API Reference", "Community", "Status"],
  Organization: ["About Us", "Careers", "Press", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Compliance"],
};

export function LandingFooter() {
  return (
    <footer id="help" className="relative border-t border-white/[0.06] bg-[#07070c]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-800">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-white">
                Anti<span className="text-red-400 font-medium">Quake</span>
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px]">
              Building resilience through technology. Coordinating disaster response for a safer world.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} AntiQuake. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-500/80 font-medium">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
