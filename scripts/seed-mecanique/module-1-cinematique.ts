import type { ModuleInput } from "./types";

export const moduleCinematique: ModuleInput = {
  title: "Cinématique du point",
  description:
    "Description du mouvement : position, vitesse, accélération, en 1D et 2D. Bases indispensables pour toute la mécanique.",
  lessons: [
    // ─────────────────────────────────────────────────────────────────────────
    // Lesson 1.1 — Position, vitesse, accélération
    // ─────────────────────────────────────────────────────────────────────────
    {
      title: "Position, vitesse, accélération",
      slug: "position-vitesse-acceleration",
      estimatedMinutes: 25,
      isFreePreview: true,
      blocks: [
        {
          type: "text",
          content: `# Position, vitesse, accélération

La **cinématique** est l'étude du mouvement indépendamment de ses causes. Pour décrire le mouvement d'un point matériel $M$ dans un référentiel, on a besoin de trois grandeurs vectorielles : la **position** $\\vec{r}(t)$, la **vitesse** $\\vec{v}(t)$ et l'**accélération** $\\vec{a}(t)$.

## 1. Vecteur position

Dans un repère $(O, \\vec{i}, \\vec{j}, \\vec{k})$, la position du point $M$ à l'instant $t$ est repérée par le vecteur :

$$\\vec{r}(t) = x(t)\\,\\vec{i} + y(t)\\,\\vec{j} + z(t)\\,\\vec{k}$$

Les fonctions $x(t), y(t), z(t)$ sont les **équations horaires** du mouvement.

## 2. Vecteur vitesse

Le vecteur vitesse est la **dérivée temporelle** du vecteur position :

$$\\vec{v}(t) = \\frac{d\\vec{r}}{dt} = \\dot{\\vec{r}}(t)$$

En coordonnées cartésiennes :

$$\\vec{v}(t) = \\dot{x}(t)\\,\\vec{i} + \\dot{y}(t)\\,\\vec{j} + \\dot{z}(t)\\,\\vec{k}$$

> Le vecteur vitesse est **toujours tangent** à la trajectoire au point $M$, orienté dans le sens du mouvement.

## 3. Vecteur accélération

Le vecteur accélération est la **dérivée de la vitesse** (ou dérivée seconde de la position) :

$$\\vec{a}(t) = \\frac{d\\vec{v}}{dt} = \\frac{d^2\\vec{r}}{dt^2} = \\ddot{\\vec{r}}(t)$$

En coordonnées cartésiennes :

$$\\vec{a}(t) = \\ddot{x}(t)\\,\\vec{i} + \\ddot{y}(t)\\,\\vec{j} + \\ddot{z}(t)\\,\\vec{k}$$

## Schéma : trajectoire et vecteurs

<svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg" style="background:#fff;max-width:100%;border-radius:8px;border:1px solid #e5e7eb">
  <!-- axes -->
  <line x1="40" y1="160" x2="470" y2="160" stroke="#666" stroke-width="1"/>
  <line x1="40" y1="160" x2="40" y2="20" stroke="#666" stroke-width="1"/>
  <text x="475" y="165" font-size="11" fill="#666">x</text>
  <text x="35" y="15" font-size="11" fill="#666">y</text>
  <!-- trajectoire (parabole) -->
  <path d="M 60 160 Q 200 -20 380 160" stroke="#2DD4BF" stroke-width="2.5" fill="none"/>
  <!-- point M -->
  <circle cx="200" cy="78" r="5" fill="#1B2A4E"/>
  <text x="208" y="74" font-size="12" fill="#1B2A4E" font-weight="bold">M</text>
  <!-- vecteur vitesse (tangent) -->
  <line x1="200" y1="78" x2="260" y2="40" stroke="#2DD4BF" stroke-width="2.5" marker-end="url(#arrowTeal)"/>
  <text x="265" y="38" font-size="13" fill="#2DD4BF" font-weight="bold">v</text>
  <!-- vecteur accélération (vertical vers le bas) -->
  <line x1="200" y1="78" x2="200" y2="135" stroke="#C9A227" stroke-width="2.5" marker-end="url(#arrowGold)"/>
  <text x="207" y="130" font-size="13" fill="#C9A227" font-weight="bold">a</text>
  <defs>
    <marker id="arrowTeal" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#2DD4BF"/>
    </marker>
    <marker id="arrowGold" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#C9A227"/>
    </marker>
  </defs>
  <text x="200" y="190" font-size="11" fill="#666" text-anchor="middle">Trajectoire parabolique — v tangent, a dirigé vers le bas</text>
</svg>

## 4. Vitesse scalaire vs vitesse vectorielle

Attention à ne pas confondre :

- **Vitesse vectorielle** $\\vec{v}$ : a une direction et un sens
- **Vitesse scalaire** (ou « norme de la vitesse ») : $v = |\\vec{v}| = \\sqrt{v_x^2 + v_y^2 + v_z^2}$
- **Distance parcourue** : $D = \\int_{t_1}^{t_2} v(t)\\,dt$

## 5. Unités SI

- Position : mètre (m)
- Vitesse : mètre par seconde (m·s⁻¹)
- Accélération : mètre par seconde au carré (m·s⁻²)

> 💡 En pratique, on rencontre souvent km/h pour les vitesses véhicules. Conversion : $1\\text{ m/s} = 3{,}6\\text{ km/h}$.`,
        },
        {
          type: "sandbox",
          title: "Visualiser position, vitesse et accélération",
          code: `import matplotlib.pyplot as plt
import numpy as np

# Temps de 0 à 10 s
t = np.linspace(0, 10, 200)

# Position: x(t) = 0.5 * a * t^2 (mouvement uniformément accéléré, a = 2 m/s^2)
a = 2.0
x = 0.5 * a * t**2

# Vitesse: v(t) = a * t
v = a * t

# Accélération: constante
acc = np.full_like(t, a)

fig, axes = plt.subplots(3, 1, figsize=(8, 8), sharex=True)

axes[0].plot(t, x, color="#1B2A4E", linewidth=2)
axes[0].set_ylabel("Position x (m)")
axes[0].set_title("Position, vitesse et accélération\\nMouvement uniformément accéléré (a = 2 m/s²)")
axes[0].grid(True, alpha=0.3)

axes[1].plot(t, v, color="#2DD4BF", linewidth=2)
axes[1].set_ylabel("Vitesse v (m/s)")
axes[1].grid(True, alpha=0.3)

axes[2].plot(t, acc, color="#C9A227", linewidth=2)
axes[2].set_ylabel("Accélération a (m/s²)")
axes[2].set_xlabel("Temps t (s)")
axes[2].grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig("output.png", dpi=100, bbox_inches="tight")
plt.show()
`,
        },
        {
          type: "text",
          content: `## Exemple corrigé

**Énoncé** : Un mobile ponctuel se déplace le long de l'axe $Ox$. Sa position est donnée par $x(t) = 4t^2 - 3t + 1$ (en mètres, $t$ en secondes). Déterminer les expressions de la vitesse $v(t)$ et de l'accélération $a(t)$, puis calculer leurs valeurs à $t = 2$ s.

### Étape 1 — Vitesse

La vitesse est la dérivée de la position :

$$v(t) = \\frac{dx}{dt} = \\frac{d}{dt}(4t^2 - 3t + 1) = 8t - 3 \\;\\;\\text{(m/s)}$$

### Étape 2 — Accélération

L'accélération est la dérivée de la vitesse :

$$a(t) = \\frac{dv}{dt} = \\frac{d}{dt}(8t - 3) = 8 \\;\\;\\text{(m/s²)}$$

L'accélération est **constante** : le mouvement est uniformément varié.

### Étape 3 — Valeurs à t = 2 s

$$v(2) = 8 \\times 2 - 3 = 13 \\text{ m/s}$$

$$a(2) = 8 \\text{ m/s²}$$

### Étape 4 — Interprétation

À $t = 2$ s, le mobile se trouve à $x(2) = 4 \\times 4 - 6 + 1 = 11$ m, avec une vitesse de $13$ m/s qui augmente linéairement, et une accélération constante de $8$ m/s².

> ✅ Le mouvement est **uniformément accéléré** : la vitesse augmente de $8$ m/s chaque seconde.`,
        },
        {
          type: "mcq",
          title: "Vérifie ta compréhension",
          question:
            "Un point a pour position $x(t) = 5t^3 - 2t^2 + 7$. Quelle est son accélération à $t = 1$ s ?",
          explanation:
            "L'accélération est la dérivée seconde de la position : a(t) = d²x/dt² = 30t - 4. À t = 1 : a = 30 - 4 = 26 m/s².",
          choices: [
            {
              text: "26 m/s²",
              isCorrect: true,
              feedback:
                "✅ Exact ! a(t) = 30t - 4, donc a(1) = 26 m/s². La dérivée première est v(t) = 15t² - 4t, et la dérivée seconde est a(t) = 30t - 4.",
            },
            {
              text: "30 m/s²",
              isCorrect: false,
              feedback:
                "❌ Tu as oublié le terme -4. La dérivée de -2t² est -4t, donc on a v(t) = 15t² - 4t, et a(t) = 30t - 4.",
            },
            {
              text: "15 m/s²",
              isCorrect: false,
              feedback:
                "❌ Tu as confondu avec la dérivée première (la vitesse). v(1) = 15 - 4 = 11 m/s, mais ce n'est pas l'accélération.",
            },
            {
              text: "11 m/s²",
              isCorrect: false,
              feedback:
                "❌ Tu as calculé la vitesse à t = 1, pas l'accélération. La vitesse est v(1) = 15·1² - 4·1 = 11 m/s.",
            },
          ],
        },
        {
          type: "mcq",
          title: "Sens du vecteur vitesse",
          question:
            "Le vecteur vitesse d'un point matériel est...",
          explanation:
            "Le vecteur vitesse est toujours tangent à la trajectoire au point considéré, et orienté dans le sens du mouvement.",
          choices: [
            {
              text: "Tangent à la trajectoire, orienté dans le sens du mouvement",
              isCorrect: true,
              feedback:
                "✅ Parfait ! C'est la définition fondamentale. La vitesse est la dérivée de la position, donc le vecteur vitesse pointe dans la direction du déplacement infinitésimal.",
            },
            {
              text: "Perpendiculaire à la trajectoire",
              isCorrect: false,
              feedback:
                "❌ C'est faux. Le vecteur accélération peut avoir une composante perpendiculaire (composante normale), mais la vitesse est toujours tangente.",
            },
            {
              text: "Toujours dirigé vers le centre de la trajectoire",
              isCorrect: false,
              feedback:
                "❌ Seule la composante normale de l'accélération pointe vers le centre (dans un mouvement circulaire). La vitesse est tangente.",
            },
            {
              text: "Toujours vertical, dirigé vers le bas",
              isCorrect: false,
              feedback:
                "❌ Non, le vecteur vitesse dépend du mouvement. Seul le poids (force) est toujours vertical vers le bas.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Lesson 1.2 — Mouvements rectilignes
    // ─────────────────────────────────────────────────────────────────────────
    {
      title: "Mouvements rectilignes uniforme et uniformément varié",
      slug: "mouvements-rectilignes",
      estimatedMinutes: 30,
      isFreePreview: true,
      blocks: [
        {
          type: "text",
          content: `# Mouvements rectilignes

Un mouvement est **rectiligne** si la trajectoire est une droite. On distingue deux cas particuliers fondamentaux.

## 1. Mouvement rectiligne uniforme (MRU)

Le mobile se déplace en ligne droite à **vitesse constante**.

### Équations horaires

$$x(t) = x_0 + v \\cdot t$$

$$v(t) = v = \\text{constante}$$

$$a(t) = 0$$

### Schéma

<svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg" style="background:#fff;max-width:100%;border-radius:8px;border:1px solid #e5e7eb">
  <line x1="30" y1="60" x2="470" y2="60" stroke="#666" stroke-width="1"/>
  <polygon points="470 60, 462 56, 462 64" fill="#666"/>
  <text x="475" y="64" font-size="11" fill="#666">x</text>
  <!-- marks at equal intervals -->
  <g stroke="#1B2A4E" stroke-width="1.5">
    <line x1="80" y1="55" x2="80" y2="65"/>
    <line x1="160" y1="55" x2="160" y2="65"/>
    <line x1="240" y1="55" x2="240" y2="65"/>
    <line x1="320" y1="55" x2="320" y2="65"/>
    <line x1="400" y1="55" x2="400" y2="65"/>
  </g>
  <text x="80" y="80" font-size="10" fill="#666">t=0</text>
  <text x="160" y="80" font-size="10" fill="#666">t=1s</text>
  <text x="240" y="80" font-size="10" fill="#666">t=2s</text>
  <text x="320" y="80" font-size="10" fill="#666">t=3s</text>
  <text x="400" y="80" font-size="10" fill="#666">t=4s</text>
  <!-- positions à intervalles réguliers = MRU -->
  <g fill="#2DD4BF">
    <circle cx="80" cy="60" r="5"/>
    <circle cx="160" cy="60" r="5"/>
    <circle cx="240" cy="60" r="5"/>
    <circle cx="320" cy="60" r="5"/>
    <circle cx="400" cy="60" r="5"/>
  </g>
  <text x="220" y="30" font-size="12" fill="#1B2A4E" font-weight="bold">Positions à intervalles de temps égaux → espacement constant</text>
</svg>

> **Caractéristique** : les positions successives à intervalles de temps égaux sont **équidistantes**.

## 2. Mouvement rectiligne uniformément varié (MRUV)

Le mobile se déplace en ligne droite avec une **accélération constante**.

### Équations horaires

$$x(t) = x_0 + v_0 t + \\frac{1}{2} a t^2$$

$$v(t) = v_0 + a t$$

$$a(t) = a = \\text{constante}$$

### Relation indépendante du temps

Très utile quand on ne connaît pas $t$ :

$$v^2 - v_0^2 = 2a(x - x_0)$$

### Schéma

<svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg" style="background:#fff;max-width:100%;border-radius:8px;border:1px solid #e5e7eb">
  <line x1="30" y1="60" x2="470" y2="60" stroke="#666" stroke-width="1"/>
  <polygon points="470 60, 462 56, 462 64" fill="#666"/>
  <text x="475" y="64" font-size="11" fill="#666">x</text>
  <!-- marks at increasing intervals (MRUV accéléré) -->
  <g stroke="#1B2A4E" stroke-width="1.5">
    <line x1="60" y1="55" x2="60" y2="65"/>
    <line x1="100" y1="55" x2="100" y2="65"/>
    <line x1="170" y1="55" x2="170" y2="65"/>
    <line x1="270" y1="55" x2="270" y2="65"/>
    <line x1="400" y1="55" x2="400" y2="65"/>
  </g>
  <text x="60" y="80" font-size="10" fill="#666">t=0</text>
  <text x="100" y="80" font-size="10" fill="#666">t=1s</text>
  <text x="170" y="80" font-size="10" fill="#666">t=2s</text>
  <text x="270" y="80" font-size="10" fill="#666">t=3s</text>
  <text x="400" y="80" font-size="10" fill="#666">t=4s</text>
  <g fill="#C9A227">
    <circle cx="60" cy="60" r="5"/>
    <circle cx="100" cy="60" r="5"/>
    <circle cx="170" cy="60" r="5"/>
    <circle cx="270" cy="60" r="5"/>
    <circle cx="400" cy="60" r="5"/>
  </g>
  <text x="220" y="30" font-size="12" fill="#1B2A4E" font-weight="bold">Positions à intervalles égaux → espacement croissant (accélération)</text>
</svg>

> **Caractéristique** : les espacements entre positions successives **augmentent** (si $a > 0$) ou **diminuent** (si $a < 0$).`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Freinage d'une voiture

**Énoncé** : Une voiture roule à $v_0 = 25$ m/s ($90$ km/h). Le conducteur freine avec une décélération constante de $a = -5$ m/s². Calculer :
1. La distance de freinage
2. Le temps de freinage

### Étape 1 — Identifier les grandeurs

- $v_0 = 25$ m/s
- $a = -5$ m/s²
- $v_{final} = 0$ (la voiture s'arrête)
- $x_0 = 0$

### Étape 2 — Distance de freinage

Utilisons la relation indépendante du temps :

$$v^2 - v_0^2 = 2a \\cdot \\Delta x$$

$$0 - 25^2 = 2 \\times (-5) \\times \\Delta x$$

$$-625 = -10 \\cdot \\Delta x$$

$$\\boxed{\\Delta x = 62{,}5 \\text{ m}}$$

### Étape 3 — Temps de freinage

$$v = v_0 + at \\Rightarrow 0 = 25 - 5t \\Rightarrow t = 5 \\text{ s}$$

### Étape 4 — Vérification

On vérifie avec $x = v_0 t + \\frac{1}{2} a t^2$ :

$$x = 25 \\times 5 + \\frac{1}{2}(-5)(25) = 125 - 62{,}5 = 62{,}5 \\text{ m} \\checkmark$$

> ✅ La voiture met **5 secondes** et parcourt **62,5 m** pour s'arrêter. C'est pourquoi la distance de sécurité recommandée est d'environ 60 m à 90 km/h.`,
        },
        {
          type: "mcq",
          title: "Identifier un mouvement",
          question:
            "On photographie un mobile à intervalles de temps égaux ($\\Delta t = 0{,}5$ s). On observe les positions suivantes (en m) : 0, 1, 4, 9, 16. Quel est le type de mouvement ?",
          explanation:
            "Les positions suivent x = t² (avec t = n·Δt). Donc x(t) = (n·0.5)² → en fait x ∝ t², ce qui est caractéristique d'un MRUV partant du repos avec x = ½·a·t². Ici, on a x = t², donc ½·a = 1, a = 2 m/s².",
          choices: [
            {
              text: "Mouvement rectiligne uniformément varié (MRUV)",
              isCorrect: true,
              feedback:
                "✅ Exact ! Les positions croissent comme les carrés des temps (1, 4, 9, 16 = 1², 2², 3², 4²). C'est la signature d'un MRUV avec x = ½at².",
            },
            {
              text: "Mouvement rectiligne uniforme (MRU)",
              isCorrect: false,
              feedback:
                "❌ En MRU, les positions seraient équidistantes (0, 1, 2, 3, 4...), pas en progression quadratique.",
            },
            {
              text: "Mouvement circulaire",
              isCorrect: false,
              feedback:
                "❌ Rien n'indique un cercle. Les positions 0, 1, 4, 9, 16 sont alignées sur un axe.",
            },
            {
              text: "Mouvement accéléré non uniformément",
              isCorrect: false,
              feedback:
                "❌ L'accélération est ici constante (x ∝ t²). Un mouvement non uniformément accéléré aurait une croissance différente (exponentielle, par exemple).",
            },
          ],
        },
        {
          type: "lab",
          title: "Lab interactif : MRUV avec sliders",
          instructions:
            "Ajuste la vitesse initiale v₀ et l'accélération a pour observer l'effet sur la position, la vitesse et l'accélération au cours du temps. Réponds ensuite aux défis.",
          simulationCode: `import matplotlib.pyplot as plt
import numpy as np

# Parameters injected by the lab framework:
# v0 (m/s), a (m/s^2)

t = np.linspace(0, 5, 100)

x = v0 * t + 0.5 * a * t**2
v = v0 + a * t
acc = np.full_like(t, a)

fig, axes = plt.subplots(1, 3, figsize=(12, 4))

axes[0].plot(t, x, color="#1B2A4E", linewidth=2)
axes[0].set_title("Position x(t)")
axes[0].set_xlabel("t (s)")
axes[0].set_ylabel("x (m)")
axes[0].grid(True, alpha=0.3)

axes[1].plot(t, v, color="#2DD4BF", linewidth=2)
axes[1].set_title("Vitesse v(t)")
axes[1].set_xlabel("t (s)")
axes[1].set_ylabel("v (m/s)")
axes[1].grid(True, alpha=0.3)

axes[2].plot(t, acc, color="#C9A227", linewidth=2)
axes[2].set_title("Accélération a(t)")
axes[2].set_xlabel("t (s)")
axes[2].set_ylabel("a (m/s²)")
axes[2].grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig("output.png", dpi=100, bbox_inches="tight")
plt.show()
`,
          sliderConfig: [
            {
              name: "v0",
              label: "Vitesse initiale v₀",
              min: 0,
              max: 30,
              step: 1,
              default: 10,
              unit: "m/s",
            },
            {
              name: "a",
              label: "Accélération a",
              min: -10,
              max: 10,
              step: 0.5,
              default: 2,
              unit: "m/s²",
            },
          ],
          challenges: [
            {
              id: "q1",
              question:
                "Avec v₀ = 10 m/s et a = 2 m/s², quelle est la position à t = 5 s ?",
              expectedValue: 75,
              tolerance: 1,
              unit: "m",
              hint: "Utilise x(t) = v₀t + ½at² avec les valeurs données.",
              explanation:
                "x(5) = 10 × 5 + 0.5 × 2 × 25 = 50 + 25 = 75 m.",
            },
            {
              id: "q2",
              question:
                "Avec v₀ = 15 m/s et a = -3 m/s², au bout de combien de temps la vitesse s'annule-t-elle ?",
              expectedValue: 5,
              tolerance: 0.5,
              unit: "s",
              hint: "Résous v(t) = 0, soit v₀ + at = 0.",
              explanation:
                "v(t) = 0 → t = -v₀/a = -15/(-3) = 5 s.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Lesson 1.3 — Mouvement plan (projectile)
    // ─────────────────────────────────────────────────────────────────────────
    {
      title: "Mouvement plan : tir projectile",
      slug: "mouvement-projectile",
      estimatedMinutes: 35,
      isFreePreview: false,
      blocks: [
        {
          type: "text",
          content: `# Mouvement d'un projectile

Le mouvement d'un projectile lancé avec une vitesse initiale $\\vec{v}_0$ dans le champ de pesanteur $\\vec{g}$ est l'archétype du mouvement plan.

## 1. Hypothèses

- Le projectile est **ponctuel**
- On néglige les **frottements de l'air**
- Le champ de pesanteur est **uniforme** : $\\vec{g} = -g\\,\\vec{j}$ avec $g \\approx 9{,}81$ m/s²

## 2. Équations horaires

Le projectile est lancé depuis l'origine avec $\\vec{v}_0$ faisant un angle $\\alpha$ avec l'horizontale :

$$\\vec{v}_0 = v_0 \\cos\\alpha\\,\\vec{i} + v_0 \\sin\\alpha\\,\\vec{j}$$

### Appliquer la 2ème loi de Newton

$$m\\vec{a} = m\\vec{g} \\Rightarrow \\vec{a} = \\vec{g}$$

Soit, en projections :

$$\\begin{cases} a_x = 0 \\\\ a_y = -g \\end{cases}$$

### Par intégration (avec $x_0 = y_0 = 0$) :

$$\\begin{cases} v_x(t) = v_0 \\cos\\alpha \\\\ v_y(t) = v_0 \\sin\\alpha - gt \\end{cases}$$

$$\\boxed{\\begin{cases} x(t) = v_0 \\cos\\alpha \\cdot t \\\\ y(t) = v_0 \\sin\\alpha \\cdot t - \\frac{1}{2}g t^2 \\end{cases}}$$

## 3. Équation de la trajectoire

En éliminant $t$ entre $x$ et $y$ :

$$t = \\frac{x}{v_0 \\cos\\alpha}$$

$$\\boxed{y(x) = -\\frac{g}{2 v_0^2 \\cos^2\\alpha} x^2 + (\\tan\\alpha)\\, x}$$

C'est une **parabole**.

## 4. Portée et flèche

### Portée (distance horizontale maximale)

Le projectile retombe sur le sol ($y = 0$) en :

$$\\boxed{x_{max} = \\frac{v_0^2 \\sin(2\\alpha)}{g}}$$

> La portée est **maximale** pour $\\alpha = 45°$ : $x_{max} = \\frac{v_0^2}{g}$

### Flèche (hauteur maximale)

Au sommet, $v_y = 0$ :

$$t_{sommet} = \\frac{v_0 \\sin\\alpha}{g}$$

$$\\boxed{h_{max} = \\frac{v_0^2 \\sin^2\\alpha}{2g}}$$

## Schéma : tir à 45°

<svg viewBox="0 0 500 250" xmlns="http://www.w3.org/2000/svg" style="background:#fff;max-width:100%;border-radius:8px;border:1px solid #e5e7eb">
  <!-- ground -->
  <line x1="20" y1="220" x2="480" y2="220" stroke="#1B2A4E" stroke-width="2"/>
  <!-- axis -->
  <line x1="60" y1="220" x2="60" y2="30" stroke="#666" stroke-width="1"/>
  <text x="40" y="25" font-size="11" fill="#666">y</text>
  <text x="475" y="235" font-size="11" fill="#666">x</text>
  <!-- trajectory parabola -->
  <path d="M 60 220 Q 250 30 440 220" stroke="#2DD4BF" stroke-width="2.5" fill="none"/>
  <!-- v0 arrow at 45 degrees -->
  <line x1="60" y1="220" x2="115" y2="165" stroke="#1B2A4E" stroke-width="2" marker-end="url(#arrowNavy)"/>
  <text x="120" y="160" font-size="13" fill="#1B2A4E" font-weight="bold">v₀ (α=45°)</text>
  <!-- top point -->
  <circle cx="250" cy="50" r="4" fill="#C9A227"/>
  <text x="258" y="48" font-size="11" fill="#C9A227" font-weight="bold">h_max</text>
  <line x1="250" y1="50" x2="250" y2="220" stroke="#C9A227" stroke-width="1" stroke-dasharray="3 3"/>
  <!-- range -->
  <line x1="60" y1="235" x2="440" y2="235" stroke="#2DD4BF" stroke-width="2"/>
  <line x1="60" y1="230" x2="60" y2="240" stroke="#2DD4BF" stroke-width="2"/>
  <line x1="440" y1="230" x2="440" y2="240" stroke="#2DD4BF" stroke-width="2"/>
  <text x="240" y="248" font-size="11" fill="#2DD4BF" font-weight="bold">x_max</text>
  <defs>
    <marker id="arrowNavy" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#1B2A4E"/>
    </marker>
  </defs>
  <text x="250" y="245" font-size="10" fill="#666" text-anchor="middle">Trajectoire parabolique — portée maximale à α = 45°</text>
</svg>`,
        },
        {
          type: "sandbox",
          title: "Visualiser plusieurs angles de tir",
          code: `import matplotlib.pyplot as plt
import numpy as np

g = 9.81
v0 = 20  # m/s

fig, ax = plt.subplots(figsize=(9, 6))

# Tester plusieurs angles
angles = [15, 30, 45, 60, 75]
colors = ["#1B2A4E", "#2DD4BF", "#C9A227", "#8B5CF6", "#EF4444"]

for angle_deg, color in zip(angles, colors):
    alpha = np.radians(angle_deg)
    
    # Temps de vol total
    t_flight = 2 * v0 * np.sin(alpha) / g
    t = np.linspace(0, t_flight, 200)
    
    x = v0 * np.cos(alpha) * t
    y = v0 * np.sin(alpha) * t - 0.5 * g * t**2
    
    ax.plot(x, y, color=color, linewidth=2, label=f"α = {angle_deg}°")

ax.set_xlabel("Distance x (m)")
ax.set_ylabel("Hauteur y (m)")
ax.set_title(f"Trajectoires de projectiles (v₀ = {v0} m/s)")
ax.legend(loc="upper right")
ax.grid(True, alpha=0.3)
ax.axhline(y=0, color="#666", linewidth=1)
ax.set_ylim(bottom=0)

plt.tight_layout()
plt.savefig("output.png", dpi=100, bbox_inches="tight")
plt.show()
`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Football

**Énoncé** : Un joueur frappe un ballon avec une vitesse $v_0 = 18$ m/s à un angle $\\alpha = 40°$. On néglige la résistance de l'air. Calculer :
1. La portée du tir
2. La hauteur maximale atteinte
3. Le temps de vol

### Étape 1 — Portée

$$x_{max} = \\frac{v_0^2 \\sin(2\\alpha)}{g} = \\frac{18^2 \\times \\sin(80°)}{9{,}81}$$

$$x_{max} = \\frac{324 \\times 0{,}985}{9{,}81} = \\frac{319{,}1}{9{,}81} \\approx 32{,}5 \\text{ m}$$

### Étape 2 — Hauteur maximale

$$h_{max} = \\frac{v_0^2 \\sin^2\\alpha}{2g} = \\frac{324 \\times \\sin^2(40°)}{2 \\times 9{,}81}$$

$$h_{max} = \\frac{324 \\times 0{,}413}{19{,}62} \\approx 6{,}8 \\text{ m}$$

### Étape 3 — Temps de vol

$$t_{vol} = \\frac{2 v_0 \\sin\\alpha}{g} = \\frac{2 \\times 18 \\times 0{,}643}{9{,}81} \\approx 2{,}36 \\text{ s}$$

### Conclusion

Le ballon parcourt **32,5 m** en ligne droite, monte à **6,8 m** de haut, et reste en l'air pendant **2,36 s**. C'est typique d'un tir de milieu de terrain en football.

> 💡 **Note pédagogique** : Si on répétait le tir avec $\\alpha = 50°$ (au lieu de 40°), la portée serait identique (car $\\sin(100°) = \\sin(80°)$) ! C'est la **symétrie des tirs complémentaires**.`,
        },
        {
          type: "mcq",
          title: "Angle de portée maximale",
          question:
            "Pour une vitesse initiale $v_0$ donnée, à quel angle α la portée d'un projectile est-elle maximale ?",
          explanation:
            "La portée x_max = v₀²·sin(2α)/g est maximale quand sin(2α) = 1, donc 2α = 90°, soit α = 45°.",
          choices: [
            {
              text: "α = 45°",
              isCorrect: true,
              feedback:
                "✅ Exact ! sin(2·45°) = sin(90°) = 1, portée maximale égale à v₀²/g.",
            },
            {
              text: "α = 30°",
              isCorrect: false,
              feedback:
                "❌ Portée réduite : sin(60°) ≈ 0,866, soit 86,6% de la portée maximale.",
            },
            {
              text: "α = 60°",
              isCorrect: false,
              feedback:
                "❌ Même portée qu'à 30° ! Car sin(120°) = sin(60°). C'est la symétrie des angles complémentaires.",
            },
            {
              text: "α = 90°",
              isCorrect: false,
              feedback:
                "❌ À 90° (tir vertical), la portée est nulle (le projectile retombe au même endroit).",
            },
          ],
        },
        {
          type: "mcq",
          title: "Composantes de la vitesse",
          question:
            "Au sommet de sa trajectoire, que vaut la vitesse d'un projectile lancé avec un angle α ≠ 90° ?",
          explanation:
            "Au sommet, v_y = 0 (la vitesse verticale s'annule). Mais v_x = v₀·cos(α) reste constante (car a_x = 0). La vitesse totale est donc horizontale.",
          choices: [
            {
              text: "v = v₀·cos(α) (horizontale)",
              isCorrect: true,
              feedback:
                "✅ Exact ! Au sommet, v_y = 0 mais v_x reste constante car il n'y a pas d'accélération horizontale.",
            },
            {
              text: "v = 0",
              isCorrect: false,
              feedback:
                "❌ Ce serait vrai pour un tir vertical (α = 90°), mais pas pour un tir oblique. La composante horizontale reste non nulle.",
            },
            {
              text: "v = v₀ (comme au départ)",
              isCorrect: false,
              feedback:
                "❌ La vitesse totale n'est plus v₀ car v_y est devenu 0. Il ne reste que v_x = v₀·cos(α) < v₀.",
            },
            {
              text: "v = v₀·sin(α) (verticale)",
              isCorrect: false,
              feedback:
                "❌ C'est l'inverse ! v_y = 0 au sommet, et v_x = v₀·cos(α) reste.",
            },
          ],
        },
        {
          type: "lab",
          title: "Lab : Optimiser un angle de tir",
          instructions:
            "Ajuste v₀ et α pour atteindre une portée cible de 50 m. Tu peux aussi observer la hauteur maximale et le temps de vol.",
          simulationCode: `import matplotlib.pyplot as plt
import numpy as np

g = 9.81

t_flight = 2 * v0 * np.sin(np.radians(alpha)) / g
t = np.linspace(0, t_flight, 200)

x = v0 * np.cos(np.radians(alpha)) * t
y = v0 * np.sin(np.radians(alpha)) * t - 0.5 * g * t**2

fig, ax = plt.subplots(figsize=(9, 6))
ax.plot(x, y, color="#2DD4BF", linewidth=2.5)

# Marquer la portée et la flèche
range_max = v0**2 * np.sin(2*np.radians(alpha)) / g
height_max = v0**2 * np.sin(np.radians(alpha))**2 / (2*g)

ax.plot([range_max], [0], 'o', color="#1B2A4E", markersize=10)
ax.plot([range_max/2], [height_max], 'o', color="#C9A227", markersize=10)

ax.annotate(f"Portée = {range_max:.1f} m", 
            xy=(range_max, 0), xytext=(range_max-30, 1),
            fontsize=10, color="#1B2A4E")
ax.annotate(f"Flèche = {height_max:.1f} m", 
            xy=(range_max/2, height_max), xytext=(range_max/2, height_max+1),
            fontsize=10, color="#C9A227")

ax.set_xlabel("Distance x (m)")
ax.set_ylabel("Hauteur y (m)")
ax.set_title(f"Tir de projectile — v₀ = {v0} m/s, α = {alpha}°\\nTemps de vol = {t_flight:.2f} s")
ax.grid(True, alpha=0.3)
ax.axhline(y=0, color="#666", linewidth=1)
ax.set_ylim(bottom=0)

plt.tight_layout()
plt.savefig("output.png", dpi=100, bbox_inches="tight")
plt.show()
`,
          sliderConfig: [
            {
              name: "v0",
              label: "Vitesse initiale v₀",
              min: 5,
              max: 40,
              step: 1,
              default: 20,
              unit: "m/s",
            },
            {
              name: "alpha",
              label: "Angle α",
              min: 5,
              max: 85,
              step: 1,
              default: 45,
              unit: "°",
            },
          ],
          challenges: [
            {
              id: "range",
              question:
                "Avec v₀ = 25 m/s et α = 45°, quelle est la portée ?",
              expectedValue: 63.7,
              tolerance: 1,
              unit: "m",
              hint: "x_max = v₀²·sin(2α)/g avec sin(90°) = 1.",
              explanation:
                "x_max = 25² × 1 / 9.81 ≈ 625/9.81 ≈ 63.7 m.",
            },
            {
              id: "height",
              question:
                "Avec v₀ = 25 m/s et α = 30°, quelle est la hauteur maximale ?",
              expectedValue: 7.96,
              tolerance: 0.5,
              unit: "m",
              hint: "h_max = v₀²·sin²(α)/(2g).",
              explanation:
                "h_max = 625 × sin²(30°) / (2 × 9.81) = 625 × 0.25 / 19.62 ≈ 7.96 m.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Lesson 1.4 — Mouvement circulaire
    // ─────────────────────────────────────────────────────────────────────────
    {
      title: "Mouvement circulaire uniforme",
      slug: "mouvement-circulaire",
      estimatedMinutes: 30,
      isFreePreview: false,
      blocks: [
        {
          type: "text",
          content: `# Mouvement circulaire uniforme (MCU)

Un point est en **mouvement circulaire uniforme** s'il décrit un cercle à **vitesse constante** en norme (mais sa direction change continuellement).

## 1. Grandeurs caractéristiques

### Vitesse angulaire

$$\\omega = \\frac{d\\theta}{dt} \\quad \\text{(rad/s)}$$

Pour un tour complet en période $T$ :

$$\\omega = \\frac{2\\pi}{T} = 2\\pi f$$

où $f = 1/T$ est la fréquence (en Hz).

### Vitesse linéaire

$$v = R \\cdot \\omega$$

où $R$ est le rayon du cercle.

## 2. Vecteur accélération

En coordonnées polaires (base de Frenet), l'accélération se décompose en :

$$\\vec{a} = \\vec{a}_t + \\vec{a}_n$$

- **Accélération tangentielle** : $a_t = \\frac{dv}{dt}$
- **Accélération normale (centripète)** : $a_n = \\frac{v^2}{R} = R\\omega^2$

En MCU, $v$ est constante donc $a_t = 0$. Il ne reste que l'accélération centripète :

$$\\boxed{\\vec{a} = -\\frac{v^2}{R}\\,\\vec{n} = R\\omega^2\\,(-\\vec{n})}$$

> ⚠️ Le vecteur accélération est **dirigé vers le centre** du cercle, même si la vitesse est constante en norme. C'est ce qui fait tourner le mobile.

## Schéma : base de Frenet

<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" style="background:#fff;max-width:100%;border-radius:8px;border:1px solid #e5e7eb">
  <!-- circle -->
  <circle cx="200" cy="125" r="80" stroke="#666" stroke-width="1" fill="none" stroke-dasharray="3 3"/>
  <!-- center -->
  <circle cx="200" cy="125" r="3" fill="#666"/>
  <text x="208" y="120" font-size="11" fill="#666">O (centre)</text>
  <!-- mobile -->
  <circle cx="280" cy="125" r="6" fill="#1B2A4E"/>
  <text x="288" y="120" font-size="13" fill="#1B2A4E" font-weight="bold">M</text>
  <!-- tangent vector T -->
  <line x1="280" y1="125" x2="280" y2="65" stroke="#2DD4BF" stroke-width="2.5" marker-end="url(#arrowTeal2)"/>
  <text x="285" y="60" font-size="14" fill="#2DD4BF" font-weight="bold">T</text>
  <text x="298" y="85" font-size="10" fill="#2DD4BF">tangent</text>
  <!-- normal vector N (toward center) -->
  <line x1="280" y1="125" x2="220" y2="125" stroke="#C9A227" stroke-width="2.5" marker-end="url(#arrowGold2)"/>
  <text x="225" y="135" font-size="14" fill="#C9A227" font-weight="bold">N</text>
  <text x="225" y="148" font-size="10" fill="#C9A227">normal (centripète)</text>
  <!-- velocity vector (along T) -->
  <line x1="280" y1="125" x2="280" y2="95" stroke="#2DD4BF" stroke-width="3" marker-end="url(#arrowTeal2)"/>
  <text x="290" y="105" font-size="13" fill="#2DD4BF" font-weight="bold">v</text>
  <!-- acceleration vector (along N) -->
  <line x1="280" y1="125" x2="240" y2="125" stroke="#C9A227" stroke-width="3" marker-end="url(#arrowGold2)"/>
  <text x="248" y="120" font-size="13" fill="#C9A227" font-weight="bold">a</text>
  <defs>
    <marker id="arrowTeal2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#2DD4BF"/>
    </marker>
    <marker id="arrowGold2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#C9A227"/>
    </marker>
  </defs>
  <text x="200" y="240" font-size="11" fill="#666" text-anchor="middle">Base de Frenet : T tangent au cercle, N vers le centre. En MCU, v ∥ T et a ∥ N.</text>
</svg>

## 3. Période et fréquence

$$T = \\frac{2\\pi}{\\omega} \\quad ; \\quad f = \\frac{1}{T}$$

**Exemples typiques** :
- Terre autour du Soleil : $T = 365{,}25$ jours, $f \\approx 3{,}17 \\times 10^{-8}$ Hz
- Aiguille des minutes d'une horloge : $T = 1$ heure, $f = 1/3600$ Hz
- Ventilateur à 1500 tr/min : $T = 0{,}04$ s, $f = 25$ Hz`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Satellite en orbite basse

**Énoncé** : L'ISS orbite à une altitude $h = 400$ km au-dessus de la Terre. Le rayon terrestre est $R_T = 6371$ km. Calculer :
1. La vitesse de l'ISS
2. Sa période de révolution

Donnée : $g_0 = 9{,}81$ m/s² à la surface, et $g(h) = g_0 (R_T/(R_T+h))^2$.

### Étape 1 — Vitesse orbitale

La force gravitationnelle fournit l'accélération centripète :

$$\\frac{v^2}{R_T + h} = g(h)$$

$$g(h) = 9{,}81 \\times \\left(\\frac{6371}{6771}\\right)^2 \\approx 8{,}68 \\text{ m/s²}$$

$$v = \\sqrt{g(h) \\cdot (R_T + h)} = \\sqrt{8{,}68 \\times 6{,}771 \\times 10^6}$$

$$\\boxed{v \\approx 7668 \\text{ m/s} \\approx 27 600 \\text{ km/h}}$$

### Étape 2 — Période

$$T = \\frac{2\\pi (R_T + h)}{v} = \\frac{2\\pi \\times 6{,}771 \\times 10^6}{7668}$$

$$\\boxed{T \\approx 5555 \\text{ s} \\approx 92{,}6 \\text{ min}}$$

> ✅ C'est pour ça que l'ISS fait environ **16 tours de la Terre par jour** ! Les astronautes voient 16 lever et coucher de soleil chaque 24h.`,
        },
        {
          type: "mcq",
          title: "Accélération en MCU",
          question:
            "Dans un mouvement circulaire uniforme, le vecteur accélération est...",
          explanation:
            "En MCU, la norme de la vitesse est constante donc a_t = 0. Mais sa direction change, ce qui implique une accélération normale a_n = v²/R dirigée vers le centre.",
          choices: [
            {
              text: "Dirigé vers le centre du cercle, de norme v²/R",
              isCorrect: true,
              feedback:
                "✅ Exact ! C'est l'accélération centripète, qui fait tourner le mobile sans changer sa vitesse.",
            },
            {
              text: "Nul (car la vitesse est constante)",
              isCorrect: false,
              feedback:
                "❌ Piège classique ! La norme est constante mais pas le vecteur vitesse. La direction change → accélération non nulle.",
            },
            {
              text: "Tangent au cercle, dans le sens du mouvement",
              isCorrect: false,
              feedback:
                "❌ Ce serait l'accélération tangentielle, qui est nulle en MCU (v = constante).",
            },
            {
              text: "Dirigé vers l'extérieur du cercle (force centrifuge)",
              isCorrect: false,
              feedback:
                "❌ La « force centrifuge » est une force fictive ressentie dans le référentiel tournant, pas dans le référentiel fixe. L'accélération réelle est centripète.",
            },
          ],
        },
        {
          type: "mcq",
          title: "Lien vitesse linéaire / angulaire",
          question:
            "Un point décrit un cercle de rayon R = 0,5 m à la vitesse angulaire ω = 4π rad/s. Quelle est sa vitesse linéaire v ?",
          explanation:
            "v = R·ω = 0,5 × 4π = 2π ≈ 6,28 m/s. La période est T = 2π/ω = 0,5 s.",
          choices: [
            {
              text: "v = 2π ≈ 6,28 m/s",
              isCorrect: true,
              feedback:
                "✅ Parfait ! v = R·ω = 0,5 × 4π = 2π m/s. Et la période est T = 2π/ω = 0,5 s.",
            },
            {
              text: "v = 4π ≈ 12,57 m/s",
              isCorrect: false,
              feedback:
                "❌ Tu as oublié le rayon. v = R·ω, pas juste ω. Avec R = 0,5 m, v = 0,5 × 4π = 2π.",
            },
            {
              text: "v = 2 m/s",
              isCorrect: false,
              feedback:
                "❌ Tu as oublié le π. ω = 4π rad/s, donc v = 0,5 × 4π = 2π ≈ 6,28 m/s.",
            },
            {
              text: "v = 0,5 m/s",
              isCorrect: false,
              feedback:
                "❌ Tu as confondu R et v. La formule est v = R·ω, avec R = 0,5 et ω = 4π.",
            },
          ],
        },
      ],
    },
  ],
};
