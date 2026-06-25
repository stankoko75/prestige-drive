"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { reservations, cars } from "@/lib/data";

const navItems = [
  {
    label: "Tableau de bord",
    href: "/dashboard",
    active: true,
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    label: "Mes réservations",
    href: "#",
    active: false,
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
  {
    label: "Mes contrats",
    href: "#",
    active: false,
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    label: "Mes factures",
    href: "#",
    active: false,
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
      </svg>
    ),
  },
  {
    label: "Mes véhicules favoris",
    href: "#",
    active: false,
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
  },
];

const bottomItems = [
  {
    label: "Profil",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    label: "Aide & support",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
      </svg>
    ),
  },
  {
    label: "Déconnexion",
    href: "/",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
      </svg>
    ),
  },
];

const stats = [
  { value: "2", label: "Réservations à venir", sub: "Prochaine : 24 Mai 2024", icon: "calendar" },
  { value: "1", label: "Contrat actif", sub: "Audi RS6", icon: "doc" },
  { value: "24", label: "Jours en tout", sub: "D'expérience", icon: "clock" },
  { value: "4.9/5", label: "Note moyenne", sub: "Basée sur 12 avis", icon: "star" },
];

const shortcuts = [
  { label: "Mes contrats", icon: "doc" },
  { label: "Mes factures", icon: "bill" },
  { label: "Mes véhicules favoris", icon: "heart" },
  { label: "Profil", icon: "user" },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      {/* ─── SIDEBAR ─── */}
      <aside className="fixed left-0 top-0 bottom-0 w-[220px] z-50 bg-[rgba(10,10,10,0.97)] border-r border-[rgba(201,168,76,0.15)] flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-[rgba(201,168,76,0.12)]">
          <div className="w-9 h-9 border border-[#C9A84C] flex items-center justify-center text-[#C9A84C] font-serif text-lg font-semibold">
            P
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-sans font-semibold text-[12px] tracking-[3px] text-[#F5F0E8] uppercase">Prestige</span>
            <span className="text-[9px] tracking-[3px] text-[#C9A84C] font-light uppercase">Drive</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-[11px] tracking-[1.5px] font-medium no-underline transition-all border-l-2 ${
                item.active
                  ? "text-[#C9A84C] border-l-[#C9A84C] bg-[rgba(201,168,76,0.08)]"
                  : "text-[#9A9080] border-l-transparent hover:text-[#F5F0E8] hover:bg-[rgba(201,168,76,0.04)]"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-[rgba(201,168,76,0.12)] px-6 py-5 flex flex-col gap-1">
          {bottomItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-2.5 text-[#9A9080] text-[11px] tracking-[1.5px] no-underline py-2 hover:text-[#F5F0E8] transition-colors"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <div className="ml-[220px] flex-1 relative">
        {/* BG */}
        <div className="fixed top-0 left-[220px] right-0 bottom-0 z-0">
          <Image
            src="/images/dashboard-bg.png"
            alt=""
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-[rgba(10,10,10,0.82)]" />
        </div>

        {/* Top bar */}
        <div className="fixed top-0 left-[220px] right-0 z-40 flex justify-end items-center gap-5 px-12 py-5 bg-[rgba(10,10,10,0.6)] backdrop-blur-sm border-b border-[rgba(201,168,76,0.08)]">
          <button className="text-[#9A9080] hover:text-[#C9A84C] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center text-black text-[11px] font-bold">
              AD
            </div>
            <span className="text-[#F5F0E8] text-[12px] tracking-[1px] font-medium">Arthur D.</span>
            <svg className="w-4 h-4 text-[#9A9080]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="relative z-10 pt-24 px-12 pb-12">
          {/* Welcome */}
          <div className="mb-8">
            <div className="w-8 h-px bg-[#C9A84C] mb-4" />
            <h1 className="font-serif text-[40px] font-light text-[#F5F0E8]">
              Bonjour Arthur,
            </h1>
            <p className="text-[13px] text-[#9A9080] tracking-[1px] mt-1">
              Prêt pour votre prochaine expérience ?
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            {[
              { val: "2", label: "Réservations à venir", sub: "Prochaine : 24 Mai 2024", IconEl: <CalendarIcon /> },
              { val: "1", label: "Contrat actif", sub: "Audi RS6", IconEl: <DocIcon /> },
              { val: "24", label: "Jours en tout", sub: "D'expérience", IconEl: <ClockIcon /> },
              { val: "4.9/5", label: "Note moyenne", sub: "Basée sur 12 avis", IconEl: <StarIcon /> },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.12)] p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="text-[#C9A84C] mt-0.5">{s.IconEl}</div>
                  <div>
                    <p className="font-serif text-[32px] font-light text-[#F5F0E8] leading-none">
                      {s.val}
                    </p>
                    <p className="text-[11px] tracking-[1px] text-[#9A9080] mt-1">{s.label}</p>
                    <p className="text-[10px] text-[#9A9080]/60 mt-0.5 tracking-[0.5px]">{s.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-[1fr_280px] gap-4 mb-4">
            {/* Reservations */}
            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(201,168,76,0.1)] p-6">
              <div className="flex justify-between items-center mb-5">
                <p className="text-[10px] tracking-[3px] text-[#C9A84C] uppercase font-semibold">
                  Mes réservations
                </p>
                <button className="flex items-center gap-1.5 text-[#9A9080] text-[11px] tracking-[1px] hover:text-[#C9A84C] transition-colors">
                  Voir toutes
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    className="flex items-center gap-4 p-4 bg-[rgba(255,255,255,0.03)] border border-[rgba(201,168,76,0.08)] hover:border-[rgba(201,168,76,0.2)] transition-all cursor-pointer group"
                  >
                    <div className="relative w-20 h-12 flex-shrink-0 overflow-hidden bg-[#1A1A1A]">
                      <Image src={res.image} alt={res.model} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-[#F5F0E8] tracking-[0.5px]">
                        {res.brand} {res.model}
                      </p>
                      <p className="text-[11px] text-[#9A9080] mt-0.5">
                        Du {res.dateDebut} au {res.dateFin}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            res.statusColor === "green" ? "bg-green-400" : "bg-yellow-400"
                          }`}
                        />
                        <span
                          className={`text-[10px] tracking-[1px] font-medium ${
                            res.statusColor === "green" ? "text-green-400" : "text-yellow-400"
                          }`}
                        >
                          {res.status}
                        </span>
                      </div>
                    </div>
                    <svg
                      className="w-4 h-4 text-[#9A9080] group-hover:text-[#C9A84C] transition-colors flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Shortcuts */}
            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(201,168,76,0.1)] p-6">
              <p className="text-[10px] tracking-[3px] text-[#C9A84C] uppercase font-semibold mb-5">
                Raccourcis
              </p>
              <div className="flex flex-col gap-1">
                {[
                  { label: "Mes contrats", icon: <DocIcon /> },
                  { label: "Mes factures", icon: <BillIcon /> },
                  { label: "Mes véhicules favoris", icon: <HeartIcon /> },
                  { label: "Profil", icon: <UserIcon /> },
                ].map((s) => (
                  <button
                    key={s.label}
                    className="flex items-center justify-between p-3.5 hover:bg-[rgba(201,168,76,0.06)] transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#C9A84C]">{s.icon}</span>
                      <span className="text-[12px] tracking-[1px] text-[#F5F0E8]">{s.label}</span>
                    </div>
                    <svg
                      className="w-4 h-4 text-[#9A9080] group-hover:text-[#C9A84C] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reserve CTA banner */}
          <div className="relative overflow-hidden bg-[rgba(255,255,255,0.03)] border border-[rgba(201,168,76,0.15)] p-8 flex items-center gap-8">
            <div className="flex-shrink-0 max-w-xs">
              <p className="text-[10px] tracking-[3px] text-[#C9A84C] uppercase font-semibold mb-2">
                Réserver un véhicule
              </p>
              <p className="text-[13px] text-[#9A9080] leading-[1.8] mb-5">
                Découvrez notre flotte d'exception et réservez le véhicule idéal pour votre prochaine expérience.
              </p>
              <Link
                href="/flotte"
                className="inline-flex items-center gap-2 bg-[#C9A84C] text-black px-6 py-2.5 text-[10px] tracking-[2px] font-bold uppercase no-underline hover:bg-[#E8C97A] transition-colors"
              >
                Réserver maintenant
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
            {/* Car thumbnails */}
            <div className="flex items-end gap-2 overflow-hidden flex-1 justify-end">
              {cars.map((car) => (
                <div key={car.id} className="relative h-28 w-40 flex-shrink-0">
                  <Image
                    src={car.studioImage}
                    alt={car.model}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icon components
function CalendarIcon() {
  return <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>;
}
function DocIcon() {
  return <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>;
}
function ClockIcon() {
  return <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
}
function StarIcon() {
  return <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>;
}
function BillIcon() {
  return <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>;
}
function HeartIcon() {
  return <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>;
}
function UserIcon() {
  return <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
}
