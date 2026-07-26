import type { ModuleInput } from "./types";

export const moduleForces: ModuleInput = {
  title: "Forces et applications",
  description:
    "Étude détaillée des principales forces : poids, frottements, tension, ressorts, forces électromagnétiques, force centripète.",
  lessons: [
    // 3.1 Poids et gravité
    {
      title: "Poids et gravité",
      slug: "poids-gravite",
      estimatedMinutes: 25,
      isFreePreview: false,
      blocks: [
        {
          type: "text",
          content: `# Poids et gravité

## 1. Définitions

### Masse $m$

La masse mesure la **quantité de matière** d'un objet. C'est une grandeur **scalaire** qui s'exprime en kilogrammes (kg). Elle est **invariante** (même valeur sur Terre, sur la Lune, ou dans l'espace).

### Poids $\\vec{P}$

Le poids est la **force** exercée par un astre sur un objet situé dans son voisinage :

$$\\boxed{\\vec{P} = m \\cdot \\vec{g}}$$

- Norme : $P = mg$ (en newtons N)
- Direction : verticale
- Sens : vers le centre de l'astre

### Champ de pesanteur $\\vec{g}$

Le champ de pesanteur dépend de l'astre :

| Astre | $g$ (m/s²) |
|---|---|
| Terre | $9{,}81$ |
| Lune | $1{,}62$ |
| Mars | $3{,}71$ |
| Jupiter | $24{,}8$ |
| Soleil | $274$ |

## 2. Variation de g avec l'altitude

À la surface terrestre ($R_T = 6371$ km) :

$$g_0 = G \\frac{M_T}{R_T^2} \\approx 9{,}81 \\text{ m/s²}$$

À l'altitude $h$ :

$$g(h) = g_0 \\left(\\frac{R_T}{R_T + h}\\right)^2$$

> Pour $h = 100$ km (limite de l'espace) : $g \\approx 9{,}5$ m/s² (peu différent).

## 3. Poids vs masse — piège fréquent

| Grandeur | Symbole | Unité | Variante ? |
|---|---|---|---|
| Masse | $m$ | kg | Non (invariante) |
| Poids | $P$ | N | Oui (dépend de l'astre) |
| $g$ | — | m/s² | Oui (dépend de l'astre et altitude) |

**Exemple** : Un astronaute de 80 kg sur Terre pèse 785 N sur Terre, mais seulement 130 N sur la Lune. Sa masse reste 80 kg partout.

## Schéma : comparaison Terre/Lune

<svg viewBox="0 0 500 280" xmlns="http://www.w3.org/2000/svg" style="background:#fff;max-width:100%;border-radius:8px;border:1px solid #e5e7eb">
  <!-- Terre -->
  <circle cx="100" cy="120" r="60" fill="#1B2A4E"/>
  <text x="100" y="125" font-size="14" fill="white" text-anchor="middle" font-weight="bold">Terre</text>
  <text x="100" y="143" font-size="10" fill="white" text-anchor="middle">g = 9,81 m/s²</text>
  <!-- objet sur Terre -->
  <rect x="155" y="115" width="20" height="20" fill="#2DD4BF" stroke="#1B2A4E"/>
  <text x="180" y="125" font-size="11" fill="#1B2A4E">m = 80 kg</text>
  <!-- Poids Terre -->
  <line x1="165" y1="135" x2="165" y2="195" stroke="#EF4444" stroke-width="3" marker-end="url(#arrT)"/>
  <text x="175" y="170" font-size="12" fill="#EF4444" font-weight="bold">P = 785 N</text>
  
  <!-- Lune -->
  <circle cx="380" cy="140" r="30" fill="#C9A227"/>
  <text x="380" y="143" font-size="11" fill="#1B2A4E" text-anchor="middle" font-weight="bold">Lune</text>
  <text x="380" y="160" font-size="9" fill="#1B2A4E" text-anchor="middle">g = 1,62 m/s²</text>
  <!-- objet sur Lune -->
  <rect x="425" y="135" width="20" height="20" fill="#2DD4BF" stroke="#1B2A4E"/>
  <!-- Poids Lune -->
  <line x1="435" y1="155" x2="435" y2="180" stroke="#EF4444" stroke-width="2" marker-end="url(#arrT)"/>
  <text x="445" y="170" font-size="11" fill="#EF4444" font-weight="bold">P = 130 N</text>
  
  <defs>
    <marker id="arrT" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#EF4444"/>
    </marker>
  </defs>
  
  <text x="100" y="220" font-size="11" fill="#666">Masse : 80 kg (invariante)</text>
  <text x="380" y="220" font-size="11" fill="#666">Masse : 80 kg (invariante)</text>
  <text x="250" y="260" font-size="11" fill="#1B2A4E" text-anchor="middle" font-weight="bold">Même masse, poids 6× plus faible sur la Lune</text>
</svg>`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Comparaison Terre/Mars

**Énoncé** : Le rover Curiosity a une masse $m = 900$ kg. Calculer son poids sur Terre et sur Mars.

### Étape 1 — Poids sur Terre

$$P_{Terre} = m \\cdot g_{Terre} = 900 \\times 9{,}81 = 8829 \\text{ N}$$

### Étape 2 — Poids sur Mars

$$P_{Mars} = m \\cdot g_{Mars} = 900 \\times 3{,}71 = 3339 \\text{ N}$$

### Étape 3 — Rapport

$$\\frac{P_{Mars}}{P_{Terre}} = \\frac{3{,}71}{9{,}81} \\approx 0{,}378$$

> ✅ Sur Mars, le rover pèse seulement **38 %** de son poids terrestre. Mais sa masse reste 900 kg — il faudrait la même force pour le mettre en mouvement !`,
        },
        {
          type: "mcq",
          title: "Masse vs poids",
          question:
            "Un astronaute de masse 70 kg se trouve sur la Lune (g_Lune = 1,62 m/s²). Quelle est sa masse et son poids sur la Lune ?",
          explanation:
            "La masse est invariante : 70 kg partout. Le poids dépend de g : P = m·g = 70 × 1,62 = 113 N.",
          choices: [
            {
              text: "Masse 70 kg, poids 113 N",
              isCorrect: true,
              feedback:
                "✅ Exact ! La masse ne change pas, mais le poids = m·g_Lune = 70 × 1,62 ≈ 113 N (vs 687 N sur Terre).",
            },
            {
              text: "Masse 11,4 kg, poids 113 N",
              isCorrect: false,
              feedback:
                "❌ La masse ne change pas avec l'astre. Sur la Lune, on pèse moins mais on a la même masse.",
            },
            {
              text: "Masse 70 kg, poids 687 N",
              isCorrect: false,
              feedback:
                "❌ C'est le poids sur Terre, pas sur la Lune ! Sur la Lune, g est plus faible.",
            },
            {
              text: "Masse 11,4 kg, poids 687 N",
              isCorrect: false,
              feedback:
                "❌ Double erreur. La masse reste 70 kg, et le poids sur la Lune n'est pas 687 N.",
            },
          ],
        },
      ],
    },

    // 3.2 Frottements
    {
      title: "Forces de frottement",
      slug: "forces-frottement",
      estimatedMinutes: 30,
      isFreePreview: false,
      blocks: [
        {
          type: "text",
          content: `# Forces de frottement

Les forces de frottement s'opposent au mouvement (ou à la tendance au mouvement) d'un objet en contact avec un support.

## 1. Frottement solide-solide

### Statique (avant le mouvement)

Quand on tire un objet immobile, le frottement statique s'oppose à la traction, jusqu'à une valeur maximale :

$$f_s \\leq f_{s,max} = \\mu_s \\cdot R$$

où $\\mu_s$ est le **coefficient de frottement statique** et $R$ la réaction normale.

> Tant que $F_{traction} < \\mu_s R$, l'objet reste immobile.

### Cinétique (pendant le mouvement)

Une fois le mouvement engagé :

$$f_k = \\mu_k \\cdot R$$

où $\\mu_k < \\mu_s$ est le coefficient cinétique.

| Couple de matériaux | $\\mu_s$ | $\\mu_k$ |
|---|---|---|
| Acier / acier | 0,74 | 0,57 |
| Bois / bois | 0,5 | 0,3 |
| Caoutchouc / asphalte (sec) | 0,9 | 0,8 |
| Téflon / téflon | 0,04 | 0,04 |
| Glace / glace | 0,1 | 0,03 |

## 2. Frottement fluide (air, eau)

### Loi quadratique (vitesses élevées)

Pour un objet en mouvement rapide dans l'air :

$$\\vec{f} = -\\frac{1}{2} \\rho C_d S v^2 \\, \\hat{v}$$

où :
- $\\rho$ : masse volumique du fluide (1,225 kg/m³ pour l'air)
- $C_d$ : coefficient de traînée (≈ 0,47 pour une sphère)
- $S$ : section efficace (m²)
- $v$ : vitesse (m/s)

### Vitesse limite

Quand le frottement compense le poids, l'accélération s'annule :

$$mg = \\frac{1}{2} \\rho C_d S v_{lim}^2$$

$$\\boxed{v_{lim} = \\sqrt{\\frac{2mg}{\\rho C_d S}}}$$

## 3. Schéma : cube tiré sur une surface

<svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg" style="background:#fff;max-width:100%;border-radius:8px;border:1px solid #e5e7eb">
  <!-- ground -->
  <line x1="20" y1="140" x2="480" y2="140" stroke="#1B2A4E" stroke-width="2"/>
  <!-- hatch marks below ground -->
  <g stroke="#666" stroke-width="1">
    <line x1="30" y1="140" x2="40" y2="155"/>
    <line x1="60" y1="140" x2="70" y2="155"/>
    <line x1="90" y1="140" x2="100" y2="155"/>
    <line x1="120" y1="140" x2="130" y2="155"/>
    <line x1="150" y1="140" x2="160" y2="155"/>
    <line x1="180" y1="140" x2="190" y2="155"/>
    <line x1="210" y1="140" x2="220" y2="155"/>
    <line x1="240" y1="140" x2="250" y2="155"/>
    <line x1="270" y1="140" x2="280" y2="155"/>
    <line x1="300" y1="140" x2="310" y2="155"/>
    <line x1="330" y1="140" x2="340" y2="155"/>
    <line x1="360" y1="140" x2="370" y2="155"/>
    <line x1="390" y1="140" x2="400" y2="155"/>
    <line x1="420" y1="140" x2="430" y2="155"/>
    <line x1="450" y1="140" x2="460" y2="155"/>
  </g>
  <!-- block -->
  <rect x="200" y="100" width="50" height="40" fill="#2DD4BF" stroke="#1B2A4E" stroke-width="1.5"/>
  <text x="220" y="125" font-size="13" fill="#1B2A4E" font-weight="bold" text-anchor="middle">m</text>
  <!-- F traction (right) -->
  <line x1="250" y1="120" x2="320" y2="120" stroke="#2DD4BF" stroke-width="2.5" marker-end="url(#arrF1)"/>
  <text x="325" y="115" font-size="13" fill="#2DD4BF" font-weight="bold">F (traction)</text>
  <!-- f friction (left) -->
  <line x1="200" y1="120" x2="140" y2="120" stroke="#C9A227" stroke-width="2.5" marker-end="url(#arrF2)"/>
  <text x="100" y="115" font-size="13" fill="#C9A227" font-weight="bold">f (frottement)</text>
  <!-- P (down) -->
  <line x1="225" y1="140" x2="225" y2="190" stroke="#EF4444" stroke-width="2.5" marker-end="url(#arrF3)"/>
  <text x="235" y="170" font-size="13" fill="#EF4444" font-weight="bold">P</text>
  <!-- R (up) -->
  <line x1="225" y1="100" x2="225" y2="50" stroke="#8B5CF6" stroke-width="2.5" marker-end="url(#arrF4)"/>
  <text x="235" y="60" font-size="13" fill="#8B5CF6" font-weight="bold">R</text>
  
  <defs>
    <marker id="arrF1" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#2DD4BF"/>
    </marker>
    <marker id="arrF2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#C9A227"/>
    </marker>
    <marker id="arrF3" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#EF4444"/>
    </marker>
    <marker id="arrF4" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#8B5CF6"/>
    </marker>
  </defs>
  
  <text x="250" y="180" font-size="11" fill="#666" text-anchor="middle">Bilan des forces sur un cube en translation horizontale</text>
</svg>`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Vitesse limite d'un parachutiste

**Énoncé** : Un parachutiste de masse $m = 80$ kg saute d'un avion. Son parachute ouvert a une section efficace $S = 40$ m², $C_d = 1{,}5$, et $\\rho_{air} = 1{,}225$ kg/m³. Calculer sa vitesse limite.

### Étape 1 — Identifier les forces

À la vitesse limite, l'accélération est nulle, donc les forces se compensent :

$$mg = \\frac{1}{2} \\rho C_d S v_{lim}^2$$

### Étape 2 — Résoudre

$$v_{lim} = \\sqrt{\\frac{2mg}{\\rho C_d S}} = \\sqrt{\\frac{2 \\times 80 \\times 9{,}81}{1{,}225 \\times 1{,}5 \\times 40}}$$

$$v_{lim} = \\sqrt{\\frac{1569{,}6}{73{,}5}} = \\sqrt{21{,}36}$$

$$\\boxed{v_{lim} \\approx 4{,}62 \\text{ m/s} \\approx 16{,}6 \\text{ km/h}}$$

### Étape 3 — Sans parachute

Si $S = 0{,}7$ m² (corps humain à plat), $C_d = 1{,}0$ :

$$v_{lim} = \\sqrt{\\frac{2 \\times 80 \\times 9{,}81}{1{,}225 \\times 1{,}0 \\times 0{,}7}} = \\sqrt{1830} \\approx 42{,}8 \\text{ m/s} \\approx 154 \\text{ km/h}$$

> ✅ Le parachute divise la vitesse limite par **9** (de 154 km/h à 17 km/h), ce qui permet un atterrissage en sécurité. La vitesse de 17 km/h correspond à une chute d'environ 1,3 m de haut.

### Étape 4 — Sans parachute avant ouverture

Avant d'ouvrir le parachute, le parachutiste atteint environ **200 km/h** en position verticale (plus petite section efficace).`,
        },
        {
          type: "mcq",
          title: "Frottement statique vs cinétique",
          question:
            "Pourquoi est-il plus difficile de mettre en mouvement un objet que de le maintenir en mouvement ?",
          explanation:
            "Le coefficient de frottement statique μ_s est toujours supérieur au coefficient cinétique μ_k. Il faut vaincre la force maximale statique pour démarrer, puis une force moindre suffit pour maintenir le mouvement.",
          choices: [
            {
              text: "Parce que μ_s > μ_k (le frottement statique est plus grand)",
              isCorrect: true,
              feedback:
                "✅ Exact ! C'est une loi universelle : il faut plus de force pour démarrer un objet que pour le maintenir en mouvement.",
            },
            {
              text: "Parce que la masse augmente avec le mouvement",
              isCorrect: false,
              feedback:
                "❌ La masse ne change pas. C'est le coefficient de frottement qui change entre statique et cinétique.",
            },
            {
              text: "Parce que la vitesse augmente la force de traction",
              isCorrect: false,
              feedback:
                "❌ C'est l'inverse : la force nécessaire pour maintenir le mouvement est plus petite que celle pour le démarrer.",
            },
            {
              text: "Ce n'est pas vrai, c'est également difficile",
              isCorrect: false,
              feedback:
                "❌ Si, c'est vrai ! Pense à un meuble lourd : il faut tirer fort pour le faire bouger, puis moins fort une fois qu'il glisse.",
            },
          ],
        },
        {
          type: "sandbox",
          title: "Vitesse limite en chute avec frottements",
          code: `import matplotlib.pyplot as plt
import numpy as np

# Simulation d'une chute avec frottement quadratique
g = 9.81
m = 80  # kg (parachutiste)
rho = 1.225  # air
Cd = 1.5
S = 40  # parachute ouvert

# Simulation par Euler
dt = 0.01
T = 30  # secondes
N = int(T/dt)

t = np.zeros(N)
v = np.zeros(N)
y = np.zeros(N)
y[0] = 1000  # 1 km d'altitude

for i in range(N-1):
    # Forces : P (vers le bas) + f (vers le haut quand v > 0)
    P = m * g
    f = 0.5 * rho * Cd * S * v[i]**2
    a = (P - f) / m  # vers le bas positif
    v[i+1] = v[i] + a * dt
    y[i+1] = y[i] - v[i] * dt
    t[i+1] = t[i] + dt

v_lim = np.sqrt(2*m*g / (rho * Cd * S))

fig, axes = plt.subplots(1, 2, figsize=(12, 5))

axes[0].plot(t, v, color="#2DD4BF", linewidth=2.5)
axes[0].axhline(y=v_lim, color="#1B2A4E", linestyle="--", linewidth=1.5,
                label=f"v_lim = {v_lim:.2f} m/s")
axes[0].set_xlabel("Temps (s)")
axes[0].set_ylabel("Vitesse (m/s)")
axes[0].set_title("Vitesse en chute avec frottement")
axes[0].legend()
axes[0].grid(True, alpha=0.3)

axes[1].plot(t, y, color="#C9A227", linewidth=2.5)
axes[1].set_xlabel("Temps (s)")
axes[1].set_ylabel("Altitude (m)")
axes[1].set_title("Altitude")
axes[1].grid(True, alpha=0.3)

plt.suptitle(f"Chute d'un parachutiste (m={m} kg, S={S} m², Cd={Cd})")
plt.tight_layout()
plt.savefig("output.png", dpi=100, bbox_inches="tight")
plt.show()
`,
        },
      ],
    },

    // 3.3 Tension et ressorts
    {
      title: "Tension et ressorts — loi de Hooke",
      slug: "tension-ressorts",
      estimatedMinutes: 30,
      isFreePreview: false,
      blocks: [
        {
          type: "text",
          content: `# Tension et ressorts

## 1. Force de tension

La **tension** est la force exercée par un fil, une corde ou un câble tendu. Caractéristiques :

- Direction : celle du fil
- Sens : du corps vers le fil (la corde « tire » le corps)
- Norme : $T$ (variable, en N)

> Dans une corde **idéale** (sans masse, inextensible), la tension est la même en tout point.

## 2. Loi de Hooke — Ressort idéal

Un ressort exerce une force **proportionnelle à son allongement** par rapport à sa longueur à vide :

$$\\boxed{\\vec{F} = -k \\cdot \\Delta \\vec{l} = -k (l - l_0)\\, \\hat{u}}$$

- $k$ : raideur du ressort (N/m)
- $l_0$ : longueur à vide (m)
- $l$ : longueur actuelle (m)
- $\\hat{u}$ : axe du ressort (de la fixation vers l'objet)
- Le signe **−** indique que la force est **rappelante** (vers la position d'équilibre)

## 3. Schéma : ressort étiré

<svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg" style="background:#fff;max-width:100%;border-radius:8px;border:1px solid #e5e7eb">
  <!-- Wall -->
  <line x1="30" y1="60" x2="30" y2="140" stroke="#1B2A4E" stroke-width="3"/>
  <g stroke="#1B2A4E" stroke-width="1.5">
    <line x1="20" y1="65" x2="30" y2="75"/>
    <line x1="20" y1="80" x2="30" y2="90"/>
    <line x1="20" y1="95" x2="30" y2="105"/>
    <line x1="20" y1="110" x2="30" y2="120"/>
    <line x1="20" y1="125" x2="30" y2="135"/>
  </g>
  
  <!-- Spring (zigzag) -->
  <path d="M 30 100 L 50 100 L 55 80 L 65 120 L 75 80 L 85 120 L 95 80 L 105 120 L 115 80 L 125 120 L 135 80 L 145 120 L 155 80 L 165 120 L 175 100 L 200 100"
        stroke="#2DD4BF" stroke-width="2" fill="none"/>
  
  <!-- Block -->
  <rect x="200" y="80" width="50" height="40" fill="#C9A227" stroke="#1B2A4E" stroke-width="1.5"/>
  <text x="225" y="105" font-size="13" fill="#1B2A4E" font-weight="bold" text-anchor="middle">m</text>
  
  <!-- Force F (toward wall, spring pulls back) -->
  <line x1="225" y1="100" x2="160" y2="100" stroke="#EF4444" stroke-width="2.5" marker-end="url(#arrSpr)"/>
  <text x="170" y="92" font-size="13" fill="#EF4444" font-weight="bold">F = -k·Δl</text>
  
  <!-- Equilibrium position (dashed) -->
  <line x1="155" y1="60" x2="155" y2="160" stroke="#999" stroke-width="1" stroke-dasharray="4 4"/>
  <text x="100" y="55" font-size="11" fill="#999">position d'équilibre (l₀)</text>
  
  <!-- displacement -->
  <line x1="155" y1="170" x2="225" y2="170" stroke="#1B2A4E" stroke-width="1.5" marker-end="url(#arrSpr)" marker-start="url(#arrSpr)"/>
  <text x="170" y="185" font-size="12" fill="#1B2A4E" font-weight="bold">Δl</text>
  
  <defs>
    <marker id="arrSpr" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#EF4444"/>
    </marker>
  </defs>
</svg>

## 4. Énergie potentielle élastique

$$E_p = \\frac{1}{2} k (l - l_0)^2 = \\frac{1}{2} k (\\Delta l)^2$$

Cette énergie est stockée quand le ressort est étiré ou comprimé, et peut être récupérée.

## 5. Période d'oscillation

Un système masse-ressort oscille avec une période :

$$\\boxed{T = 2\\pi \\sqrt{\\frac{m}{k}}}$$

Indépendante de l'amplitude (pour les petites oscillations)`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Mesure de la raideur d'un ressort

**Énoncé** : On suspend une masse $m = 200$ g à un ressort vertical. Le ressort s'allonge de $\\Delta l = 5$ cm. Calculer :
1. La raideur $k$ du ressort
2. La période d'oscillation si on écarte la masse de sa position d'équilibre

### Étape 1 — Convertir en unités SI

$$m = 0{,}2 \\text{ kg} \\quad ; \\quad \\Delta l = 0{,}05 \\text{ m}$$

### Étape 2 — Équilibre

À l'équilibre, le poids équilibre la tension du ressort :

$$mg = k \\cdot \\Delta l$$

$$k = \\frac{mg}{\\Delta l} = \\frac{0{,}2 \\times 9{,}81}{0{,}05} = \\frac{1{,}962}{0{,}05}$$

$$\\boxed{k = 39{,}24 \\text{ N/m}}$$

### Étape 3 — Période d'oscillation

$$T = 2\\pi \\sqrt{\\frac{m}{k}} = 2\\pi \\sqrt{\\frac{0{,}2}{39{,}24}}$$

$$T = 2\\pi \\sqrt{0{,}0051} = 2\\pi \\times 0{,}0714$$

$$\\boxed{T \\approx 0{,}448 \\text{ s}}$$

> ✅ La masse oscille avec une période d'environ **0,45 s**. Cette méthode (mesurer l'allongement statique puis la période d'oscillation) est une façon simple de caractériser un ressort sans balance ni dynamomètre.`,
        },
        {
          type: "mcq",
          title: "Loi de Hooke",
          question:
            "Un ressort de raideur k = 50 N/m est étiré de 4 cm. Quelle est la norme de la force de rappel ?",
          explanation:
            "F = k·Δl = 50 × 0,04 = 2 N. Direction : vers la position d'équilibre (force de rappel).",
          choices: [
            {
              text: "2 N",
              isCorrect: true,
              feedback:
                "✅ Exact ! F = k·Δl = 50 × 0,04 = 2 N. Attention aux unités : Δl doit être en mètres.",
            },
            {
              text: "200 N",
              isCorrect: false,
              feedback:
                "❌ Tu as laissé Δl en cm au lieu de convertir en m. 4 cm = 0,04 m, donc F = 50 × 0,04 = 2 N.",
            },
            {
              text: "0,08 N",
              isCorrect: false,
              feedback:
                "❌ Tu as inversé la formule. F = k·Δl, pas F = Δl/k.",
            },
            {
              text: "12,5 N",
              isCorrect: false,
              feedback:
                "❌ Tu as divisé k par Δl au lieu de multiplier. F = k·Δl = 50 × 0,04 = 2 N.",
            },
          ],
        },
      ],
    },

    // 3.4 Forces électromagnétiques
    {
      title: "Forces électromagnétiques",
      slug: "forces-electromagnetiques",
      estimatedMinutes: 35,
      isFreePreview: false,
      blocks: [
        {
          type: "text",
          content: `# Forces électromagnétiques

## 1. Force électrostatique — Loi de Coulomb

Deux charges $q_1$ et $q_2$ séparées d'une distance $r$ exercent l'une sur l'autre une force :

$$\\boxed{\\vec{F}_{1 \\to 2} = k \\frac{q_1 q_2}{r^2} \\hat{u}_{1 \\to 2}}$$

avec $k = \\frac{1}{4\\pi\\varepsilon_0} \\approx 9 \\times 10^9$ N·m²/C².

### Caractéristiques

- **Attractive** si charges opposées ($q_1 q_2 < 0$)
- **Répulsive** si charges de même signe ($q_1 q_2 > 0$)
- Direction : la droite qui joint les charges
- Décroît en $1/r^2$

## 2. Force magnétique — Loi de Lorentz

Une charge $q$ en mouvement à la vitesse $\\vec{v}$ dans un champ magnétique $\\vec{B}$ subit :

$$\\boxed{\\vec{F} = q \\, \\vec{v} \\times \\vec{B}}$$

### Propriétés

- $\\vec{F} \\perp \\vec{v}$ et $\\vec{F} \\perp \\vec{B}$ → **force ne travaille pas** ($W = 0$)
- La force ne改变 que la **direction** de la vitesse, pas sa norme
- Si $\\vec{v} \\parallel \\vec{B}$, alors $\\vec{F} = \\vec{0}$ (aucune force)

## 3. Schéma : charges en interaction

<svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg" style="background:#fff;max-width:100%;border-radius:8px;border:1px solid #e5e7eb">
  <!-- Cas répulsif -->
  <text x="125" y="30" font-size="13" fill="#1B2A4E" font-weight="bold" text-anchor="middle">Charges de même signe (répulsion)</text>
  <circle cx="80" cy="100" r="15" fill="#EF4444"/>
  <text x="80" y="105" font-size="12" fill="white" text-anchor="middle" font-weight="bold">+</text>
  <text x="60" y="135" font-size="11" fill="#666">q₁</text>
  
  <circle cx="200" cy="100" r="15" fill="#EF4444"/>
  <text x="200" y="105" font-size="12" fill="white" text-anchor="middle" font-weight="bold">+</text>
  <text x="195" y="135" font-size="11" fill="#666">q₂</text>
  
  <!-- forces (mutuelles) -->
  <line x1="100" y1="100" x2="60" y2="100" stroke="#1B2A4E" stroke-width="2.5" marker-end="url(#arrE1)"/>
  <text x="40" y="95" font-size="11" fill="#1B2A4E">F₁₂</text>
  <line x1="180" y1="100" x2="220" y2="100" stroke="#1B2A4E" stroke-width="2.5" marker-end="url(#arrE1)"/>
  <text x="225" y="95" font-size="11" fill="#1B2A4E">F₂₁</text>
  
  <!-- Cas attractif -->
  <text x="375" y="30" font-size="13" fill="#1B2A4E" font-weight="bold" text-anchor="middle">Charges opposées (attraction)</text>
  <circle cx="310" cy="100" r="15" fill="#EF4444"/>
  <text x="310" y="105" font-size="12" fill="white" text-anchor="middle" font-weight="bold">+</text>
  <text x="290" y="135" font-size="11" fill="#666">q₁</text>
  
  <circle cx="430" cy="100" r="15" fill="#1B2A4E"/>
  <text x="430" y="105" font-size="12" fill="white" text-anchor="middle" font-weight="bold">−</text>
  <text x="425" y="135" font-size="11" fill="#666">q₂</text>
  
  <!-- forces (mutuelles, vers l'autre) -->
  <line x1="330" y1="100" x2="380" y2="100" stroke="#2DD4BF" stroke-width="2.5" marker-end="url(#arrE2)"/>
  <line x1="410" y1="100" x2="360" y2="100" stroke="#2DD4BF" stroke-width="2.5" marker-end="url(#arrE2)"/>
  
  <defs>
    <marker id="arrE1" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#1B2A4E"/>
    </marker>
    <marker id="arrE2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#2DD4BF"/>
    </marker>
  </defs>
</svg>

## 4. Comparaison des forces fondamentales

| Force | Portée | Intensité relative |
|---|---|---|
| Forte (noyau) | $10^{-15}$ m | 1 |
| Électromagnétique | ∞ | $10^{-2}$ |
| Faible (radioactivité β) | $10^{-18}$ m | $10^{-6}$ |
| Gravitationnelle | ∞ | $10^{-39}$ |

> La force électromagnétique est **~10³⁶ fois plus intense** que la gravitation. C'est pourquoi un simple aimant soulève un clou malgré l'attraction terrestre.`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Atome d'hydrogène

**Énoncé** : Dans l'atome d'hydrogène, le proton et l'électron sont séparés de $r = 0{,}529$ Å ($1 \\text{ Å} = 10^{-10}$ m). Comparer la force électrique et la force gravitationnelle entre ces deux particules.

Données : $m_p = 1{,}67 \\times 10^{-27}$ kg, $m_e = 9{,}11 \\times 10^{-31}$ kg, $q = 1{,}6 \\times 10^{-19}$ C, $G = 6{,}67 \\times 10^{-11}$ N·m²/kg².

### Étape 1 — Force électrique

$$F_e = k \\frac{q^2}{r^2} = 9 \\times 10^9 \\times \\frac{(1{,}6 \\times 10^{-19})^2}{(0{,}529 \\times 10^{-10})^2}$$

$$F_e = 9 \\times 10^9 \\times \\frac{2{,}56 \\times 10^{-38}}{2{,}8 \\times 10^{-21}}$$

$$\\boxed{F_e \\approx 8{,}2 \\times 10^{-8} \\text{ N}}$$

### Étape 2 — Force gravitationnelle

$$F_g = G \\frac{m_p m_e}{r^2} = 6{,}67 \\times 10^{-11} \\times \\frac{1{,}67 \\times 10^{-27} \\times 9{,}11 \\times 10^{-31}}{2{,}8 \\times 10^{-21}}$$

$$\\boxed{F_g \\approx 3{,}6 \\times 10^{-47} \\text{ N}}$$

### Étape 3 — Rapport

$$\\frac{F_e}{F_g} = \\frac{8{,}2 \\times 10^{-8}}{3{,}6 \\times 10^{-47}} \\approx 2{,}3 \\times 10^{39}$$

> ✅ La force électrique est **10³⁹ fois plus intense** que la force gravitationnelle dans l'atome ! C'est pourquoi la gravitation est totalement négligeable à l'échelle atomique.

### Étape 4 — Pourquoi la gravitation domine-t-elle à grande échelle ?

Parce que la matière est globalement neutre (autant de charges + que −), les forces électriques se compensent à grande échelle. La gravitation, elle, est toujours attractive → elle s'accumule.`,
        },
        {
          type: "mcq",
          title: "Loi de Coulomb",
          question:
            "Deux charges de +2 μC et +3 μC sont séparées de 30 cm. Quelle est la norme de la force entre elles ?",
          explanation:
            "F = k·q₁·q₂/r² = 9×10⁹ × 2×10⁻⁶ × 3×10⁻⁶ / (0,3)² = 9×10⁹ × 6×10⁻¹² / 0,09 = 0,6 N. Répulsive car charges de même signe.",
          choices: [
            {
              text: "0,6 N (répulsive)",
              isCorrect: true,
              feedback:
                "✅ Exact ! F = 9×10⁹ × 2×10⁻⁶ × 3×10⁻⁶ / 0,09 = 0,6 N. Répulsive car q₁ et q₂ sont de même signe.",
            },
            {
              text: "0,06 N (répulsive)",
              isCorrect: false,
              feedback:
                "❌ Erreur de puissance. 2 μC = 2×10⁻⁶ C, pas 2×10⁻⁷ C.",
            },
            {
              text: "0,6 N (attractive)",
              isCorrect: false,
              feedback:
                "❌ La norme est bonne mais le sens est faux. Deux charges + se repoussent, pas s'attirent.",
            },
            {
              text: "6 N (répulsive)",
              isCorrect: false,
              feedback:
                "❌ Tu as probablement oublié de convertir r en mètres (30 cm = 0,3 m).",
            },
          ],
        },
        {
          type: "mcq",
          title: "Force de Lorentz",
          question:
            "Une charge positive se déplace vers le nord dans un champ magnétique dirigé vers le haut. Quelle est la direction de la force magnétique qu'elle subit ?",
          explanation:
            "F = qv×B. v vers le nord, B vers le haut. v×B pointe vers l'ouest (règle de la main droite). Donc F est vers l'ouest.",
          choices: [
            {
              text: "Vers l'ouest",
              isCorrect: true,
              feedback:
                "✅ Exact ! Règle de la main droite : v (nord) × B (haut) = ouest. La force est perpendiculaire à v et B.",
            },
            {
              text: "Vers l'est",
              isCorrect: false,
              feedback:
                "❌ C'est le sens pour une charge NÉGATIVE. Pour une charge positive, c'est l'inverse.",
            },
            {
              text: "Vers le haut (même sens que B)",
              isCorrect: false,
              feedback:
                "❌ F = qv×B est toujours perpendiculaire à B, jamais parallèle.",
            },
            {
              text: "Vers le nord (même sens que v)",
              isCorrect: false,
              feedback:
                "❌ F est toujours perpendiculaire à v (la force magnétique ne change pas la norme de v, seulement sa direction).",
            },
          ],
        },
      ],
    },

    // 3.5 Force centripète
    {
      title: "Force centripète",
      slug: "force-centripete",
      estimatedMinutes: 25,
      isFreePreview: false,
      blocks: [
        {
          type: "text",
          content: `# Force centripète

## 1. Définition

Toute force (ou composante de force) dirigée vers le **centre** d'une trajectoire circulaire est appelée **force centripète**. Elle est nécessaire pour maintenir un mouvement circulaire.

$$\\boxed{F_{centripète} = m \\frac{v^2}{R} = m R \\omega^2}$$

## 2. Origines possibles de la force centripète

La force centripète **n'est pas une nouvelle force** — c'est un rôle que peuvent jouer différentes forces :

| Situation | Origine de la force centripète |
|---|---|
| Voiture dans un virage | Frottement des pneus sur la route |
| Satellite en orbite | Force gravitationnelle |
| Boucle de montagnes russes | Réaction normale + poids |
| Électron autour du noyau | Force électrique |
| Pierre au bout d'une corde | Tension de la corde |

## 3. Schéma : voiture dans un virage

<svg viewBox="0 0 500 280" xmlns="http://www.w3.org/2000/svg" style="background:#fff;max-width:100%;border-radius:8px;border:1px solid #e5e7eb">
  <!-- Route courbe -->
  <path d="M 100 250 Q 250 50 400 250" stroke="#999" stroke-width="60" fill="none"/>
  <path d="M 100 250 Q 250 50 400 250" stroke="#1B2A4E" stroke-width="2" fill="none" stroke-dasharray="3 3"/>
  
  <!-- centre -->
  <circle cx="250" cy="200" r="4" fill="#666"/>
  <text x="260" y="200" font-size="11" fill="#666">centre du virage</text>
  
  <!-- voiture -->
  <rect x="220" y="80" width="30" height="20" rx="3" fill="#1B2A4E"/>
  <text x="235" y="95" font-size="10" fill="white" text-anchor="middle" font-weight="bold">m</text>
  
  <!-- Vecteur vitesse (tangent) -->
  <line x1="235" y1="80" x2="290" y2="65" stroke="#2DD4BF" stroke-width="2.5" marker-end="url(#arrC1)"/>
  <text x="280" y="55" font-size="13" fill="#2DD4BF" font-weight="bold">v</text>
  
  <!-- Force centripète (vers centre) -->
  <line x1="235" y1="100" x2="240" y2="170" stroke="#EF4444" stroke-width="2.5" marker-end="url(#arrC2)"/>
  <text x="250" y="145" font-size="13" fill="#EF4444" font-weight="bold">F (centripète)</text>
  
  <!-- Rayon -->
  <line x1="235" y1="100" x2="250" y2="200" stroke="#999" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="245" y="155" font-size="11" fill="#999">R</text>
  
  <defs>
    <marker id="arrC1" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#2DD4BF"/>
    </marker>
    <marker id="arrC2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#EF4444"/>
    </marker>
  </defs>
  
  <text x="250" y="270" font-size="11" fill="#666" text-anchor="middle">Voiture dans un virage : la force centripète est fournie par les pneus</text>
</svg>

## 4. Vitesse maximale dans un virage

Soit un virage de rayon $R$, un coefficient de frottement $\\mu$. La force centripète maximale que les pneus peuvent fournir est :

$$F_{max} = \\mu \\cdot m g$$

Pour ne pas déraper, il faut :

$$m \\frac{v_{max}^2}{R} \\leq \\mu m g$$

$$\\boxed{v_{max} = \\sqrt{\\mu g R}}$$

## 5. Virage incliné (banking)

Pour réduire la dépendance aux frottements, on incline la route d'un angle $\\theta$. Sans frottements :

$$\\tan\\theta = \\frac{v^2}{Rg}$$

> C'est pourquoi les virages d'autoroute et les courbes de TGV sont inclinés.`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Virage en voiture

**Énoncé** : Une voiture de 1200 kg prend un virage de rayon $R = 50$ m à la vitesse $v = 60$ km/h. Calculer la force centripète nécessaire. Si le coefficient de frottement des pneus est $\\mu = 0{,}8$, la voiture peut-elle négocier le virage ?

### Étape 1 — Convertir la vitesse

$$v = 60 \\text{ km/h} = \\frac{60}{3{,}6} = 16{,}67 \\text{ m/s}$$

### Étape 2 — Force centripète nécessaire

$$F_{req} = m \\frac{v^2}{R} = 1200 \\times \\frac{16{,}67^2}{50} = 1200 \\times \\frac{277{,}9}{50}$$

$$\\boxed{F_{req} \\approx 6668 \\text{ N}}$$

### Étape 3 — Force maximale des pneus

$$F_{max} = \\mu m g = 0{,}8 \\times 1200 \\times 9{,}81 = 9418 \\text{ N}$$

### Étape 4 — Conclusion

$$F_{req} = 6668 \\text{ N} < F_{max} = 9418 \\text{ N} \\checkmark$$

La voiture peut négocier le virage ✅

### Étape 5 — Vitesse maximale

$$v_{max} = \\sqrt{\\mu g R} = \\sqrt{0{,}8 \\times 9{,}81 \\times 50} = \\sqrt{392{,}4}$$

$$\\boxed{v_{max} \\approx 19{,}8 \\text{ m/s} \\approx 71{,}3 \\text{ km/h}}$$

> ✅ À 60 km/h, on est en sécurité. Mais à 80 km/h, la voiture déraperait ! C'est pourquoi on ralentit dans les virages.`,
        },
        {
          type: "mcq",
          title: "Identification de la force centripète",
          question:
            "Un satellite est en orbite circulaire autour de la Terre. Quelle est la nature de la force centripète qui maintient cette orbite ?",
          explanation:
            "Pour un satellite, c'est la force gravitationnelle qui joue le rôle de force centripète. Sans elle, le satellite irait en ligne droite (première loi de Newton).",
          choices: [
            {
              text: "La force gravitationnelle de la Terre",
              isCorrect: true,
              feedback:
                "✅ Exact ! La gravité attire le satellite vers la Terre (centre de l'orbite), fournissant la force centripète nécessaire au mouvement circulaire.",
            },
            {
              text: "La force centrifuge",
              isCorrect: false,
              feedback:
                "❌ La « force centrifuge » est une force fictive ressentie dans le référentiel tournant, pas une force réelle. Dans un référentiel galiléen, elle n'existe pas.",
            },
            {
              text: "La tension d'un câble invisible",
              isCorrect: false,
              feedback:
                "❌ Il n'y a pas de câble retenant les satellites ! C'est la gravitation seule.",
            },
            {
              text: "La force magnétique terrestre",
              isCorrect: false,
              feedback:
                "❌ La force magnétique terrestre est négligeable à l'échelle des satellites. C'est la gravitation qui domine.",
            },
          ],
        },
        {
          type: "mcq",
          title: "Vitesse maximale dans un virage",
          question:
            "Si on double le rayon d'un virage (R → 2R), la vitesse maximale que peut prendre une voiture devient...",
          explanation:
            "v_max = √(μgR). Si R double, v_max est multiplié par √2 ≈ 1,41. Donc +41% environ.",
          choices: [
            {
              text: "Multipliée par √2 ≈ 1,41 (soit +41%)",
              isCorrect: true,
              feedback:
                "✅ Exact ! v_max = √(μgR). Si R → 2R, v_max → √2 × v_max_initial ≈ 1,41 × v_max_initial.",
            },
            {
              text: "Doublée (×2)",
              isCorrect: false,
              feedback:
                "❌ La vitesse ne varie pas linéairement avec R mais avec sa racine. v ∝ √R, donc ×√2 quand R double.",
            },
            {
              text: "Divisée par 2",
              isCorrect: false,
              feedback:
                "❌ C'est l'inverse : un virage plus large permet une vitesse plus grande, pas plus petite.",
            },
            {
              text: "Inchangée",
              isCorrect: false,
              feedback:
                "❌ La vitesse maximale dépend du rayon. Plus R est grand, plus on peut aller vite.",
            },
          ],
        },
      ],
    },
  ],
};
