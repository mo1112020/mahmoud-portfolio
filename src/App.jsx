import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import ReactDOM from "react-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import charImg from "./assets/character.png";

const LINKEDIN_URL = "https://www.linkedin.com/in/eng-mahmoud-saad-635185249/";
const YOUTUBE_URL = "https://www.youtube.com/@mahmoudabdelhady6253/playlists";

const T = {
  bg: "#f5f4f0",
  card: "#ffffff",
  border: "rgba(0,0,0,0.06)",
  borderHover: "rgba(0,0,0,0.12)",
  accent: "#1c1917", // Stone 900
  accentGlow: "rgba(28,25,23,0.05)",
  accentSoft: "#e7e5e4", // Stone 200
  white: "#1c1917", // Text is now dark
  muted: "#78716c", // Stone 500
  dim: "#a8a29e", // Stone 400
  green: "#10b981",
  surface: "#ffffff",
  surfaceHov: "#fafaf9",
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icons = {
  Mail: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>,
  Phone: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
  MapPin: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>,
  Linkedin: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>,
  ArrowRight: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>,
  Check: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5" /></svg>,
  ChevronDown: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 9 6 6 6-6" /></svg>,
  Menu: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
  X: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6 6 18M6 6l12 12" /></svg>,
  Youtube: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></svg>,
};

// ─── Three.js Wireframe Building ─────────────────────────────────────────────

function WireframeBuilding() {
  const groupRef = useRef();
  const scanRef = useRef();

  const towerEdges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(1.2, 3, 1.2)),
    []
  );
  const floorEdges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(1.2, 0.01, 1.2)),
    []
  );
  const floorY = useMemo(() => [-0.9, -0.3, 0.3, 0.9], []);
  const joints = useMemo(() => [
    [-0.6, -1.5, -0.6], [0.6, -1.5, -0.6], [-0.6, -1.5, 0.6], [0.6, -1.5, 0.6],
    [-0.6,  1.5, -0.6], [0.6,  1.5, -0.6], [-0.6,  1.5, 0.6], [0.6,  1.5, 0.6],
  ], []);

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y += 0.003;
    if (scanRef.current)
      scanRef.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 1.5;
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={towerEdges}>
        <lineBasicMaterial color="#78716c" />
      </lineSegments>

      {floorY.map((y, i) => (
        <lineSegments key={i} geometry={floorEdges} position={[0, y, 0]}>
          <lineBasicMaterial color="#57534e" transparent opacity={0.7} />
        </lineSegments>
      ))}

      {joints.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={1.5}
          />
        </mesh>
      ))}

      <mesh ref={scanRef}>
        <planeGeometry args={[1.4, 0.02]} />
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

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
      <div className="mesh-gradient" />
    </div>
  );
}

function SkillsMarquee() {
  const skills = [
    "AutoCAD", "SAP2000", "Structural Design", "Site Supervision",
    "Math Tutoring", "Calculus Specialist", "CapCut", "Canva",
    "Technical Design", "Concrete Structures", "Construction Management"
  ];
  return (
    <div className="skills-marquee">
      <div className="marquee-inner">
        {[...skills, ...skills, ...skills].map((s, i) => (
          <div key={i} className="marquee-pill">
            <span className="pill-dot" />
            <span className="pill-txt">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroVisual() {
  const [msgIdx, setMsgIdx] = useState(0);
  const [isTalking, setIsTalking] = useState(false);
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

  const nextMsg = () => {
    setMsgIdx((i) => (i + 1) % msgs.length);
    setIsTalking(true);
    setTimeout(() => setIsTalking(false), 2000);
  };

  useEffect(() => {
    const t = setInterval(nextMsg, 8000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="bp-frame">
        <svg className="bp-svg" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="390" height="390" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 6" opacity="0.1" />

          <line x1="200" y1="5" x2="200" y2="395" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
          <line x1="5" y1="200" x2="395" y2="200" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />

          <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
          <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.12" />
          <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="1" opacity="0.15" />

          <g opacity="0.2">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
              <line key={deg} x1="200" y1="20" x2="200" y2="35" stroke="currentColor" strokeWidth="1.5"
                transform={`rotate(${deg}, 200, 200)`} />
            ))}
          </g>

          <circle cx="200" cy="200" r="15" fill="currentColor" opacity="0.1" />
        </svg>

        <div className={`char-wrap ${isTalking ? "is-talking" : ""}`} onClick={nextMsg} style={{ cursor: "pointer" }}>
          <div className="char-circle">
            <div className="char-glow" />
            <img src={charImg} alt="Welcome" className="hero-char" />
            <div className="mouth-anim" />
          </div>
          <div className="welcome-bubble">{msgs[msgIdx]}</div>
        </div>

        <div className="float-tag ft-tl">AutoCAD</div>
        <div className="float-tag ft-tr">SAP2000</div>
        <div className="float-tag ft-bl">Site Supervision</div>
        <div className="float-tag ft-br">Structural Design</div>
      </div>
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
    <div className="page-home-root">
      <div className="page-home">
        <div className="section-wrap">
          <div className="hero-wrap">
            <div className="hero-left">
              <Reveal>
                <div className="hero-eyebrow">
                  <span className="exp-badge">
                    <span className="exp-dot" />
                    Available for opportunities
                  </span>
                </div>
                <h1 className="hero-head">
                  <span className="hh-line">
                    <i>I&apos;m Mahmoud Saad</i>
                  </span>
                  <span className="hh-line">
                    <b>Civil Engineer</b>
                    <span>&amp;</span>
                    <b>Math Tutor</b>
                  </span>
                  <span className="hh-line">
                    <i>Based in</i>
                    <b>Istanbul</b>
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={0.22}>
                <p className="hero-bio">
                  I build practical structural solutions and help students master
                  mathematics through clear, step-by-step teaching. I focus on
                  quality execution, strong communication, and measurable results.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="hero-btns">
                  <button className="btn-primary btn-capsule" onClick={() => onNavigate("Contact")}>
                    Get In Touch <Icons.ArrowRight />
                  </button>
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="hero-stats">
                  {[
                    { n: 4, s: "+", l: "Professional Roles" },
                    { n: 3, s: "", l: "Languages" },
                    { n: 4, s: "+", l: "Years Tutoring" },
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

          <Reveal delay={0.5}>
            <SkillsMarquee />
          </Reveal>
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
    current: { label: "Current", cls: "chip-current" },
    engineering: { label: "Engineering", cls: "chip-engineering" },
    teaching: { label: "Teaching", cls: "chip-teaching" },
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
    { num: "01", title: "Site Supervision", desc: "On-site construction supervision for foundations, reinforcement, and concrete works with strict safety compliance.", tags: ["Foundations", "Concrete", "Safety"] },
    { num: "02", title: "Technical Office", desc: "Quantity take-offs, structural drawing interpretation, documentation, and coordination between site and office.", tags: ["Take-offs", "Drawings", "Reports"] },
    { num: "03", title: "Mathematics Tutoring", desc: "Comprehensive private and online tutoring for Middle School, High School, and University students. Expert guidance in Calculus 1 & 2, Differential Equations, and Civil Engineering courses.", tags: ["Calculus 1 & 2", "Middle & High School", "University Math"] },
    { num: "04", title: "Engineering Software", desc: "Structural design and analysis using AutoCAD for drafting and SAP2000 for structural modeling and load analysis.", tags: ["AutoCAD", "SAP2000", "Engineering Apps"] },
    { num: "05", title: "Creative Design & Tech", desc: "Creating professional logos and visual designs using Canva, and high-quality video editing with CapCut for educational or professional content.", tags: ["Logo Design", "Canva", "CapCut"] },
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
    { icon: <Icons.Mail />, label: "Email", value: "mabdelhady322@gmail.com", href: "mailto:mabdelhady322@gmail.com" },
    { icon: <Icons.Phone />, label: "Phone / WhatsApp", value: "+90 544 185 19 08", href: "tel:+905441851908" },
    { icon: <Icons.Linkedin />, label: "LinkedIn", value: "View Profile →", href: LINKEDIN_URL },
    { icon: <Icons.Youtube />, label: "YouTube", value: "Watch Tutorials →", href: YOUTUBE_URL },
    { icon: <Icons.MapPin />, label: "Location", value: "Istanbul, Turkey", href: null },
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
  const [activePage, setActivePage] = useState("Home");
  const [displayPage, setDisplayPage] = useState("Home");
  const [isExiting, setIsExiting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -400, y: -400 });

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
            {displayPage === "Home" && <HomePage onNavigate={navigate} />}
            {displayPage === "Experience" && <ExperiencePage />}
            {displayPage === "Skills" && <SkillsPage />}
            {displayPage === "Contact" && <ContactPage />}

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
        </main>
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
  }

  .ambient-bg {
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
    position: fixed; width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%);
    pointer-events: none; z-index: 1;
    transform: translate(-50%,-50%);
    mix-blend-mode: multiply;
    transition: left 0.12s cubic-bezier(0.23, 1, 0.32, 1), top 0.12s cubic-bezier(0.23, 1, 0.32, 1);
  }

  /* ─── App shell ─── */
  .app-wrap {
    position: relative; z-index: 10;
    display: flex; flex-direction: column;
    min-height: 100vh; width: 100%;
  }

  /* ─── Shared Layout inner ─── */
  .nav-inner {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; max-width: 1240px; margin: 0 auto;
  }
  
  /* ─── Navbar ─── */
  .navbar {
    height: var(--nav-h); border-bottom: 1px solid var(--border);
    background: rgba(245,244,240,0.8); backdrop-filter: blur(30px);
    z-index: 100; position: sticky; top: 0;
  }
  .nav-inner {
    margin: 0 auto; height: 100%; width: 100%;
    display: flex; align-items: center; justify-content: space-between;
  }
  .nav-logo {
    font-family: var(--display); font-size: 20px; font-weight: 400;
    color: var(--accent); background: none; border: none; cursor: pointer;
    display: flex; align-items: center; gap: 2px;
  }
  .logo-dot { color: var(--accent); opacity: 0.3; }
  .nav-links { display: flex; align-items: center; gap: 8px; }
  .nav-item {
    padding: 10px 20px; color: var(--muted); background: none; border: none;
    font-size: 14px; font-weight: 500; cursor: pointer; border-radius: 100px;
    transition: all 0.25s ease; position: relative; font-family: var(--sans);
    display: flex; flex-direction: column; align-items: center; gap: 4px;
  }
  .nav-item:hover { color: var(--accent); background: rgba(0,0,0,0.03); }
  .nav-active { color: var(--accent); }
  .nav-pip {
    position: absolute; bottom: 3px; left: 50%; transform: translateX(-50%);
    width: 4px; height: 4px; border-radius: 50%;
    background: var(--accent);
    animation: pipIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes pipIn { from { opacity: 0; transform: translateX(-50%) scale(0); } to { opacity: 1; transform: translateX(-50%) scale(1); } }
  .nav-end { display: flex; align-items: center; gap: 10px; }
  .btn-hire {
    padding: 10px 24px; background: #1c1917; color: #fff;
    border: none; border-radius: 100px;
    font-size: 13px; font-weight: 600; cursor: pointer; font-family: var(--sans);
    transition: all 0.25s ease; white-space: nowrap;
  }
  .btn-hire:hover { background: #000; transform: scale(1.03); }

  /* ─── Main + page transitions ─── */
  .main {
    flex: 1; display: flex; flex-direction: column;
    position: relative;
  }
  .page-wrap {
    flex: 1; display: flex; flex-direction: column;
    width: 100%;
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
  .yt-card { 
    padding: 64px; 
    background: #fff; 
    border-radius: 32px; 
    border: 1px solid var(--border);
    box-shadow: 0 40px 100px rgba(0,0,0,0.04);
  }
  .yt-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 80px; align-items: center; }
  .yt-title { font-family: var(--display); font-size: 42px; font-weight: 400; color: var(--accent); margin-bottom: 24px; }
  .yt-desc { font-size: 18px; color: var(--muted); line-height: 1.8; margin-bottom: 36px; font-weight: 300; }
  .yt-benefits { display: flex; flex-direction: column; gap: 16px; margin-bottom: 44px; }
  .yt-benefit { display: flex; align-items: center; gap: 12px; font-size: 15px; color: var(--muted); }
  
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
    min-height: 100vh;
    display: flex; flex-direction: column;
    padding: 60px 4% 40px;
    justify-content: center;
    position: relative;
  }
  .page-home::after {
    content: ''; position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px);
    background-size: 40px 40px; pointer-events: none; z-index: -1;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent);
  }
  .page-section { padding: 120px 4% 140px; min-height: calc(100vh - var(--nav-h)); }
  .section-wrap { margin: 0 auto; width: 100%; }

  /* Skills Marquee */
  .skills-marquee {
    margin-top: 32px; overflow: hidden;
    mask-image: linear-gradient(to right, transparent, #000 15%, #000 85%, transparent);
    padding: 12px 0;
  }
  .marquee-inner { 
    display: inline-flex; animation: marquee-scroll 70s linear infinite; gap: 20px; 
    padding: 10px 0;
  }
  
  .marquee-pill {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 24px; border: 1px solid var(--border);
    border-radius: 999px; background: rgba(255, 255, 255, 0.45);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    white-space: nowrap; cursor: default;
  }
  .marquee-pill:hover {
    background: #fff; border-color: var(--accent);
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 12px 28px rgba(0,0,0,0.06);
  }
  .pill-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--accent); opacity: 0.15;
    transition: all 0.3s ease;
  }
  .marquee-pill:hover .pill-dot { opacity: 1; transform: scale(1.2); background: #10b981; }
  
  .pill-txt {
    font-size: 13px; font-weight: 600; color: var(--muted);
    text-transform: uppercase; letter-spacing: 0.1em;
    font-family: var(--sans);
    transition: color 0.3s ease;
  }
  .marquee-pill:hover .pill-txt { color: var(--accent); }
  
  @keyframes marquee-scroll { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }

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
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: clamp(36px, 5vw, 64px);
    align-items: start;
    max-width: 1240px; width: 100%; margin: 0 auto;
  }
  .hero-left {
    display: flex;
    flex-direction: column;
    max-width: 620px;
    animation: heroFadeUp 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .hero-btns { display: flex; align-items: center; gap: 14px; margin-top: 30px; }

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

  .hero-stats {
    display: flex; margin-top: 60px; padding-top: 48px;
    border-top: 1px solid var(--border);
  }
  .stat-cell {
    flex: 1; display: flex; flex-direction: column; gap: 4px;
    padding-right: 48px;
  }
  .stat-num {
    font-family: var(--display); font-size: 48px; font-weight: 400;
    color: var(--accent); line-height: 1; letter-spacing: -0.02em;
  }
  .stat-lbl { font-size: 13px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 500; }

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
  .hero-right {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 8px;
    animation: heroFadeIn 0.9s ease-out both;
    animation-delay: 0.15s;
  }
  .hero-visual {
    position: relative;
    width: 100%;
    max-width: 540px;
    margin-inline: auto;
    animation: heroFloat 6s ease-in-out infinite;
  }
  .bp-frame { position: relative; width: 100%; aspect-ratio: 1; }
  
  .hero-head {
    font-family: var(--display);
    font-size: clamp(38px, 6vw, 72px);
    line-height: 1.1; color: var(--white);
    margin-bottom: 24px;
  }
  .hh-line { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 4px; }
  .hh-line b { font-weight: 500; letter-spacing: -0.02em; }
  .hh-line i { font-family: var(--display); font-style: italic; font-weight: 300; color: var(--dim); }
  
  .pill-img {
    display: inline-flex; width: clamp(44px, 8vw, 88px); height: clamp(28px, 4vw, 44px);
    border-radius: 100px; overflow: hidden; background: #fff;
    border: 1px solid var(--border); box-shadow: 0 4px 15px rgba(0,0,0,0.04);
  }
  .pill-img img { width: 100%; height: 100%; object-fit: cover; }
  .pill-ico {
    display: inline-flex; width: 44px; height: 44px;
    background: #fff; border: 1px solid var(--border); border-radius: 50%;
    align-items: center; justify-content: center; font-size: 18px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.05);
  }

  .btn-capsule {
    padding: 20px 52px; border-radius: 100px; background: #1c1917; color: #fff;
    font-weight: 600; font-size: 16px; border: none;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .ambient-bg {
    position: fixed; inset: 0; z-index: -1;
    background: #f5f4f0;
    overflow: hidden;
  }
  .mesh-gradient {
    position: absolute; inset: -50%;
    background-image: 
      radial-gradient(at 10% 20%, rgba(28, 25, 23, 0.06) 0px, transparent 50%),
      radial-gradient(at 90% 10%, rgba(120, 113, 108, 0.12) 0px, transparent 50%),
      radial-gradient(at 40% 80%, rgba(168, 162, 158, 0.08) 0px, transparent 50%),
      radial-gradient(at 70% 30%, rgba(28, 25, 23, 0.04) 0px, transparent 50%);
    filter: blur(100px);
    animation: meshFlow 20s ease-in-out infinite alternate;
  }
  @keyframes meshFlow {
    0%   { transform: translate(0, 0) rotate(0deg); }
    100% { transform: translate(5%, 5%) rotate(5deg); }
  }
  .hero-bio {
    font-size: 17px;
    color: #57534e;
    line-height: 1.8;
    max-width: 56ch;
    margin-top: 22px;
    font-weight: 400;
    letter-spacing: -0.005em;
    font-family: var(--sans);
    animation: heroFadeUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: 0.16s;
  }
  .hero-eyebrow {
    display: flex;
    align-items: center;
    margin-bottom: 22px;
    font-family: var(--sans);
  }
  .exp-badge {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 14px;
    padding: 12px 24px;
    min-height: 52px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: linear-gradient(180deg, rgba(24, 24, 27, 0.86), rgba(10, 10, 11, 0.9));
    color: #f5f5f4;
    font-size: clamp(15px, 2vw, 20px);
    font-weight: 600;
    letter-spacing: 0.01em;
    text-transform: none;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04), 0 14px 34px rgba(0,0,0,0.24);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    animation: badgeGlow 4s ease infinite;
  }
  .exp-badge::before {
    content: "";
    position: absolute;
    inset: 1px;
    border-radius: inherit;
    border: 1px solid rgba(255, 255, 255, 0.06);
    pointer-events: none;
  }
  @keyframes badgeGlow {
    0%, 100% { box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04), 0 14px 34px rgba(0,0,0,0.24); }
    50% { box-shadow: inset 0 0 0 1px rgba(255,255,255,0.07), 0 16px 42px rgba(0,0,0,0.30); }
  }
  .exp-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.18), 0 0 16px rgba(16, 185, 129, 0.55);
    flex-shrink: 0;
    animation: dotPulse 2.2s ease-in-out infinite;
  }
  @keyframes dotPulse {
    0%, 100% { transform: scale(1); box-shadow: 0 0 0 5px rgba(16,185,129,0.18), 0 0 16px rgba(16,185,129,0.55); }
    50% { transform: scale(1.08); box-shadow: 0 0 0 8px rgba(16,185,129,0.10), 0 0 20px rgba(16,185,129,0.65); }
  }

  .hero-head {
    font-size: clamp(38px, 4.8vw, 66px);
    line-height: 1.04;
    letter-spacing: -0.035em;
    margin-bottom: 4px;
    font-family: var(--display);
    color: #1c1917;
    animation: heroFadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: 0.08s;
  }
  .hh-line { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; flex-wrap: wrap; }
  .hh-line i { font-style: normal; font-weight: 500; color: #292524; }
  .hh-line b { font-weight: 800; color: #1c1917; }
  .pill-img { 
    height: clamp(28px, 3.5vw, 42px); aspect-ratio: 1.8; 
    border-radius: 100px; overflow: hidden; border: 1px solid var(--border);
    background: #fff; transform: rotate(-1deg); box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  .btn-capsule {
    padding: 16px 34px; font-size: 14px; font-weight: 600;
    background: #1c1917; color: #fff;
    border-radius: 100px; border: none; cursor: pointer;
    box-shadow: 0 10px 26px rgba(28,25,23,0.14);
    transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
    display: flex; align-items: center; gap: 12px;
    font-family: var(--sans);
    animation: heroFadeUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: 0.22s;
  }
  .btn-capsule:hover { 
    background: #000;
    transform: translateY(-3px);
    box-shadow: 0 18px 36px rgba(28,25,23,0.2);
  }
  .btn-capsule svg {
    transition: transform 0.25s ease;
  }
  .btn-capsule:hover svg {
    transform: translateX(3px);
  }
  .pill-img img { width: 100%; height: 100%; object-fit: cover; }
  .pill-ico {
    padding: 6px 16px; background: #fff; border: 1px solid var(--border);
    border-radius: 100px; font-size: 18px; transform: rotate(2deg);
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  }

  .char-wrap {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: clamp(140px, 18vw, 190px); height: clamp(140px, 18vw, 190px);
    z-index: 10; transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }
  .char-wrap:hover { transform: translate(-50%, -50%) scale(1.08); }
  
  .char-circle {
    width: 100%; height: 100%; border-radius: 50%;
    border: 2px solid #fff; overflow: hidden;
    background: #fff; box-shadow: 0 30px 60px rgba(0,0,0,0.12);
    display: flex; align-items: center; justify-content: center; position: relative;
  }
  .char-glow {
    position: absolute; inset: 0;
    background: radial-gradient(circle at 50% 50%, rgba(0,0,0,0.03) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-char { width: 100%; height: 100%; object-fit: cover; transform: scale(1.05); }
  
  .mouth-anim {
    position: absolute; bottom: 34%; left: 51%;
    width: 22px; height: 6px; background: rgba(0,0,0,0.25);
    border-radius: 50%; opacity: 0; transform: translateX(-50%);
    transition: opacity 0.3s;
  }
  .is-talking .mouth-anim {
    opacity: 1;
    animation: mouthPop 0.15s infinite alternate;
  }
  @keyframes mouthPop {
    from { height: 2px; width: 18px; }
    to   { height: 12px; width: 24px; }
  }
  .float-tag:hover {
    transform: scale(1.1) rotate(2deg);
    background: #000;
    box-shadow: 0 15px 40px rgba(0,0,0,0.5);
    z-index: 50;
  }
  .welcome-bubble {
    position: absolute; top: -10px; left: 100%;
    transform: none; white-space: nowrap;
    background: #1c1917; color: #fff;
    padding: 10px 20px; border-radius: 20px 20px 20px 0;
    font-weight: 500; font-size: 14px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    animation: float-bubble 4s ease-in-out infinite;
    z-index: 20;
  }
  @keyframes float-bubble {
    0%, 100% { transform: translateY(0) rotate(5deg); }
    50%      { transform: translateY(-8px) rotate(8deg); }
  }

  .bp-svg {
    width: 100%; height: 100%; color: var(--accent);
    animation: bpSpin 120s linear infinite;
    filter: drop-shadow(0 0 20px rgba(0,0,0,0.02));
  }
  @keyframes bpSpin { to { transform: rotate(360deg); } }

  .float-tag {
    position: absolute; background: #1c1917;
    border: 1px solid rgba(255,255,255,0.1); border-radius: 100px;
    padding: 8px 20px; font-size: 13px; font-weight: 500;
    color: #ffffff; white-space: nowrap;
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    letter-spacing: 0.02em; z-index: 20;
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
    position: relative; z-index: 1;
    width: 300px; height: 100%;
    background-color: var(--bg);
    border-left: 1px solid var(--border);
    display: flex; flex-direction: column; padding: 48px 24px 40px;
    transform: translateX(100%);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: -10px 0 50px rgba(0,0,0,0.05);
    overflow-y: auto;
  }
  .mobile-overlay.open .mobile-nav { transform: translateX(0); }
  
  .mobile-logo {
    font-family: var(--display); font-size: 24px; font-weight: 500;
    color: var(--accent); margin-bottom: 48px;
    display: flex; justify-content: space-between; align-items: center;
  }
  
  .mobile-nav-list { display: flex; flex-direction: column; gap: 8px; }
  
  .mobile-nav-item {
    background: #fff; border: 1px solid var(--border); border-radius: 12px;
    color: var(--muted); font-size: 16px; font-weight: 500; font-family: var(--sans);
    padding: 18px 20px; cursor: pointer;
    display: flex; align-items: center; gap: 12px;
    transition: all 0.2s ease; text-align: left;
    width: 100%;
  }
  .mobile-nav-item.active { 
    color: var(--accent); 
    background: #fff;
    border-color: var(--accent);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1);
  }
  .mobile-nav-item:hover { color: var(--accent); transform: translateX(-4px); }
  .mobile-num { font-size: 11px; color: var(--accent); font-weight: 600; opacity: 0.5; }

  /* ─── Footer ─── */
  .footer {
    padding: 40px 0 32px; border-top: 1px solid var(--border);
    background: var(--bg); color: var(--muted); z-index: 10;
    margin-top: auto;
  }
  .footer-inner { 
    margin: 0 auto; width: 100%; padding: 0 4%;
    display: flex; align-items: center; justify-content: space-between;
  }
  .footer-copy { font-size: 13px; font-weight: 400; color: var(--dim); }
  .footer-links { display: flex; gap: 32px; }
  .footer-link {
    font-size: 13px; color: var(--muted); text-decoration: none;
    transition: all 0.3s ease; font-weight: 500;
  }
  .footer-link:hover { color: var(--accent); transform: translateY(-2px); }

  /* ─── Responsive ─── */
  @media (max-width: 1024px) {
    .nav-inner { max-width: 90%; }
    .section-wrap { max-width: 90%; }
    .hero-wrap { grid-template-columns: 1fr; gap: 40px; }
    .hero-left { max-width: 100%; }
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
    .hero-btns    { flex-direction: column; align-items: stretch; }
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
    .hero-stats { gap: 16px; grid-template-columns: 1fr; }
  }

  .hero-stats {
    margin-top: 44px;
    padding: 22px;
    border: 1px solid rgba(28, 25, 23, 0.08);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(8px);
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    animation: heroFadeUp 0.95s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: 0.28s;
  }
  .hero-stats .stat-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px 12px;
    transition: transform 0.3s ease;
  }
  .hero-stats .stat-cell:hover { transform: translateY(-4px); }
  .hero-stats .stat-cell:not(:last-child)::after { display: none; }
  .hero-stats .stat-num {
    font-family: var(--display);
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 700;
    color: #1f1b19;
    line-height: 1;
  }
  .hero-stats .stat-lbl {
    font-size: 10px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: 600;
  }

  /* ─── App-wide UI polish overrides ─── */
  .nav-inner,
  .section-wrap {
    max-width: 1240px;
    padding-inline: clamp(16px, 3vw, 36px);
  }

  .page-home {
    padding-top: clamp(14px, 2.4vw, 28px);
    padding-bottom: clamp(16px, 2.4vw, 28px);
  }

  .page-section {
    padding-top: clamp(62px, 7vw, 88px);
    padding-bottom: clamp(68px, 7.5vw, 96px);
  }

  .section-header {
    margin-bottom: clamp(34px, 5vw, 64px);
  }

  .card {
    border-radius: 18px;
    border-color: rgba(28, 25, 23, 0.08);
    box-shadow: 0 8px 24px rgba(28, 25, 23, 0.06);
  }
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 36px rgba(28, 25, 23, 0.12);
  }

  .hero-wrap {
    min-height: min(560px, calc(100vh - var(--nav-h) - 36px));
  }
  .hero-visual {
    max-width: 490px;
  }
  .hero-bio {
    max-width: 50ch;
    font-size: 15px;
    line-height: 1.65;
  }
  .hero-btns {
    margin-top: 18px;
  }
  .hero-left {
    gap: 2px;
  }
  .hero-head {
    margin-bottom: 8px;
    font-size: clamp(34px, 4vw, 56px);
    line-height: 1.02;
  }
  .hero-eyebrow {
    margin-bottom: 14px;
  }
  .exp-badge {
    gap: 10px;
    min-height: 40px;
    padding: 8px 16px;
    border-radius: 999px;
    border: 1px solid rgba(28, 25, 23, 0.12);
    background: rgba(255, 255, 255, 0.72);
    color: #1c1917;
    font-size: clamp(13px, 1.6vw, 16px);
    box-shadow: 0 6px 18px rgba(28, 25, 23, 0.08);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
  }
  .exp-badge::before {
    display: none;
  }
  .exp-dot {
    width: 9px;
    height: 9px;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.18);
  }
  .hero-stats {
    margin-top: 20px;
    padding: 14px;
    gap: 8px;
  }
  .hero-stats .stat-num {
    font-size: clamp(24px, 3vw, 32px);
  }
  .hero-stats .stat-lbl {
    font-size: 9px;
  }

  .timeline {
    gap: 18px;
    padding-left: 28px;
  }
  .tl-card {
    padding: 24px 24px;
  }

  .svc-grid,
  .contact-grid,
  .edu-lang-grid {
    gap: 18px;
  }

  .tools-card,
  .edu-card,
  .lang-card,
  .form-card,
  .yt-card {
    border-radius: 20px;
  }

  .footer {
    padding-top: 28px;
    padding-bottom: 24px;
  }

  @media (max-width: 1024px) {
    .section-wrap,
    .nav-inner {
      max-width: 980px;
      padding-inline: 20px;
    }

    .page-home {
      min-height: auto;
    }
  }

  @media (max-width: 768px) {
    :root {
      --nav-h: 64px;
    }

    .navbar {
      padding-inline: 0;
    }

    .nav-inner,
    .section-wrap {
      padding-inline: 16px;
    }

    .page-home {
      padding: 14px 0 20px;
    }
    .hero-wrap {
      min-height: auto;
    }
    .page-section {
      padding: 46px 0 54px;
      min-height: auto;
    }

    .hero-head {
      font-size: clamp(30px, 8.8vw, 40px);
      line-height: 1.08;
    }
    .hero-eyebrow {
      margin-bottom: 10px;
    }
    .exp-badge {
      width: fit-content;
      justify-content: flex-start;
      font-size: 13px;
      padding: 8px 14px;
      min-height: 36px;
    }
    .exp-dot {
      width: 8px;
      height: 8px;
    }
    .hero-bio {
      font-size: 14px;
      line-height: 1.62;
      margin-top: 10px;
    }
    .hero-btns {
      margin-top: 14px;
    }

    .hero-stats {
      margin-top: 16px;
      padding: 12px;
      gap: 8px;
    }
    .hero-stats .stat-cell {
      padding: 6px;
    }

    .yt-card,
    .svc-card,
    .tools-card,
    .edu-card,
    .lang-card,
    .vol-card,
    .form-card,
    .contact-card,
    .tl-card {
      padding: 20px;
    }

    .timeline {
      padding-left: 20px;
    }
    .tl-dot {
      left: -24px;
    }

    .mobile-nav {
      width: min(86vw, 320px);
      padding: 34px 18px 24px;
    }
    .mobile-logo {
      margin-bottom: 28px;
      font-size: 22px;
    }
    .mobile-nav-item {
      font-size: 15px;
      padding: 14px 16px;
      border-radius: 10px;
    }

    .footer {
      padding: 18px 0 16px;
    }
    .footer-copy {
      font-size: 12px;
    }
    .footer-links {
      gap: 16px;
    }
  }

  @media (max-width: 480px) {
    .nav-inner,
    .section-wrap {
      padding-inline: 12px;
    }

    .hero-head {
      font-size: clamp(30px, 10.8vw, 40px);
    }
    .hero-stats {
      grid-template-columns: 1fr;
    }

    .eyebrow {
      letter-spacing: 0.14em;
      font-size: 10px;
    }
    .section-title {
      font-size: clamp(30px, 9vw, 42px);
    }
  }

  @keyframes heroFadeUp {
    from {
      opacity: 0;
      transform: translateY(18px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes heroFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes heroFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-left,
    .hero-head,
    .btn-capsule,
    .hero-stats,
    .hero-right,
    .hero-visual {
      animation: none !important;
    }
  }
`;
