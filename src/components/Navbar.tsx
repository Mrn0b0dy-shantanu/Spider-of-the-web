"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-content">
        <Link href="/" className="logo">
          <span className="accent-text">NDC</span> HACKATHON
        </Link>
        <div className="nav-links">
          <Link href="#about">About</Link>
          <Link href="#schedule">Schedule</Link>
          <Link href="#sponsors">Sponsors</Link>
          <Link href="#register" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Register Now</Link>
        </div>
      </div>
    </nav>
  );
}
