# Prestige Drive — Next.js 14 + Tailwind CSS

Location de véhicules de prestige. Interface luxe noir & or.

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS 3**
- **TypeScript**
- **Framer Motion** (animations)

## Structure

```
prestige-drive/
├── public/
│   └── images/
│       ├── hero.mp4               ← Vidéo intro homepage
│       ├── homepage.png           ← Fallback vidéo
│       ├── showroom-bg.png        ← Fond décor vide
│       ├── dashboard-bg.png       ← Background dashboard
│       ├── revuelto-showroom.png  ← Lamborghini Revuelto (fond showroom)
│       ├── revuelto-studio.png    ← Lamborghini Revuelto (fond noir)
│       ├── cullinan-showroom.png  ← Rolls-Royce Cullinan (fond showroom)
│       ├── cullinan-studio.png    ← Rolls-Royce Cullinan (fond noir)
│       ├── rs6-showroom.png       ← Audi RS6 (fond showroom)
│       ├── rs6-studio.png         ← Audi RS6 (fond noir)
│       ├── r8spyder-showroom.png  ← Audi R8 Spyder (fond showroom)
│       └── r8spyder-studio.png    ← Audi R8 Spyder (fond noir)
├── src/
│   ├── app/
│   │   ├── page.tsx               ← Homepage (hero vidéo + strip)
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── flotte/
│   │   │   └── page.tsx           ← Catalogue véhicules
│   │   ├── vehicle/
│   │   │   └── [slug]/
│   │   │       └── page.tsx       ← Fiche véhicule détaillée
│   │   └── dashboard/
│   │       └── page.tsx           ← Espace client
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.tsx
│   │   └── ui/
│   │       └── ReservationModal.tsx
│   └── lib/
│       └── data.ts                ← Données véhicules & réservations
```

## Pages

| Route | Description |
|---|---|
| `/` | Homepage avec vidéo hero |
| `/flotte` | Catalogue des 4 véhicules |
| `/vehicle/lamborghini-revuelto` | Fiche Revuelto |
| `/vehicle/rolls-royce-cullinan` | Fiche Cullinan |
| `/vehicle/audi-rs6` | Fiche RS6 |
| `/vehicle/audi-r8-spyder` | Fiche R8 Spyder |
| `/dashboard` | Espace client Arthur D. |

## Installation

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

## Build production

```bash
npm run build
npm start
```

## Design System

- **Couleurs** : Or `#C9A84C`, Noir `#0A0A0A`, Texte `#F5F0E8`, Muted `#9A9080`
- **Typographie** : Cormorant Garamond (serif, titres) + Montserrat (sans-serif, corps)
- **Images showroom** : Utilisées comme fond plein écran pour les fiches véhicule
- **Images studio** : Fond noir, utilisées dans les cards flotte + modal réservation + dashboard

## Notes Claude Code

- Ajouter les véhicules dans `src/lib/data.ts`
- Les slugs URL correspondent à l'`id` dans `data.ts`
- Le modal de réservation est dans `src/components/ui/ReservationModal.tsx`
- Connecter un backend (Supabase, Prisma…) pour les vraies réservations
