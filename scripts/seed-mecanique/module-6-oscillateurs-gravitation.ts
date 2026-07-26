import type { ModuleInput } from "./types";

export const moduleOscillateursGravitation: ModuleInput = {
  title: "Oscillateurs et gravitation",
  description:
    "Pendule simple, oscillateur harmonique, lois de Kepler et gravitation universelle.",
  lessons: [
    // 6.1 Pendule simple
    {
      title: "Pendule simple",
      slug: "pendule-simple",
      estimatedMinutes: 30,
      isFreePreview: false,
      blocks: [
        {
          type: "text",
          content: `# Pendule simple

## 1. Définition

Un **pendule simple** est constitué d'une masse ponctuelle $m$ suspendue à un fil inextensible de longueur $l$ et de masse négligeable, oscillant sous l'effet de la gravité.

## 2. Équation du mouvement

### Bilan des forces

- Poids $\\vec{P} = m\\vec{g}$ (vertical, vers le bas)
- Tension $\\vec{T}$ (le long du fil, vers le point d'attache)

### PFD en projection tangentielle

$$m l \\ddot{\\theta} = -mg \\sin\\theta$$

$$\\boxed{\\ddot{\\theta} + \\frac{g}{l} \\sin\\theta = 0}$$

### Approximation des petits angles

Pour $\\theta$ petit ($\\theta \\ll 1$ rad), $\\sin\\theta \\approx \\theta$ :

$$\\ddot{\\theta} + \\omega_0^2 \\theta = 0 \\quad \\text{avec} \\quad \\omega_0 = \\sqrt{\\frac{g}{l}}$$

## 3. Solution harmonique

$$\\theta(t) = \\theta_{max} \\cos(\\omega_0 t + \\phi)$$

- Période : $\\boxed{T = 2\\pi \\sqrt{\\frac{l}{g}}}$
- Indépendante de la masse et de l'amplitude (pour petits angles)
- Fréquence : $f = \\frac{1}{T}$

## 4. Schéma du pendule

<svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" style="background:#fff;max-width:100%;border-radius:8px;border:1px solid #e5e7eb">
  <!-- Pivot O -->
  <circle cx="200" cy="40" r="5" fill="#1B2A4E"/>
  <text x="210" y="45" font-size="13" fill="#1B2A4E" font-weight="bold">O</text>
  
  <!-- Ligne verticale (équilibre) -->
  <line x1="200" y1="40" x2="200" y2="220" stroke="#999" stroke-width="1" stroke-dasharray="3 3"/>
  
  <!-- Fil -->
  <line x1="200" y1="40" x2="120" y2="180" stroke="#1B2A4E" stroke-width="1.5"/>
  
  <!-- Masse -->
  <circle cx="120" cy="180" r="14" fill="#2DD4BF" stroke="#1B2A4E" stroke-width="1.5"/>
  <text x="120" y="185" font-size="11" fill="#1B2A4E" text-anchor="middle" font-weight="bold">m</text>
  
  <!-- Longueur l -->
  <text x="155" y="115" font-size="13" fill="#1B2A4E" font-weight="bold">l</text>
  
  <!-- Angle θ -->
  <path d="M 200 80 A 40 40 0 0 0 175 80" stroke="#C9A227" stroke-width="2" fill="none"/>
  <text x="170" y="75" font-size="14" fill="#C9A227" font-weight="bold">θ</text>
  
  <!-- Force P (poids, vertical vers le bas) -->
  <line x1="120" y1="195" x2="120" y2="240" stroke="#EF4444" stroke-width="2.5" marker-end="url(#arrP1)"/>
  <text x="125" y="225" font-size="13" fill="#EF4444" font-weight="bold">P = mg</text>
  
  <!-- Force T (tension, le long du fil) -->
  <line x1="120" y1="180" x2="170" y2="115" stroke="#2DD4BF" stroke-width="2.5" marker-end="url(#arrP2)"/>
  <text x="155" y="140" font-size="13" fill="#2DD4BF" font-weight="bold">T</text>
  
  <defs>
    <marker id="arrP1" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#EF4444"/>
    </marker>
    <marker id="arrP2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#2DD4BF"/>
    </marker>
  </defs>
  
  <text x="200" y="265" font-size="11" fill="#666" text-anchor="middle">Pendule simple de longueur l, masse m, écarté de l'équilibre d'un angle θ</text>
</svg>

## 5. Période en fonction de la longueur

| Longueur $l$ | Période $T$ |
|---|---|
| $10$ cm | $0{,}63$ s |
| $25$ cm (pendule classique) | $1{,}00$ s |
| $1$ m | $2{,}01$ s |
| $10$ m | $6{,}35$ s |

> La fameuse horloge à pendule de Huygens (1656) utilisait un pendule d'environ 1 m pour faire un tic toutes les secondes.`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Mesurer g avec un pendule

**Énoncé** : Un pendule de longueur $l = 1{,}00$ m fait 30 oscillations en $60{,}3$ s. Calculer $g$.

### Étape 1 — Mesurer la période

$$T = \\frac{60{,}3}{30} = 2{,}01 \\text{ s}$$

### Étape 2 — Inverser la formule

$$T = 2\\pi \\sqrt{\\frac{l}{g}} \\Rightarrow g = \\frac{4\\pi^2 l}{T^2}$$

### Étape 3 — Calculer

$$g = \\frac{4 \\times 9{,}87 \\times 1}{2{,}01^2} = \\frac{39{,}48}{4{,}04}$$

$$\\boxed{g \\approx 9{,}77 \\text{ m/s²}}$$

### Étape 4 — Comparer à la valeur attendue

À Lomé (latitude 6°N), $g_{théorique} \\approx 9{,}78$ m/s². Notre mesure est très proche (écart < 0,1 %).

> ✅ Cette méthode, due à Galilée puis Huygens, reste l'une des façons les plus simples de mesurer $g$ avec précision, sans équipement sophistiqué. Elle est toujours utilisée dans les lycées.

### Étape 5 — Sur la Lune

Avec $g_{Lune} = 1{,}62$ m/s², le même pendule aurait une période :

$$T_{Lune} = 2\\pi \\sqrt{\\frac{1}{1{,}62}} = 4{,}94 \\text{ s}$$

Soit 2,46× plus lent que sur Terre. C'est pourquoi les objets oscillent plus lentement sur la Lune (vu dans les vidéos Apollo).`,
        },
        {
          type: "mcq",
          title: "Période du pendule",
          question:
            "Si on double la longueur d'un pendule simple (l → 2l), sa période est multipliée par...",
          explanation:
            "T = 2π√(l/g). Si l → 2l, T → √2 × T ≈ 1,41 × T. La période ne varie pas linéairement mais avec la racine carrée.",
          choices: [
            {
              text: "√2 ≈ 1,41",
              isCorrect: true,
              feedback:
                "✅ Exact ! T ∝ √l, donc doubler l multiplie T par √2 ≈ 1,41. La période ne double pas, elle augmente de 41%.",
            },
            {
              text: "2",
              isCorrect: false,
              feedback:
                "❌ Ce serait si T ∝ l, mais T ∝ √l. La relation n'est pas linéaire.",
            },
            {
              text: "4",
              isCorrect: false,
              feedback:
                "❌ T² ∝ l, donc T ∝ √l. Pas T⁴ ∝ l.",
            },
            {
              text: "1 (inchangée)",
              isCorrect: false,
              feedback:
                "❌ La période dépend de la longueur. Un pendule plus long oscille plus lentement.",
            },
          ],
        },
        {
          type: "mcq",
          title: "Période vs masse",
          question:
            "Que se passe-t-il si on triple la masse du pendule sans changer la longueur ?",
          explanation:
            "T = 2π√(l/g) ne dépend pas de m. La période est inchangée ! C'est une propriété remarquable du pendule simple.",
          choices: [
            {
              text: "La période est inchangée",
              isCorrect: true,
              feedback:
                "✅ Exact ! T = 2π√(l/g) ne dépend pas de la masse. C'est pourquoi Galilée a pu utiliser des pendules de différentes masses pour mesurer le temps.",
            },
            {
              text: "La période triple",
              isCorrect: false,
              feedback:
                "❌ La masse n'apparaît pas dans la formule. Pense à la chute libre : tous les corps tombent à la même vitesse (a = g, indépendamment de m).",
            },
            {
              text: "La période est divisée par 3",
              isCorrect: false,
              feedback:
                "❌ La masse n'intervient pas dans la période du pendule. C'est une propriété fondamentale du mouvement harmonique.",
            },
            {
              text: "La période est divisée par √3",
              isCorrect: false,
              feedback:
                "❌ La masse n'apparaît pas dans T = 2π√(l/g). Aucune dépendance.",
            },
          ],
        },
        {
          type: "sandbox",
          title: "Visualiser les oscillations",
          code: `import matplotlib.pyplot as plt
import numpy as np

g = 9.81

# Paramètres injectés: l (longueur), theta_max (angle initial en degrés)

omega0 = np.sqrt(g / l)
theta_rad = np.radians(theta_max)

# Période
T = 2 * np.pi / omega0

# Simulation sur 3 périodes
t = np.linspace(0, 3 * T, 300)
theta_t = theta_rad * np.cos(omega0 * t)

fig, ax = plt.subplots(figsize=(10, 5))
ax.plot(t, np.degrees(theta_t), color="#2DD4BF", linewidth=2.5)
ax.axhline(y=0, color="#999", linewidth=1)

# Marquer les périodes
for i in range(4):
    ax.axvline(x=i * T, color="#C9A227", linestyle=":", alpha=0.5)
    ax.text(i * T, theta_max + 1, f"T={T:.2f}s" if i == 1 else "",
            color="#C9A227", fontsize=10, ha="center")

ax.set_xlabel("Temps t (s)")
ax.set_ylabel("Angle θ (°)")
ax.set_title(f"Oscillations du pendule — l = {l} m, θ_max = {theta_max}°\\n"
             f"Période T = 2π√(l/g) = {T:.3f} s")
ax.grid(True, alpha=0.3)
ax.set_ylim(-theta_max - 5, theta_max + 5)

plt.tight_layout()
plt.savefig("output.png", dpi=100, bbox_inches="tight")
plt.show()
`,
        },
      ],
    },

    // 6.2 Oscillateur harmonique
    {
      title: "Oscillateur harmonique — système masse-ressort",
      slug: "oscillateur-harmonique",
      estimatedMinutes: 30,
      isFreePreview: false,
      blocks: [
        {
          type: "text",
          content: `# Oscillateur harmonique

## 1. Système masse-ressort

Une masse $m$ attachée à un ressort de raideur $k$, sans frottement, oscille autour de sa position d'équilibre.

### PFD

$$m \\ddot{x} = -k x$$

$$\\boxed{\\ddot{x} + \\omega_0^2 x = 0 \\quad \\text{avec} \\quad \\omega_0 = \\sqrt{\\frac{k}{m}}}$$

## 2. Solution harmonique

$$x(t) = x_{max} \\cos(\\omega_0 t + \\phi)$$

- Période : $\\boxed{T = 2\\pi \\sqrt{\\frac{m}{k}}}$
- Fréquence : $f = \\frac{1}{2\\pi}\\sqrt{\\frac{k}{m}}$

## 3. Énergie mécanique

L'énergie mécanique totale se conserve :

$$E_m = E_c + E_p = \\frac{1}{2} m v^2 + \\frac{1}{2} k x^2 = \\text{constante}$$

Au point d'amplitude maximale ($v = 0$) :

$$E_m = \\frac{1}{2} k x_{max}^2$$

Au passage à l'équilibre ($x = 0$) :

$$E_m = \\frac{1}{2} m v_{max}^2$$

## 4. Comparaison avec le pendule

| Pendule (petits angles) | Masse-ressort |
|---|---|
| $\\omega_0 = \\sqrt{g/l}$ | $\\omega_0 = \\sqrt{k/m}$ |
| $T = 2\\pi\\sqrt{l/g}$ | $T = 2\\pi\\sqrt{m/k}$ |
| $E_p = mgh = mgl(1-\\cos\\theta) \\approx \\frac{1}{2}mgl\\theta^2$ | $E_p = \\frac{1}{2}kx^2$ |

## 5. Oscillations amorties

Avec un frottement fluide $\\vec{f} = -\\lambda \\vec{v}$ :

$$m \\ddot{x} + \\lambda \\dot{x} + k x = 0$$

### Régimes

- **Régime pseudo-périodique** (faible amortissement) : oscillations avec amplitude décroissante exponentielle
- **Régime critique** : retour le plus rapide à l'équilibre sans oscillation
- **Régime apériodique** (fort amortissement) : retour lent à l'équilibre sans oscillation`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Caractériser un ressort

**Énoncé** : Un système masse-ressort a une période $T = 0{,}5$ s quand on y suspend une masse $m = 100$ g. Calculer :
1. La raideur $k$
2. L'énergie mécanique maximale si l'amplitude est $x_{max} = 5$ cm

### Étape 1 — Calculer k

$$T = 2\\pi \\sqrt{\\frac{m}{k}} \\Rightarrow k = \\frac{4\\pi^2 m}{T^2}$$

$$k = \\frac{4 \\times 9{,}87 \\times 0{,}1}{0{,}5^2} = \\frac{3{,}95}{0{,}25}$$

$$\\boxed{k \\approx 15{,}8 \\text{ N/m}}$$

### Étape 2 — Énergie mécanique

$$E_m = \\frac{1}{2} k x_{max}^2 = \\frac{1}{2} \\times 15{,}8 \\times (0{,}05)^2$$

$$E_m = \\frac{1}{2} \\times 15{,}8 \\times 0{,}0025 = 0{,}0198 \\text{ J}$$

$$\\boxed{E_m \\approx 19{,}8 \\text{ mJ}}$$

### Étape 3 — Vitesse maximale

$$\\frac{1}{2} m v_{max}^2 = E_m \\Rightarrow v_{max} = \\sqrt{\\frac{2 E_m}{m}} = \\sqrt{\\frac{0{,}0396}{0{,}1}}$$

$$v_{max} = \\sqrt{0{,}396} \\approx 0{,}63 \\text{ m/s}$$

> ✅ Quand la masse passe par l'équilibre, sa vitesse est maximale ($0{,}63$ m/s), et toute l'énergie est cinétique. Aux extrêmes, l'énergie est entièrement potentielle dans le ressort.`,
        },
        {
          type: "mcq",
          title: "Période d'un oscillateur",
          question:
            "Un système masse-ressort a une période T. Si on quadruple la masse (m → 4m), la nouvelle période est...",
          explanation:
            "T = 2π√(m/k). Si m → 4m, T → 2T (car √4 = 2). La période est doublée.",
          choices: [
            {
              text: "2T (doublée)",
              isCorrect: true,
              feedback:
                "✅ Exact ! T ∝ √m. Quadrupler la masse multiplie T par √4 = 2.",
            },
            {
              text: "4T (quadruplée)",
              isCorrect: false,
              feedback:
                "❌ T n'est pas proportionnel à m mais à √m. Donc ×2, pas ×4.",
            },
            {
              text: "T/2 (divisée par 2)",
              isCorrect: false,
              feedback:
                "❌ C'est l'inverse : une masse plus grande oscille plus lentement, donc T augmente.",
            },
            {
              text: "T (inchangée)",
              isCorrect: false,
              feedback:
                "❌ La période dépend de la masse. Vérifie la formule : T = 2π√(m/k).",
            },
          ],
        },
      ],
    },

    // 6.3 Lois de Kepler
    {
      title: "Lois de Kepler",
      slug: "lois-kepler",
      estimatedMinutes: 30,
      isFreePreview: false,
      blocks: [
        {
          type: "text",
          content: `# Les trois lois de Kepler

Johannes Kepler (1571-1630) a formulé trois lois décrivant le mouvement des planètes autour du Soleil, à partir des observations de Tycho Brahé.

## 1. Première loi — Loi des orbites

> Les planètes décrivent des **ellipses** dont le Soleil occupe l'un des **foyers**.

### Équation d'une ellipse

$$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$$

- $a$ : demi-grand axe
- $b$ : demi-petit axe
- Excentricité : $e = \\sqrt{1 - b^2/a^2}$

| Astre | $a$ (UA) | $e$ |
|---|---|---|
| Mercure | 0,387 | 0,206 (très elliptique) |
| Terre | 1,000 | 0,017 (quasi circulaire) |
| Mars | 1,524 | 0,093 |
| Comète Halley | 17,8 | 0,967 (très elliptique) |

## 2. Deuxième loi — Loi des aires

> Le rayon vecteur Soleil-Planète balaie des **aires égales** en des **temps égaux**.

Conséquence : la planète va **plus vite** près du Soleil (périhélie) que loin (aphélie).

## 3. Troisième loi — Loi des périodes

> Le carré de la période de révolution est proportionnel au cube du demi-grand axe :

$$\\boxed{\\frac{T^2}{a^3} = \\frac{4\\pi^2}{GM_{Soleil}} = \\text{constante}}$$

Pour toutes les planètes du système solaire, $T^2/a^3$ est le même (à $10^{-5}$ près).

| Planète | $a$ (UA) | $T$ (ans) | $T^2/a^3$ |
|---|---|---|---|
| Mercure | 0,387 | 0,241 | 1,00 |
| Terre | 1,000 | 1,000 | 1,00 |
| Mars | 1,524 | 1,881 | 1,00 |
| Jupiter | 5,203 | 11,86 | 1,00 |

> 1 UA = distance Terre-Soleil ≈ 1,496 × 10⁸ km

## 4. Schéma : orbite elliptique et loi des aires

<svg viewBox="0 0 500 280" xmlns="http://www.w3.org/2000/svg" style="background:#fff;max-width:100%;border-radius:8px;border:1px solid #e5e7eb">
  <!-- Ellipse -->
  <ellipse cx="250" cy="140" rx="180" ry="100" stroke="#2DD4BF" stroke-width="2" fill="none"/>
  
  <!-- Soleil (au foyer) -->
  <circle cx="180" cy="140" r="14" fill="#C9A227"/>
  <text x="155" y="125" font-size="13" fill="#C9A227" font-weight="bold">Soleil</text>
  
  <!-- Périhélie (point le plus proche) -->
  <circle cx="70" cy="140" r="4" fill="#1B2A4E"/>
  <text x="35" y="135" font-size="11" fill="#1B2A4E" font-weight="bold">Périhélie</text>
  
  <!-- Aphélie (point le plus éloigné) -->
  <circle cx="430" cy="140" r="4" fill="#1B2A4E"/>
  <text x="400" y="135" font-size="11" fill="#1B2A4E" font-weight="bold">Aphélie</text>
  
  <!-- Triangle 1 (près du Soleil, rapide) -->
  <path d="M 180 140 L 90 100 L 95 180 Z" fill="#EF4444" fill-opacity="0.3" stroke="#EF4444" stroke-width="1"/>
  
  <!-- Triangle 2 (loin, lent) -->
  <path d="M 180 140 L 380 100 L 385 180 Z" fill="#2DD4BF" fill-opacity="0.3" stroke="#2DD4BF" stroke-width="1"/>
  
  <text x="120" y="200" font-size="11" fill="#EF4444" font-weight="bold">Aire 1 (faite en peu de temps)</text>
  <text x="320" y="200" font-size="11" fill="#2DD4BF" font-weight="bold">Aire 2 (égale à Aire 1)</text>
  
  <text x="250" y="260" font-size="11" fill="#666" text-anchor="middle">Loi des aires : les deux aires colorées sont parcourues dans le même temps</text>
</svg>

## 5. Loi des aires — vitesse variable

Près du Soleil, la planète va plus vite. Au périhélie :

$$v_{peri} = \\sqrt{GM \\left(\\frac{2}{r_{peri}} - \\frac{1}{a}\\right)}$$

Au aphélie :

$$v_{aphe} = \\sqrt{GM \\left(\\frac{2}{r_{aphe}} - \\frac{1}{a}\\right)}$$

> La Terre va à 30,3 km/s au périhélie (janvier) et 29,3 km/s à l'aphélie (juillet).`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Période d'une planète

**Énoncé** : Une exoplanète orbite autour de son étoile à une distance moyenne $a = 0{,}5$ UA. Sachant que la masse de l'étoile est $M = 2 M_{Soleil}$, calculer sa période de révolution.

### Étape 1 — Troisième loi de Kepler

$$T^2 = \\frac{4\\pi^2}{GM} a^3$$

### Étape 2 — Convertir en unités SI

- $a = 0{,}5 \\text{ UA} = 0{,}5 \\times 1{,}496 \\times 10^{11} = 7{,}48 \\times 10^{10}$ m
- $M = 2 \\times 1{,}989 \\times 10^{30} = 3{,}978 \\times 10^{30}$ kg
- $G = 6{,}67 \\times 10^{-11}$ N·m²/kg²

### Étape 3 — Calculer

$$T^2 = \\frac{4 \\times 9{,}87}{6{,}67 \\times 10^{-11} \\times 3{,}978 \\times 10^{30}} \\times (7{,}48 \\times 10^{10})^3$$

$$T^2 = \\frac{39{,}48}{2{,}654 \\times 10^{20}} \\times 4{,}19 \\times 10^{32}$$

$$T^2 = 1{,}488 \\times 10^{-19} \\times 4{,}19 \\times 10^{32} = 6{,}23 \\times 10^{13} \\text{ s²}$$

$$T = \\sqrt{6{,}23 \\times 10^{13}} = 7{,}89 \\times 10^6 \\text{ s}$$

### Étape 4 — Convertir en années

$$T = \\frac{7{,}89 \\times 10^6}{365{,}25 \\times 24 \\times 3600} = 0{,}25 \\text{ an}$$

$$\\boxed{T \\approx 91 \\text{ jours}}$$

### Étape 5 — Vérification par la troisième loi

$$\\frac{T^2}{a^3} = \\frac{0{,}25^2}{0{,}5^3} = \\frac{0{,}0625}{0{,}125} = 0{,}5$$

> ✅ Pour le Soleil (masse = 1 $M_\\odot$), $T^2/a^3 = 1$ (en unités UA/ans). Ici l'étoile est 2× plus massive, donc $T^2/a^3 = 2$. Avec $a = 0{,}5$ UA, $T = \\sqrt{2 \\times 0{,}125} = 0{,}5$ an. Mais en fait... attendez, on a $a^3 = 0{,}125$, donc $T^2 = 2 \\times 0{,}125 = 0{,}25$, $T = 0{,}5$ an = 183 jours.

Hmm, reprenons. La constante pour le Soleil est $T^2/a^3 = 1$ (an²/UA³). Pour une étoile de masse $2M_\\odot$ :

$$\\frac{T^2}{a^3} = \\frac{M_\\odot}{M_{étoile}} = \\frac{1}{2}$$

Donc $T^2 = 0{,}5 \\times a^3 = 0{,}5 \\times 0{,}125 = 0{,}0625$ → $T = 0{,}25$ an = **91 jours**.

> ✅ La planète complète une orbite en 91 jours, soit 4× plus vite que la Terre (365 jours). C'est cohérent : elle est 2× plus proche (orbite plus courte) ET l'étoile est 2× plus massive (gravité plus forte).`,
        },
        {
          type: "mcq",
          title: "Troisième loi de Kepler",
          question:
            "Si une planète orbite à 4 UA du Soleil, combien de temps dure son année ?",
          explanation:
            "T² = a³ (en UA et années). Donc T² = 4³ = 64, T = √64 = 8 ans.",
          choices: [
            {
              text: "8 ans",
              isCorrect: true,
              feedback:
                "✅ Exact ! T = √(a³) = √64 = 8 ans. Plus on s'éloigne, plus la période est longue (et de façon non linéaire).",
            },
            {
              text: "4 ans",
              isCorrect: false,
              feedback:
                "❌ Tu as confondu T avec a. La relation est T² = a³, donc T = √(a³) = √64 = 8 ans.",
            },
            {
              text: "16 ans",
              isCorrect: false,
              feedback:
                "❌ Tu as fait a² au lieu de √(a³). T² = a³, pas T = a².",
            },
            {
              text: "64 ans",
              isCorrect: false,
              feedback:
                "❌ Tu as pris a³ au lieu de √(a³). T² = a³ = 64, donc T = √64 = 8 ans.",
            },
          ],
        },
        {
          type: "mcq",
          title: "Loi des aires",
          question:
            "D'après la deuxième loi de Kepler, une planète se déplace...",
          explanation:
            "La loi des aires dit que le rayon vecteur balaie des aires égales en des temps égaux. Donc la planète va plus vite près du Soleil (périhélie) que loin (aphélie).",
          choices: [
            {
              text: "Plus vite près du Soleil (périhélie)",
              isCorrect: true,
              feedback:
                "✅ Exact ! Au périhélie, la planète est proche du Soleil, donc l'arc balayé doit être plus long pour la même aire → vitesse plus grande.",
            },
            {
              text: "À vitesse constante",
              isCorrect: false,
              feedback:
                "❌ La vitesse n'est pas constante sur une orbite elliptique. La Terre va à 30,3 km/s en janvier et 29,3 km/s en juillet.",
            },
            {
              text: "Plus vite loin du Soleil (aphélie)",
              isCorrect: false,
              feedback:
                "❌ C'est l'inverse ! La loi des aires implique une vitesse maximale au périhélie, minimale à l'aphélie.",
            },
            {
              text: "À vitesse nulle au périhélie",
              isCorrect: false,
              feedback:
                "❌ Au contraire, c'est là que la vitesse est maximale.",
            },
          ],
        },
      ],
    },

    // 6.4 Gravitation universelle
    {
      title: "Loi de la gravitation universelle",
      slug: "gravitation-universelle",
      estimatedMinutes: 35,
      isFreePreview: false,
      blocks: [
        {
          type: "text",
          content: `# Gravitation universelle

## 1. Énoncé (Newton, 1687)

Deux corps ponctuels de masses $m_1$ et $m_2$ séparés d'une distance $r$ s'attirent avec une force :

$$\\boxed{F = G \\frac{m_1 m_2}{r^2}}$$

- $G = 6{,}674 \\times 10^{-11}$ N·m²/kg² (constante de gravitation)
- Direction : la droite joignant les deux corps
- Sens : attractive (vers l'autre corps)
- Décroît en $1/r^2$

## 2. Champ gravitationnel

Un corps de masse $M$ crée un champ gravitationnel :

$$\\vec{g}(\\vec{r}) = -G \\frac{M}{r^2} \\hat{r}$$

Un corps de masse $m$ placé dans ce champ subit :

$$\\vec{F} = m \\vec{g}$$

> À la surface terrestre : $g = G M_T / R_T^2 = 6{,}674 \\times 10^{-11} \\times 5{,}97 \\times 10^{24} / (6{,}371 \\times 10^6)^2 \\approx 9{,}81$ m/s² ✅

## 3. Énergie potentielle gravitationnelle

$$E_p(r) = -G \\frac{m_1 m_2}{r}$$

- Négative (origine à l'infini, $E_p = 0$ quand $r \\to \\infty$)
- Croît vers 0 quand $r$ augmente

## 4. Vitesse de libération

Pour quitter l'attraction d'un astre de masse $M$ et rayon $R$, depuis la surface :

$$\\frac{1}{2} m v_{lib}^2 = G \\frac{m M}{R}$$

$$\\boxed{v_{lib} = \\sqrt{\\frac{2GM}{R}}}$$

| Astre | $v_{lib}$ |
|---|---|
| Terre | $11{,}2$ km/s |
| Lune | $2{,}4$ km/s |
| Mars | $5{,}0$ km/s |
| Jupiter | $59{,}5$ km/s |
| Soleil | $617$ km/s |

## 5. Vitesse orbitale

Pour une orbite circulaire à altitude $r$ autour d'un astre de masse $M$ :

$$\\frac{mv^2}{r} = G \\frac{mM}{r^2}$$

$$\\boxed{v_{orb} = \\sqrt{\\frac{GM}{r}}}$$

> Plus l'orbite est basse, plus la vitesse orbitale est élevée. La Station Spatiale Internationale à 400 km va à 7,7 km/s ; la Lune à 384 000 km va à 1 km/s.

## 6. Schéma : attraction gravitationnelle

<svg viewBox="0 0 500 250" xmlns="http://www.w3.org/2000/svg" style="background:#fff;max-width:100%;border-radius:8px;border:1px solid #e5e7eb">
  <!-- Astre 1 -->
  <circle cx="120" cy="125" r="40" fill="#1B2A4E"/>
  <text x="120" y="130" font-size="13" fill="white" text-anchor="middle" font-weight="bold">M₁</text>
  
  <!-- Astre 2 -->
  <circle cx="380" cy="125" r="25" fill="#C9A227"/>
  <text x="380" y="130" font-size="11" fill="#1B2A4E" text-anchor="middle" font-weight="bold">m₂</text>
  
  <!-- Forces (mutuelles, attractives) -->
  <line x1="160" y1="125" x2="335" y2="125" stroke="#2DD4BF" stroke-width="2.5" marker-end="url(#arrG1)"/>
  <text x="220" y="115" font-size="13" fill="#2DD4BF" font-weight="bold">F (M₁ → m₂)</text>
  
  <line x1="355" y1="155" x2="180" y2="155" stroke="#EF4444" stroke-width="2.5" marker-end="url(#arrG2)"/>
  <text x="220" y="180" font-size="13" fill="#EF4444" font-weight="bold">F (m₂ → M₁)</text>
  
  <!-- Distance r -->
  <line x1="160" y1="80" x2="355" y2="80" stroke="#999" stroke-width="1.5" marker-end="url(#arrG3)" marker-start="url(#arrG3)"/>
  <text x="250" y="70" font-size="13" fill="#666" font-weight="bold">r</text>
  
  <defs>
    <marker id="arrG1" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#2DD4BF"/>
    </marker>
    <marker id="arrG2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#EF4444"/>
    </marker>
    <marker id="arrG3" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#999"/>
    </marker>
  </defs>
  
  <text x="250" y="230" font-size="13" fill="#1B2A4E" text-anchor="middle" font-weight="bold">F = G · M₁·m₂ / r²</text>
</svg>`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Vitesse de libération de la Terre

**Énoncé** : Calculer la vitesse de libération d'un projectile depuis la surface de la Terre.

Données : $M_T = 5{,}97 \\times 10^{24}$ kg, $R_T = 6371$ km, $G = 6{,}674 \\times 10^{-11}$ N·m²/kg².

### Étape 1 — Appliquer la formule

$$v_{lib} = \\sqrt{\\frac{2 G M_T}{R_T}}$$

### Étape 2 — Convertir

$$R_T = 6{,}371 \\times 10^6 \\text{ m}$$

### Étape 3 — Calculer

$$v_{lib} = \\sqrt{\\frac{2 \\times 6{,}674 \\times 10^{-11} \\times 5{,}97 \\times 10^{24}}{6{,}371 \\times 10^6}}$$

$$v_{lib} = \\sqrt{\\frac{7{,}969 \\times 10^{14}}{6{,}371 \\times 10^6}}$$

$$v_{lib} = \\sqrt{1{,}251 \\times 10^8}$$

$$\\boxed{v_{lib} \\approx 11\\,186 \\text{ m/s} \\approx 11{,}2 \\text{ km/s} \\approx 40\\,300 \\text{ km/h}}$$

### Étape 4 — Comparaison avec la Lune

$$v_{lib,Lune} = \\sqrt{\\frac{2 \\times 6{,}674 \\times 10^{-11} \\times 7{,}342 \\times 10^{22}}{1{,}737 \\times 10^6}} = \\sqrt{5{,}64 \\times 10^6} \\approx 2{,}38 \\text{ km/s}$$

> ✅ C'est beaucoup plus facile de quitter la Lune (2,4 km/s) que la Terre (11,2 km/s). C'est pourquoi les missions Apollo avaient besoin d'une fusée géante (Saturn V, 110 m de haut) pour quitter la Terre, mais d'un petit module pour quitter la Lune.

### Étape 5 — Comparaison énergétique

Énergie cinétique pour quitter la Terre : $\\frac{1}{2} m v^2 = 62{,}6$ MJ/kg

Pour 1 tonne de charge utile : $62{,}6$ GJ — soit l'énergie de 1,5 tonnes de TNT.

> ✅ C'est pourquoi l'exploration spatiale est si coûteuse : il faut énormément d'énergie pour échapper à la gravité terrestre.`,
        },
        {
          type: "mcq",
          title: "Loi de gravitation",
          question:
            "Si on double la distance entre deux masses, la force gravitationnelle devient...",
          explanation:
            "F = G·m₁·m₂/r². Si r → 2r, F → F/4 (la force décroît comme le carré inverse de la distance).",
          choices: [
            {
              text: "Divisée par 4",
              isCorrect: true,
              feedback:
                "✅ Exact ! F ∝ 1/r². Doubler r divise F par 4. C'est pourquoi la gravité de la Lune est faible même si sa masse est énorme.",
            },
            {
              text: "Divisée par 2",
              isCorrect: false,
              feedback:
                "❌ C'est 1/r², pas 1/r. Doubler r divise par 2² = 4.",
            },
            {
              text: "Doublée",
              isCorrect: false,
              feedback:
                "❌ Inverse : plus la distance augmente, plus la force diminue.",
            },
            {
              text: "Inchangée",
              isCorrect: false,
              feedback:
                "❌ La force dépend fortement de la distance (en 1/r²).",
            },
          ],
        },
        {
          type: "mcq",
          title: "Vitesse orbitale",
          question:
            "Si un satellite passe d'une orbite basse (400 km) à une orbite géostationnaire (36 000 km), sa vitesse orbitale...",
          explanation:
            "v_orb = √(GM/r). Plus r est grand, plus v est petit. Mais r augmente de 6,8 (de 6771 à 42164 km), donc v diminue d'un facteur √6,8 ≈ 2,6.",
          choices: [
            {
              text: "Diminue (d'environ un facteur 2,6)",
              isCorrect: true,
              feedback:
                "✅ Exact ! v_orb ∝ 1/√r. En passant de 400 km à 36 000 km, r augmente de 6,2, donc v diminue d'un facteur √6,2 ≈ 2,5. L'ISS va à 7,7 km/s, un satellite géostationnaire à 3,1 km/s.",
            },
            {
              text: "Augmente (car l'orbite est plus grande)",
              isCorrect: false,
              feedback:
                "❌ C'est l'inverse ! Plus l'orbite est haute, plus la vitesse orbitale est faible. La Lune (très haut) va à seulement 1 km/s, l'ISS (bas) à 7,7 km/s.",
            },
            {
              text: "Reste constante",
              isCorrect: false,
              feedback:
                "❌ La vitesse orbitale dépend de l'altitude : v_orb = √(GM/r).",
            },
            {
              text: "Devient nulle (le satellite est immobile)",
              isCorrect: false,
              feedback:
                "❌ Même un satellite géostationnaire (qui paraît immobile depuis le sol) se déplace à 3,1 km/s autour de la Terre.",
            },
          ],
        },
        {
          type: "sandbox",
          title: "Vitesse orbitale vs altitude",
          code: `import matplotlib.pyplot as plt
import numpy as np

G = 6.674e-11
M_T = 5.97e24
R_T = 6.371e6  # m

# Altitudes de 0 à 40 000 km
h = np.linspace(0, 40000e3, 200)  # en mètres
r = R_T + h

# Vitesse orbitale
v = np.sqrt(G * M_T / r) / 1000  # en km/s

# Période orbitale
T = 2 * np.pi * r / np.sqrt(G * M_T / r) / 3600  # en heures

fig, axes = plt.subplots(1, 2, figsize=(12, 5))

axes[0].plot(h / 1000, v, color="#2DD4BF", linewidth=2.5)
axes[0].set_xlabel("Altitude h (km)")
axes[0].set_ylabel("Vitesse orbitale v (km/s)")
axes[0].set_title("Vitesse orbitale vs altitude")
axes[0].grid(True, alpha=0.3)
axes[0].axhline(y=7.67, color="#1B2A4E", linestyle="--", alpha=0.5)
axes[0].text(5000, 7.8, "ISS (7,7 km/s)", color="#1B2A4E", fontsize=10)

axes[1].plot(h / 1000, T, color="#C9A227", linewidth=2.5)
axes[1].set_xlabel("Altitude h (km)")
axes[1].set_ylabel("Période orbitale T (heures)")
axes[1].set_title("Période orbitale vs altitude")
axes[1].grid(True, alpha=0.3)
axes[1].axhline(y=24, color="#1B2A4E", linestyle="--", alpha=0.5)
axes[1].text(15000, 26, "Orbite géostationnaire (24h)", color="#1B2A4E", fontsize=10)
axes[1].set_ylim(0, 50)

plt.suptitle("Satellites terrestres : vitesse et période orbitales")
plt.tight_layout()
plt.savefig("output.png", dpi=100, bbox_inches="tight")
plt.show()
`,
        },
      ],
    },
  ],
};
