import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { ChevronDown, Phone, Menu, X } from "lucide-react";
import ServicesMegaMenu from "./reusable/ServicesMegaMenu";

export default function Nav() {
  const [openServices, setOpenServices] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);

  const navLinkBase =
    "text-sm font-medium text-textdark/80 hover:text-primary transition-colors duration-200";
  const navLinkActive = "text-primary font-semibold";

  /* close services menu on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) setOpenServices(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* close mobile menu on desktop resize */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const mobileLinks = [
    { to: "/", label: "Home" },
    { to: "/servicehub", label: "Service Hub" },
    { to: "/resource", label: "Resources" },
    { to: "/company", label: "Company" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="w-full sticky top-0 z-50">
      {/* ── Announcement Bar ── */}
      <div className="bg-textdark text-textbright text-xs py-2.5 px-4 flex items-center justify-center gap-3 text-center">
        <span>
          Looking for the right{" "}
          <span className="text-yellow font-semibold">
            Compliance &amp; Registration Services?
          </span>{" "}
          Get quick guidance from our experts
        </span>
        <button className="hidden sm:inline-flex items-center gap-1 bg-red text-textbright px-3 py-1 rounded-md text-xs font-semibold hover:opacity-90 transition-opacity">
          Enquire Now →
        </button>
      </div>

      {/* ── Main Navbar ── */}
      <div className="bg-bright/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/image%2033%201%20(1)%201.png?updatedAt=1771313237021"
              className="h-12"
              alt="Insight Consulting"
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? navLinkActive : ""}`
              }
            >
              Home
            </NavLink>

            {/* Services dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpenServices(!openServices)}
                className={`${navLinkBase} flex items-center gap-1`}
              >
                Services
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    openServices ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openServices && <ServicesMegaMenu />}
            </div>

            <NavLink
              to="/servicehub"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? navLinkActive : ""}`
              }
            >
              Service Hub
            </NavLink>

            <NavLink
              to="/resource"
              className={({ isActive }) =>
                `${navLinkBase} flex items-center gap-1 ${
                  isActive ? navLinkActive : ""
                }`
              }
            >
              Resources <ChevronDown size={14} />
            </NavLink>

            <NavLink
              to="/company"
              className={({ isActive }) =>
                `${navLinkBase} flex items-center gap-1 ${
                  isActive ? navLinkActive : ""
                }`
              }
            >
              Company <ChevronDown size={14} />
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? navLinkActive : ""}`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+919857847497"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-textdark/80 border border-border rounded-xl px-3.5 py-2 hover:border-primary/40 hover:text-primary transition-all duration-200"
            >
              <Phone size={15} />
              <span>+91 98578 47497</span>
            </a>

            <Link to="/login">
              <button className="bg-red text-textbright px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all duration-200 hover:shadow-md active:scale-[0.98]">
                Login →
              </button>
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors duration-200"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <X size={20} className="text-textdark" />
              ) : (
                <Menu size={20} className="text-textdark" />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-bright px-4 pt-4 pb-6 space-y-1">
            {mobileLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-secondary text-primary font-semibold"
                      : "text-textdark hover:bg-secondary/60"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            <div className="pt-4 space-y-3">
              <a
                href="tel:+919857847497"
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-textdark border border-border rounded-xl"
              >
                <Phone size={15} /> +91 98578 47497
              </a>
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <button className="w-full bg-red text-textbright py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                  Login →
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
