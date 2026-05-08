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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl shadow-black/40"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 to-red-800 shadow-lg shadow-red-900/30 group-hover:shadow-red-800/50 transition-shadow">
                <ShieldAlert className="w-5 h-5 text-white" />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-transparent to-white/10" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Anti<span className="text-red-400 font-medium">Quake</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3.5 py-2 text-sm text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.04] transition-all duration-300 font-medium"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="flex items-center gap-1.5 mr-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-emerald-400">Systems Online</span>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-zinc-300 hover:text-white hover:bg-white/[0.06]"
              >
                <Link href="/login">Open Dashboard</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30 hover:shadow-red-800/40 transition-all font-semibold px-5"
              >
                <Link href="/signup">
                  Get Started <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 bottom-0 w-[300px] bg-[#0c0c14] border-l border-white/[0.06] p-6 pt-20"
            >
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-sm text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors font-medium"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-6 pt-6 border-t border-white/[0.06] flex flex-col gap-3">
                <Button asChild variant="outline" className="w-full border-white/10 text-zinc-300 hover:bg-white/[0.04]">
                  <Link href="/login">Open Dashboard</Link>
                </Button>
                <Button asChild className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold">
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
