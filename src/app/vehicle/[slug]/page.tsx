"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import ReservationModal from "@/components/ui/ReservationModal";
import { cars } from "@/lib/data";

interface Props {
  params: { slug: string };
}

export default function VehicleDetailPage({ params }: Props) {
  const car = cars.find((c) => c.id === params.slug);
  if (!car) notFound();

  const [modalOpen, setModalOpen] = useState(false);

  // Other cars for sidebar (exclude current)
  const otherCars = cars.filter((c) => c.id !== car.id);
  const leftCar = otherCars[0];
  const rightCar = otherCars[otherCars.length - 1];

  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      <Navbar transparent />

      {/* ─── VEHICLE HERO ─── */}
      <section className="relative min-h-screen overflow-hidden flex flex-col items-center justify-start pt-[100px] sm:pt-[120px] pb-32 sm:pb-10">
        {/* Showroom background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={car.showroomImage}
            alt={`${car.brand} ${car.model} showroom`}
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
          {/* Scrim haut : masque le texte (marque/modèle/stats) intégré à la photo */}
          <div className="absolute top-0 left-0 right-0 h-[50%] sm:h-[45%] backdrop-blur-2xl bg-gradient-to-b from-black/90 via-black/70 to-transparent" />
          {/* Scrim bas : masque les boutons intégrés à la photo */}
          <div className="absolute bottom-0 left-0 right-0 h-[35%] sm:h-[30%] backdrop-blur-xl bg-gradient-to-t from-black/85 to-transparent" />
        </div>

        {/* Vehicle content */}
        <div className="relative z-10 text-center w-full px-4">
          <p className="text-[10px] sm:text-[11px] tracking-[3px] sm:tracking-[5px] text-[#C9A84C] font-semibold uppercase mb-3">
            {car.brand}
          </p>
          <h1 className="font-serif text-[clamp(38px,11vw,130px)] font-light tracking-[2px] sm:tracking-[8px] uppercase leading-none text-[#F5F0E8] mb-8 sm:mb-12">
            {car.model}
          </h1>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 md:gap-20">
            {[
              { value: car.puissance, label: "Puissance", icon: StatIconPower },
              { value: car.acceleration, label: "0–100 KM/H", icon: StatIconAccel },
              { value: car.vitesseMax, label: "Vitesse Max", icon: StatIconSpeed },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-9 sm:h-9 border border-[#C9A84C] rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon />
                </div>
                <div className="text-left">
                  <p className="text-[16px] sm:text-[20px] font-semibold text-[#F5F0E8] tracking-[1px] leading-none">
                    {value}
                  </p>
                  <p className="text-[8px] sm:text-[9px] tracking-[1.5px] sm:tracking-[2px] text-[#9A9080] uppercase mt-0.5">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar: Vue 360 + Galerie */}
        <div className="absolute bottom-5 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col sm:flex-row w-[90%] sm:w-auto gap-2 sm:gap-0 z-10">
          <button className="flex items-center justify-center gap-2 sm:gap-3 bg-black/60 backdrop-blur-sm border border-[rgba(201,168,76,0.3)] px-4 sm:px-10 py-3 sm:py-4 text-[9px] sm:text-[10px] tracking-[1.5px] sm:tracking-[2px] text-[#F5F0E8] uppercase font-medium hover:bg-[rgba(201,168,76,0.12)] hover:border-[#C9A84C] transition-all cursor-pointer font-sans">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="#C9A84C" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Vue 360°
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center gap-2 sm:gap-3 bg-[#C9A84C] border border-[#C9A84C] px-4 sm:px-10 py-3 sm:py-4 text-[9px] sm:text-[10px] tracking-[1.5px] sm:tracking-[2px] text-black uppercase font-bold hover:bg-[#E8C97A] transition-all cursor-pointer font-sans"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 stroke-black flex-shrink-0" fill="none" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            Réserver maintenant
          </button>
          <button className="flex items-center justify-center gap-2 sm:gap-3 bg-black/60 backdrop-blur-sm border border-[rgba(201,168,76,0.3)] px-4 sm:px-10 py-3 sm:py-4 text-[9px] sm:text-[10px] tracking-[1.5px] sm:tracking-[2px] text-[#F5F0E8] uppercase font-medium hover:bg-[rgba(201,168,76,0.12)] hover:border-[#C9A84C] transition-all cursor-pointer font-sans">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="#C9A84C" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            Galerie
          </button>
        </div>
      </section>

      {/* ─── DESCRIPTION SECTION ─── */}
      <section className="relative bg-[#0A0A0A]">
        {/* Showroom BG subtle */}
        <div className="absolute inset-0 z-0 opacity-10">
          <Image src="/images/showroom-bg.png" alt="" fill className="object-cover" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 md:px-12 py-12 sm:py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Description */}
          <div>
            <div className="w-10 h-px bg-[#C9A84C] mb-6" />
            <p className="text-[10px] tracking-[3px] text-[#C9A84C] uppercase font-semibold mb-3">
              {car.brand}
            </p>
            <h2 className="font-serif text-[34px] sm:text-[40px] md:text-[48px] font-light tracking-[2px] sm:tracking-[3px] uppercase text-[#F5F0E8] leading-none mb-6">
              {car.model}
            </h2>
            <p className="text-[13px] leading-[2] text-[#9A9080] font-light">
              {car.description}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setModalOpen(true)}
                className="bg-[#C9A84C] text-black px-8 py-3 text-[10px] tracking-[2.5px] font-bold uppercase hover:bg-[#E8C97A] transition-colors font-sans"
              >
                Réserver
              </button>
              <Link
                href="/flotte"
                className="border border-[rgba(201,168,76,0.3)] text-[#9A9080] px-8 py-3 text-[10px] tracking-[2.5px] font-medium uppercase hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors no-underline font-sans text-center"
              >
                Retour flotte
              </Link>
            </div>
          </div>

          {/* Studio photo */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={car.studioImage}
                alt={`${car.brand} ${car.model}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 40vw"
              />
            </div>
            {/* Gold frame accent */}
            <div className="absolute -bottom-3 -right-3 w-full h-full border border-[rgba(201,168,76,0.25)] pointer-events-none" />
          </div>
        </div>

        {/* Other vehicles */}
        <div className="relative z-10 border-t border-[rgba(201,168,76,0.12)] px-5 sm:px-8 md:px-12 py-10 md:py-12">
          <p className="text-[10px] tracking-[3px] text-[#9A9080] uppercase mb-8 text-center">
            Autres véhicules disponibles
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-4xl mx-auto">
            {otherCars.slice(0, 3).map((other) => (
              <Link
                key={other.id}
                href={`/vehicle/${other.id}`}
                className="relative overflow-hidden block no-underline group h-28 sm:h-36"
              >
                <Image
                  src={other.studioImage}
                  alt={other.model}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-[9px] tracking-[2px] text-[#C9A84C] uppercase font-semibold">
                    {other.brand}
                  </p>
                  <p className="font-serif text-[18px] font-light text-[#F5F0E8]">
                    {other.model}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation modal */}
      <ReservationModal
        car={car}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}

function StatIconPower() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="#C9A84C" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
  );
}
function StatIconAccel() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="#C9A84C" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}
function StatIconSpeed() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="#C9A84C" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
    </svg>
  );
}
