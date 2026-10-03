'use client';

import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Search, 
  ExternalLink, 
  Github, 
  TrendingUp, 
  DollarSign, 
  Layers, 
  ArrowUpRight, 
  Terminal, 
  CheckCircle2, 
  RefreshCw, 
  FolderGit2, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Globe,
  Play,
  Server,
  Share2
} from 'lucide-react';
import { AI_APPS, CATEGORIES, AIApp } from '../data/apps';
import QuickStartModal from './components/QuickStartModal';
import SocialPublisherModal from './components/SocialPublisherModal';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyWithDemos, setOnlyWithDemos] = useState(false);
  const [onlyLocalRepo, setOnlyLocalRepo] = useState(false);
  const [selectedAppForLaunch, setSelectedAppForLaunch] = useState<AIApp | null>(null);
  const [isSocialPublisherOpen, setIsSocialPublisherOpen] = useState(false);

  // Profit Calculator State
  const [userCount, setUserCount] = useState<number>(100);
  const [pricePerUnit, setPricePerUnit] = useState<number>(29);
  const [costPerUnit, setCostPerUnit] = useState<number>(1.5);

  const grossRevenue = useMemo(() => userCount * pricePerUnit, [userCount, pricePerUnit]);
  const computeCost = useMemo(() => userCount * costPerUnit, [userCount, costPerUnit]);
  const netProfit = useMemo(() => grossRevenue - computeCost, [grossRevenue, computeCost]);
  const marginPercentage = useMemo(() => 
    grossRevenue > 0 ? Math.round((netProfit / grossRevenue) * 100) : 0, 
    [grossRevenue, netProfit]
  );
  const annualProfit = useMemo(() => netProfit * 12, [netProfit]);

  // Filtered Apps
  const filteredApps = useMemo(() => {
    return AI_APPS.filter((app) => {
      // Category filter
      if (selectedCategory !== 'all' && app.category !== selectedCategory) {
        return false;
      }
      // Demo filter
      if (onlyWithDemos && !app.demoUrl) {
        return false;
      }
      // Local code filter
      if (onlyLocalRepo && !app.hasLocalCode) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = app.name.toLowerCase().includes(query);
        const matchesDesc = app.description.toLowerCase().includes(query);
        const matchesCompete = app.competingWith.toLowerCase().includes(query);
        const matchesTags = app.tags.some(t => t.toLowerCase().includes(query));
        return matchesName || matchesDesc || matchesCompete || matchesTags;
      }
      return true;
    });
  }, [selectedCategory, onlyWithDemos, onlyLocalRepo, searchQuery]);

  return (
    <>
      {/* Header */}
      <header className="header">
        <a href="#" className="header-brand">
          <span className="brand-badge">50+ AI SaaS</span>
          <span className="brand-title">Awesome Generative AI Apps</span>
        </a>

        <div className="header-actions">
          <a 
            href="https://github.com/xennials-dev/awesome-generative-ai-apps" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-ghost"
          >
            <Github size={16} />
            <span>GitHub Fork</span>
          </a>
          <a 
            href="#calculator" 
            className="btn-ghost"
          >
            <DollarSign size={16} />
            <span>Profit Calc</span>
          </a>
          <button
            onClick={() => setIsSocialPublisherOpen(true)}
            className="btn-ghost"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.45rem', 
              border: '1px solid rgba(99, 102, 241, 0.35)', 
              background: 'rgba(99, 102, 241, 0.12)',
              cursor: 'pointer' 
            }}
            title="Universal Social Publisher for TikTok, Instagram, YouTube, X, LinkedIn, Facebook & 6+ more via Upload-Post API"
          >
            <Share2 size={16} className="text-indigo-400" />
            <span>Social Publisher</span>
          </button>
          <a 
            href="#quickstart" 
            className="btn-primary"
          >
            <Zap size={16} />
            <span>Quick Start</span>
          </a>
        </div>
      </header>

      <main className="container">
        {/* Hero */}
        <section className="hero">
          <div className="hero-pill">
            <RefreshCw size={14} className="text-indigo-400" />
            <span>Automated Daily Upstream Sync at 06:00 UTC</span>
          </div>

          <h1 className="hero-title">
            50 Complete AI SaaS Products.<br />
            <span className="gradient-text">Brand Them. Sell Them. Keep 100%.</span>
          </h1>

          <p className="hero-subtitle">
            Turnkey open-source generative AI business templates with Stripe billing, Google OAuth, 
            Prisma database, and 100+ AI models wired up. Deploy to Vercel in seconds.
          </p>

          {/* Unified Model Router Status Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', margin: '1.25rem auto 1.75rem', maxWidth: '850px', padding: '0.6rem 1.25rem', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '12px', boxShadow: '0 4px 20px rgba(99, 102, 241, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#e0e7ff' }}>
              <Cpu size={16} style={{ color: 'var(--primary)' }} />
              <span>Model & Distribution Routers:</span>
            </div>
            <span className="status-pill ready" title="NVIDIA NIM API Router via MY_MODEL_API_KEY">⚡ NVIDIA NIM</span>
            <span className="status-pill online" title="Local LM Studio at http://localhost:1234/v1">🖥️ LM Studio (Local)</span>
            <span className="status-pill online" title="Local Ollama at http://localhost:11434/v1">🦙 Ollama (Local)</span>
            <span className="status-pill ready" title="Google Gemini 2.0 Flash API">✨ Gemini 2.0</span>
            <span 
              className="status-pill online" 
              style={{ cursor: 'pointer' }}
              onClick={() => setIsSocialPublisherOpen(true)}
              title="Upload-Post Universal Social Media API (12+ networks)"
            >
              📡 Upload-Post API
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginLeft: '0.25rem' }}>
              — Click any app below for 1-Click Launch & Deploy
            </span>
          </div>

          <div className="hero-metrics">
            <div className="metric-card">
              <div className="metric-value">
                <Sparkles size={20} className="text-indigo-400" />
                <span>50+</span>
              </div>
              <div className="metric-label">Complete SaaS Apps</div>
            </div>

            <div className="metric-card">
              <div className="metric-value">
                <DollarSign size={20} className="text-emerald-400" />
                <span>~95%</span>
              </div>
              <div className="metric-label">Average Profit Margin</div>
            </div>

            <div className="metric-card">
              <div className="metric-value">
                <ShieldCheck size={20} className="text-purple-400" />
                <span>MIT</span>
              </div>
              <div className="metric-label">Open Source License</div>
            </div>

            <div className="metric-card">
              <div className="metric-value">
                <Zap size={20} className="text-amber-400" />
                <span>1-Click</span>
              </div>
              <div className="metric-label">Vercel Deployment</div>
            </div>
          </div>
        </section>

        {/* Profit Calculator */}
        <section id="calculator" className="calculator-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <TrendingUp size={20} style={{ color: '#10b981' }} />
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Interactive SaaS Margin Calculator</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Estimate your Monthly Recurring Revenue (MRR) and gross margins across any product template.
              </p>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '0.4rem 0.85rem', borderRadius: '8px', color: '#6ee7b7', fontSize: '0.8rem', fontWeight: 600 }}>
              Typical Model: Resell AI compute with 90-95% margins
            </div>
          </div>

          <div className="calc-grid">
            <div>
              <div className="calc-input-group">
                <div className="calc-label">
                  <span>Paying Customers / Month:</span>
                  <span className="calc-val">{userCount.toLocaleString()} customers</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="2000" 
                  step="10"
                  value={userCount} 
                  onChange={(e) => setUserCount(Number(e.target.value))} 
                  className="calc-slider"
                />
              </div>

              <div className="calc-input-group">
                <div className="calc-label">
                  <span>You Charge Users (Per Pack/Month):</span>
                  <span className="calc-val">${pricePerUnit.toFixed(2)}</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="149" 
                  step="1"
                  value={pricePerUnit} 
                  onChange={(e) => setPricePerUnit(Number(e.target.value))} 
                  className="calc-slider"
                />
              </div>

              <div className="calc-input-group">
                <div className="calc-label">
                  <span>AI API Compute Cost (Per Pack/User):</span>
                  <span className="calc-val">${costPerUnit.toFixed(2)}</span>
                </div>
                <input 
                  type="range" 
                  min="0.2" 
                  max="15" 
                  step="0.1"
                  value={costPerUnit} 
                  onChange={(e) => setCostPerUnit(Number(e.target.value))} 
                  className="calc-slider"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                <button 
                  onClick={() => { setPricePerUnit(29); setCostPerUnit(1.5); }}
                  className="btn-ghost"
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                >
                  Preset: Headshots ($29)
                </button>
                <button 
                  onClick={() => { setPricePerUnit(49); setCostPerUnit(3.0); }}
                  className="btn-ghost"
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                >
                  Preset: Video Shorts ($49)
                </button>
                <button 
                  onClick={() => { setPricePerUnit(19); setCostPerUnit(0.8); }}
                  className="btn-ghost"
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                >
                  Preset: E-commerce ($19)
                </button>
              </div>
            </div>

            <div className="calc-result-box">
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Estimated Net Profit (MRR)
                </span>
                <div className="profit-highlight">
                  ${netProfit.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/mo</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', margin: '1rem 0' }}>
                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Gross Revenue</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    ${grossRevenue.toLocaleString()}
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>AI Compute Cost</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f87171' }}>
                    ${computeCost.toLocaleString()}
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Profit Margin</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>
                    {marginPercentage}%
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Annual Run-Rate</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#a7f3d0' }}>
                    ${annualProfit.toLocaleString()}/yr
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                *Based on standard MuAPI / OpenAI / Claude API compute pricing with zero middleman royalty fees.
              </p>
            </div>
          </div>
        </section>

        {/* Controls Bar: Search & Category Chips */}
        <section className="controls-bar">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div className="search-input-wrapper">
              <Search className="search-icon" size={18} />
              <input 
                type="text" 
                placeholder="Search by app name, keywords, competitors (e.g. Midjourney, Opus Clip, Jasper)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={onlyWithDemos} 
                  onChange={(e) => setOnlyWithDemos(e.target.checked)}
                  style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                Live Demos Only
              </label>

              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={onlyLocalRepo} 
                  onChange={(e) => setOnlyLocalRepo(e.target.checked)}
                  style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                In Local Workspace
              </label>
            </div>
          </div>

          <div className="category-chips">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`chip-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              >
                <span>{cat.label}</span>
                <span style={{ opacity: 0.6, fontSize: '0.75rem' }}>({cat.count})</span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            <span>Showing {filteredApps.length} of {AI_APPS.length} applications</span>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Clear Search
              </button>
            )}
          </div>
        </section>

        {/* Apps Grid */}
        <section className="apps-grid">
          {filteredApps.map((app) => (
            <div 
              key={app.id} 
              className="app-card"
              onClick={() => setSelectedAppForLaunch(app)}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <div className="card-top">
                  <span className="card-category-badge">{app.categoryLabel}</span>
                  {app.stars && (
                    <span className="card-stars">
                      ★ {app.stars}
                    </span>
                  )}
                </div>

                <h3 className="card-title">{app.name}</h3>
                <p className="card-tagline">{app.tagline}</p>

                <div className="card-compete">
                  <div className="card-compete-title">Direct Competitor Target</div>
                  <div className="card-compete-text">{app.competingWith}</div>
                </div>

                <div className="card-tags">
                  {app.tags.map((tag, idx) => (
                    <span key={idx} className="card-tag">{tag}</span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
                  <span>Price Benchmark: <strong style={{ color: '#e2e8f0' }}>{app.typicalPricing}</strong></span>
                  {app.hasLocalCode && (
                    <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle2 size={12} /> Local Source
                    </span>
                  )}
                </div>

                <div className="card-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAppForLaunch(app);
                      }}
                      className="btn-card-launch"
                    >
                      <Play size={12} />
                      <span>Run & Deploy</span>
                    </button>
                  </div>

                  <div className="card-links">
                    {app.demoUrl && (
                      <a 
                        href={app.demoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={(e) => e.stopPropagation()}
                        className="btn-card-demo"
                      >
                        <Globe size={13} />
                        <span>Demo</span>
                      </a>
                    )}
                    <a 
                      href={app.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                      className="btn-card-gh"
                    >
                      <Github size={13} />
                      <span>Code</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Quickstart Section */}
        <section id="quickstart" className="quickstart-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Terminal size={24} style={{ color: 'var(--primary)' }} />
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Quick Start: Run Any App Locally & Deploy</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Every template in this repository shares the same unified stack.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#e0e7ff', marginBottom: '0.5rem' }}>
                1. Navigate to Any App
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
                Select any subfolder in this workspace (e.g. AI Headshots):
              </p>
              <pre className="code-block">
cd image_generation/ai-headshot-generator
npm install
              </pre>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#e0e7ff', marginBottom: '0.5rem' }}>
                2. Configure Environment
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
                Copy `.env.example` and add your database & Stripe keys:
              </p>
              <pre className="code-block">
cp .env.example .env
# Set DATABASE_URL, STRIPE_SECRET_KEY, NEXTAUTH_SECRET
              </pre>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#e0e7ff', marginBottom: '0.5rem' }}>
                3. Push DB & Launch Dev
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
                Sync Prisma schema and launch the local server:
              </p>
              <pre className="code-block">
npx prisma db push
npm run dev
              </pre>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.25rem', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(236,72,153,0.05))', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
                  Deploying to Vercel
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  This master hub and all individual sub-apps are 100% Vercel-ready with zero configuration needed.
                </p>
              </div>
              <a 
                href="https://vercel.com/new" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary"
              >
                <span>Deploy on Vercel</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <p>
            Awesome Generative AI Apps Hub • MIT Licensed • Synchronized daily with upstream 
            <a 
              href="https://github.com/Anil-matcha/awesome-generative-ai-apps" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#818cf8', marginLeft: '0.35rem', textDecoration: 'none' }}
            >
              Anil-matcha/awesome-generative-ai-apps
            </a>
          </p>
        </footer>
      </main>

      {/* Interactive Quick Start & Deploy Modal */}
      {selectedAppForLaunch && (
        <QuickStartModal 
          app={selectedAppForLaunch} 
          onClose={() => setSelectedAppForLaunch(null)} 
        />
      )}

      {/* Universal Upload-Post Social Media Publisher Modal */}
      <SocialPublisherModal 
        isOpen={isSocialPublisherOpen} 
        onClose={() => setIsSocialPublisherOpen(false)} 
      />
    </>
  );
}
