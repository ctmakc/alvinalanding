import { useEffect, useRef, useState } from "react";
import heroPortrait from "../assets/gamma-1.png";
import buyersLifestyle from "../assets/gamma-6.jpg";
import sellersLifestyle from "../assets/gamma-3.jpg";
import buyerGuide from "../assets/gamma-4.png";
import sellerGuide from "../assets/gamma-5.png";

function useRevealAnimations() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from(document.querySelectorAll(".reveal"));

    if (prefersReducedMotion) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -5% 0px" }
    );

    nodes.forEach((node, index) => {
      node.style.transitionDelay = `${Math.min(index % 6, 4) * 40}ms`;
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);
}

function TiltCard({ className = "", children }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let raf = 0;

    const onMove = (event) => {
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * 8;
      const ry = (px - 0.5) * 10;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        node.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
      });
    };

    const reset = () => {
      cancelAnimationFrame(raf);
      node.style.transform = "";
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", reset);
    node.addEventListener("pointercancel", reset);

    return () => {
      cancelAnimationFrame(raf);
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", reset);
      node.removeEventListener("pointercancel", reset);
    };
  }, []);

  return (
    <div ref={ref} className={`tilt ${className}`.trim()}>
      {children}
    </div>
  );
}

function LeadForm() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form className={`lead-form${submitted ? " submitted" : ""}`} onSubmit={onSubmit}>
      <label>
        Name
        <input type="text" placeholder="Your name" required />
      </label>
      <label>
        Email
        <input type="email" placeholder="you@email.com" required />
      </label>
      <label>
        I am interested in
        <select required defaultValue="">
          <option value="" disabled>
            Select
          </option>
          <option>Buying in Ottawa</option>
          <option>Selling in Ottawa</option>
          <option>Both / planning move</option>
          <option>Guide download</option>
        </select>
      </label>
      <label>
        Message
        <textarea rows="4" placeholder="Tell us your timing, area, budget, or goals" />
      </label>
      <button className="btn" type="submit">
        Send Inquiry
      </button>
      <p className="form-note">
        Demo form for UI concept. Wire to CRM/email (HubSpot, Mailchimp, Web3Forms, or custom backend) before production.
      </p>
      <p className="form-success">Thanks. This concept form submitted locally.</p>
    </form>
  );
}

function App() {
  useRevealAnimations();

  return (
    <>
      <div className="page-bg" aria-hidden="true">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="grid" />
      </div>

      <header className="topbar reveal">
        <a className="brand" href="#home" aria-label="Alvina Usher home">
          <span className="brand-mark">AU</span>
          <span className="brand-copy">
            <strong>Alvina Usher</strong>
            <small>Ottawa Real Estate</small>
          </span>
        </a>
        <nav className="nav" aria-label="Primary">
          <a href="#buyers">Buyers</a>
          <a href="#sellers">Sellers</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="btn btn-sm" href="tel:+16137961449">
          Call 613-796-1449
        </a>
      </header>

      <main id="home">
        <section className="hero section">
          <div className="hero-copy reveal">
            <p className="eyebrow">Ottawa, ON | Sales Representative</p>
            <h1>Modern real estate strategy for Ottawa buyers and sellers.</h1>
            <p className="lede">
              Work with <strong>Alvina Usher</strong> for a data-driven, client-focused process backed by 13+ years of experience and local market insight.
            </p>
            <div className="hero-actions">
              <a className="btn" href="#contact">
                Book a Consultation
              </a>
              <a className="btn btn-ghost" href="#guides">
                Get Free Guides
              </a>
            </div>
            <div className="hero-meta">
              <div>
                <span>13+ years</span>
                <small>Experience</small>
              </div>
              <div>
                <span>Ottawa-first</span>
                <small>Local network</small>
              </div>
              <div>
                <span>Data-driven</span>
                <small>Pricing & strategy</small>
              </div>
            </div>
          </div>

          <div className="hero-visual reveal">
            <TiltCard className="portrait-card">
              <img src={heroPortrait} alt="Alvina Usher portrait" />
              <div className="portrait-glow" />
            </TiltCard>
            <div className="floating stat-card stat-a reveal">
              <strong>Buyers</strong>
              <span>Step-by-step guidance with clarity and confidence</span>
            </div>
            <div className="floating stat-card stat-b reveal">
              <strong>Sellers</strong>
              <span>Smart pricing + tailored marketing for top-dollar outcomes</span>
            </div>
          </div>
        </section>

        <section className="trust section reveal" aria-label="Trust signals">
          <div className="chip">Details Realty Inc., Brokerage</div>
          <div className="chip">Cell/Text: (613) 796-1449</div>
          <div className="chip">Office: (613) 686-6336</div>
          <div className="chip">
            <a href="https://www.alvinausher.com/" target="_blank" rel="noreferrer">
              alvinausher.com
            </a>
          </div>
        </section>

        <section id="buyers" className="split section">
          <div className="panel reveal">
            <p className="eyebrow">For Buyers</p>
            <h2>Find the right home without the chaos.</h2>
            <p>
              From pre-approval prep to offer strategy, Alvina helps buyers move with confidence in a competitive Ottawa market.
            </p>
            <ul className="feature-list">
              <li>Neighborhood fit and shortlist strategy</li>
              <li>Offer guidance and negotiation support</li>
              <li>Clear next steps at every stage</li>
            </ul>
            <a className="text-link" href="#guides">
              Download Ottawa Buyer Guide
            </a>
          </div>
          <TiltCard className="media-card reveal">
            <img src={buyersLifestyle} alt="Happy home buyers with sold sign" />
          </TiltCard>
        </section>

        <section id="sellers" className="split section">
          <div className="panel reveal">
            <p className="eyebrow">For Sellers</p>
            <h2>Position your home to sell faster and stronger.</h2>
            <p>
              Strategic pricing, presentation planning, and market-aware promotion designed to maximize attention and qualified offers.
            </p>
            <ul className="feature-list">
              <li>Pricing strategy informed by local conditions</li>
              <li>Listing prep and presentation recommendations</li>
              <li>Marketing plan built to attract serious buyers</li>
            </ul>
            <a className="text-link" href="#guides">
              Download Seller Top-Dollar Guide
            </a>
          </div>
          <div className="media-stack reveal">
            <TiltCard className="media-card">
              <img src={sellersLifestyle} alt="Homeowner receiving keys" />
            </TiltCard>
            <div className="mini-portrait">
              <img src={heroPortrait} alt="Alvina Usher professional portrait" />
            </div>
          </div>
        </section>

        <section id="guides" className="guides section">
          <div className="section-head reveal">
            <p className="eyebrow">Lead Magnets / Value First</p>
            <h2>High-converting free resources for Ottawa clients</h2>
            <p>
              These are already part of Alvina&apos;s personal brand and work perfectly as primary landing page conversion hooks.
            </p>
          </div>
          <div className="guide-grid">
            <TiltCard className="guide-card reveal">
              <img src={buyerGuide} alt="Alvina Usher buying guide for Ottawa" />
              <div className="guide-copy">
                <h3>Buyer Guide</h3>
                <p>A practical Ottawa-focused guide for first-time and move-up buyers.</p>
                <a className="btn btn-ghost" href="#contact">
                  Request Access
                </a>
              </div>
            </TiltCard>
            <TiltCard className="guide-card reveal">
              <img src={sellerGuide} alt="Alvina Usher seller guide for top dollar" />
              <div className="guide-copy">
                <h3>Seller Guide</h3>
                <p>Top-dollar focused playbook for preparing and launching your listing.</p>
                <a className="btn btn-ghost" href="#contact">
                  Request Access
                </a>
              </div>
            </TiltCard>
          </div>
        </section>

        <section id="about" className="about section">
          <div className="about-card reveal">
            <TiltCard className="about-photo">
              <img src={heroPortrait} alt="Alvina Usher" />
            </TiltCard>
            <div className="about-copy">
              <p className="eyebrow">About Alvina</p>
              <h2>Client-focused, community-connected, strategy-led.</h2>
              <p>
                Public profiles indicate Alvina Usher is an Ottawa-area Sales Representative with Details Realty Inc., Brokerage, with 13+ years of expertise and a strong focus on helping both buyers and sellers navigate changing market conditions.
              </p>
              <p>
                This landing page is designed around that positioning: modern presentation, trust-first messaging, and clear conversion paths for consultations and guide downloads.
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="contact section reveal">
          <div className="contact-panel">
            <div>
              <p className="eyebrow">Contact / CTA</p>
              <h2>Let&apos;s build your Ottawa real estate game plan.</h2>
              <p>
                Reach out for buying strategy, pricing advice, or a custom plan for your next move.
              </p>
              <div className="contact-links">
                <a href="tel:+16137961449">Call / Text: 613-796-1449</a>
                <a href="https://detailsrealty.ca/our-agents.html/alvina-usher/" target="_blank" rel="noreferrer">
                  Details Realty Agent Profile
                </a>
                <a href="https://www.alvinausher.com/" target="_blank" rel="noreferrer">
                  Official Website
                </a>
              </div>
            </div>
            <LeadForm />
          </div>
        </section>
      </main>

      <footer className="footer reveal">
        <p>
          Production-ready React/Vite landing page concept for Alvina Usher (Ottawa Realtor), built from public profile/site information and publicly accessible images found on her current web presence.
        </p>
        <p className="small">
          Real estate/MLS content and branding usage should be reviewed before production launch for compliance.
        </p>
      </footer>
    </>
  );
}

export default App;
