import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Clock,
  ShieldCheck,
  BarChart3,
  BookOpen,
  CircleDot,
} from "lucide-react";
import { Colors } from "./components/Color";
import { Button } from "./components/Button";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Contact", href: "#contact" },
];

const FEATURES = [
  {
    icon: Clock,
    title: "Timed exams",
    desc: "Auto-submits when the clock runs out — no manual cutoffs, no disputes.",
  },
  {
    icon: ShieldCheck,
    title: "Locked-down sessions",
    desc: "One active attempt per candidate, tied to their registration number.",
  },
  {
    icon: BarChart3,
    title: "Instant results",
    desc: "Objective sections are graded the moment a candidate submits.",
  },
  {
    icon: BookOpen,
    title: "Practice mode",
    desc: "Past questions and mock tests, untimed, so students can prepare.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Register",
    desc: "Create an account with your registration number and school details.",
  },
  {
    n: "2",
    title: "Get scheduled",
    desc: "Your school assigns exams to your timetable — you'll see them on login.",
  },
  {
    n: "3",
    title: "Sit the exam",
    desc: "Answer, flag, and review questions before the timer submits for you.",
  },
];

export function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-white text-slate-800">
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <span
            className="font-semibold text-[17px] tracking-tight"
            style={{ color: Colors.primary }}
          >
            CBT-SYSTEM
          </span>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-[13.5px] text-slate-600 hover:text-slate-900 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button name="Login" onClick={() => navigate("/login")} />
            <Button name="Register" onClick={() => navigate("/register")} />
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 -mr-2 text-slate-700"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 px-5 py-4 flex flex-col gap-4">
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
              <Button
                name="Login"
                className="flex-1"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/login");
                }}
              />
              <Button
                name="Register"
                className="flex-1"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/register");
                }}
              />
            </div>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 sm:pt-16 pb-16 sm:pb-24 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-8 items-center">
        {/* Left: copy */}
        <div>
          <span
            className="inline-block text-[12px] font-medium px-3 py-1 rounded-full mb-5"
            style={{ background: `${Colors.light}33`, color: Colors.dark }}
          >
            Built for schools and exam bodies
          </span>
          <h1 className="text-[32px] sm:text-[42px] lg:text-[46px] font-semibold leading-[1.15] tracking-tight text-slate-900">
            Computer-based testing that gets out of the way
          </h1>
          <p className="mt-5 text-[15.5px] sm:text-[16.5px] text-slate-600 leading-relaxed max-w-md">
            Schedule exams, run them under a strict timer, and get objective
            results the moment a candidate submits. Built for exam halls with
            shared computers and patchy networks.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button name="Register" onClick={() => navigate("/register")} />
            <Button name="Login" onClick={() => navigate("/login")} />
          </div>

          <p className="mt-5 text-[12.5px] text-slate-400">
            Already registered by your school? Use the login above — no new
            account needed.
          </p>
        </div>

        {/* Right: exam UI mockup, grounded in the actual product rather than a generic illustration */}
        <div
          className="rounded-3xl p-5 sm:p-6 shadow-xl"
          style={{ background: Colors.gradient }}
        >
          <div className="bg-white rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11.5px] font-medium text-slate-400">
                Mathematics · Question 7 of 40
              </span>
              <span
                className="flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full"
                style={{ background: `${Colors.light}33`, color: Colors.dark }}
              >
                <Clock size={13} />
                34:52
              </span>
            </div>

            <p className="text-[14.5px] font-medium text-slate-800 leading-snug mb-4">
              A candidate scores 62% in a 40-question exam. How many questions
              did they answer correctly?
            </p>

            <div className="space-y-2">
              {[
                { label: "A", text: "22 questions", selected: false },
                { label: "B", text: "23 questions", selected: false },
                { label: "C", text: "25 questions", selected: true },
                { label: "D", text: "27 questions", selected: false },
              ].map((opt) => (
                <div
                  key={opt.label}
                  className={[
                    "flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-[13.5px]",
                    opt.selected ? "border-transparent" : "border-slate-200 text-slate-600",
                  ].join(" ")}
                  style={
                    opt.selected
                      ? { background: `${Colors.light}22`, color: Colors.dark }
                      : {}
                  }
                >
                  <span
                    className="w-5 h-5 rounded-full border flex items-center justify-center text-[10.5px] font-semibold shrink-0"
                    style={
                      opt.selected
                        ? { borderColor: Colors.primary, color: Colors.primary }
                        : { borderColor: "#cbd5e1" }
                    }
                  >
                    {opt.selected ? <CircleDot size={12} /> : opt.label}
                  </span>
                  {opt.text}
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <button className="text-[12.5px] font-medium text-slate-400">
                Flag for review
              </button>
              <button
                className="text-[12.5px] font-medium px-4 py-2 rounded-lg text-white"
                style={{ background: Colors.gradient }}
              >
                Next question
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURE STRIP ================= */}
      <section id="features" className="border-y border-slate-100 bg-slate-50/60">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className={[
                "px-0 sm:px-6 py-6 sm:py-0",
                i === 0 ? "sm:pl-0" : "",
              ].join(" ")}
            >
              <Icon size={20} style={{ color: Colors.primary }} />
              <p className="mt-3 text-[14.5px] font-semibold text-slate-800">
                {title}
              </p>
              <p className="mt-1.5 text-[13px] text-slate-500 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <h2 className="text-[24px] sm:text-[28px] font-semibold text-slate-900 tracking-tight">
          Three steps from registration to result
        </h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-semibold"
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

      {/* ================= CTA BAND ================= */}
      <section className="px-5 sm:px-8 pb-16 sm:pb-24">
        <div
          className="max-w-6xl mx-auto rounded-3xl px-6 sm:px-12 py-12 sm:py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{ background: Colors.gradient }}
        >
          <div>
            <p className="text-white text-[20px] sm:text-[24px] font-semibold leading-snug">
              Ready for your next exam?
            </p>
            <p className="text-white/70 text-[13.5px] mt-1.5">
              Register in a few minutes, or log in if your school already set
              you up.
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              name="Register"
              className="flex-1 sm:flex-none"
              onClick={() => navigate("/login")}
            />
            <Button
              name="Login"
              className="flex-1 sm:flex-none"
              onClick={() => navigate("/login")}
            />
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer id="contact" className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[13px] font-medium" style={{ color: Colors.primary }}>
            mySchoolCBT
          </span>
          <p className="text-[12.5px] text-slate-400">
            support@myschoolcbt.example · Mon–Fri, 8am–5pm
          </p>
        </div>
      </footer>
    </div>
  );
}
