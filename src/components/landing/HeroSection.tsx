"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Activity,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── animated grid background ─── */
function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      time += 0.003;

      const gridSize = 60;
      const cols = Math.ceil(w / gridSize) + 1;
      const rows = Math.ceil(h / gridSize) + 1;

      // grid lines
      ctx.strokeStyle = "rgba(255,255,255,0.025)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, h);
        ctx.stroke();
      }
      for (let i = 0; i < rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(w, i * gridSize);
        ctx.stroke();
      }

      // pulsing dots at intersections
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gridSize;
          const y = j * gridSize;
          const dist = Math.sqrt(
            Math.pow(x - w / 2, 2) + Math.pow(y - h / 2, 2)
          );
          const wave = Math.sin(time * 2 + dist * 0.008) * 0.5 + 0.5;
          const alpha = wave * 0.15 + 0.03;

          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220, 50, 50, ${alpha})`;
          ctx.fill();
        }
      }

      // scanning line
      const scanY = ((Math.sin(time * 0.8) + 1) / 2) * h;
      const gradient = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      gradient.addColorStop(0, "rgba(220, 50, 50, 0)");
      gradient.addColorStop(0.5, "rgba(220, 50, 50, 0.06)");
      gradient.addColorStop(1, "rgba(220, 50, 50, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanY - 30, w, 60);

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

/* ─── operational status chips ─── */
const statusItems = [
  { icon: Shield, label: "Threat Detection", status: "Active", color: "emerald" },
  { icon: Activity, label: "Response Teams", status: "847 Online", color: "emerald" },
  { icon: Users, label: "Civilians Served", status: "2.4M+", color: "blue" },
  { icon: Zap, label: "Avg Response", status: "< 4 min", color: "amber" },
];

const colorMap: Record<string, { bg: string; text: string; dot: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[#07070c]" />
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/10 via-transparent to-purple-950/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(180,30,30,0.15),transparent)]" />
      <GridBackground />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="flex flex-col items-center text-center">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-sm font-medium text-zinc-300">
              National Disaster Coordination Platform
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black tracking-tight leading-[1.05] text-white"
          >
            When Disaster Strikes,{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                Every Second
              </span>
            </span>{" "}
            Counts.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-6 max-w-2xl text-lg sm:text-xl text-zinc-400 leading-relaxed"
          >
            The operational command platform that unifies disaster response teams,
            relief organizations, and communities — delivering real-time coordination
            when it matters most.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-10"
          >
            <Button
              asChild
              size="lg"
              className="bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-900/25 hover:shadow-red-800/40 transition-all h-13 px-8 text-base font-semibold rounded-xl"
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
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-13 px-6 text-base rounded-xl"
            >
              <Link href="/signup">Request Help →</Link>
            </Button>
          </motion.div>

          {/* Status indicators */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl"
          >
            {statusItems.map((item, i) => {
              const c = colorMap[item.color];
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
                >
                  <div className={`flex-shrink-0 p-2 rounded-lg ${c.bg}`}>
                    <item.icon className={`w-4 h-4 ${c.text}`} />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-[11px] text-zinc-500 font-medium truncate">{item.label}</p>
                    <p className={`text-sm font-semibold ${c.text}`}>{item.status}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#07070c] to-transparent" />
    </section>
  );
}
