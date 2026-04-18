import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import cvFile from "./assets/MAHMOUD_AHMED_CV_ATS.pdf";
import charImg from "./assets/character.png";

const CV_LINK = cvFile;
const LINKEDIN_URL = "https://www.linkedin.com/in/eng-mahmoud-saad-635185249/";
const YOUTUBE_URL = "https://www.youtube.com/@mahmoudabdelhady6253";

const T = {
  bg:          "#09090b",
  card:        "rgba(20,20,23,0.8)",
  border:      "rgba(255,255,255,0.07)",
  borderHover: "rgba(245,158,11,0.5)",
  accent:      "#f59e0b",
  accentGlow:  "rgba(245,158,11,0.22)",
  accentSoft:  "rgba(245,158,11,0.08)",
  white:       "#fafafa",
  muted:       "#a1a1aa",
  dim:         "#52525b",
  green:       "#10b981",
  surface:     "rgba(255,255,255,0.025)",
  surfaceHov:  "rgba(255,255,255,0.045)",
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icons = {
  Mail:       () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Phone:      () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  MapPin:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  Linkedin:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  ArrowRight: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  Check:      () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>,
  Download:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  ChevronDown:() => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 9 6 6 6-6"/></svg>,
  Menu:       () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  X:          () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Youtube:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>,
};

// ─── Shared Components ────────────────────────────────────────────────────────

function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const d = document.documentElement;
      setPct((d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100 || 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return <div className="scroll-progress" style={{ transform: `scaleX(${pct / 100})` }} />;
}

function Reveal({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function Counter({ end, suffix = "" }) {
  const [val, setVal] = useState(0);
  const [go, setGo] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !go) setGo(true); },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [go]);
  useEffect(() => {
    if (!go) return;
    let n = 0;
    const step = Math.max(1, Math.ceil(end / 50));
    const t = setInterval(() => {
      n += step;
      if (n >= end) { setVal(end); clearInterval(t); }
      else setVal(n);
    }, 22);
    return () => clearInterval(t);
  }, [end, go]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function AmbientBackground() {
  return (
    <div className="ambient-bg" aria-hidden="true">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="noise-overlay" />
      <div className="dot-grid" />
    </div>
  );
}

function HeroVisual() {
  const [msgIdx, setMsgIdx] = useState(0);
  const msgs = [
    "Welcome to my portfolio!",
    "How can I help you today?",
    "Need an engineering tutor?",
    "Building things is my passion!",
    "Let's create something great!",
    "Check out my YouTube channel!",
    "Success starts with a plan.",
    "Calculus 1 & 2 are my specialty!",
    "Solving problems, one at a time.",
    "Ready for our next project?",
    "Innovation in every design.",
    "Welcome! Click me for more!",
  ];

  const nextMsg = () => setMsgIdx((i) => (i + 1) % msgs.length);

  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="bp-frame">
        <svg className="bp-svg" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="380" height="380" rx="4"
            stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.2"/>
          <line x1="200" y1="10" x2="200" y2="390" stroke="currentColor" strokeWidth="0.5" opacity="0.22"/>
          <line x1="10"  y1="200" x2="390" y2="200" stroke="currentColor" strokeWidth="0.5" opacity="0.22"/>
          <line x1="10"  y1="10"  x2="390" y2="390" stroke="currentColor" strokeWidth="0.3" opacity="0.1"/>
          <line x1="390" y1="10"  x2="10"  y2="390" stroke="currentColor" strokeWidth="0.3" opacity="0.1"/>
          <circle cx="200" cy="200" r="175" stroke="currentColor" strokeWidth="0.5" opacity="0.12"/>
          <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 6" opacity="0.18"/>
          <circle cx="200" cy="200" r="105" stroke="currentColor" strokeWidth="1"   opacity="0.28"/>
          <circle cx="200" cy="200" r="70"  stroke="currentColor" strokeWidth="1.5" opacity="0.38"/>
          <circle cx="200" cy="200" r="35"  stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
          <circle cx="200" cy="200" r="12"  fill="currentColor"   opacity="0.55"/>
          <circle cx="200" cy="200" r="5"   fill="currentColor"   opacity="0.9"/>
          <path d="M15 15 L15 48 M15 15 L48 15"   stroke="currentColor" strokeWidth="1.5" opacity="0.65"/>
          <path d="M385 15 L385 48 M385 15 L352 15" stroke="currentColor" strokeWidth="1.5" opacity="0.65"/>
          <path d="M15 385 L15 352 M15 385 L48 385"  stroke="currentColor" strokeWidth="1.5" opacity="0.65"/>
          <path d="M385 385 L385 352 M385 385 L352 385" stroke="currentColor" strokeWidth="1.5" opacity="0.65"/>
          <line x1="15"  y1="200" x2="60"  y2="200" stroke="currentColor" strokeWidth="1" opacity="0.45"/>
          <line x1="340" y1="200" x2="385" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.45"/>
          <line x1="200" y1="15"  x2="200" y2="60"  stroke="currentColor" strokeWidth="1" opacity="0.45"/>
          <line x1="200" y1="340" x2="200" y2="385" stroke="currentColor" strokeWidth="1" opacity="0.45"/>
          <circle cx="200" cy="60"  r="3.5" fill="currentColor" opacity="0.55"/>
          <circle cx="200" cy="340" r="3.5" fill="currentColor" opacity="0.55"/>
          <circle cx="60"  cy="200" r="3.5" fill="currentColor" opacity="0.55"/>
          <circle cx="340" cy="200" r="3.5" fill="currentColor" opacity="0.55"/>
          <circle cx="151" cy="151" r="2.5" fill="currentColor" opacity="0.3"/>
          <circle cx="249" cy="151" r="2.5" fill="currentColor" opacity="0.3"/>
          <circle cx="151" cy="249" r="2.5" fill="currentColor" opacity="0.3"/>
          <circle cx="249" cy="249" r="2.5" fill="currentColor" opacity="0.3"/>
        </svg>
        <div className="char-wrap" onClick={nextMsg} style={{ cursor: "pointer" }}>
          <div className="char-circle">
            <img src={charImg} alt="Welcome" className="hero-char" />
          </div>
          <div className="welcome-bubble">{msgs[msgIdx]}</div>
        </div>
        <div className="float-tag ft-tl">AutoCAD</div>
        <div className="float-tag ft-tr">SAP2000</div>
        <div className="float-tag ft-bl">Site Supervision</div>
        <div className="float-tag ft-br">Structural Design</div>
      </div>
      <p className="hero-bg-word">ENGINEER</p>
    </div>
  );
}

function MobileMenu({ pages, activePage, navigate }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const overlay = (
    <div className={`mobile-overlay ${open ? "open" : ""}`} onClick={close}>
      <nav className="mobile-nav" onClick={e => e.stopPropagation()}>
        <div className="mobile-logo">M<span>.</span>Saad</div>
        <div className="mobile-nav-list">
          {pages.map((p, i) => (
            <button key={p}
              className={`mobile-nav-item ${activePage === p ? "active" : ""}`}
              onClick={() => { navigate(p); close(); }}>
              <span className="mobile-num">0{i + 1}</span>{p}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );

  return (
    <>
      <button className="hamburger" onClick={() => setOpen(o => !o)} aria-label={open ? "Close menu" : "Open menu"}>
        {open ? <Icons.X /> : <Icons.Menu />}
      </button>
      {ReactDOM.createPortal(overlay, document.body)}
    </>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ eyebrow, title, accent }) {
  return (
    <div className="section-header">
      <Reveal>
        <p className="eyebrow"><span className="eyebrow-line" />{eyebrow}</p>
        <h2 className="section-title">
          {title}<br />
          <em className="section-em">{accent}</em>
        </h2>
      </Reveal>
    </div>
  );
}

// ─── Pages ───────────────────────────────────────────────────────────────────
function YouTubeSection() {
  return (
    <div className="page-section section-yt">
      <div className="section-wrap">
        <SectionHeader eyebrow="Content Creation" title="Educational content," accent="on YouTube." />
        <div className="card yt-card">
          <div className="yt-grid">
            <div className="yt-info">
              <h3 className="yt-title">Engineering & Mathematics Tutorials</h3>
              <p className="yt-desc">
                I share my knowledge through detailed tutorials, simplifying complex civil engineering 
                concepts and mathematics for university and high school students.
              </p>
              <div className="yt-benefits">
                <div className="yt-benefit">
                  <span className="check-icon"><Icons.Check /></span>
                  <span>Visual explanations for complex theories</span>
                </div>
                <div className="yt-benefit">
                  <span className="check-icon"><Icons.Check /></span>
                  <span>Practical engineering software guides</span>
                </div>
              </div>
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <Icons.Youtube /> Visit My Channel
              </a>
            </div>
            <div className="yt-visual">
              <div className="yt-thumb">
                <div className="yt-overlay">
                  <div className="yt-play"><Icons.Youtube /></div>
                </div>
                <div className="yt-skeleton">
                  <div className="yt-skel-line" />
                  <div className="yt-skel-line" />
                  <div className="yt-skel-line" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage({ onNavigate }) {
  return (
    <div>
    <div className="page-home">
      <div className="hero-wrap">
        <div className="hero-left">
          <Reveal>
            <span className="status-pill">
              <span className="status-dot" />
              Available for opportunities
            </span>
          </Reveal>

          <Reveal delay={0.12}>
            <h1 className="hero-name">
              <span className="hn-1">Mahmoud</span>
              <span className="hn-2">Ahmed <em>Saad</em></span>
            </h1>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="hero-role-row">
              <span className="role-bar" />
              <span className="role-text">Civil Engineer · Math Tutor · Site Supervisor</span>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="hero-bio">
              Specializing in <span className="bio-hl">site supervision</span>,{" "}
              <span className="bio-hl">structural analysis</span>, and technical office operations.
              Building strong foundations — in concrete and in knowledge.
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="hero-btns">
              <a href={CV_LINK} download="Mahmoud_Ahmed_Saad_CV.pdf" className="btn-primary">
                <Icons.Download /> Download CV
              </a>
              <button className="btn-ghost" onClick={() => onNavigate("Contact")}>
                Get in Touch <Icons.ArrowRight />
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.5}>
            <div className="hero-stats">
              {[
                { n: 4, s: "+", l: "Professional Roles"  },
                { n: 3, s: "",  l: "Languages Spoken"    },
                { n: 9, s: "+", l: "Months on Site"      },
              ].map((st, i) => (
                <div key={i} className="stat-cell">
                  <span className="stat-num"><Counter end={st.n} suffix={st.s} /></span>
                  <span className="stat-lbl">{st.l}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="hero-right">
          <HeroVisual />
        </div>
      </div>

      <div className="scroll-cue">
        <span className="scroll-cue-text">Scroll to explore</span>
        <span className="scroll-cue-icon"><Icons.ChevronDown /></span>
      </div>
    </div>

    <div className="home-sec"><ExperiencePage /></div>
    <div className="home-sec"><YouTubeSection /></div>
    <div className="home-sec"><SkillsPage /></div>
    <div className="home-sec"><ContactPage /></div>
    </div>
  );
}

function ExperiencePage() {
  const jobs = [
    {
      co: "Mathematics Tutor",
      role: "High School Mathematics Tutor · Part Time",
      loc: "Bakırköy, Istanbul", date: "Apr 2026 – Present", tag: "current",
      bullets: [
        "Specializing in private home mathematics lessons for high school students, simplifying complex concepts.",
        "Improving academic performance and exam readiness through structured, individual tutoring.",
        "Highly experienced in adaptive, student-centered teaching across various math levels.",
      ],
    },
    {
      co: "Dream Mart Şti.",
      role: "Online Shopping & Order Coordination",
      loc: "Istanbul, Turkey", date: "Oct 2025 – Present", tag: "current",
      bullets: [
        "Managed e-commerce operations for cross-border delivery from Turkey to Arab countries.",
        "Inspected products for accuracy, authenticity, and conformity with customer orders.",
        "Organized delivery schedules, shipment timelines, and final quality checks.",
      ],
    },
    {
      co: "OMRAN TRK",
      role: "Intern Civil Engineer · Full Time",
      loc: "Yalova, Turkey", date: "Apr 2025 – Sep 2025", tag: "engineering",
      bullets: [
        "Assisted in on-site construction including foundations, reinforcement, and concrete pouring.",
        "Conducted site supervision ensuring adherence to structural drawings and safety standards.",
        "Gained experience in quantity take-offs, structural drawings, and team coordination.",
      ],
    },
    {
      co: "ENSHAA İnşaat Taahhüt Ltd. Şti.",
      role: "Intern Civil Engineer · Full Time",
      loc: "Istanbul, Turkey", date: "Jan 2025 – Mar 2025", tag: "engineering",
      bullets: [
        "Site supervision of foundation, steel reinforcement, and concrete works.",
        "Ensured compliance with structural drawings, specifications, and safety regulations.",
        "Supported engineers in site execution, technical office tasks, and coordination.",
      ],
    },
    {
      co: "Mathematics & Engineering Tutor",
      role: "Academic Peer Tutoring · Private Lessons",
      loc: "Istanbul (In-Home & Online)", date: "2021 – 2025", tag: "teaching",
      bullets: [
        "Specializing in private in-home and online mathematics tutoring for students.",
        "Subjects: Calculus I & II, Differential Equations, Reinforced Concrete I & II.",
        "Experienced in teaching Middle School, High School, and University levels.",
        "Recognized for clear explanations, structured delivery, and patient interaction.",
      ],
    },
  ];

  const tagMeta = {
    current:     { label: "Current",     cls: "chip-current"     },
    engineering: { label: "Engineering", cls: "chip-engineering" },
    teaching:    { label: "Teaching",    cls: "chip-teaching"    },
  };

  return (
    <div className="page-section">
      <div className="section-wrap">
        <SectionHeader eyebrow="Career Path" title="Building experience," accent="one project at a time." />
        <div className="timeline">
          {jobs.map((job, i) => {
            const { label, cls } = tagMeta[job.tag];
            return (
              <Reveal key={i} delay={i * 0.07}>
                <div className="tl-item">
                  <div className={`tl-dot ${job.tag === "current" ? "tl-dot-live" : ""}`} />
                  <div className="card tl-card">
                    <div className="tl-head">
                      <div className="tl-title-row">
                        <h3 className="tl-co">{job.co}</h3>
                        <span className={`chip ${cls}`}>{label}</span>
                      </div>
                      <div className="tl-meta">
                        <span className="tl-loc">{job.loc}</span>
                        <span className="tl-date">{job.date}</span>
                      </div>
                    </div>
                    <p className="tl-role">{job.role}</p>
                    <ul className="tl-bullets">
                      {job.bullets.map((b, bi) => (
                        <li key={bi}>
                          <span className="check-icon"><Icons.Check /></span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SkillsPage() {
  const services = [
    { num: "01", title: "Site Supervision",    desc: "On-site construction supervision for foundations, reinforcement, and concrete works with strict safety compliance.", tags: ["Foundations", "Concrete", "Safety"] },
    { num: "02", title: "Technical Office",     desc: "Quantity take-offs, structural drawing interpretation, documentation, and coordination between site and office.", tags: ["Take-offs", "Drawings", "Reports"] },
    { num: "03", title: "Mathematics Tutoring",       desc: "Comprehensive private and online tutoring for Middle School, High School, and University students. Expert guidance in Calculus 1 & 2, Differential Equations, and Civil Engineering courses.", tags: ["Calculus 1 & 2", "Middle & High School", "University Math"] },
    { num: "04", title: "Engineering Software", desc: "Structural design and analysis using AutoCAD for drafting and SAP2000 for structural modeling and load analysis.", tags: ["AutoCAD", "SAP2000", "Engineering Apps"] },
  ];

  const tools = ["AutoCAD", "SAP2000", "Civil Engineering Software Apps", "CapCut", "Canva", "Microsoft Office", "Excel", "Structural Analysis", "Quantity Take-offs", "Reinforced Concrete Design", "Foundation Design", "Site Supervision", "Technical Documentation"];

  return (
    <div className="page-section">
      <div className="section-wrap">
        <SectionHeader eyebrow="What I Offer" title="Skills designed to" accent="deliver results." />

        <div className="svc-grid">
          {services.map((svc, i) => (
            <Reveal key={i} delay={i * 0.09}>
              <div className="card svc-card">
                <span className="svc-num">{svc.num}</span>
                <h3 className="svc-title">{svc.title}</h3>
                <p className="svc-desc">{svc.desc}</p>
                <div className="chip-row">
                  {svc.tags.map((t, ti) => <span key={ti} className="chip chip-muted">{t}</span>)}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.28}>
          <div className="card tools-card">
            <p className="eyebrow"><span className="eyebrow-line" />Technical Skills &amp; Tools</p>
            <div className="chip-row chip-row-dense">
              {tools.map((t, i) => <span key={i} className="chip chip-accent">{t}</span>)}
            </div>
          </div>
        </Reveal>

        <div className="edu-lang-grid">
          <Reveal delay={0.34}>
            <div className="card edu-card">
              <p className="eyebrow"><span className="eyebrow-line" />Education</p>
              <h3 className="edu-degree">B.Sc. Civil Engineering</h3>
              <p className="edu-school">Istanbul Nişantaşı University</p>
              <p className="edu-date">Sep 2021 – Jul 2025</p>
            </div>
          </Reveal>
          <Reveal delay={0.42}>
            <div className="card lang-card">
              <p className="eyebrow"><span className="eyebrow-line" />Languages</p>
              <div className="lang-list">
                {[["Arabic", "Native", 100], ["English", "Fluent", 90], ["Turkish", "Fluent", 85]].map(([lang, lvl, pct], i) => (
                  <div key={i} className="lang-item">
                    <div className="lang-row">
                      <span className="lang-name">{lang}</span>
                      <span className="lang-level">{lvl}</span>
                    </div>
                    <div className="prog-track">
                      <div className="prog-fill" style={{ width: `${pct}%`, transitionDelay: `${0.5 + i * 0.12}s` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.5}>
          <div className="card vol-card">
            <div>
              <p className="eyebrow"><span className="eyebrow-line" />Volunteering</p>
              <h3 className="vol-title">Genç Türk Kızılay</h3>
              <p className="vol-desc">Humanitarian campaigns, sports events, and community leadership</p>
            </div>
            <span className="vol-date">May 2021 – Feb 2022</span>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle, sending, success, error
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setStatus("sending");
    
    try {
      // Using your real Formspree ID
      const response = await fetch("https://formspree.io/f/mlgabyab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _subject: `New Portfolio Message from ${form.name}`
        })
      });
      
      if (response.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  const contacts = [
    { icon: <Icons.Mail />,     label: "Email",            value: "mabdelhady322@gmail.com", href: "mailto:mabdelhady322@gmail.com" },
    { icon: <Icons.Phone />,    label: "Phone / WhatsApp", value: "+90 544 185 19 08",        href: "tel:+905441851908"              },
    { icon: <Icons.Linkedin />, label: "LinkedIn",         value: "View Profile →",           href: LINKEDIN_URL                     },
    { icon: <Icons.Youtube />,  label: "YouTube",          value: "Watch Tutorials →",        href: YOUTUBE_URL                      },
    { icon: <Icons.MapPin />,   label: "Location",         value: "Istanbul, Turkey",         href: null                             },
  ];

  return (
    <div className="page-section">
      <div className="section-wrap">
        <SectionHeader eyebrow="Get in Touch" title="Let's build something" accent="remarkable together." />
        <p className="section-desc">Have a project or opportunity? I'd love to hear about it. Send me a message and I'll get back to you within 24 hours.</p>

        <div className="contact-grid">
          {contacts.map((c, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="card contact-card">
                <span className="contact-icon-wrap">{c.icon}</span>
                <div>
                  <p className="contact-lbl">{c.label}</p>
                  {c.href ? (
                    <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer" className="contact-val contact-link">
                      {c.value}
                    </a>
                  ) : (
                    <p className="contact-val">{c.value}</p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div className="card form-card">
            <form onSubmit={submit}>
              <div className="form-row">
                <div className="field">
                  <label>Your Name</label>
                  <input type="text" placeholder="John Doe" required value={form.name} onChange={set("name")} />
                </div>
                <div className="field">
                  <label>Email Address</label>
                  <input type="email" placeholder="john@example.com" required value={form.email} onChange={set("email")} />
                </div>
              </div>
              <div className="field">
                <label>Message</label>
                <textarea rows={5} placeholder="Tell me about your project or opportunity…" required
                  value={form.message} onChange={set("message")} />
              </div>
              <button type="submit" className="btn-primary" disabled={status !== "idle"}>
                {status === "idle" && <><Icons.ArrowRight /> Send Message</>}
                {status === "sending" && "Sending..."}
                {status === "success" && "Success!"}
                {status === "error" && "Try Again"}
              </button>
              {status === "success" && (
                <p style={{ color: "var(--green)", fontSize: "13px", marginTop: "12px", fontWeight: "500" }}>
                  Thank you! Your message has been sent successfully.
                </p>
              )}
              {status === "error" && (
                <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "12px", fontWeight: "500" }}>
                  Something went wrong. Please try again or email me directly.
                </p>
              )}
            </form>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

const PAGES = ["Home", "Experience", "Skills", "Contact"];

export default function App() {
  const [activePage,   setActivePage]   = useState("Home");
  const [displayPage,  setDisplayPage]  = useState("Home");
  const [isExiting,    setIsExiting]    = useState(false);
  const [mousePos,     setMousePos]     = useState({ x: -400, y: -400 });

  useEffect(() => {
    const onMouse = e => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMouse);
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  const navigate = useCallback((page) => {
    if (page === activePage || isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      setActivePage(page);
      setDisplayPage(page);
      setIsExiting(false);
    }, 260);
  }, [activePage, isExiting]);

  return (
    <>
      <style>{css(T)}</style>

      <AmbientBackground />
      <div className="cursor-glow" style={{ left: mousePos.x, top: mousePos.y }} />

      <div className="app-wrap">
        <nav className="navbar">
          <div className="nav-inner">
            <button className="nav-logo" onClick={() => navigate("Home")}>
              M<span className="logo-dot">.</span>Saad
            </button>

            <div className="nav-links">
              {PAGES.map(p => (
                <button key={p} className={`nav-item ${activePage === p ? "nav-active" : ""}`}
                  onClick={() => navigate(p)}>
                  {p}
                  {activePage === p && <span className="nav-pip" />}
                </button>
              ))}
            </div>

            <div className="nav-end">
              <button className={`btn-hire ${activePage === "Contact" ? "btn-hire-on" : ""}`}
                onClick={() => navigate("Contact")}>
                Hire Me
              </button>
              <MobileMenu pages={PAGES} activePage={activePage} navigate={navigate} />
            </div>
          </div>
        </nav>

        <main className="main">
          <div key={displayPage} className={`page-wrap ${isExiting ? "page-exit" : "page-enter"}`}>
            {displayPage === "Home"       && <HomePage       onNavigate={navigate} />}
            {displayPage === "Experience" && <ExperiencePage />}
            {displayPage === "Skills"     && <SkillsPage />}
            {displayPage === "Contact"    && <ContactPage />}
          </div>
        </main>

        <footer className="footer">
          <div className="nav-inner footer-inner">
            <span className="footer-copy">© 2026 Mahmoud Ahmed Saad — Civil Engineer</span>
            <div className="footer-links">
              <a href="mailto:mabdelhady322@gmail.com" className="footer-link">Email</a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="footer-link">YouTube</a>
              <span className="footer-loc">Istanbul, Turkey</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────

const css = (T) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');

  :root {
    --bg:          ${T.bg};
    --card:        ${T.card};
    --border:      ${T.border};
    --border-hov:  ${T.borderHover};
    --accent:      ${T.accent};
    --glow:        ${T.accentGlow};
    --soft:        ${T.accentSoft};
    --white:       ${T.white};
    --muted:       ${T.muted};
    --dim:         ${T.dim};
    --green:       ${T.green};
    --surface:     ${T.surface};
    --surface-hov: ${T.surfaceHov};
    --sans:        'Inter', system-ui, sans-serif;
    --display:     'Inter', system-ui, sans-serif;
    --nav-h:       72px;
  }

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    background: var(--bg); color: var(--white);
    font-family: var(--sans); line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* ─── Ambient background ─── */
  .ambient-bg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 80% 55% at 60% -10%, rgba(245,158,11,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 55% 50% at 10% 90%, rgba(82,82,91,0.15) 0%, transparent 60%),
      var(--bg);
  }
  .orb {
    position: absolute; border-radius: 50%;
    filter: blur(100px); will-change: transform;
    animation: orbFloat 26s ease-in-out infinite alternate;
  }
  .orb-1 { width: 55vw; height: 55vw; top: -15%; right: -10%; background: rgba(245,158,11,0.09); animation-duration: 30s; }
  .orb-2 { width: 45vw; height: 45vw; bottom: -12%; left: -8%; background: rgba(82,82,91,0.2); animation-duration: 22s; animation-delay: -9s; }
  .orb-3 { width: 28vw; height: 28vw; top: 45%; left: 32%; background: rgba(245,158,11,0.04); animation-duration: 18s; animation-delay: -4s; }
  .noise-overlay {
    position: absolute; inset: 0; opacity: 0.35;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
  }
  .dot-grid {
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px);
    background-size: 34px 34px;
    mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent);
    -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent);
  }
  @keyframes orbFloat {
    0%   { transform: translate(0,0) scale(1); }
    50%  { transform: translate(-4%,6%) scale(1.06); }
    100% { transform: translate(5%,-4%) scale(0.96); }
  }

  /* ─── Cursor glow ─── */
  .cursor-glow {
    position: fixed; width: 700px; height: 700px; border-radius: 50%;
    background: radial-gradient(circle, rgba(245,158,11,0.065) 0%, transparent 62%);
    pointer-events: none; z-index: 1;
    transform: translate(-50%,-50%);
    transition: left 0.07s linear, top 0.07s linear;
  }

  /* ─── App shell ─── */
  .app-wrap {
    position: relative; z-index: 10;
    display: flex; flex-direction: column;
    height: 100vh; overflow: hidden;
  }

  /* ─── Shared Layout inner ─── */
  .nav-inner {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; max-width: 1240px; margin: 0 auto;
  }
  
  /* ─── Navbar ─── */
  .navbar {
    flex-shrink: 0; z-index: 100;
    height: var(--nav-h); display: flex; align-items: center; justify-content: center;
    padding: 0 6%;
    background: rgba(9,9,11,0.75);
    backdrop-filter: blur(22px) saturate(1.5);
    -webkit-backdrop-filter: blur(22px) saturate(1.5);
    border-bottom: 1px solid var(--border);
    box-shadow: 0 1px 0 rgba(255,255,255,0.02), 0 4px 20px rgba(0,0,0,0.25);
  }
  .nav-logo {
    font-family: var(--display); font-size: 22px; font-weight: 800;
    color: var(--white); background: none; border: none; cursor: pointer;
    letter-spacing: -0.03em; padding: 0; line-height: 1;
    transition: opacity 0.2s;
  }
  .nav-logo:hover { opacity: 0.8; }
  .logo-dot { color: var(--accent); }
  .nav-links { display: flex; align-items: center; gap: 2px; }
  .nav-item {
    position: relative; background: none; border: none; cursor: pointer;
    padding: 8px 16px; color: var(--muted); font-family: var(--sans);
    font-size: 14px; font-weight: 500; border-radius: 8px;
    transition: color 0.2s, background 0.2s;
    display: flex; flex-direction: column; align-items: center; gap: 4px;
  }
  .nav-item:hover { color: var(--white); background: var(--surface); }
  .nav-active { color: var(--white); }
  .nav-pip {
    position: absolute; bottom: 3px; left: 50%; transform: translateX(-50%);
    width: 4px; height: 4px; border-radius: 50%;
    background: var(--accent); box-shadow: 0 0 8px var(--accent);
    animation: pipIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes pipIn { from { opacity: 0; transform: translateX(-50%) scale(0); } to { opacity: 1; transform: translateX(-50%) scale(1); } }
  .nav-end { display: flex; align-items: center; gap: 10px; }
  .btn-hire {
    padding: 9px 22px; background: var(--soft); color: var(--accent);
    border: 1px solid rgba(245,158,11,0.3); border-radius: 100px;
    font-size: 13px; font-weight: 600; cursor: pointer; font-family: var(--sans);
    transition: all 0.25s ease; white-space: nowrap; letter-spacing: 0.01em;
  }
  .btn-hire:hover, .btn-hire-on {
    background: var(--accent); color: var(--bg);
    border-color: var(--accent); box-shadow: 0 0 24px var(--glow);
  }

  /* ─── Main + page transitions ─── */
  .main {
    flex: 1; position: relative; overflow: hidden;
    min-height: 0;
  }
  .page-wrap {
    position: absolute; inset: 0;
    overflow-y: auto; overflow-x: hidden;
  }
  .page-wrap::-webkit-scrollbar { width: 4px; }
  .page-wrap::-webkit-scrollbar-track { background: transparent; }
  .page-wrap::-webkit-scrollbar-thumb { background: var(--surface-hov); border-radius: 4px; }
  .page-enter { animation: pageEnter 0.38s cubic-bezier(0.22,1,0.36,1) both; }
  .page-exit  { animation: pageExit  0.26s ease both; }
  @keyframes pageEnter {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pageExit {
    from { opacity: 1; transform: translateY(0); }
    to   { opacity: 0; transform: translateY(-10px); }
  }

  /* ─── Reveal animation removed ─── */

  /* ─── Home page section dividers ─── */
  .home-sec { border-top: 1px solid var(--border); }

  /* ─── Page layouts ─── */
  /* ─── YouTube Section ─── */
  .section-yt { padding-top: 100px; }
  .yt-card { padding: 48px; background: linear-gradient(135deg, rgba(20,20,23,0.9) 0%, rgba(30,30,35,0.8) 100%); }
  .yt-grid { display: grid; grid-template-columns: 1.25fr 0.75fr; gap: 60px; align-items: center; }
  .yt-title { font-family: var(--display); font-size: 32px; font-weight: 800; color: var(--white); margin-bottom: 20px; }
  .yt-desc { font-size: 17px; color: var(--muted); line-height: 1.8; margin-bottom: 30px; }
  .yt-benefits { display: flex; flex-direction: column; gap: 14px; margin-bottom: 36px; }
  .yt-benefit { display: flex; align-items: center; gap: 12px; font-size: 14px; color: var(--white); }
  
  .yt-visual { position: relative; }
  .yt-thumb {
    width: 100%; aspect-ratio: 16/9; background: #18181b; border-radius: 16px;
    border: 1px solid var(--border); overflow: hidden; position: relative;
    display: flex; flex-direction: column; justify-content: flex-end; padding: 20px;
  }
  .yt-overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center; z-index: 2;
    transition: background 0.3s;
  }
  .yt-card:hover .yt-overlay { background: rgba(245,158,11,0.15); }
  .yt-play {
    width: 64px; height: 64px; border-radius: 50%; background: #ff0000;
    color: white; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 30px rgba(255,0,0,0.4); transform: scale(1); transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .yt-card:hover .yt-play { transform: scale(1.1); }
  .yt-skel-line { height: 10px; background: rgba(255,255,255,0.05); border-radius: 100px; margin-top: 8px; }
  .yt-skel-line:nth-child(1) { width: 70%; }
  .yt-skel-line:nth-child(2) { width: 40%; }
  .yt-skel-line:nth-child(3) { width: 90%; }

  .page-home {
    min-height: calc(100vh - var(--nav-h));
    display: flex; flex-direction: column;
    padding: 60px 6% 40px;
  }
  .page-section { padding: 88px 6% 108px; min-height: calc(100vh - var(--nav-h)); }
  .section-wrap { max-width: 1240px; margin: 0 auto; width: 100%; }

  /* ─── Section header ─── */
  .section-header { margin-bottom: 64px; }
  .eyebrow {
    display: flex; align-items: center; gap: 12px;
    font-size: 11px; color: var(--accent); letter-spacing: 0.2em;
    text-transform: uppercase; font-weight: 600; margin-bottom: 18px;
  }
  .eyebrow-line { display: inline-block; width: 26px; height: 1px; background: var(--accent); flex-shrink: 0; }
  .section-title {
    font-family: var(--display); font-size: clamp(34px, 5vw, 62px);
    font-weight: 800; line-height: 1.07; letter-spacing: -0.03em; color: var(--white);
  }
  .section-em { color: var(--muted); font-style: italic; font-weight: 400; }
  .section-desc { font-size: 16px; color: var(--muted); line-height: 1.75; max-width: 520px; margin-bottom: 44px; }

  /* ─── Hero ─── */
  .hero-wrap {
    flex: 1; display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 80px; align-items: center;
    max-width: 1240px; width: 100%; margin: 0 auto;
  }
  .hero-left { display: flex; flex-direction: column; }

  .status-pill {
    display: inline-flex; align-items: center; gap: 9px;
    padding: 8px 18px; background: var(--surface);
    border: 1px solid var(--border); border-radius: 100px;
    font-size: 13px; color: var(--white); font-weight: 500;
    width: fit-content; backdrop-filter: blur(10px);
  }
  .status-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--green); flex-shrink: 0;
    animation: statusPulse 2.4s ease-in-out infinite;
  }
  @keyframes statusPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
    50%       { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
  }

  .hero-name {
    font-family: var(--display); line-height: 1.0;
    letter-spacing: -0.04em; margin: 22px 0 0;
  }
  .hn-1, .hn-2 { display: block; }
  .hn-1 {
    font-size: clamp(52px, 8.5vw, 96px); font-weight: 800; color: var(--white);
  }
  .hn-2 {
    font-size: clamp(52px, 8.5vw, 96px); font-weight: 800;
    background: linear-gradient(125deg, var(--white) 25%, var(--accent) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .hn-2 em {
    font-style: italic; font-weight: 400;
    background: none; -webkit-text-fill-color: var(--muted);
  }

  .hero-role-row { display: flex; align-items: center; gap: 16px; margin-top: 22px; }
  .role-bar  { width: 28px; height: 2px; background: var(--accent); flex-shrink: 0; }
  .role-text { font-size: 13px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500; }

  .hero-bio { font-size: 18px; color: var(--muted); line-height: 1.8; max-width: 620px; margin-top: 24px; }
  .bio-hl { color: var(--white); font-weight: 500; }

  .hero-btns { display: flex; gap: 14px; margin-top: 36px; flex-wrap: wrap; }

  .btn-primary {
    padding: 14px 30px; background: var(--accent); color: var(--bg);
    border: none; border-radius: 100px; font-size: 14px; font-weight: 700;
    cursor: pointer; display: inline-flex; align-items: center; gap: 9px;
    transition: all 0.3s cubic-bezier(0.2,0.8,0.2,1);
    font-family: var(--sans); text-decoration: none; letter-spacing: 0.01em;
  }
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 16px 40px var(--glow), 0 4px 12px rgba(0,0,0,0.3);
  }
  .btn-primary:disabled {
    opacity: 0.6; cursor: not-allowed; transform: none;
    background: var(--dim);
  }
  .btn-ghost {
    padding: 14px 30px; background: transparent; color: var(--white);
    border: 1px solid var(--border); border-radius: 100px;
    font-size: 14px; font-weight: 500; cursor: pointer;
    display: inline-flex; align-items: center; gap: 9px;
    transition: all 0.3s ease; font-family: var(--sans);
  }
  .btn-ghost:hover { background: var(--surface-hov); border-color: var(--border-hov); transform: translateY(-1px); }

  /* Stats */
  .hero-stats {
    display: flex; margin-top: 48px; padding-top: 36px;
    border-top: 1px solid var(--border);
  }
  .stat-cell {
    flex: 1; display: flex; flex-direction: column; gap: 6px;
    padding-right: 32px; position: relative;
  }
  .stat-cell:not(:last-child)::after {
    content: ''; position: absolute; right: 16px; top: 4px; bottom: 4px;
    width: 1px; background: var(--border);
  }
  .stat-num {
    font-family: var(--display); font-size: 44px; font-weight: 800;
    color: var(--white); line-height: 1; letter-spacing: -0.03em;
  }
  .stat-lbl { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 500; }

  /* ─── Hero visual / blueprint ─── */
  .hero-right { display: flex; align-items: center; justify-content: center; }
  .hero-visual { position: relative; width: 100%; max-width: 520px; }
  .bp-frame { position: relative; width: 100%; aspect-ratio: 1; }
  
  .char-wrap {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: clamp(120px, 15vw, 150px); height: clamp(20px, 15vw, 150px);
    z-index: 10;
  }
  .char-circle {
    width: 100%; height: 100%; border-radius: 50%;
    border: 3px solid var(--accent); overflow: hidden;
    background: var(--card); box-shadow: 0 0 40px var(--glow);
    display: flex; align-items: center; justify-content: center;
  }
  .hero-char { width: 100%; height: 100%; object-fit: cover; transform: scale(1.1); }
  
  .welcome-bubble {
    position: absolute; top: -15px; left: 100%;
    transform: none; white-space: nowrap;
    background: var(--accent); color: var(--bg);
    padding: 8px 16px; border-radius: 16px 16px 16px 0;
    font-weight: 800; font-size: 14px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
    animation: float-bubble 3s ease-in-out infinite;
    z-index: 20;
  }
  @keyframes float-bubble {
    0%, 100% { transform: translateY(0) rotate(5deg); }
    50%      { transform: translateY(-8px) rotate(8deg); }
  }

  .bp-svg {
    width: 100%; height: 100%; color: var(--accent);
    animation: bpSpin 90s linear infinite;
    filter: drop-shadow(0 0 24px rgba(245,158,11,0.12));
  }
  @keyframes bpSpin { to { transform: rotate(360deg); } }

  .float-tag {
    position: absolute; background: rgba(20,20,23,0.85);
    border: 1px solid var(--border); border-radius: 100px;
    padding: 7px 16px; font-size: 12px; font-weight: 500;
    color: var(--white); white-space: nowrap;
    backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06);
    letter-spacing: 0.01em;
  }
  .ft-tl { top: 18%; left: -6%;  animation: ftBob 4.8s ease-in-out infinite alternate; }
  .ft-tr { top: 14%; right: -4%; animation: ftBob 5.4s ease-in-out infinite alternate-reverse; }
  .ft-bl { bottom: 22%; left: -9%; animation: ftBob 4.4s ease-in-out infinite alternate; animation-delay: -1.2s; }
  .ft-br { bottom: 17%; right: -5%; animation: ftBob 5.8s ease-in-out infinite alternate-reverse; animation-delay: -2.4s; }
  @keyframes ftBob { from { transform: translateY(0); } to { transform: translateY(-12px); } }

  .hero-bg-word {
    position: absolute; bottom: -8%; right: -14%;
    font-family: var(--display); font-size: clamp(48px, 8vw, 96px);
    font-weight: 900; letter-spacing: -0.07em;
    color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.045);
    user-select: none; pointer-events: none; z-index: -1; white-space: nowrap;
  }

  /* Scroll cue */
  .scroll-cue {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    padding: 32px 0 8px; margin-top: auto; opacity: 0.45;
  }
  .scroll-cue-text { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--dim); }
  .scroll-cue-icon { color: var(--accent); animation: scrollBounce 2.3s ease-in-out infinite; }
  @keyframes scrollBounce { 0%, 100% { transform: translateY(0); } 55% { transform: translateY(7px); } }

  /* ─── Cards ─── */
  .card {
    background: var(--card); border: 1px solid var(--border); border-radius: 20px;
    padding: 28px; position: relative; overflow: hidden;
    backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 3px rgba(0,0,0,0.2);
    transition: border-color 0.4s ease,
                transform 0.4s cubic-bezier(0.2,0.8,0.2,1),
                box-shadow 0.4s ease;
  }
  .card::after {
    content: ''; position: absolute; inset: 0; border-radius: inherit;
    background: linear-gradient(135deg, rgba(245,158,11,0.05) 0%, transparent 55%);
    opacity: 0; transition: opacity 0.4s ease; pointer-events: none;
  }
  .card:hover {
    border-color: var(--border-hov);
    transform: translateY(-5px);
    box-shadow: 0 28px 64px rgba(0,0,0,0.5), 0 0 32px var(--glow),
                inset 0 1px 0 rgba(255,255,255,0.06);
  }
  .card:hover::after { opacity: 1; }

  /* ─── Timeline ─── */
  .timeline {
    display: flex; flex-direction: column; gap: 22px;
    padding-left: 32px; position: relative;
  }
  .timeline::before {
    content: ''; position: absolute; left: 6px; top: 20px;
    height: calc(100% - 44px); width: 1px;
    background: linear-gradient(to bottom, var(--accent), rgba(245,158,11,0.08), transparent);
  }
  .tl-item { position: relative; }
  .tl-dot {
    position: absolute; left: -36px; top: 24px;
    width: 13px; height: 13px; border-radius: 50%;
    border: 2px solid var(--border); background: var(--bg);
    transition: all 0.3s ease; z-index: 2;
  }
  .tl-item:hover .tl-dot { border-color: var(--accent); }
  .tl-dot-live {
    border-color: var(--accent); background: var(--accent);
    box-shadow: 0 0 0 3px var(--soft), 0 0 14px var(--glow);
    animation: livePulse 2.4s ease-in-out infinite;
  }
  @keyframes livePulse {
    0%, 100% { box-shadow: 0 0 0 3px var(--soft), 0 0 14px var(--glow); }
    50%       { box-shadow: 0 0 0 7px rgba(245,158,11,0), 0 0 22px var(--glow); }
  }
  .tl-card { padding: 28px 30px; }
  .tl-head { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; }
  .tl-title-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .tl-co { font-size: 18px; font-weight: 700; color: var(--white); font-family: var(--display); }
  .tl-meta { text-align: right; display: flex; flex-direction: column; align-items: flex-end; }
  .tl-loc  { font-size: 13px; color: var(--muted); font-weight: 500; }
  .tl-date { font-size: 12px; color: var(--dim); margin-top: 4px; font-weight: 600; }
  .tl-role { font-size: 14px; color: var(--accent); margin-top: 10px; font-weight: 600; letter-spacing: 0.01em; }
  .tl-bullets { list-style: none; margin-top: 18px; display: flex; flex-direction: column; gap: 11px; }
  .tl-bullets li { display: flex; align-items: flex-start; gap: 11px; }
  .check-icon { color: var(--accent); flex-shrink: 0; margin-top: 1px; }
  .tl-bullets li span:last-child { font-size: 14px; color: var(--muted); line-height: 1.68; }

  /* ─── Chips / Badges ─── */
  .chip {
    display: inline-block; padding: 4px 12px; border-radius: 100px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;
  }
  .chip-current     { background: var(--soft); color: var(--accent); border: 1px solid rgba(245,158,11,0.22); }
  .chip-engineering { background: rgba(16,185,129,0.1); color: #34d399; border: 1px solid rgba(16,185,129,0.22); }
  .chip-teaching    { background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid rgba(56,189,248,0.22); }
  .chip-muted  { background: var(--surface-hov); color: var(--muted); border: 1px solid var(--border); text-transform: none; letter-spacing: 0; font-size: 12px; font-weight: 500; }
  .chip-accent { background: var(--soft); color: var(--accent); border: 1px solid rgba(245,158,11,0.15); text-transform: none; letter-spacing: 0; font-size: 13px; font-weight: 500; padding: 6px 14px; }
  .chip-row       { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
  .chip-row-dense { margin-top: 16px; }

  /* ─── Skills / Services ─── */
  .svc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .svc-card { display: flex; flex-direction: column; height: 100%; padding: 40px; }
  .svc-num   { font-family: var(--display); font-size: 42px; font-weight: 900; color: var(--accent); opacity: 0.35; line-height: 1; letter-spacing: -0.05em; }
  .svc-title { font-size: 20px; font-weight: 700; color: var(--white); margin-top: 12px; font-family: var(--display); }
  .svc-desc  { font-size: 14px; color: var(--muted); line-height: 1.75; margin-top: 12px; flex: 1; }
  .tools-card { padding: 32px; margin-top: 20px; }

  /* Education / languages */
  .edu-lang-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px; align-items: stretch; }
  .edu-card, .lang-card { padding: 32px; display: flex; flex-direction: column; height: 100%; }
  .lang-card .lang-list { flex: 1; display: flex; flex-direction: column; justify-content: center; }
  .edu-degree { font-size: 18px; font-weight: 700; color: var(--white); margin-top: 16px; font-family: var(--display); }
  .edu-school { font-size: 14px; color: var(--muted); margin-top: 6px; }
  .edu-date   { font-size: 12px; color: var(--dim); margin-top: 8px; font-weight: 500; }

  .lang-list { display: flex; flex-direction: column; gap: 18px; margin-top: 16px; }
  .lang-row   { display: flex; justify-content: space-between; margin-bottom: 7px; }
  .lang-name  { font-size: 14px; font-weight: 500; color: var(--white); }
  .lang-level { font-size: 12px; color: var(--muted); }
  .prog-track { height: 3px; background: var(--surface-hov); border-radius: 3px; overflow: hidden; }
  .prog-fill  { height: 100%; background: linear-gradient(90deg, var(--accent), #fcd34d); border-radius: 3px; width: 0; transition: width 1.3s cubic-bezier(0.22,1,0.36,1); }

  /* Volunteering */
  .vol-card { display: flex; justify-content: space-between; align-items: center; padding: 28px 32px; margin-top: 20px; }
  .vol-title { font-size: 18px; font-weight: 700; color: var(--white); margin-top: 12px; font-family: var(--display); }
  .vol-desc  { font-size: 14px; color: var(--muted); margin-top: 6px; }
  .vol-date  { font-size: 12px; color: var(--dim); font-weight: 500; white-space: nowrap; margin-left: 24px; flex-shrink: 0; }

  /* ─── Contact ─── */
  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
  .contact-card { display: flex; align-items: flex-start; gap: 20px; padding: 28px; }
  .contact-icon-wrap {
    width: 42px; height: 42px; border-radius: 13px;
    background: var(--soft); border: 1px solid rgba(245,158,11,0.2);
    display: flex; align-items: center; justify-content: center;
    color: var(--accent); flex-shrink: 0;
  }
  .contact-lbl  { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; margin-bottom: 4px; }
  .contact-val  { font-size: 14px; color: var(--white); font-weight: 500; word-break: break-all; }
  .contact-link { text-decoration: none; color: var(--white); transition: color 0.2s; display: block; }
  .contact-link:hover { color: var(--accent); }

  /* Form */
  .form-card { padding: 36px; }
  .form-row  { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .field { margin-bottom: 20px; }
  .field label { display: block; font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; margin-bottom: 8px; }
  .field input, .field textarea {
    width: 100%; padding: 14px 16px;
    background: rgba(255,255,255,0.02); border: 1px solid var(--border);
    border-radius: 12px; color: var(--white); font-size: 14px;
    font-family: var(--sans); outline: none; appearance: none;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
  }
  .field textarea { resize: vertical; min-height: 130px; }
  .field input:focus, .field textarea:focus {
    border-color: var(--accent);
    background: rgba(245,158,11,0.03);
    box-shadow: 0 0 0 3px var(--soft);
  }
  .field input::placeholder, .field textarea::placeholder { color: var(--dim); }

  /* ─── Mobile menu ─── */
  .hamburger {
    display: none; align-items: center; justify-content: center;
    background: var(--surface); border: 1px solid var(--border); color: var(--white);
    border-radius: 12px; padding: 10px; cursor: pointer;
    transition: all 0.3s ease; z-index: 2000;
  }
  .hamburger:hover { background: var(--surface-hov); border-color: var(--accent); }
  
  .mobile-overlay {
    position: fixed; inset: 0;
    z-index: 99999;
    display: flex; justify-content: flex-end;
    opacity: 0; pointer-events: none;
    transition: opacity 0.35s ease;
  }
  .mobile-overlay.open { opacity: 1; pointer-events: auto; }
  
  /* Dimmed backdrop — separate element so it doesn't affect the panel */
  .mobile-overlay::before {
    content: '';
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.7);
  }

  .mobile-nav {
    position: relative; /* sit above ::before */
    z-index: 1;
    width: 300px; height: 100%;
    /* Completely opaque — no see-through */
    background-color: #09090b;
    border-left: 2px solid rgba(245,158,11,0.25);
    display: flex; flex-direction: column; padding: 48px 24px 40px;
    transform: translateX(100%);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: -16px 0 60px rgba(0,0,0,0.9);
    overflow-y: auto;
  }
  .mobile-overlay.open .mobile-nav { transform: translateX(0); }
  
  .mobile-logo {
    font-family: var(--display); font-size: 28px; font-weight: 800;
    color: var(--white); margin-bottom: 60px; letter-spacing: -0.02em;
    display: flex; justify-content: space-between; align-items: center;
  }
  .mobile-logo span { color: var(--accent); }
  
  .mobile-nav-list { display: flex; flex-direction: column; gap: 12px; }
  
  .mobile-nav-item {
    background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 16px;
    color: var(--white); font-size: 18px; font-weight: 700; font-family: var(--display);
    padding: 20px 24px; cursor: pointer;
    display: flex; align-items: center; gap: 16px;
    transition: all 0.2s ease; text-align: left;
    width: 100%;
  }
  .mobile-nav-item.active { 
    color: var(--accent); 
    background: var(--soft); 
    border-color: var(--accent);
    box-shadow: 0 8px 20px rgba(245, 158, 11, 0.15);
  }
  .mobile-nav-item:hover  { background: var(--surface-hov); transform: translateX(-4px); }
  .mobile-num { font-size: 12px; color: var(--accent); font-weight: 800; font-family: var(--sans); opacity: 0.6; }

  /* ─── Footer ─── */
  .footer {
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    padding: 0 6%; height: 52px;
    border-top: 1px solid var(--border);
    background: rgba(9,9,11,0.75); backdrop-filter: blur(22px);
    -webkit-backdrop-filter: blur(22px);
    z-index: 50;
  }
  .footer-copy  { font-size: 12px; color: var(--dim); }
  .footer-links { display: flex; align-items: center; gap: 20px; }
  .footer-link  { font-size: 12px; color: var(--dim); text-decoration: none; transition: color 0.2s; }
  .footer-link:hover { color: var(--white); }
  .footer-loc   { font-size: 12px; color: var(--dim); }

  /* ─── Responsive ─── */
  @media (max-width: 1024px) {
    .nav-inner { max-width: 90%; }
    .section-wrap { max-width: 90%; }
    .hero-wrap { grid-template-columns: 1fr; gap: 40px; }
    .hero-right { display: none; }
    .svc-grid { grid-template-columns: 1fr; }
    .edu-lang-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .navbar { padding: 0 20px; }
    .nav-links { display: none; }
    .hamburger { display: flex; }
    .page-home    { padding: 40px 20px 28px; }
    .page-section { padding: 60px 20px 80px; }
    .hn-1, .hn-2  { font-size: clamp(40px, 12vw, 64px); }
    .hero-btns    { flex-direction: column; }
    .btn-primary, .btn-ghost { width: 100%; justify-content: center; }
    .hero-stats   { gap: 0; }
    .stat-cell    { padding-right: 16px; }
    .stat-num     { font-size: 34px; }
    .yt-grid      { grid-template-columns: 1fr; gap: 32px; }
    .yt-card      { padding: 32px 24px; }
    .contact-grid { grid-template-columns: 1fr; }
    .form-row     { grid-template-columns: 1fr; }
    .tl-meta      { text-align: left; }
    .tl-head      { flex-direction: column; gap: 8px; }
    .vol-card     { flex-direction: column; align-items: flex-start; gap: 12px; }
    .vol-date     { margin-left: 0; }
    .footer       { height: auto; padding: 16px 20px; }
    .footer-inner { flex-direction: column; gap: 8px; text-align: center; justify-content: center; }
    .footer-links { flex-wrap: wrap; justify-content: center; }
  }
  @media (max-width: 480px) {
    .hn-1, .hn-2 { font-size: clamp(36px, 13vw, 52px); }
    .stat-cell:not(:last-child)::after { display: none; }
    .stat-cell { padding-right: 0; }
    .hero-stats { gap: 24px; flex-direction: column; }
  }
`;
