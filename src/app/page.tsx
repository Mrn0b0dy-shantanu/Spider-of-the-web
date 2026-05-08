export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content section-container">
          <p className="hero-tagline">Code. Create. Conquer.</p>
          <h1 className="title-large">
            <span className="gradient-text">NDC HACKATHON</span> <br />
            <span className="accent-text">2026</span>
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto 40px' }}>
            Empowering the next generation of innovators. Join us for 48 hours of pure creation at Notre Dame College.
          </p>
          <div className="hero-actions">
            <button className="btn-primary">Register Your Team</button>
            <button className="btn-outline">View Rulebook</button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-container">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 className="title-medium">About the <span className="accent-text">Event</span></h2>
          <p style={{ maxWidth: '700px', margin: '0 auto', opacity: 0.8 }}>
            NDC Hackathon is the flagship technology event of Notre Dame College. We bring together the brightest minds to solve real-world problems through technology.
          </p>
        </div>
        
        <div className="grid">
          <div className="card glass">
            <div className="card-icon">🚀</div>
            <h3>Innovation</h3>
            <p style={{ opacity: 0.7, marginTop: '12px' }}>Push the boundaries of what's possible with cutting-edge tech.</p>
          </div>
          <div className="card glass">
            <div className="card-icon">🤝</div>
            <h3>Collaboration</h3>
            <p style={{ opacity: 0.7, marginTop: '12px' }}>Network with industry experts and like-minded peers.</p>
          </div>
          <div className="card glass">
            <div className="card-icon">🏆</div>
            <h3>Competition</h3>
            <p style={{ opacity: 0.7, marginTop: '12px' }}>Win exciting prizes and recognition from top companies.</p>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '100px 0' }}>
        <div className="section-container">
          <h2 className="title-medium" style={{ textAlign: 'center' }}>Event <span className="accent-text">Schedule</span></h2>
          
          <div style={{ marginTop: '60px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { time: "09:00 AM", event: "Opening Ceremony", date: "June 15" },
              { time: "11:00 AM", event: "Hacking Starts", date: "June 15" },
              { time: "02:00 PM", event: "Workshop: AI Ethics", date: "June 15" },
              { time: "08:00 PM", event: "Midnight Snack & Chill", date: "June 15" },
              { time: "11:00 AM", event: "Project Submission", date: "June 16" },
              { time: "03:00 PM", event: "Closing & Awards", date: "June 16" },
            ].map((item, i) => (
              <div key={i} className="glass" style={{ padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ color: 'var(--primary-glow)', fontWeight: '700', marginRight: '20px' }}>{item.time}</span>
                  <span style={{ fontWeight: '500' }}>{item.event}</span>
                </div>
                <span style={{ opacity: 0.5 }}>{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section id="sponsors" className="section-container" style={{ textAlign: 'center' }}>
        <h2 className="title-medium">Our <span className="accent-text">Sponsors</span></h2>
        <p style={{ marginBottom: '60px', opacity: 0.6 }}>Partnering with the best in the industry.</p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '60px', justifyContent: 'center', alignItems: 'center', opacity: 0.4 }}>
          {/* Placeholder for Sponsor Logos */}
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>TECH GIANT</div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>INNO CORP</div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>DEV STUDIO</div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>CODE LAB</div>
        </div>
      </section>
    </div>
  );
}
