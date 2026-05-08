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
    <section className="relative flex justify-center items-center min-h-screen overflow-hidden">

      <div className="absolute inset-0 bg-[#07070c]" />
      <div className="absolute inset-0 bg-linear-to-b from-red-950/10 via-transparent to-purple-950/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(180,30,30,0.15),transparent)]" />
      <GridBackground />


      <div className="z-10 relative mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 max-w-7xl">
        <div className="flex flex-col items-center text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-white/[0.04] backdrop-blur-sm mb-8 px-4 py-1.5 border border-white/[0.08] rounded-full"
          >
            <span className="relative flex w-2 h-2">
              <span className="inline-flex absolute bg-red-400 opacity-75 rounded-full w-full h-full animate-ping" />
              <span className="inline-flex relative bg-red-500 rounded-full w-2 h-2" />
            </span>
            <span className="font-medium text-zinc-300 text-sm">
              National Disaster Coordination Platform
            </span>
          </motion.div>


          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="max-w-4xl font-black text-white lg:text-[4.5rem] text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight"
          >
            When Disaster Strikes,{" "}
            <span className="relative">
              <span className="bg-clip-text bg-linear-to-r from-red-400 via-red-500 to-red-600 text-transparent">
                Every Second
              </span>
            </span>{" "}
            Counts.
          </motion.h1>


          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-6 max-w-2xl text-zinc-400 text-lg sm:text-xl leading-relaxed"
          >
            The operational command platform that unifies disaster response teams,
            relief organizations, and communities — delivering real-time coordination
            when it matters most.
          </motion.p>


          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="flex sm:flex-row flex-col items-center gap-4 mt-10"
          >
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
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="hover:bg-red-500/10 px-6 rounded-xl h-13 text-red-400 hover:text-red-300 text-base"
            >
              <Link href="/signup">Request Help →</Link>
            </Button>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="gap-3 sm:gap-4 grid grid-cols-2 lg:grid-cols-4 mt-16 w-full max-w-3xl"
          >
            {statusItems.map((item, i) => {
              const c = colorMap[item.color];
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                  className="flex items-center gap-3 bg-white/[0.03] backdrop-blur-sm px-4 py-3 border border-white/[0.06] rounded-xl"
                >
                  <div className={`flex-shrink-0 p-2 rounded-lg ${c.bg}`}>
                    <item.icon className={`w-4 h-4 ${c.text}`} />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="font-medium text-[11px] text-zinc-500 truncate">{item.label}</p>
                    <p className={`text-sm font-semibold ${c.text}`}>{item.status}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>


      <div className="right-0 bottom-0 left-0 absolute bg-linear-to-t from-[#07070c] to-transparent h-32" />
    </section>
  );
}
