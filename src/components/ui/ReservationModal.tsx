"use client";

import { useState } from "react";
import Image from "next/image";
import type { Car } from "@/lib/data";

interface ReservationModalProps {
  car: Car;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReservationModal({ car, isOpen, onClose }: ReservationModalProps) {
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [lieu, setLieu] = useState("Paris, France");
  const [km, setKm] = useState("300 km / jour inclus");
  const [chauffeur, setChauffeur] = useState(false);
  const [extraKm, setExtraKm] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  const images = [car.showroomImage, car.studioImage];

  const calculateDays = () => {
    if (!dateDebut || !dateFin) return 0;
    const d1 = new Date(dateDebut);
    const d2 = new Date(dateFin);
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const days = calculateDays();
  const baseTotal = days * car.pricePerDay;
  const chauffeurTotal = chauffeur ? days * 400 : 0;
  const total = baseTotal + chauffeurTotal;
  const acompte = Math.round(total * 0.1);

  const formatDate = (val: string) => {
    if (!val) return "";
    const d = new Date(val);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#0F0F0F] border border-[rgba(201,168,76,0.2)] w-[95vw] max-w-[1100px] max-h-[95vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── HEADER ─── */}
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 md:py-5 border-b border-[rgba(201,168,76,0.15)]">
          <div className="w-8" />
          <p className="text-[11px] sm:text-[13px] tracking-[2px] sm:tracking-[4px] font-semibold text-[#C9A84C] uppercase">
            Réserver ce véhicule
          </p>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#9A9080] hover:text-[#F5F0E8] transition-colors bg-transparent border-none cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ─── CORPS ─── */}
        <div className="flex flex-col md:flex-row flex-1 md:overflow-hidden">

          {/* COLONNE GAUCHE */}
          <div className="w-full md:w-[380px] md:flex-shrink-0 border-b md:border-b-0 md:border-r border-[rgba(201,168,76,0.12)] flex flex-col">

            {/* Image avec navigation */}
            <div className="relative h-[180px] sm:h-[210px] bg-[#111] overflow-hidden flex-shrink-0">
              <Image
                src={images[imgIdx]}
                alt={car.model}
                fill
                className="object-cover transition-opacity duration-400"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                onClick={() => setImgIdx((imgIdx + images.length - 1) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 border border-[rgba(201,168,76,0.3)] flex items-center justify-center text-[#F5F0E8] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={() => setImgIdx((imgIdx + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 border border-[rgba(201,168,76,0.3)] flex items-center justify-center text-[#F5F0E8] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>

            {/* Infos véhicule */}
            <div className="p-6 border-b border-[rgba(201,168,76,0.12)]">
              <p className="text-[10px] tracking-[4px] text-[#C9A84C] font-semibold uppercase mb-1">{car.brand}</p>
              <p className="font-serif text-[30px] font-light tracking-[3px] text-[#F5F0E8] mb-4 leading-none">{car.model}</p>
              <div className="flex gap-5">
                {[
                  { value: car.puissance, label: "PUISSANCE" },
                  { value: car.acceleration, label: "0-100 KM/H" },
                  { value: car.vitesseMax, label: "VITESSE MAX" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-[13px] font-semibold text-[#F5F0E8] leading-none">{s.value}</p>
                    <p className="text-[8px] tracking-[1.5px] text-[#9A9080] uppercase mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tarif */}
            <div className="px-6 py-5 border-b border-[rgba(201,168,76,0.12)]">
              <p className="text-[9px] tracking-[3px] text-[#9A9080] uppercase font-semibold mb-2">Tarif de location</p>
              <div className="flex items-baseline gap-2">
                <p className="font-serif text-[28px] font-light text-[#C9A84C] leading-none">
                  {car.pricePerDay.toLocaleString("fr-FR")} €
                </p>
                <p className="text-[10px] tracking-[2px] text-[#9A9080] uppercase">/ JOUR</p>
              </div>
            </div>

            {/* Avantages */}
            <div className="px-6 py-5 flex flex-col gap-3">
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
                  <p className="text-[9px] tracking-[1.5px] text-[#9A9080] uppercase">{f.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* COLONNE DROITE */}
          <div className="flex-1 flex flex-col p-4 sm:p-6 gap-4 sm:gap-5 md:overflow-y-auto">

            {/* Dates */}
            <div>
              <p className="text-[9px] tracking-[3px] text-[#9A9080] font-semibold uppercase mb-3">
                Sélectionnez vos dates
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1 flex flex-col gap-1.5">
                  <p className="text-[8px] tracking-[2px] text-[#9A9080] uppercase font-medium">Date de début</p>
                  <div className="relative">
                    <input
                      type="date"
                      className="prestige-input pr-10 text-[12px]"
                      value={dateDebut}
                      onChange={(e) => setDateDebut(e.target.value)}
                    />
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A84C] pointer-events-none" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                  </div>
                  {dateDebut && (
                    <p className="text-[9px] text-[#C9A84C] tracking-[0.5px]">{formatDate(dateDebut)}</p>
                  )}
                </div>

                <svg className="hidden sm:block w-5 h-5 text-[#C9A84C] flex-shrink-0 mt-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>

                <div className="flex-1 flex flex-col gap-1.5">
                  <p className="text-[8px] tracking-[2px] text-[#9A9080] uppercase font-medium">Date de fin</p>
                  <div className="relative">
                    <input
                      type="date"
                      className="prestige-input pr-10 text-[12px]"
                      value={dateFin}
                      onChange={(e) => setDateFin(e.target.value)}
                      min={dateDebut}
                    />
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A84C] pointer-events-none" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                  </div>
                  {dateFin && (
                    <p className="text-[9px] text-[#C9A84C] tracking-[0.5px]">{formatDate(dateFin)}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Lieu + KM */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-[8px] tracking-[2px] text-[#9A9080] uppercase font-medium">Lieu de livraison</p>
                <div className="relative">
                  <select
                    className="prestige-input appearance-none pr-8 text-[12px] cursor-pointer"
                    value={lieu}
                    onChange={(e) => setLieu(e.target.value)}
                  >
                    <option>Paris, France</option>
                    <option>Monaco</option>
                    <option>Cannes</option>
                    <option>Saint-Tropez</option>
                    <option>Lyon</option>
                    <option>Autre (sur devis)</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9080] pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-[8px] tracking-[2px] text-[#9A9080] uppercase font-medium">KM inclus</p>
                <div className="relative">
                  <select
                    className="prestige-input appearance-none pr-8 text-[12px] cursor-pointer"
                    value={km}
                    onChange={(e) => setKm(e.target.value)}
                  >
                    <option>300 km / jour inclus</option>
                    <option>500 km / jour inclus</option>
                    <option>Kilométrage illimité</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9080] pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Options */}
            <div>
              <p className="text-[9px] tracking-[3px] text-[#9A9080] font-semibold uppercase mb-3">Options</p>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: "Chauffeur privé", price: "400 € / jour", checked: chauffeur, set: setChauffeur },
                  { label: "Kilométrage supplémentaire", price: "5 € / km", checked: extraKm, set: setExtraKm },
                ].map((opt) => (
                  <label key={opt.label} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer ${
                          opt.checked ? "border-[#C9A84C] bg-[#C9A84C]" : "border-[#3A3A3A] group-hover:border-[#C9A84C]"
                        }`}
                        onClick={() => opt.set(!opt.checked)}
                      >
                        {opt.checked && (
                          <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[11px] text-[#F5F0E8] tracking-[0.5px]">{opt.label}</span>
                    </div>
                    <span className="text-[11px] text-[#9A9080]">{opt.price}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Blocs infos */}
            <div className="flex flex-col gap-2.5">
              {[
                {
                  badge: "10%",
                  title: "ACOMPTE",
                  text: "Un acompte de 10% du montant total est requis pour confirmer votre réservation.",
                },
                {
                  badge: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                  ),
                  title: "CAUTION",
                  text: "Une caution de 10 000 € sera bloquée sur votre carte bancaire. Elle est restituée sous 5 à 7 jours après la fin de la location, sous réserve d'aucun dommage ou infraction.",
                },
                {
                  badge: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  ),
                  title: "PAIEMENT SÉCURISÉ",
                  text: "Le solde est à régler au plus tard 48h avant la date de début de la location.",
                },
              ].map((bloc, i) => (
                <div key={i} className="flex gap-3 bg-[#1A1A1A] border-l-2 border-[#C9A84C] px-4 py-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[rgba(201,168,76,0.4)] flex items-center justify-center text-[#C9A84C]">
                    {typeof bloc.badge === "string" ? (
                      <span className="text-[9px] font-bold">{bloc.badge}</span>
                    ) : (
                      bloc.badge
                    )}
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[2px] text-[#C9A84C] font-semibold uppercase mb-1">{bloc.title}</p>
                    <p className="text-[10px] text-[#9A9080] leading-relaxed">{bloc.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── FOOTER ─── */}
        <div className="border-t border-[rgba(201,168,76,0.15)] bg-[#0A0A0A]">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center px-4 sm:px-6 md:px-8 py-4 gap-3 sm:gap-6">
            {/* Récapitulatif */}
            <div className="flex-shrink-0">
              <p className="text-[8px] tracking-[2px] text-[#9A9080] uppercase font-semibold">Récapitulatif</p>
              <p className="text-[11px] text-[#F5F0E8] mt-0.5">
                {days > 0 ? `${days} jour${days > 1 ? "s" : ""} de location` : "Sélectionnez les dates"}
              </p>
            </div>

            <div className="hidden sm:block w-px h-10 bg-[rgba(201,168,76,0.15)]" />

            {/* Total */}
            <div className="flex-1 text-center">
              <p className="text-[8px] tracking-[2px] text-[#9A9080] uppercase font-semibold mb-0.5">Total estimé</p>
              <p className="font-serif text-[24px] sm:text-[28px] font-light text-[#C9A84C] leading-none">
                {total > 0 ? `${total.toLocaleString("fr-FR")} €` : "—"}
              </p>
              {total > 0 && (
                <p className="text-[9px] text-[#9A9080] mt-0.5">
                  (Acompte 10% : {acompte.toLocaleString("fr-FR")} €)
                </p>
              )}
            </div>

            <div className="hidden sm:block w-px h-10 bg-[rgba(201,168,76,0.15)]" />

            {/* Sécurisé + bouton */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 flex-shrink-0">
              <div className="flex items-center gap-2 text-[#9A9080]">
                <svg className="w-4 h-4 text-[#C9A84C] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                <span className="text-[9px] tracking-[1px] uppercase">Paiement 100% sécurisé</span>
              </div>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#C9A84C] text-black px-8 py-3.5 text-[10px] tracking-[3px] font-bold uppercase hover:bg-[#E8C97A] transition-colors border-none cursor-pointer flex-shrink-0">
                Continuer
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* CGV */}
          <div className="px-4 sm:px-6 md:px-8 pb-4">
            <p className="text-center text-[9px] text-[#9A9080] tracking-[0.5px]">
              En confirmant cette réservation, vous acceptez nos{" "}
              <span className="text-[#C9A84C] underline cursor-pointer hover:text-[#E8C97A] transition-colors">
                Conditions Générales de Location
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
