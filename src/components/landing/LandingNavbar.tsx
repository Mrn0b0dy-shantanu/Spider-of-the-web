"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Menu,
  X,
  ChevronRight,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Analytics", href: "#analytics" },
  { label: "Resources", href: "#resources" },
  { label: "Contact Us", href: "#contact" },
  { label: "Help", href: "#help" },
];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl shadow-black/40"
          : "bg-transparent"
          }`}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center h-16 lg:h-[72px]">

            <Link href="/" className="group flex items-center gap-2.5">
              <div className="relative flex justify-center items-center bg-linear-to-br from-red-600 to-red-800 shadow-lg shadow-red-900/30 group-hover:shadow-red-800/50 rounded-lg w-9 h-9 transition-shadow">
                <ShieldAlert className="w-5 h-5 text-white" />
                <div className="absolute inset-0 bg-linear-to-t from-transparent to-white/10 rounded-lg" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                Anti<span className="font-medium text-red-400">Quake</span>
              </span>
            </Link>


            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:bg-white/[0.04] px-3.5 py-2 rounded-lg font-medium text-zinc-400 hover:text-white text-sm transition-all duration-300"
                >
                  {link.label}
                </a>
              ))}
            </nav>


            <div className="hidden lg:flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-emerald-500/10 mr-2 px-3 py-1.5 border border-emerald-500/20 rounded-full">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span className="font-medium text-emerald-400 text-xs">Systems Online</span>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hover:bg-white/[0.06] text-zinc-300 hover:text-white"
              >
                <Link href="/login">Open Dashboard</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/30 hover:shadow-red-800/40 px-5 font-semibold text-white transition-all"
              >
                <Link href="/signup">
                  Get Started <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </Button>
            </div>


            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex justify-center items-center hover:bg-white/[0.06] rounded-lg w-10 h-10 text-zinc-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>


      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden z-40 fixed inset-0"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="top-0 right-0 bottom-0 absolute bg-[#0c0c14] p-6 pt-20 border-white/[0.06] border-l w-[300px]"
            >
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="hover:bg-white/[0.04] px-4 py-3 rounded-lg font-medium text-zinc-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="flex flex-col gap-3 mt-6 pt-6 border-white/[0.06] border-t">
                <Button asChild variant="outline" className="hover:bg-white/[0.04] border-white/10 w-full text-zinc-300">
                  <Link href="/login">Open Dashboard</Link>
                </Button>
                <Button asChild className="bg-red-600 hover:bg-red-500 w-full font-semibold text-white">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
