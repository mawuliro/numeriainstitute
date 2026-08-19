# 🎓 Numeria Institute

> Plateforme d'apprentissage interactive pour la physique, les mathématiques et la programmation — pensée pour les apprenants francophones.

[![Deploy on Vercel](https://img.shields.io/badge/Vercel-Live-brightgreen)](https://numeriainstitute.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL-2D3748)](https://www.prisma.io)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

**Production** : <https://numeriainstitute.vercel.app>

---

## 📖 Sommaire

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Architecture](#architecture)
- [Installation locale](#installation-locale)
- [Déploiement](#déploiement)
- [Structure du projet](#structure-du-projet)
- [Contenu pédagogique](#contenu-pédagogique)
- [Sécurité](#sécurité)
- [Héritage Django](#héritage-django)
- [Roadmap](#roadmap)
- [Contribuer](#contribuer)
- [Licence](#licence)

---

## Aperçu

Numeria Institute est une plateforme d'enseignement en ligne dédiée aux **sciences fondamentales** (physique, mathématiques) et à la **programmation** (Python), avec une attention particulière portée aux **apprenants francophones** — notamment en Afrique subsaharienne.

Le projet vise à combiner la rigueur académique d'un cours universitaire avec l'interactivité d'une plateforme moderne (style Khan Academy / Brilliant), en proposant :

- Des **cours structurés** avec théorie, formules LaTeX, schémas vectoriels
- Des **exemples corrigés pas-à-pas** détaillés
- Des **exercices interactifs** (QCM, labs PhET-style)
- Des **bac à sable Python** s'exécutant dans le navigateur (Pyodide)
- Une **gamification** (badges, streaks, certificats)
- Une **communauté** (forum, blog)

### Public cible

- Étudiants du supérieur (L1–M1) en sciences physiques et mathématiques
- Élèves de Terminale scientifique préparant le bac
- Autodidactes francophones souhaitant apprendre Python ou consolider leurs bases en mécanique
- Enseignants cherchant un support pédagogique interactif

---

## Fonctionnalités

### 📚 Cours & contenu

- **Cours structurés** en modules et leçons
- **Blocs de contenu variés** par leçon :
  - Texte Markdown + LaTeX (rendu MathJax)
  - Schémas SVG vectoriels inline (trajectoires, vecteurs forces, etc.)
  - Sandbox Python (Pyodide — matplotlib dans le navigateur)
  - QCM avec feedback détaillé par option
  - Labs interactifs PhET-style (sliders + simulations matplotlib + challenges à résoudre)
- **Progression individuelle** : marquage des leçons terminées
- **Favoris** (bookmarks) sur les leçons
- **Certificats** générés automatiquement à la fin d'un cours

### 👤 Authentification & profils

- Inscription / connexion par email + mot de passe
- **Photo de profil** (upload via API endpoint dédié, redimensionnée avec sharp)
- Validation d'email obligatoire
- Réinitialisation de mot de passe par token sécurisé
- Rate limiting sur le login (5 tentatives / 15 min, lockout 30 min)
- Tokens hashés en SHA-256 en base (jamais stockés en clair)
- **Soft-delete RGPD** des utilisateurs (préserve l'historique)

### 🎮 Gamification

- **Streak** quotidien (série de jours d'activité)
- **Badges** débloquables :
  - 🎯 Premier pas — première leçon terminée
  - 🔥 Régulier — 7 jours de streak
  - ⚡ Assidu — 30 jours de streak
  - 🏆 Champion — cours complet terminé
  - 💬 Actif — premier message forum
  - 🧭 Explorateur — 5 cours visités
- **XP** cumulé par activité
- **Certificats** avec numéro unique

### 👨‍🏫 Espace admin

- Dashboard avec statistiques (utilisateurs, cours, inscriptions, badges)
- Gestion des **cours** (CRUD complet + modules + leçons + blocs)
- Gestion des **utilisateurs** (rôles : Student / Mentor / Staff / Admin, vérification, soft-delete)
- Gestion du **blog** (éditeur Markdown + LaTeX)
- Gestion de la **visioconférence** (planification de réunions Jitsi Meet)

### 🌐 Communauté

- **Forum** par cours (sujets, réponses, épinglage, verrouillage)
- **Blog** avec articles pédagogiques
- **Visioconférence** intégrée via Jitsi Meet (avec salle d'attente)

### 🌍 Internationalisation

- **Bilingue FR / EN** (cookie-based, sans routing URL)
- Toutes les pages publiques traduites

### 🎨 Design & UX

- **Thème clair / sombre** (next-themes)
- **Responsive** mobile-first (drawer mobile, sidebar desktop)
- **Couleurs de marque** : navy `#1B2A4E`, teal `#2DD4BF`, or `#C9A227`
- **Callouts colorés** dans le contenu (💡 tip, ⚠️ warning, ✅ success, ❌ error, 📋 definition)
- **Animations subtiles** (fade-in sur les blocs)

### 📊 SEO & PWA

- `sitemap.xml` dynamique
- `robots.txt` dynamique
- `generateMetadata` par page (OpenGraph, Twitter Cards)
- `manifest.json` pour installation PWA
- Pas de tracking analytics (RGPD-friendly)

---

## Stack technique

| Catégorie | Technologie |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Langage** | TypeScript (strict mode) |
| **DB & ORM** | PostgreSQL (Neon) + Prisma 6 |
| **Auth** | NextAuth v5 (JWT, Credentials provider) |
| **Emails** | Brevo (ex-Sendinblue) |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **Icônes** | lucide-react |
| **Forms** | react-hook-form + zod |
| **State** | Zustand, TanStack Query |
| **Python runtime** | Pyodide (CDN, exécuté côté client) |
| **Images** | sharp (redimensionnement server-side) |
| **Déploiement** | Vercel (Edge middleware + Node.js serverless) |

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Navigateur (Client)                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  React 19 + Next.js 16 App Router                │  │
│  │  • Pages (Server Components par défaut)          │  │
│  │  • Server Actions (mutations)                   │  │
│  │  • Client Components (forms, interactivité)     │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Pyodide (Python dans le navigateur)             │  │
│  │  • matplotlib + numpy chargés depuis CDN        │  │
│  │  • Sandbox + Labs interactifs                   │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼ (HTTPS)
┌──────────────────────────────────────────────────────────┐
│              Vercel (Edge + Node.js Serverless)          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Edge Middleware (1 MB max)                      │  │
│  │  • Route protection (/admin, /dashboard, etc.)   │  │
│  │  • JWT validation via NextAuth                   │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Server Components & API Routes (Node.js)        │  │
│  │  • Prisma Client (PostgreSQL)                   │  │
│  │  • NextAuth v5 (Credentials + JWT)              │  │
│  │  • Server Actions (mutations DB)               │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼ (TCP + SSL)
┌──────────────────────────────────────────────────────────┐
│                Neon (PostgreSQL managé)                 │
│  • 27 tables (User, Course, Lesson, MCQ, Lab, etc.)     │
│  • Indexes optimisés                                     │
│  • Cascade deletes                                       │
└──────────────────────────────────────────────────────────┘
```

### Sécurité

- **AUTH_SECRET** requis en production (JWT signing)
- **CSRF protection** via `serverActions.allowedOrigins`
- **Tokens hashés** en SHA-256 (reset password, email verify)
- **Rate limiting** IP-based sur login + search + contact + avatar upload
- **Soft-delete** RGPD (préserve l'historique)
- **XSS prevention** : HTML échappé avant rendu Markdown (sauf SVG inline qui sont extraits avant échappement)
- **Headers de sécurité** : X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy

---

## Installation locale

### Prérequis

- **Node.js 20+** ou **Bun 1.3+**
- **PostgreSQL** (local, Docker, ou un compte Neon gratuit)
- **Git**

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/mawuliro/numeriainstitute.git
cd numeriainstitute

# 2. Installer les dépendances
bun install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Édite .env avec tes valeurs :
#   DATABASE_URL=postgresql://user:pass@host:5432/db
#   AUTH_SECRET=openssl rand -base64 32
#   NEXTAUTH_URL=http://localhost:3000
#   BOOTSTRAP_ADMIN_SECRET=une-chaîne-aléatoire
#   BREVO_API_KEY= (optionnel en dev)

# 4. Pousser le schéma Prisma sur la DB
bunx prisma db push
bunx prisma generate

# 5. Lancer le serveur de dev
bun run dev
```

Ouvre <http://localhost:3000> — c'est prêt ! 🎉

### Créer un compte admin

```bash
# Option A : script local
bun run scripts/create-admin.ts

# Option B : via l'endpoint bootstrap (production)
curl -X POST https://ton-app.vercel.app/api/admin/bootstrap \
  -H "x-bootstrap-secret: TON_BOOTSTRAP_ADMIN_SECRET"
```

---

## Déploiement

### Vercel (recommandé)

1. Fork le repo sur GitHub
2. Importe le projet sur [Vercel](https://vercel.com)
3. Configure les variables d'environnement :

| Variable | Valeur | Env. |
|---|---|---|
| `DATABASE_URL` | URL Neon PostgreSQL | Production + Preview |
| `AUTH_SECRET` | `openssl rand -base64 32` | Production |
| `NEXTAUTH_URL` | `https://ton-app.vercel.app` | Production |
| `BOOTSTRAP_ADMIN_SECRET` | Chaîne aléatoire longue | Production (à supprimer après bootstrap) |
| `BREVO_API_KEY` | Clé API Brevo | Production (optionnel) |
| `BREVO_SENDER_EMAIL` | `noreply@ton-domaine.com` | Production |
| `BREVO_SENDER_NAME` | `Numeria Institute` | Production |

4. Configure la DB Neon : <https://neon.tech> (gratuit, 5 min de setup)
5. Pousse le schéma : `DATABASE_URL="..." bunx prisma db push`
6. Crée l'admin via curl (voir ci-dessus)
7. **Sécurité** : supprime `BOOTSTRAP_ADMIN_SECRET` après création de l'admin

### Neon DB setup

1. Crée un compte sur <https://neon.tech>
2. "Create new project" → nomme-le `numeria-prod`
3. Région : `us-east-2` (proche de Vercel iad1)
4. Récupère la connection string dans "Connection Details"
5. Ajoute-la comme `DATABASE_URL` sur Vercel

---

## Structure du projet

```
numeriainstitute/
├── prisma/
│   └── schema.prisma              # Schéma DB (27 tables)
├── public/
│   ├── uploads/avatars/           # Avatars uploadés (dev only)
│   ├── manifest.json              # PWA manifest
│   ├── favicon.ico
│   └── logo.svg
├── scripts/
│   ├── create-admin.ts            # Crée un admin (idempotent)
│   ├── seed-mecanique/            # Cours complet de Mécanique Classique
│   │   ├── index.ts               # Script principal
│   │   ├── types.ts               # Types TS pour le contenu
│   │   ├── module-1-cinematique.ts
│   │   ├── module-2-lois-newton.ts
│   │   ├── module-3-forces.ts
│   │   ├── module-4-energie.ts
│   │   ├── module-5-quantite-mouvement.ts
│   │   └── module-6-oscillateurs-gravitation.ts
│   └── seed.ts                    # Seed générique
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/                # Routes d'auth (login, signup)
│   │   ├── admin/                 # Espace admin (layout protégé)
│   │   │   ├── cours/             # CRUD cours + leçons + blocs
│   │   │   ├── blog/              # CRUD blog
│   │   │   ├── utilisateurs/      # Gestion utilisateurs
│   │   │   └── visioconference/   # Gestion réunions
│   │   ├── api/
│   │   │   ├── admin/bootstrap/   # Endpoint création admin initial
│   │   │   ├── auth/[...nextauth] # NextAuth handler
│   │   │   ├── search/            # Recherche full-text
│   │   │   ├── notifications/
│   │   │   └── upload-avatar/     # Upload + resize via sharp
│   │   ├── cours/                 # Catalogue + détail cours + leçons
│   │   ├── blog/                  # Blog public
│   │   ├── communaute/            # Forum
│   │   ├── visioconference/       # Visio Jitsi
│   │   ├── profil/                # Profil + édition
│   │   ├── dashboard/             # Espace étudiant
│   │   ├── contact/
│   │   ├── a-propos/
│   │   ├── admissions/
│   │   ├── formations/
│   │   ├── mentorat/              # Placeholder
│   │   ├── layout.tsx             # Root layout (fonts, providers)
│   │   ├── page.tsx               # Home
│   │   ├── error.tsx              # Error boundary (with details)
│   │   ├── not-found.tsx
│   │   ├── loading.tsx
│   │   ├── sitemap.ts             # Dynamic sitemap
│   │   └── robots.ts             # Dynamic robots.txt
│   ├── auth.config.ts            # Lightweight NextAuth config (Edge-safe)
│   ├── middleware.ts              # Route protection (Edge runtime)
│   ├── components/
│   │   ├── lesson/                # Composants de rendu de leçons
│   │   │   ├── lesson-blocks-renderer.tsx
│   │   │   ├── text-block.tsx     # Markdown + LaTeX + SVG + callouts
│   │   │   ├── mcq-block.tsx      # QCM interactif
│   │   │   ├── sandbox-block.tsx  # Python (Pyodide)
│   │   │   ├── lab-block.tsx      # Lab PhET-style avec challenges
│   │   │   ├── fill-blank-block.tsx
│   │   │   └── true-false-block.tsx
│   │   ├── ui/                    # shadcn/ui (40+ components)
│   │   ├── providers/             # ThemeProvider, SessionProvider
│   │   ├── site-header.tsx
│   │   ├── site-footer.tsx
│   │   ├── search-bar.tsx
│   │   ├── notification-bell.tsx
│   │   ├── numeria-logo.tsx       # Logo SVG
│   │   └── ...
│   ├── lib/
│   │   ├── auth.ts                # NextAuth config (Node.js runtime)
│   │   ├── db.ts                  # Prisma client
│   │   ├── security.ts           # Password validation, rate limit, requireAdmin
│   │   ├── email.ts              # Brevo wrapper
│   │   ├── gamification.ts       # Badges + streaks
│   │   ├── queries.ts            # Requêtes réutilisables
│   │   ├── i18n.ts               # Server-side i18n
│   │   ├── i18n-client.ts        # Client-side i18n hook
│   │   ├── i18n-shared.ts        # Traductions FR/EN (600+ clés)
│   │   └── utils.ts               # cn() et helpers
│   └── types/
│       └── globals.d.ts          # Window.MathJax types
├── .env.example
├── next.config.ts                 # Server Actions origins + security headers
├── tailwind.config.ts
├── tsconfig.json                  # Strict mode
├── eslint.config.mjs
└── package.json
```

---

## Contenu pédagogique

### Cours disponible

#### 📘 Mécanique Classique (12h, 25 leçons)

Cours complet de mécanique newtonienne — niveau L1/L2.

| Module | Leçons | Concepts |
|---|---|---|
| **1. Cinématique du point** | 4 | Position, vitesse, accélération, MRU, MRUV, projectile, MCU |
| **2. Lois de Newton** | 4 | Inertie, PFD, actions réciproques, applications |
| **3. Forces et applications** | 5 | Poids, frottements, ressorts, électromagnétiques, centripète |
| **4. Travail et énergie** | 4 | Travail, Ec, Ep, conservation |
| **5. Quantité de mouvement** | 4 | Impulsion, collisions élastiques/inélastiques |
| **6. Oscillateurs & gravitation** | 4 | Pendule, masse-ressort, Kepler, Newton |

### Format d'une leçon

Chaque leçon suit une structure pédagogique constante :

1. **Théorie** : texte Markdown avec formules LaTeX (`$...$` inline, `$$...$$` block)
2. **Schémas SVG inline** : trajectoires, vecteurs forces, schémas de circuits, orbites, etc.
3. **Exemple corrigé** : pas-à-pas en 4-5 étapes avec interprétation physique
4. **Exercices interactifs** :
   - 3-5 QCM avec feedback détaillé par option
   - Sandbox Python (matplotlib dans le navigateur)
   - Labs interactifs PhET-style (sliders + simulation + challenges)

### Créer un nouveau cours

Les cours sont insérés via des scripts TypeScript réutilisables. Voir `scripts/seed-mecanique/` comme modèle.

```bash
# Créer un nouveau cours
cp -r scripts/seed-mecanique scripts/mon-nouveau-cours
# Édite les fichiers module-*.ts avec ton contenu
# Lance le seed
DATABASE_URL="..." bun run scripts/mon-nouveau-cours/index.ts
```

Voir `scripts/seed-mecanique/types.ts` pour les types de blocs disponibles :
- `text` (Markdown + LaTeX + SVG inline)
- `sandbox` (code Python avec matplotlib)
- `mcq` (QCM avec feedback)
- `lab` (lab interactif avec sliders + challenges)

---

## Sécurité

### Mesures implémentées

| Catégorie | Mesure |
|---|---|
| **Auth** | NextAuth v5 (JWT), `AUTH_SECRET` required in prod |
| **Mots de passe** | bcrypt (12 rounds), validation stricte (8+ char, Maj/min/chiffre/spécial) |
| **Rate limiting** | Login (5/15min), Search (30/min), Contact (5/h), Avatar (10/min) |
| **Tokens** | SHA-256 hashés en DB (jamais en clair) |
| **CSRF** | `serverActions.allowedOrigins` + NextAuth CSRF token |
| **XSS** | HTML échappé avant rendu Markdown ; SVG extraits avant échappement |
| **SQL injection** | Prisma (prepared statements) |
| **Headers** | X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy |
| **RGPD** | Soft-delete des utilisateurs (préserve l'historique) |

### Recommandations post-déploiement

1. **Supprimez `BOOTSTRAP_ADMIN_SECRET`** après création de l'admin
2. **Configurez Brevo** avec un domaine vérifié (sinon emails → spam)
3. **Activez HTTPS** (Vercel le fait automatiquement)
4. **Surveillez les logs** Vercel (Runtime Logs) pour les erreurs Prisma

---

## Héritage Django

Ce projet a été **migré depuis une application Django** vers Next.js 16. Le schéma de données Prisma (`prisma/schema.prisma`) a été adapté du modèle Django original — la structure des modèles (User, Course, CourseModule, CourseLesson, LessonBlock, MCQExercise, etc.) a été préservée.

### Pourquoi la migration ?

| Aspect | Django (avant) | Next.js (après) |
|---|---|---|
| **Runtime** | Python (WSGI / ASGI) | JavaScript (V8, Node.js + Edge) |
| **Frontend** | Templates Django + JS | React 19 (Server + Client Components) |
| **DB** | Django ORM + migrations | Prisma + db push |
| **Auth** | Django auth | NextAuth v5 (JWT) |
| **Déploiement** | Serveur dédié / VPS | Vercel serverless |
| **Cold start** | ~5 s (Python) | ~50 ms (Edge) |
| **i18n** | Django i18n | Custom cookie-based |
| **Real-time interactivité** | HTMX / AJAX | React Server Components + Server Actions |

### Ce qui a été préservé

- ✅ Schéma de données (27 tables)
- ✅ Structure pédagogique (cours → modules → leçons → blocs)
- ✅ Gamification (badges, streaks, certificats)
- ✅ Communauté (forum, blog)
- ✅ Visioconférence (Jitsi Meet)
- ✅ Pages publiques (catalogue, blog, contact, à-propos)

### Ce qui a été ajouté

- ✨ Sandbox Python dans le navigateur (Pyodide)
- ✨ Labs interactifs PhET-style avec challenges
- ✨ Schémas SVG vectoriels inline
- ✨ Callouts colorés (tip / warning / success / error / definition)
- ✨ Photo de profil avec upload + resize (sharp)
- ✨ Recherche full-text avec rate limiting
- ✨ SEO dynamique (sitemap, robots, generateMetadata)
- ✨ PWA manifest
- ✨ Thème clair / sombre

---

## Roadmap

### Court terme (1-2 mois)

- [ ] Migration des données depuis la DB Django (script d'import)
- [ ] Cours complet d'**Électromagnétisme** (L1/L2)
- [ ] Cours complet de **Python débutant** (sandbox-heavy)
- [ ] Système de notation par exercice (score cumulé)
- [ ] Notifications email (Brevo) pour réponses forum

### Moyen terme (3-6 mois)

- [ ] **Paiements Stripe** pour cours payants (paywall déjà implémenté côté code)
- [ ] **Vercel Blob** pour les avatars (au lieu des data URLs en DB)
- [ ] **Tests E2E** avec Playwright
- [ ] **CI/CD** GitHub Actions (lint + typecheck + build)
- [ ] Cours de **Mécanique quantique** (L3/M1)
- [ ] Mode **hors-ligne** PWA (service worker)

### Long terme (6+ mois)

- [ ] **Multi-tenant** (plusieurs écoles sur la même instance)
- [ ] **API publique** pour intégrations LMS (Moodle, Canvas)
- [ ] **IA tutor** (chatbot pédagogique)
- [ ] **Certification reconnue** (partenariat universitaire)
- [ ] **Mobile app** (React Native)

---

## Contribuer

Les contributions sont les bienvenues ! Voici comment démarrer :

1. **Forkez** le dépôt
2. **Créez une branche** : `git checkout -b feat/ma-feature`
3. **Commitez** vos changements : `git commit -m "feat: ..."`
4. **Poussez** : `git push origin feat/ma-feature`
5. **Ouvrez une Pull Request**

### Conventions

- **Commits** : conventionnels (`feat:`, `fix:`, `chore:`, `docs:`)
- **Code** : TypeScript strict, ESLint activé
- **Tests** : à venir (Playwright E2E planifié)
- **i18n** : toutes les nouvelles strings doivent être ajoutées à `i18n-shared.ts` (FR + EN)

### Signaler un bug

Ouvrez une [issue](https://github.com/mawuliro/numeriainstitute/issues) avec :
- Description du problème
- Étapes pour reproduire
- Comportement attendu vs actuel
- Screenshots si applicable
- Navigateur + OS

---

## Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👥 Équipe

- **Développement** : Mawulikplimi Roland ([@mawuliro](https://github.com/mawuliro))
- **Localisation** : Lomé, Togo 🇹🇬

---

## 🙏 Remerciements

- **Pyodide** (Python dans le navigateur) — <https://pyodide.org>
- **MathJax** (rendu LaTeX) — <https://www.mathjax.org>
- **shadcn/ui** (composants React) — <https://ui.shadcn.com>
- **Neon** (PostgreSQL serverless) — <https://neon.tech>
- **Vercel** (hébergement) — <https://vercel.com>
- **Brevo** (emails transactionnels) — <https://brevo.com>

---

<p align="center">
  Fait avec ❤️ à Lomé, Togo<br>
  <a href="https://numeriainstitute.vercel.app">numeriainstitute.vercel.app</a>
</p>
