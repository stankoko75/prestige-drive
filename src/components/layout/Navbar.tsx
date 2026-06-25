"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = true }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const bg =
    transparent && !scrolled
      ? "bg-transparent"
      : "bg-[#0A0A0A]/95 border-b border-[rgba(201,168,76,0.15)]";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-5 transition-all duration-500 ${bg}`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 no-underline">
        <div className="w-11 h-11 border border-[#C9A84C] flex items-center justify-center text-[#C9A84C] font-serif text-xl font-semibold">
          P
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-sans font-semibold text-[13px] tracking-[3px] text-[#F5F0E8] uppercase">
            Prestige
          </span>
          <span className="text-[10px] tracking-[4px] text-[#C9A84C] font-light uppercase">
            Drive
          </span>
        </div>
      </Link>

      {/* Nav links */}
      <ul className="flex gap-10 list-none">
        {["Accueil", "Flotte", "Expériences", "À Propos"].map((item) => (
          <li key={item}>
            <Link
              href={
                item === "Flotte"
                  ? "/flotte"
                  : item === "Accueil"
                  ? "/"
                  : "#"
              }
              className="text-[#F5F0E8] text-[11px] tracking-[2.5px] font-medium uppercase no-underline hover:text-[#C9A84C] transition-colors duration-300"
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right side */}
      <div className="flex items-center gap-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-[#F5F0E8] text-[11px] tracking-[2px] font-medium no-underline hover:text-[#C9A84C] transition-colors"
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
          className="border border-[#C9A84C] px-7 py-2.5 text-[#C9A84C] text-[10px] tracking-[2.5px] font-semibold uppercase no-underline hover:bg-[#C9A84C] hover:text-black transition-all duration-300"
        >
          Réserver
        </Link>
      </div>
    </nav>
  );
}
