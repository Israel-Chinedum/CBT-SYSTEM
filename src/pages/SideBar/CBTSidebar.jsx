import React, { useState, useEffect } from "react";
import { Colors } from "/src/components/Color";
import { useAuth } from "/src/context/AuthContext";
import { useNavigate, useLocation, NavLink, Outlet } from "react-router-dom";
import {
  BookOpen,
  BarChart3,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
} from "lucide-react";

// Each item has a real URL, so refresh and the back button work.
const NAV_ITEMS = [
  { to: "/dashboard/subjects", label: "Subjects", icon: BookOpen },
  { to: "/dashboard/results", label: "My Results", icon: BarChart3 },
  { to: "/dashboard/profile", label: "Profile", icon: User },
];

function initials(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function CBTSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Real student details from the session.
  // Adjust these field names to match what your server returns.
  const studentName = user?.fullname || user?.username || "Student";
  const studentId = user?.studentId || user?.username || "";

  // Page title in the desktop navbar comes from the current URL
  const currentTitle =
    NAV_ITEMS.find((n) =>
      n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)
    )?.label ?? "Subjects";

  // Close the mobile drawer whenever the viewport grows back to desktop width
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const gradientStyle = {
    backgroundImage: `linear-gradient(165deg, ${Colors.darker} 0%, ${Colors.secondary} 30%, ${Colors.accent} 55%, ${Colors.dark} 78%, ${Colors.darker} 100%)`,
  };

  return (
    <div className="min-h-screen w-full flex" style={{ background: Colors.background }}>
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
              "rounded-full bg-white font-semibold flex items-center justify-center shrink-0",
              collapsed ? "w-10 h-10 text-[13px]" : "w-16 h-16 text-lg",
              "transition-all duration-300",
            ].join(" ")}
            style={{ color: Colors.dark }}
          >
            {initials(studentName)}
          </div>
          {!collapsed && (
            <div className="mt-3 min-w-0 max-w-full">
              <p className="font-medium text-sm leading-tight truncate">
                {studentName}
              </p>
              {studentId && (
                <p className="text-[12px] text-white/60 mt-0.5 tracking-wide truncate">
                  {studentId}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, badge, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                [
                  "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] transition-colors relative",
                  collapsed ? "justify-center px-0" : "",
                  isActive
                    ? "bg-white font-semibold"
                    : "text-white/80 hover:bg-white/10 hover:text-white",
                ].join(" ")
              }
              style={({ isActive }) => (isActive ? { color: Colors.dark } : undefined)}
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && <span className="truncate">{label}</span>}
                  {badge && !collapsed && (
                    <span
                      className={[
                        "ml-auto text-[10.5px] font-semibold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center",
                        isActive
                          ? "text-white"
                          : "bg-white/20 text-white",
                      ].join(" ")}
                      style={isActive ? { background: Colors.dark } : undefined}
                    >
                      {badge}
                    </span>
                  )}
                  {badge && collapsed && (
                    <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-amber-300" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer: logout */}
        <div className="px-3 pb-4 pt-2 space-y-1 shrink-0">
          <button
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className={[
              "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium bg-white hover:bg-white/90 transition-colors",
              collapsed ? "justify-center px-0" : "",
            ].join(" ")}
            style={{ color: Colors.dark }}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ---------------- Right column (navbar + routed content) ---------------- */}
      <div className="flex-1 min-w-0 flex flex-col pt-14 lg:pt-0">
        {/* ---------------- Desktop navbar ---------------- */}
        <header className="hidden lg:flex sticky top-0 z-10 h-16 items-center gap-4 px-6 bg-white border-b border-slate-200">
          <h1 className="font-semibold text-slate-800 text-[15px] truncate">
            {currentTitle}
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

        {/* The matching child route renders here */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
