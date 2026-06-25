import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prestige Drive — L'Exception, Au-Delà de l'Ordinaire",
  description:
    "Des expériences sur-mesure avec les véhicules les plus prestigieux. Chaque détail. Parfaitement maîtrisé.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
