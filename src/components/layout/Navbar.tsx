"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface NavbarProps {
  transparent?: boolean;
}

const NAV_ITEMS = [
  { label: "Accueil", href: "/" },
  { label: "Flotte", href: "/flotte" },
  { label: "Expériences", href: "#" },
  { label: "À Propos", href: "#" },
];

export default function Navbar({ transparent = true }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const bg =
    transparent && !scrolled && !menuOpen
      ? "bg-transparent"
      : "bg-[#0A0A0A]/95 border-b border-[rgba(201,168,76,0.15)]";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 md:py-5 transition-all duration-500 ${bg}`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 md:gap-3 no-underline" onClick={() => setMenuOpen(false)}>
        <div className="w-9 h-9 md:w-11 md:h-11 border border-[#C9A84C] flex items-center justify-center text-[#C9A84C] font-serif text-lg md:text-xl font-semibold">
          P
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-sans font-semibold text-[11px] md:text-[13px] tracking-[2px] md:tracking-[3px] text-[#F5F0E8] uppercase">
            Prestige
          </span>
          <span className="text-[8px] md:text-[10px] tracking-[3px] md:tracking-[4px] text-[#C9A84C] font-light uppercase">
            Drive
          </span>
        </div>
      </Link>

      {/* Nav links — desktop */}
      <ul className="hidden md:flex gap-10 list-none">
        {NAV_ITEMS.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-[#F5F0E8] text-[11px] tracking-[2.5px] font-medium uppercase no-underline hover:text-[#C9A84C] transition-colors duration-300"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right side */}
      <div className="flex items-center gap-3 md:gap-6">
        <Link
          href="/dashboard"
          className="hidden md:flex items-center gap-2 text-[#F5F0E8] text-[11px] tracking-[2px] font-medium no-underline hover:text-[#C9A84C] transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
          Connexion
        </Link>
        <Link
          href="/flotte"
          className="border border-[#C9A84C] px-4 md:px-7 py-2 md:py-2.5 text-[#C9A84C] text-[9px] md:text-[10px] tracking-[1.5px] md:tracking-[2.5px] font-semibold uppercase no-underline hover:bg-[#C9A84C] hover:text-black transition-all duration-300"
        >
          Réserver
        </Link>

        {/* Hamburger — mobile */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={menuOpen}
          className="md:hidden flex items-center justify-center w-9 h-9 text-[#F5F0E8] bg-transparent border-none cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0A0A0A]/98 border-t border-b border-[rgba(201,168,76,0.15)] flex flex-col py-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="px-6 py-3 text-[#F5F0E8] text-[12px] tracking-[2px] font-medium uppercase no-underline hover:text-[#C9A84C] transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-6 py-3 text-[#F5F0E8] text-[12px] tracking-[2px] font-medium uppercase no-underline hover:text-[#C9A84C] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            Connexion
          </Link>
        </div>
      )}
    </nav>
  );
}
