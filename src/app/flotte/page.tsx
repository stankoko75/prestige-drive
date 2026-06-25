"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import ReservationModal from "@/components/ui/ReservationModal";
import { cars, type Car } from "@/lib/data";

const CATEGORIES = [
  { label: "TOUS LES VÉHICULES", value: "all" },
  { label: "HYPERCAR", value: "Hypercar" },
  { label: "SUV DE LUXE", value: "SUV de luxe" },
  { label: "BREAK SPORT", value: "Break sport" },
  { label: "SUPERCAR CABRIOLET", value: "Supercar cabriolet" },
];

const MARQUES = [
  { label: "TOUTES LES MARQUES", value: "all" },
  { label: "LAMBORGHINI", value: "LAMBORGHINI" },
  { label: "ROLLS-ROYCE", value: "ROLLS-ROYCE" },
  { label: "AUDI", value: "AUDI" },
];

function getCategoryCount(value: string) {
  if (value === "all") return cars.length;
  return cars.filter((c) => c.categorie === value).length;
}

function getBrandCount(value: string) {
  if (value === "all") return cars.length;
  return cars.filter((c) => c.brand === value).length;
}

export default function FlottePage() {
  const [selectedCar, setSelectedCar] = useState<Car>(cars[0]);
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = cars.filter((c) => {
    const catOk = category === "all" || c.categorie === category;
    const brandOk = brand === "all" || c.brand === brand;
    return catOk && brandOk;
  });

  return (
    <>
      <main className="bg-[#0A0A0A] h-screen overflow-hidden flex flex-col">
        <Navbar transparent={false} />

        <div className="flex overflow-hidden" style={{ height: "calc(100vh - 84px)", marginTop: "84px" }}>
          {/* ─── SIDEBAR GAUCHE ─── */}
          <aside className="w-[265px] flex-shrink-0 bg-[#0D0D0D] border-r border-[rgba(201,168,76,0.1)] flex flex-col overflow-y-auto">
            <div className="px-6 py-5 border-b border-[rgba(201,168,76,0.1)]">
              <p className="text-[10px] tracking-[3px] font-semibold text-[#F5F0E8] uppercase">
                Sélectionnez votre véhicule
              </p>
            </div>

            {/* Catégories */}
            <div className="px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[9px] tracking-[3px] text-[#C9A84C] font-semibold uppercase">Catégories</p>
                <svg className="w-3.5 h-3.5 text-[#9A9080]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              <div className="flex flex-col gap-0.5">
                {CATEGORIES.map((cat) => {
                  const count = getCategoryCount(cat.value);
                  const active = category === cat.value;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`flex items-center justify-between py-2.5 transition-all duration-200 bg-transparent border-none cursor-pointer text-left w-full ${
                        active
                          ? "border-l-[2px] border-[#C9A84C] pl-3 text-[#F5F0E8]"
                          : "border-l-[2px] border-transparent pl-0 text-[#9A9080] hover:text-[#C9A84C]"
                      }`}
                    >
                      <span className="text-[10px] tracking-[2px] font-semibold uppercase">{cat.label}</span>
                      <span className={`text-[10px] font-bold ${active ? "text-[#C9A84C]" : "text-[#3A3A3A]"}`}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Marques */}
            <div className="px-6 py-5 border-t border-[rgba(201,168,76,0.08)]">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[9px] tracking-[3px] text-[#C9A84C] font-semibold uppercase">Marque</p>
                <svg className="w-3.5 h-3.5 text-[#9A9080]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                {MARQUES.map((m) => {
                  const count = getBrandCount(m.value);
                  const active = brand === m.value;
                  return (
                    <button
                      key={m.value}
                      onClick={() => setBrand(m.value)}
                      className="flex items-center gap-3 py-2 cursor-pointer bg-transparent border-none text-left w-full group"
                    >
                      <div className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-colors ${
                        active ? "border-[#C9A84C] bg-[#C9A84C]" : "border-[#3A3A3A] group-hover:border-[#C9A84C]"
                      }`}>
                        {active && (
                          <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-[10px] tracking-[1.5px] font-medium uppercase transition-colors ${
                        active ? "text-[#F5F0E8]" : "text-[#9A9080] group-hover:text-[#C9A84C]"
                      }`}>{m.label}</span>
                      <span className="ml-auto text-[10px] text-[#3A3A3A]">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset */}
            <div className="mt-auto px-6 pb-6">
              <button
                onClick={() => { setCategory("all"); setBrand("all"); }}
                className="flex items-center gap-2 text-[#9A9080] hover:text-[#C9A84C] transition-colors bg-transparent border-none cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <span className="text-[10px] tracking-[2px] uppercase font-semibold">Réinitialiser les filtres</span>
              </button>
            </div>
          </aside>

          {/* ─── CONTENU PRINCIPAL ─── */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">

            {/* Zone image + panneau droit */}
            <div className="flex flex-1 overflow-hidden min-h-0">

              {/* Image véhicule */}
              <div className="flex-1 relative overflow-hidden bg-[#080808]">
                <Image
                  key={selectedCar.id}
                  src={selectedCar.studioImage}
                  alt={`${selectedCar.brand} ${selectedCar.model}`}
                  fill
                  className="object-cover transition-opacity duration-500"
                  priority
                />
              </div>

              {/* ─── PANNEAU DROIT ─── */}
              <aside className="w-[295px] flex-shrink-0 bg-[rgba(13,13,13,0.97)] border-l border-[rgba(201,168,76,0.1)] flex flex-col overflow-y-auto">

                {/* À propos */}
                <div className="p-6 border-b border-[rgba(201,168,76,0.1)]">
                  <p className="text-[9px] tracking-[3px] text-[#9A9080] font-semibold uppercase mb-4">
                    À propos de ce véhicule
                  </p>
                  <p className="text-[11px] text-[#9A9080] leading-relaxed">{selectedCar.description}</p>
                </div>

                {/* Tarif */}
                <div className="px-6 py-5 border-b border-[rgba(201,168,76,0.1)]">
                  <p className="text-[9px] tracking-[3px] text-[#9A9080] font-semibold uppercase mb-3">
                    Tarif de location
                  </p>
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <p className="font-serif text-[28px] font-light text-[#C9A84C] leading-none">
                        {selectedCar.pricePerDay.toLocaleString("fr-FR")} €
                      </p>
                      <p className="text-[9px] tracking-[2px] text-[#9A9080] uppercase">/ JOUR</p>
                    </div>
                    <Link
                      href={`/vehicle/${selectedCar.id}`}
                      className="w-8 h-8 border border-[rgba(201,168,76,0.3)] flex items-center justify-center hover:border-[#C9A84C] hover:bg-[rgba(201,168,76,0.08)] transition-all no-underline"
                    >
                      <svg className="w-4 h-4 text-[#C9A84C]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Avantages */}
                <div className="px-6 py-5 border-b border-[rgba(201,168,76,0.1)] flex flex-col gap-3.5">
                  {[
                    {
                      label: "ASSURANCE TOUS RISQUES",
                      icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                        </svg>
                      ),
                    },
                    {
                      label: "ASSISTANCE 24/7",
                      icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                        </svg>
                      ),
                    },
                    {
                      label: "LIVRAISON INCLUSE",
                      icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                        </svg>
                      ),
                    },
                    {
                      label: "AUCUN DÉPÔT REQUIS",
                      icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                        </svg>
                      ),
                    },
                  ].map((f) => (
                    <div key={f.label} className="flex items-center gap-3">
                      <div className="text-[#C9A84C] flex-shrink-0">{f.icon}</div>
                      <p className="text-[10px] tracking-[1.5px] text-[#9A9080] uppercase">{f.label}</p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="p-6 mt-auto">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="w-full bg-[#C9A84C] text-black py-4 text-[10px] tracking-[3px] font-bold uppercase hover:bg-[#E8C97A] transition-colors border-none cursor-pointer"
                  >
                    Réserver ce véhicule
                  </button>
                </div>
              </aside>
            </div>

            {/* ─── CARROUSEL VÉHICULES ─── */}
            <div className="flex-shrink-0 bg-[rgba(10,10,10,0.97)] border-t border-[rgba(201,168,76,0.25)]">
              <div className="flex items-center justify-between px-6 py-2.5 border-b border-[rgba(201,168,76,0.1)]">
                <p className="text-[10px] tracking-[2.5px] font-semibold text-[#F5F0E8] uppercase">
                  {filtered.length} Véhicule{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}
                </p>
                <button className="w-7 h-7 border border-[rgba(201,168,76,0.2)] flex items-center justify-center hover:border-[#C9A84C] transition-colors bg-transparent cursor-pointer">
                  <svg className="w-3.5 h-3.5 text-[#C9A84C]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
              <div className="flex overflow-x-auto" style={{ height: "95px" }}>
                {filtered.length > 0 ? (
                  filtered.map((car) => {
                    const active = selectedCar.id === car.id;
                    return (
                      <button
                        key={car.id}
                        onClick={() => setSelectedCar(car)}
                        className="relative flex-shrink-0 overflow-hidden border-0 outline-none cursor-pointer group"
                        style={{ width: "185px", height: "95px" }}
                      >
                        <Image
                          src={car.studioImage}
                          alt={car.model}
                          fill
                          className={`object-contain transition-opacity duration-300 scale-90 ${active ? "opacity-90" : "opacity-55 group-hover:opacity-75"}`}
                        />
                        {active && (
                          <>
                            <div className="absolute inset-0 border border-[#C9A84C]" />
                            <div className="absolute top-2 right-2 w-5 h-5 bg-[#C9A84C] rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                              </svg>
                            </div>
                          </>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-[rgba(10,10,10,0.85)] text-left">
                          <p className="text-[8px] tracking-[1px] text-[#C9A84C] font-semibold uppercase truncate">{car.brand} {car.model}</p>
                          <p className="text-[9px] text-[#F5F0E8] font-semibold">
                            {car.pricePerDay.toLocaleString("fr-FR")} €
                            <span className="text-[7px] text-[#9A9080] font-normal"> /jour</span>
                          </p>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-[11px] text-[#9A9080] tracking-[2px] uppercase">Aucun véhicule disponible</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── BANDE INFOS PLEINE LARGEUR ─── */}
        <div className="flex-shrink-0 grid grid-cols-4 bg-[rgba(10,10,10,0.97)] border-t border-[rgba(201,168,76,0.2)]">
          {[
            {
              icon: (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="#C9A84C" strokeWidth={1.5} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              ),
              title: "Livraison partout dans le monde",
              sub: "Nous livrons où vous voulez, à tout moment.",
            },
            {
              icon: (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="#C9A84C" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
              ),
              title: "Conciergerie 24/7",
              sub: "Un support dédié, à toute heure.",
            },
            {
              icon: (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="#C9A84C" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              ),
              title: "Réservation sécurisée",
              sub: "Votre sécurité est notre priorité.",
            },
            {
              icon: (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="#C9A84C" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                </svg>
              ),
              title: "Meilleur tarif garanti",
              sub: "Les meilleurs tarifs, toujours.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-5 py-4 ${i < 3 ? "border-r border-[rgba(201,168,76,0.1)]" : ""}`}
            >
              {item.icon}
              <div>
                <p className="text-[9px] tracking-[2px] font-semibold text-[#C9A84C] uppercase mb-0.5">{item.title}</p>
                <p className="text-[9px] text-[#9A9080]">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {modalOpen && (
        <ReservationModal
          car={selectedCar}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
