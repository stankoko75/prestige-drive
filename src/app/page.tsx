"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function HomePage() {
  const [videoEnded, setVideoEnded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    const fallback = setTimeout(() => setVideoEnded(true), 30000);
    return () => {
      mq.removeEventListener("change", onChange);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      {/* ─── INTRO VIDEO (plein écran, sans UI) ─── */}
      {!videoEnded && (
        <div className="fixed inset-0 z-[100] bg-black">
          {/* La balise vidéo est rendue dès le HTML initial (pas derrière un état "mounted")
              pour qu'elle commence à charger/jouer même si l'hydratation React est lente
              sur mobile — sinon l'écran reste noir le temps que le JS s'exécute. */}
          <video
            key={isMobile ? "mobile" : "desktop"}
            autoPlay
            muted
            playsInline
            poster="/images/homepage.png"
            className="w-full h-full object-cover"
            onEnded={() => setVideoEnded(true)}
            onError={() => setVideoEnded(true)}
          >
            <source src={isMobile ? "/videos/intro-mobile.mp4" : "/videos/intro.mp4"} type="video/mp4" />
          </video>
          <button
            onClick={() => setVideoEnded(true)}
            className="absolute bottom-10 right-10 flex items-center gap-2 bg-transparent border-none cursor-pointer text-[rgba(245,240,232,0.45)] hover:text-[#C9A84C] transition-colors"
          >
            <span className="text-[10px] tracking-[3px] uppercase font-semibold">Passer l&apos;intro</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      )}

      {/* ─── HERO (image fixe + texte + boutons) ─── */}
      {videoEnded && (
        <>
          <Navbar transparent={false} />
          <section className="relative h-screen min-h-[600px] flex flex-col animate-fade-in">
            {/* Background : image pré-floutée côté serveur (le texte d'origine y est
                déjà illisible) — évite de charger l'image source 4K + un filtre CSS
                coûteux côté client, qui pouvait rester invisible le temps de calculer. */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/homepage-hero-bg.jpg"
                alt="Prestige Drive"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/55" />
            </div>

            {/* Contenu central : titre, sous-titre, CTA (responsive, ne dépend pas du texte intégré à la photo) */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-5 sm:px-8">
              <h1 className="font-serif text-[clamp(26px,6.5vw,56px)] font-light uppercase tracking-[1.5px] sm:tracking-[3px] text-[#F5F0E8] leading-[1.2] max-w-3xl">
                L&apos;exception, au-delà de l&apos;ordinaire
              </h1>
              <div className="w-10 h-px bg-[#C9A84C] my-5" />
              <p className="text-[12px] sm:text-[13px] text-[#9A9080] leading-[1.8] max-w-md">
                Des expériences sur-mesure avec les véhicules les plus prestigieux. Chaque détail. Parfaitement maîtrisé.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full sm:w-auto max-w-[280px] sm:max-w-none">
                <Link
                  href="/flotte"
                  className="bg-[#C9A84C] text-black px-8 py-3.5 text-[10px] tracking-[2.5px] font-bold uppercase hover:bg-[#E8C97A] transition-colors no-underline text-center"
                >
                  Découvrir notre flotte
                </Link>
                <Link
                  href="/dashboard"
                  className="border border-[rgba(245,240,232,0.4)] text-[#F5F0E8] px-8 py-3.5 text-[10px] tracking-[2.5px] font-semibold uppercase hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors no-underline text-center"
                >
                  Mes réservations
                </Link>
              </div>
            </div>

            {/* Bande bas */}
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 bg-[rgba(10,10,10,0.93)] border-t border-[rgba(201,168,76,0.25)]">
              {[
                {
                  icon: (
                    <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="#C9A84C" strokeWidth={1.5} viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  ),
                  title: "Livraison mondiale",
                  sub: "Nous livrons partout, à tout moment.",
                },
                {
                  icon: (
                    <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="#C9A84C" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                  ),
                  title: "Conciergerie 24/7",
                  sub: "Un support dédié, à chaque instant.",
                },
                {
                  icon: (
                    <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="#C9A84C" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                  ),
                  title: "Réservation sécurisée",
                  sub: "Votre sécurité est notre priorité.",
                },
                {
                  icon: (
                    <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="#C9A84C" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                    </svg>
                  ),
                  title: "Meilleur prix garanti",
                  sub: "Des tarifs imbattables, toujours.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 md:px-8 py-4 md:py-7 border-[rgba(201,168,76,0.12)] ${
                    i < 2 ? "border-b md:border-b-0" : ""
                  } ${i % 2 === 0 ? "border-r" : ""} ${i < 3 ? "md:border-r" : "md:border-r-0"}`}
                >
                  {item.icon}
                  <div>
                    <p className="text-[10px] sm:text-[11px] tracking-[1px] sm:tracking-[2px] font-semibold text-[#C9A84C] uppercase mb-1">{item.title}</p>
                    <p className="text-[10px] sm:text-[11px] text-[#9A9080] tracking-[0.5px]">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
