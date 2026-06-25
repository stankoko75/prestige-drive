export interface Car {
  id: string;
  brand: string;
  model: string;
  puissance: string;
  acceleration: string;
  vitesseMax: string;
  pricePerDay: number;
  showroomImage: string;
  studioImage: string;
  heroImage: string;
  color: string;
  description: string;
  categorie: string;
}

export const cars: Car[] = [
  {
    id: "lamborghini-revuelto",
    brand: "LAMBORGHINI",
    model: "REVUELTO",
    puissance: "1 015 CH",
    acceleration: "2,5 s",
    vitesseMax: "> 350 KM/H",
    pricePerDay: 2800,
    showroomImage: "/images/revuelto-showroom.png",
    studioImage: "/images/revuelto-studio.png",
    heroImage: "/images/revuelto-showroom.png",
    color: "#6B7C3A",
    description:
      "Le Lamborghini Revuelto incarne l'avenir de la supercar de Sant'Agata. Motorisation V12 hybride plug-in de 1 015 ch, design sculptural et technologie de pointe pour une expérience de conduite absolument inoubliable.",
    categorie: "Hypercar",
  },
  {
    id: "rolls-royce-cullinan",
    brand: "ROLLS-ROYCE",
    model: "CULLINAN",
    puissance: "600 CH",
    acceleration: "4,9 s",
    vitesseMax: "250 KM/H",
    pricePerDay: 3200,
    showroomImage: "/images/cullinan-showroom.png",
    studioImage: "/images/cullinan-studio.png",
    heroImage: "/images/cullinan-showroom.png",
    color: "#1A1A1A",
    description:
      "Le Rolls-Royce Cullinan redéfinit le concept de SUV ultra-luxe. Intérieur artisanal de la plus haute facture, silence absolu à bord et puissance V12 biturbo pour une présence royale en toutes circonstances.",
    categorie: "SUV de luxe",
  },
  {
    id: "audi-rs6",
    brand: "AUDI",
    model: "RS6",
    puissance: "630 CH",
    acceleration: "3,3 s",
    vitesseMax: "> 305 KM/H",
    pricePerDay: 890,
    showroomImage: "/images/rs6-showroom.png",
    studioImage: "/images/rs6-studio.png",
    heroImage: "/images/rs6-showroom.png",
    color: "#D4A017",
    description:
      "L'Audi RS6 Avant est le break de sport ultime. Sa silhouette jaune Vegas incandescente, son V8 biturbo de 630 ch et son quattro implacable en font le compagnon idéal pour qui refuse de choisir entre praticité et performance.",
    categorie: "Break sport",
  },
  {
    id: "audi-r8-spyder",
    brand: "AUDI",
    model: "R8 SPYDER",
    puissance: "620 CH",
    acceleration: "3,1 s",
    vitesseMax: "> 330 KM/H",
    pricePerDay: 1450,
    showroomImage: "/images/r8spyder-showroom.png",
    studioImage: "/images/r8spyder-studio.png",
    heroImage: "/images/r8spyder-studio.png",
    color: "#FFFFFF",
    description:
      "L'Audi R8 Spyder V10 Performance est une supercar à ciel ouvert. Son moteur atmosphérique hurlant à 8 700 tr/min, sa carrosserie blanche immaculée et son habitacle racing offrent une connexion unique avec la route.",
    categorie: "Supercar cabriolet",
  },
];

export const reservations = [
  {
    id: "res-001",
    carId: "audi-rs6",
    brand: "AUDI",
    model: "RS6",
    image: "/images/rs6-studio.png",
    dateDebut: "24 Mai 2024",
    dateFin: "28 Mai 2024",
    status: "Confirmée" as const,
    statusColor: "green" as const,
    montant: 3560,
  },
  {
    id: "res-002",
    carId: "lamborghini-revuelto",
    brand: "LAMBORGHINI",
    model: "REVUELTO",
    image: "/images/revuelto-studio.png",
    dateDebut: "10 Juin 2024",
    dateFin: "15 Juin 2024",
    status: "En attente" as const,
    statusColor: "yellow" as const,
    montant: 14000,
  },
];
