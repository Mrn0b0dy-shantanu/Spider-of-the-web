import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="section-container">
        <Link href="/" className="footer-logo">
          <span className="accent-text">NDC</span> HACKATHON
        </Link>
        <div className="footer-links">
          <Link href="#about">About</Link>
          <Link href="#schedule">Schedule</Link>
          <Link href="#sponsors">Sponsors</Link>
          <Link href="#contact">Contact</Link>
        </div>
        <p className="copyright">
          © {new Date().getFullYear()} Notre Dame College Hackathon. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
