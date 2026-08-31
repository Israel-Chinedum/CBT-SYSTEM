import React, { useState, useEffect } from "react";
import { Colors } from "/src/components/Color";
import { useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  ClipboardList,
  CalendarClock,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
} from "lucide-react";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "exams", label: "My exams", icon: FileText, badge: 2 },
  { key: "practice", label: "Practice tests", icon: ClipboardList },
  { key: "results", label: "Results", icon: BarChart3 },
  { key: "timetable", label: "Timetable", icon: CalendarClock },
  { key: "notices", label: "Announcements", icon: Bell, badge: 5 },
];

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function CBTSidebar({
  studentName = "Amaka Chukwu",
  studentId = "CAND-0341829",
  children,
}) {
  const [active, setActive] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();

  // Close the mobile drawer whenever the viewport grows back to desktop width
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const gradientStyle = {
    backgroundImage: `linear-gradient(165deg, ${Colors.darker} 0%, ${Colors.secondary} 30%, ${Colors.accent} 55%, ${Colors.dark} 78%, ${Colors.darker} 100%)`,
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex">
      {/* ---------------- Mobile top bar ---------------- */}
      <header
        className="lg:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between h-14 px-4 text-white"
        style={gradientStyle}
      >
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="p-2 -ml-2 rounded-md hover:bg-white/10 active:bg-white/20 transition-colors"
        >
          <Menu size={22} />
        </button>
        <span className="font-semibold tracking-tight text-[15px]">
          CBT-SYSTEM
        </span>
        <div
          className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-[11px] font-semibold"
          aria-hidden="true"
        >
          {initials(studentName)}
        </div>
      </header>

      {/* ---------------- Mobile backdrop ---------------- */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ---------------- Sidebar ---------------- */}
      <aside
        style={gradientStyle}
        className={[
          "fixed lg:sticky top-0 z-50 lg:z-10 h-screen text-white flex flex-col",
          "transition-[width,transform] duration-300 ease-out shrink-0",
          collapsed ? "lg:w-[84px]" : "lg:w-[264px]",
          "w-[264px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
        aria-label="Primary"
      >
        {/* Top: brand + collapse/close controls */}
        <div className="flex items-center justify-between h-16 px-4 shrink-0">
          {!collapsed && (
            <span className="font-semibold text-[15px] tracking-tight truncate">
              CBT-SYSTEM
            </span>
          )}
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="lg:hidden p-2 rounded-md hover:bg-white/10 active:bg-white/20 transition-colors ml-auto"
          >
            <X size={20} />
          </button>
          <button
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={[
              "hidden lg:flex p-2 rounded-md hover:bg-white/10 active:bg-white/20 transition-colors",
              collapsed ? "mx-auto" : "ml-auto",
            ].join(" ")}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* Profile */}
        <div
          className={[
            "flex flex-col items-center text-center px-4 pb-5 pt-1",
            collapsed ? "px-2" : "",
          ].join(" ")}
        >
          <div
            className={[
              "rounded-full bg-white text-[#26494c] font-semibold flex items-center justify-center shrink-0",
              collapsed ? "w-10 h-10 text-[13px]" : "w-16 h-16 text-lg",
              "transition-all duration-300",
            ].join(" ")}
          >
            {initials(studentName)}
          </div>
          {!collapsed && (
            <div className="mt-3 min-w-0">
              <p className="font-medium text-sm leading-tight truncate">
                {studentName}
              </p>
              <p className="text-[12px] text-white/60 mt-0.5 tracking-wide">
                {studentId}
              </p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon, badge }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActive(key);
                  setMobileOpen(false);
                }}
                title={collapsed ? label : undefined}
                className={[
                  "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] transition-colors relative",
                  collapsed ? "justify-center px-0" : "",
                  isActive
                    ? "bg-white text-[#26494c] font-semibold"
                    : "text-white/80 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
                {badge && !collapsed && (
                  <span
                    className={[
                      "ml-auto text-[10.5px] font-semibold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center",
                      isActive
                        ? "bg-[#26494c] text-white"
                        : "bg-white/20 text-white",
                    ].join(" ")}
                  >
                    {badge}
                  </span>
                )}
                {badge && collapsed && (
                  <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-amber-300" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer: settings + logout */}
        <div className="px-3 pb-4 pt-2 space-y-1 shrink-0">
          <button
            title={collapsed ? "Settings" : undefined}
            className={[
              "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] text-white/80 hover:bg-white/10 hover:text-white transition-colors",
              collapsed ? "justify-center px-0" : "",
            ].join(" ")}
          >
            <Settings size={18} className="shrink-0" />
            {!collapsed && <span>Settings</span>}
          </button>
          <button
            onClick={() => navigate("/login")}
            title={collapsed ? "Logout" : undefined}
            className={[
              "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium bg-white text-[#26494c] hover:bg-white/90 transition-colors",
              collapsed ? "justify-center px-0" : "",
            ].join(" ")}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/*
        ---------------- Right column (navbar + content) ----------------
        This sits next to <aside> inside the same flex row as a flex-1
        child, so it automatically takes up whatever width is left over
        when the sidebar is 264px vs 84px — no manual margin math needed,
        and it resizes smoothly because the sidebar's width transition
        drives it.
      */}
      <div className="flex-1 min-w-0 flex flex-col pt-14 lg:pt-0">
        {/* ---------------- Desktop navbar ---------------- */}
        <header className="hidden lg:flex sticky top-0 z-10 h-16 items-center gap-4 px-6 bg-white border-b border-slate-200">
          <h1 className="font-semibold text-slate-800 text-[15px] truncate">
            {NAV_ITEMS.find((n) => n.key === active)?.label ?? "Dashboard"}
          </h1>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden xl:flex items-center gap-2 h-9 px-3 rounded-lg bg-slate-100 text-slate-400 w-56">
              <Search size={15} />
              <span className="text-[13px]">Search</span>
            </div>
            <button
              aria-label="Notifications"
              className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
            </button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0"
              style={gradientStyle}
              aria-hidden="true"
            >
              {initials(studentName)}
            </div>
          </div>
        </header>

        {/* ---------------- Main content placeholder ---------------- */}
        <main className="flex-1 min-w-0">
          {children ?? (
            <div className="p-6 lg:p-10">
              <h1 className="text-xl font-semibold text-slate-800 lg:hidden">
                Dashboard
              </h1>
              <p className="text-sm text-slate-500 mt-1 lg:mt-0">
                Content area — swap this with your exam dashboard, results
                tables, etc.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {["Available exams", "Completed", "Upcoming"].map((t) => (
                  <div
                    key={t}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                      {t}
                    </p>
                    <p className="text-2xl font-semibold text-slate-800 mt-2">
                      —
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
