import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Clock,
  Calculator,
  BookOpen,
  Atom,
  FlaskConical,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Colors } from "./components/Color";
import { useAuth } from "./context/AuthContext";
import { getSubjects } from "./services/api";
import fpogLogo from "/src/assets/fpog_logo.png";

const NAV_LINKS = [
  { label: "Subjects", href: "#subjects" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  // { label: "Contact", href: "#contact" },
];

const SUBJECT_ICONS = {
  calculator: Calculator,
  book: BookOpen,
  atom: Atom,
  flask: FlaskConical,
};

const STATS = [
  { value: "4", label: "Subjects" },
  { value: "1,000+", label: "Questions per subject" },
  { value: "10", label: "Questions per exam" },
  { value: "Instant", label: "Scoring" },
];

const STEPS = [
  {
    n: "1",
    title: "Register",
    desc: "Create an account with your name, username, email and phone number.",
  },
  {
    n: "2",
    title: "Choose a subject",
    desc: "Log in, pick a subject from your dashboard and read the instructions.",
  },
  {
    n: "3",
    title: "Sit the exam",
    desc: "Answer, flag and review questions. The timer submits for you when time is up.",
  },
];

// ------------------------------------------------------------
// Small reusable pieces
// ------------------------------------------------------------

function CtaButton({ children, onClick, variant = "brand", className = "" }) {
  const styles = {
    solid: { background: "#ffffff", color: Colors.dark },
    ghost: {
      background: "transparent",
      color: "#ffffff",
      border: "1px solid rgba(255,255,255,0.45)",
    },
    brand: { background: Colors.gradient, color: Colors.light },
    outline: {
      background: "transparent",
      color: Colors.dark,
      border: `1px solid ${Colors.primary}`,
    },
  };

  return (
    <button
      onClick={onClick}
      className={`h-11 px-6 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 ${className}`}
      style={styles[variant]}
    >
      {children}
    </button>
  );
}

// A card in the feature grid
function FeatureCard({ title, desc, className = "", children }) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white p-6 flex flex-col ${className}`}
    >
      <div
        className="flex-1 flex items-center justify-center rounded-2xl p-4 mb-5 min-h-[130px]"
        style={{ background: `${Colors.light}22` }}
      >
        {children}
      </div>
      <p className="text-[15px] font-semibold text-slate-800">{title}</p>
      <p className="mt-1.5 text-[13px] text-slate-500 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

// ------------------------------------------------------------
// Page
// ------------------------------------------------------------

export function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Navbar turns solid once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Subject cards use the same list as the dashboard
  useEffect(() => {
    let cancelled = false;
    getSubjects().then((list) => {
      if (!cancelled) setSubjects(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const onDark = !scrolled && !menuOpen;

  // Login/Register, or a dashboard shortcut for logged-in students
  const authButtons = ({ dark, className = "" }) => {
    if (isAuthenticated) {
      return (
        <CtaButton
          variant={dark ? "solid" : "brand"}
          className={className}
          onClick={() => goTo("/dashboard")}
        >
          Go to dashboard <ArrowRight size={16} />
        </CtaButton>
      );
    }

    return (
      <>
        <CtaButton
          variant={dark ? "solid" : "brand"}
          className={className}
          onClick={() => goTo("/register")}
        >
          Register
        </CtaButton>
        <CtaButton
          variant={dark ? "ghost" : "outline"}
          className={className}
          onClick={() => goTo("/login")}
        >
          Login
        </CtaButton>
      </>
    );
  };

  const heroBackground = {
    backgroundImage: `radial-gradient(circle at 15% 20%, rgba(133,209,209,0.28), transparent 45%), radial-gradient(circle at 90% 80%, rgba(133,209,209,0.18), transparent 40%), ${Colors.gradient}`,
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-800">
      {/* ================= NAVBAR ================= */}

      <header
        className={`fixed top-0 inset-x-0 z-30 transition-colors duration-200 ${
          onDark
            ? "bg-transparent"
            : "bg-white/95 backdrop-blur border-b border-slate-100"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <span
            className="font-semibold text-[17px] tracking-tight"
            style={{ color: onDark ? "#ffffff" : Colors.primary }}
          >
            CBT-SYSTEM
          </span>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={`text-[13.5px] transition-colors ${
                  onDark
                    ? "text-white/85 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {authButtons({ dark: onDark, className: "h-10 px-5" })}
          </div>

          <button
            className={`md:hidden p-2 -mr-2 ${onDark ? "text-white" : "text-slate-700"}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-5 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-[14px] text-slate-600"
              >
                {l.label}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              {authButtons({ dark: false, className: "flex-1" })}
            </div>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}
      <section
        className="relative overflow-hidden rounded-b-[2.5rem] pt-28 sm:pt-32 pb-28 sm:pb-32 bg-gray-800"
        // style={heroBackground}
      >
        <div className="bg-white absolute left-[50%] translate-x-[-50%] top-[8%] rounded-full p-3">
          <img
            src={fpogLogo}
            alt=""
            aria-hidden="true"
            className=" inset-0 w-50  h-50 bg-cover z-0 pointer-events-none select-none"
          />
        </div>
        {/* dot pattern */}
        <div
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-14 items-center">
          {/* Copy */}
          <div>
            <span className="inline-flex items-center gap-2 text-[12px] font-medium px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/15">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: Colors.light }}
              />
              Built for schools and exam bodies
            </span>

            <h1 className="mt-6 text-[34px] sm:text-[46px] lg:text-[54px] font-semibold leading-[1.1] tracking-tight text-white">
              Computer-based testing that{" "}
              <span style={{ color: Colors.light }}>gets out of the way</span>
            </h1>

            <p className="mt-5 text-[15.5px] sm:text-[17px] text-white/75 leading-relaxed max-w-md">
              Pick a subject, sit a timed exam, and see your score the moment
              you submit. Your answers are saved as you go, so a page refresh
              will not lose your work.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {authButtons({ dark: true, className: "sm:min-w-[140px]" })}
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] text-white/70">
              {[
                "Auto-submit when time ends",
                "Answers saved automatically",
                "Printable result slip",
              ].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} style={{ color: Colors.light }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* App preview */}
          <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
            {/* floating timer */}
            <div
              className="hidden lg:flex absolute -top-5 -right-4 z-10 items-center gap-2 px-3.5 py-2 rounded-full bg-white shadow-lg text-[13px] font-semibold"
              style={{ color: Colors.dark }}
            >
              <Clock size={15} />
              12:34 left
            </div>

            {/* main exam card */}
            <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11.5px] font-medium text-slate-400">
                  Mathematics · Question 7 of 10
                </span>
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: `${Colors.light}33`,
                    color: Colors.dark,
                  }}
                >
                  Algebra
                </span>
              </div>

              <p className="text-[14.5px] font-medium text-slate-800 leading-snug mb-4">
                A student scores 60% in a 10-question exam. How many questions
                did they answer correctly?
              </p>

              <div className="space-y-2">
                {[
                  { label: "A", text: "5 questions", selected: false },
                  { label: "B", text: "6 questions", selected: true },
                  { label: "C", text: "7 questions", selected: false },
                  { label: "D", text: "8 questions", selected: false },
                ].map((opt) => (
                  <div
                    key={opt.label}
                    className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-[13.5px] ${
                      opt.selected ? "" : "border-slate-200 text-slate-600"
                    }`}
                    style={
                      opt.selected
                        ? {
                            borderColor: Colors.dark,
                            background: Colors.background,
                            color: Colors.dark,
                          }
                        : undefined
                    }
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0"
                      style={
                        opt.selected
                          ? { background: Colors.dark, color: "#fff" }
                          : { background: "#f1f5f9", color: "#475569" }
                      }
                    >
                      {opt.label}
                    </span>
                    {opt.text}
                  </div>
                ))}
              </div>
            </div>

            {/* floating result */}
            <div className="hidden lg:flex absolute -bottom-8 -left-10 z-10 items-center gap-3 bg-white rounded-2xl shadow-xl px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-800">
                  Physics · Passed
                </p>
                <p className="text-[12px] text-slate-500">8 / 10 · 80%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 -mt-12">
        <div className="rounded-2xl bg-white shadow-xl border border-slate-100 grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-100">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`px-5 py-5 text-center ${i >= 2 ? "border-t lg:border-t-0 border-slate-100" : ""}`}
            >
              <p
                className="text-[22px] sm:text-[26px] font-semibold"
                style={{ color: Colors.dark }}
              >
                {s.value}
              </p>
              <p className="text-[12px] text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SUBJECTS ================= */}
      <section
        id="subjects"
        className="scroll-mt-20 max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24"
      >
        <p
          className="text-[12px] font-semibold uppercase tracking-wider"
          style={{ color: Colors.primary }}
        >
          Subjects
        </p>
        <h2 className="mt-2 text-[26px] sm:text-[32px] font-semibold text-slate-900 tracking-tight">
          Four subjects, one place
        </h2>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map((s) => {
            const Icon = SUBJECT_ICONS[s.icon] ?? BookOpen;
            return (
              <button
                key={s.id}
                onClick={() => goTo("/dashboard/subjects")}
                className="group text-left rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white"
                  style={{ background: Colors.gradient }}
                >
                  <Icon size={20} />
                </div>
                <p className="mt-4 font-semibold text-slate-800">{s.name}</p>
                <p className="mt-1 text-[13px] text-slate-500 leading-relaxed">
                  {s.description}
                </p>
                <p className="mt-4 flex items-center justify-between text-[12.5px] text-slate-500">
                  <span>
                    {s.durationMinutes} min · {s.questionCount} questions
                  </span>
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-0.5 transition-transform"
                    style={{ color: Colors.primary }}
                  />
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="scroll-mt-20 max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24"
      >
        <p
          className="text-[12px] font-semibold uppercase tracking-wider"
          style={{ color: Colors.primary }}
        >
          Features
        </p>
        <h2 className="mt-2 text-[26px] sm:text-[32px] font-semibold text-slate-900 tracking-tight">
          Everything a candidate needs in the exam hall
        </h2>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Timer */}
          <FeatureCard
            className="lg:col-span-2"
            title="Timed exams that submit for you"
            desc="A live countdown turns red when time is short, and the exam is submitted automatically at zero. Answers are saved as you go."
          >
            <div className="w-full max-w-xs">
              <div
                className="flex items-center justify-between text-[13px] font-semibold"
                style={{ color: Colors.dark }}
              >
                <span className="flex items-center gap-1.5">
                  <Clock size={15} /> Time left
                </span>
                <span className="font-mono">04:12</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white overflow-hidden">
                <div
                  className="h-full rounded-full bg-red-400"
                  style={{ width: "21%" }}
                />
              </div>
            </div>
          </FeatureCard>

          {/* Navigator */}
          <FeatureCard
            title="Question navigator"
            desc="Jump to any question and flag the ones you want to revisit before submitting."
          >
            <div className="grid grid-cols-5 gap-1.5">
              {["a", "a", "f", "a", "c", "e", "e", "a", "e", "e"].map(
                (state, i) => (
                  <span
                    key={i}
                    className={`w-7 h-7 rounded-md text-[11px] font-semibold flex items-center justify-center ${
                      state === "e"
                        ? "bg-white border border-slate-300 text-slate-500"
                        : "text-white"
                    } ${state === "f" ? "bg-amber-400" : ""} ${state === "c" ? "ring-2 ring-offset-1" : ""}`}
                    style={
                      state === "a" || state === "c"
                        ? {
                            background: Colors.dark,
                            "--tw-ring-color": Colors.dark,
                          }
                        : undefined
                    }
                  >
                    {i + 1}
                  </span>
                ),
              )}
            </div>
          </FeatureCard>

          {/* Calculator */}
          <FeatureCard
            title="Built-in calculator"
            desc="Mathematics candidates get a calculator right inside the exam screen."
          >
            <div
              className="w-36 rounded-xl p-2 shadow"
              style={{ background: Colors.darker }}
            >
              <p className="text-right text-white font-mono text-lg px-1 pb-1.5">
                36
              </p>
              <div className="grid grid-cols-4 gap-1">
                {["7", "8", "9", "×", "4", "5", "6", "−"].map((k) => (
                  <span
                    key={k}
                    className="h-6 rounded text-[11px] font-semibold flex items-center justify-center"
                    style={
                      "×−".includes(k)
                        ? { background: Colors.primary, color: "#fff" }
                        : { background: "#ffffff", color: "#334155" }
                    }
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </FeatureCard>

          {/* Focus */}
          <FeatureCard
            title="Focused sessions"
            desc="Leaving the exam screen shows a warning and is recorded, so everyone sits under the same rules."
          >
            <div className="flex items-start gap-2.5 rounded-xl bg-white border border-amber-200 px-3.5 py-3 max-w-[230px]">
              <ShieldAlert
                size={18}
                className="text-amber-500 shrink-0 mt-0.5"
              />
              <p className="text-[12px] text-slate-600 leading-snug">
                You left the exam screen <strong>1 time</strong> so far.
              </p>
            </div>
          </FeatureCard>

          {/* Results */}
          <FeatureCard
            title="Instant results and progress"
            desc="Scores arrive the moment you submit. Your dashboard keeps every result, with a printable slip."
          >
            <div className="flex items-end gap-2 h-24">
              {[40, 65, 30, 80, 60].map((h, i) => (
                <div
                  key={i}
                  className="w-6 flex flex-col justify-end items-center h-full"
                >
                  <div
                    className="w-full rounded-t-md"
                    style={{
                      height: `${h}%`,
                      background: h >= 50 ? Colors.primary : "#f87171",
                    }}
                  />
                </div>
              ))}
            </div>
          </FeatureCard>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        className="scroll-mt-20 max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24"
      >
        <p
          className="text-[12px] font-semibold uppercase tracking-wider"
          style={{ color: Colors.primary }}
        >
          How it works
        </p>
        <h2 className="mt-2 text-[26px] sm:text-[32px] font-semibold text-slate-900 tracking-tight">
          Three steps from registration to result
        </h2>

        <div className="relative mt-12 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6">
          {/* connecting line (desktop) */}
          <div
            className="hidden sm:block absolute top-[18px] left-[8%] right-[8%] border-t-2 border-dashed"
            style={{ borderColor: `${Colors.primary}55` }}
            aria-hidden="true"
          />

          {STEPS.map((s) => (
            <div key={s.n} className="relative">
              <div
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-semibold ring-4 ring-white"
                style={{ background: Colors.gradient }}
              >
                {s.n}
              </div>
              <p className="mt-4 text-[15px] font-semibold text-slate-800">
                {s.title}
              </p>
              <p className="mt-1.5 text-[13.5px] text-slate-500 leading-relaxed max-w-xs">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-5 sm:px-8 pb-20 sm:pb-24">
        <div
          className="relative overflow-hidden max-w-6xl mx-auto rounded-3xl px-6 sm:px-12 py-12 sm:py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={heroBackground}
        >
          <div className="relative">
            <p className="text-white text-[22px] sm:text-[28px] font-semibold leading-snug">
              Ready for your next exam?
            </p>
            <p className="text-white/70 text-[14px] mt-1.5">
              {isAuthenticated
                ? "Head to your dashboard to pick a subject."
                : "Register in a few minutes, or log in if you already have an account."}
            </p>
          </div>
          <div className="relative flex gap-3 w-full sm:w-auto">
            {authButtons({ dark: true, className: "flex-1 sm:flex-none" })}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer id="contact" className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span
            className="text-[13px] font-medium"
            style={{ color: Colors.primary }}
          >
            CBT-SYSTEM
          </span>
          <p className="text-[12.5px] text-slate-400">
            support@myschoolcbt.example · Mon–Fri, 8am–5pm
          </p>
        </div>
      </footer>
    </div>
  );
}
