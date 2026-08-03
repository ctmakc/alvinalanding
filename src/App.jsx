import React, { useState } from 'react';

// Assets from our factage collection
import alvinaHero from './assets/factage/alvina-hero-900.webp';
import stagingImg from './assets/factage/gamma-3.jpg';
import sellersImg from './assets/factage/sellers-lifestyle-900.webp';
import buyersImg from './assets/factage/buyers-lifestyle-900.webp';
import book1 from './assets/factage/IMG_7202.png';
import book2 from './assets/factage/IMG_7203.png';

const App = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', intent: 'Selling My Home' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Mission Brief Received! \nName: ${formData.name}\nAlvina will respond within 4 hours.`);
  };

  return (
    <div className="antialiased bg-[#fafaeb] text-[#00003c]">
      <style>
        {`
          :root {
            --navy: #00003c;
            --ivory: #fafaeb;
            --gold: #735c00;
          }
          .font-serif { font-family: 'Noto Serif', serif; }
          .hero-gradient {
            background: linear-gradient(to bottom, rgba(0,0,60,0.4), rgba(0,0,60,0.8));
          }
        `}
      </style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#fafaeb]/80 backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-[#00003c] cursor-pointer">menu</span>
            <div className="font-serif uppercase tracking-widest font-black text-2xl text-[#00003c] leading-tight">
              ALVINA<br />USHER
            </div>
          </div>
          <a href="#contact" className="bg-[#00003c] text-[#fafaeb] px-6 py-3 font-serif font-bold tracking-widest text-sm uppercase transition-transform active:scale-95 hover:bg-[#735c00]">
            ENQUIRE NOW
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-[85vh] flex items-center pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={alvinaHero} alt="Alvina Usher" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        <div className="relative z-10 px-8 py-12 max-w-4xl">
          <p className="text-[#735c00] font-bold tracking-[0.2em] uppercase text-xs mb-6">Precision in Real Estate</p>
          <h1 className="font-serif text-4xl md:text-6xl font-black text-[#fafaeb] leading-tight mb-8">
            Mission-Focused Real Estate. 31 Years of Logistics Precision Applied to Your Home Sale.
          </h1>
          <p className="text-[#fafaeb]/90 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
            Alvina Usher | Ottawa Real Estate Expert. Specialized in Kanata, Stittsville, and Waterfront Properties.
          </p>
        </div>
      </header>

      {/* Proof Strip */}
      <section className="bg-[#fafaeb] py-16 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="flex justify-center items-baseline gap-2">
              <span className="font-serif text-5xl font-black text-[#00003c]">31</span>
              <span className="material-symbols-outlined text-[#00003c]">military_tech</span>
            </div>
            <h3 className="font-bold uppercase tracking-widest text-xs text-[#735c00]">Years Logistics Officer</h3>
            <p className="text-sm text-[#00003c]/60 italic">(Foundation of discipline and reliability)</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-center items-baseline gap-2">
              <span className="font-serif text-5xl font-black text-[#00003c]">11+</span>
              <span className="material-symbols-outlined text-[#00003c]">workspace_premium</span>
            </div>
            <h3 className="font-bold uppercase tracking-widest text-xs text-[#735c00]">Years Ottawa Realtor</h3>
            <p className="text-sm text-[#00003c]/60 italic">(Deep market knowledge)</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-center items-center gap-3 text-[#00003c]">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <h3 className="font-bold uppercase tracking-widest text-sm text-[#00003c]">Professional Staging Included</h3>
            <p className="text-sm text-[#00003c]/60 italic">(Zero extra cost for sellers)</p>
          </div>
        </div>
      </section>

      {/* Intent Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative group bg-[#f2f2d9] p-16 flex flex-col justify-center items-start space-y-6 overflow-hidden">
          <img src={sellersImg} className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale group-hover:opacity-20 transition-opacity" alt="Sellers" />
          <p className="relative z-10 text-[#735c00] font-bold tracking-widest text-xs uppercase">For Sellers</p>
          <h2 className="relative z-10 font-serif text-3xl font-black text-[#00003c] leading-snug">
            List with Precision. Get professional staging and a logistics-led marketing plan.
          </h2>
          <a href="#contact" className="relative z-10 inline-block border-b-2 border-[#00003c] pb-1 font-serif font-bold text-[#00003c] tracking-widest uppercase text-sm hover:text-[#735c00] hover:border-[#735c00] transition-colors">
            View Selling Strategy
          </a>
        </div>
        <div className="relative group bg-[#00003c] p-16 flex flex-col justify-center items-start space-y-6 overflow-hidden">
          <img src={buyersImg} className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale group-hover:opacity-20 transition-opacity" alt="Buyers" />
          <p className="relative z-10 text-[#735c00] font-bold tracking-widest text-xs uppercase">For Buyers</p>
          <h2 className="relative z-10 font-serif text-3xl font-black text-[#fafaeb] leading-snug">
            Buy with Confidence. Access 'A Guide to Buying a Home in Ottawa' for free.
          </h2>
          <a href="#contact" className="relative z-10 inline-block border-b-2 border-[#fafaeb] pb-1 font-serif font-bold text-[#fafaeb] tracking-widest uppercase text-sm hover:text-[#735c00] hover:border-[#735c00] transition-colors">
            Browse Intelligence
          </a>
        </div>
      </section>

      {/* Staging Section */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={stagingImg} alt="Staged Living Room" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#fafaeb]/85"></div>
        </div>
        <div className="relative z-10 px-8 py-20 max-w-2xl">
          <h2 className="font-serif text-4xl md:text-5xl font-black text-[#00003c] mb-8 leading-tight">
            Your Home, Transformed.
          </h2>
          <p className="text-lg text-[#00003c]/80 leading-relaxed mb-10">
            I collaborate with Turnkey Property Staging Solutions to turn every listing into a model home. High-end presentation is standard, not an upgrade.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-[#00003c] font-bold uppercase tracking-widest text-xs">
              <span className="material-symbols-outlined text-[#735c00]">check_circle</span>
              Included Staging Services
            </li>
            <li className="flex items-center gap-3 text-[#00003c] font-bold uppercase tracking-widest text-xs">
              <span className="material-symbols-outlined text-[#735c00]">check_circle</span>
              High-End Architectural Presentation
            </li>
          </ul>
        </div>
      </section>

      {/* Featured Listings */}
      <section id="listings" className="bg-[#fafaeb] py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-black text-[#00003c] mb-4">Featured Listings</h2>
            <p className="text-[#735c00] font-bold tracking-[0.2em] uppercase text-xs">West Ottawa & Waterfront Specialist</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white shadow-sm overflow-hidden group">
              <div className="relative h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=1000" alt="970 Shamir Avenue" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-4 right-4 bg-[#00003c] text-[#fafaeb] text-[10px] font-bold px-3 py-1 uppercase tracking-widest">For Sale</div>
              </div>
              <div className="p-8">
                <h3 className="font-serif text-2xl font-black text-[#00003c] mb-2">970 Shamir Avenue</h3>
                <p className="text-[#735c00] font-bold text-lg mb-6">$729,000</p>
                <button className="w-full border border-[#00003c]/20 py-4 font-serif font-bold text-xs uppercase tracking-widest hover:bg-[#00003c] hover:text-[#fafaeb] transition-colors">
                  View Details
                </button>
              </div>
            </div>
            <div className="bg-white shadow-sm overflow-hidden group">
              <div className="relative h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1000" alt="304 - 6376 Bilberry Drive N" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-4 right-4 bg-[#00003c] text-[#fafaeb] text-[10px] font-bold px-3 py-1 uppercase tracking-widest">For Sale</div>
              </div>
              <div className="p-8">
                <h3 className="font-serif text-2xl font-black text-[#00003c] mb-2">304 - 6376 Bilberry Drive N</h3>
                <p className="text-[#735c00] font-bold text-lg mb-6">$298,500</p>
                <button className="w-full border border-[#00003c]/20 py-4 font-serif font-bold text-xs uppercase tracking-widest hover:bg-[#00003c] hover:text-[#fafaeb] transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Library Section */}
      <section className="bg-[#fafaeb] py-24 px-8 border-t border-[#00003c]/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#735c00] font-bold tracking-[0.2em] uppercase text-[10px] mb-4">Free Intelligence</p>
            <h2 className="font-serif text-4xl font-black text-[#00003c]">The Precision Library</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 flex items-center gap-8 shadow-sm group">
              <div className="w-32 h-40 bg-[#00003c] flex-shrink-0 flex items-center justify-center p-4 text-center group-hover:bg-[#735c00] transition-colors shadow-lg">
                <img src={book1} className="w-full h-full object-contain" alt="Book 1"/>
              </div>
              <div>
                <h3 className="font-serif text-xl font-black text-[#00003c] mb-2">How to Sell Homes Fast for Top Dollar</h3>
                <p className="text-sm text-[#00003c]/60 mb-4">Master the logistics of the perfect sale with Alvina's proven strategy.</p>
                <button className="text-[#735c00] font-bold text-[10px] uppercase tracking-widest border-b border-[#735c00]">Request PDF</button>
              </div>
            </div>
            <div className="bg-white p-8 flex items-center gap-8 shadow-sm group">
              <div className="w-32 h-40 bg-[#735c00] flex-shrink-0 flex items-center justify-center p-4 text-center group-hover:bg-[#00003c] transition-colors shadow-lg">
                <img src={book2} className="w-full h-full object-contain" alt="Book 2"/>
              </div>
              <div>
                <h3 className="font-serif text-xl font-black text-[#00003c] mb-2">A Guide to Buying a Home in Ottawa</h3>
                <p className="text-sm text-[#00003c]/60 mb-4">The expert roadmap to your next investment in the capital region.</p>
                <button className="text-[#735c00] font-bold text-[10px] uppercase tracking-widest border-b border-[#735c00]">Request PDF</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="bg-[#00003c] py-24 px-8">
        <div className="max-w-xl mx-auto bg-[#fafaeb] p-12 shadow-2xl">
          <h2 className="font-serif text-3xl font-black text-[#00003c] mb-2">Secure Your Strategy Session</h2>
          <p className="text-[#00003c]/60 text-sm mb-8">Direct Phone: <a href="tel:6137961449" className="font-bold underline text-[#00003c]"> (613) 796-1449</a></p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#00003c] mb-2">Your Name</label>
              <input
                type="text"
                required
                placeholder="Full Name"
                className="w-full bg-transparent border-b border-[#00003c]/20 py-3 focus:outline-none focus:border-[#735c00] transition-colors"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#00003c] mb-2">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="+1 (613) 000-0000"
                className="w-full bg-transparent border-b border-[#00003c]/20 py-3 focus:outline-none focus:border-[#735c00] transition-colors"
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#00003c] mb-2">Primary Intent</label>
              <div className="relative">
                <select
                  className="w-full bg-transparent border-b border-[#00003c]/20 py-3 focus:outline-none focus:border-[#735c00] appearance-none transition-colors"
                  onChange={(e) => setFormData({...formData, intent: e.target.value})}
                >
                  <option>Selling My Home</option>
                  <option>Buying A Home</option>
                  <option>Waterfront Consultation</option>
                </select>
                <span className="material-symbols-outlined absolute right-0 bottom-3 text-[#00003c]/40 pointer-events-none text-sm">expand_more</span>
              </div>
            </div>
            <button type="submit" className="w-full bg-[#00003c] text-[#fafaeb] py-5 font-serif font-black tracking-[0.2em] uppercase text-sm mt-8 hover:bg-[#735c00] transition-colors shadow-xl">
              Initiate Mission
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#00003c] py-16 px-12 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-12 md:space-y-0">
          <div className="font-serif uppercase tracking-widest font-black text-lg text-[#fafaeb] text-center md:text-left">
            ALVINA USHER
          </div>
          <div className="flex gap-8">
            <a href="#listings" className="text-[#fafaeb]/60 text-[10px] font-bold uppercase tracking-widest hover:text-[#735c00]">Listings</a>
            <a href="#contact" className="text-[#fafaeb]/60 text-[10px] font-bold uppercase tracking-widest hover:text-[#735c00]">Enquire</a>
            <a href="tel:6137961449" className="text-[#fafaeb]/60 text-[10px] font-bold uppercase tracking-widest hover:text-[#735c00]">Call (613) 796-1449</a>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/5 text-center">
          <p className="text-[#fafaeb]/40 text-[9px] tracking-[0.2em] uppercase mb-2">
            &copy; 2026 ALVINA USHER PRECISION REAL ESTATE. ALL RIGHTS RESERVED.
          </p>
          <p className="text-[#fafaeb]/40 text-[9px] tracking-[0.2em] uppercase">
            Details Realty Inc., Brokerage. Licensed in Ontario.
          </p>
        </div>
        {/* Agency credit — house standard (uafest.ca): wording + MMIX logo on a
            light chip, grayscale until hover, so it sits on light and dark footers. */}
        <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "22px 24px 0" }}>
          <a
            href="https://mmix.ua/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "inherit", opacity: 0.7, textDecoration: "none" }}
          >
            Development & promotion —
            <span style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,0.9)", borderRadius: 6, padding: "4px 8px" }}>
              <img src="/mmix-logo.png" alt="MMIX — Marketing Mix" width={62} height={60} style={{ height: 36, width: "auto" }} />
            </span>
          </a>
        </div>
      </footer>

    </div>
  );
};

export default App;
