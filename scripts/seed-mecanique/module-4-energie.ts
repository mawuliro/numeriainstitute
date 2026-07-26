import type { ModuleInput } from "./types";

export const moduleEnergie: ModuleInput = {
  title: "Travail et énergie",
  description:
    "Travail d'une force, énergie cinétique, énergie potentielle, et conservation de l'énergie mécanique.",
  lessons: [
    // 4.1 Travail d'une force
    {
      title: "Travail d'une force",
      slug: "travail-force",
      estimatedMinutes: 30,
      isFreePreview: false,
      blocks: [
        {
          type: "text",
          content: `# Travail d'une force

## 1. Définition

Le **travail** d'une force $\\vec{F}$ sur un déplacement $\\vec{AB}$ mesure l'énergie transférée par cette force :

$$\\boxed{W_{AB}(\\vec{F}) = \\vec{F} \\cdot \\vec{AB} = F \\cdot AB \\cdot \\cos\\alpha}$$

où $\\alpha$ est l'angle entre $\\vec{F}$ et $\\vec{AB}$.

## 2. Unités et signe

- **Unité** : joule (J) — $1 \\text{ J} = 1 \\text{ N} \\cdot \\text{m}$
- **Travail moteur** : $W > 0$ ($\\alpha < 90°$, force « pousse » dans le sens du mouvement)
- **Travail nul** : $W = 0$ ($\\alpha = 90°$, force perpendiculaire)
- **Travail résistant** : $W < 0$ ($\\alpha > 90°$, force s'oppose au mouvement)

## 3. Cas particuliers importants

### Poids (force constante verticale)

Pour un déplacement de $A$ (altitude $z_A$) à $B$ (altitude $z_B$) :

$$\\boxed{W_{AB}(\\vec{P}) = mg(z_A - z_B) = -mg \\Delta z}$$

> Si $B$ est plus haut que $A$ ($z_B > z_A$), le travail du poids est **négatif** (résistant).

### Force de frottement

Toujours opposée au déplacement : $\\alpha = 180°$, $\\cos\\alpha = -1$ :

$$W(\\vec{f}) = -f \\cdot AB$$

> Le travail des frottements est **toujours négatif** (résistant).

### Tension d'un fil idéal

La tension est toujours perpendiculaire au déplacement (cas d'un mouvement circulaire), donc :

$$W(\\vec{T}) = 0$$

## 4. Schéma : angle entre F et déplacement

<svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg" style="background:#fff;max-width:100%;border-radius:8px;border:1px solid #e5e7eb">
  <!-- Déplacement AB -->
  <line x1="100" y1="150" x2="380" y2="100" stroke="#1B2A4E" stroke-width="3" marker-end="url(#arrW1)"/>
  <circle cx="100" cy="150" r="5" fill="#1B2A4E"/>
  <text x="80" y="160" font-size="14" fill="#1B2A4E" font-weight="bold">A</text>
  <circle cx="380" cy="100" r="5" fill="#1B2A4E"/>
  <text x="390" y="95" font-size="14" fill="#1B2A4E" font-weight="bold">B</text>
  
  <!-- Force F (different angle) -->
  <line x1="100" y1="150" x2="220" y2="50" stroke="#EF4444" stroke-width="2.5" marker-end="url(#arrW2)"/>
  <text x="180" y="40" font-size="14" fill="#EF4444" font-weight="bold">F</text>
  
  <!-- Angle alpha -->
  <path d="M 130 142 A 30 30 0 0 0 122 130" stroke="#C9A227" stroke-width="2" fill="none"/>
  <text x="135" y="125" font-size="13" fill="#C9A227" font-weight="bold">α</text>
  
  <defs>
    <marker id="arrW1" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#1B2A4E"/>
    </marker>
    <marker id="arrW2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#EF4444"/>
    </marker>
  </defs>
  
  <text x="250" y="190" font-size="13" fill="#1B2A4E" text-anchor="middle" font-weight="bold">W = F · AB · cos(α)</text>
</svg>

## 5. Travail d'une force variable

Si la force varie le long du trajet, on découpe en petits déplacements $d\\vec{l}$ :

$$W_{AB} = \\int_A^B \\vec{F} \\cdot d\\vec{l}$$

### Force conservative

Une force est **conservative** si son travail ne dépend que des positions $A$ et $B$ (pas du chemin) :

$$W_{AB}(\\vec{F}) = E_p(A) - E_p(B)$$

Elle dérive d'une énergie potentielle $E_p$.

| Force | Conservative ? |
|---|---|
| Poids | ✅ Oui |
| Force électrique | ✅ Oui |
| Force de rappel élastique | ✅ Oui |
| Frottements (solide) | ❌ Non |
| Frottements fluides | ❌ Non |`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Travail du poids sur un toboggan

**Énoncé** : Un enfant de masse $m = 30$ kg descend un toboggan. Le point de départ $A$ est à 3 m au-dessus du point d'arrivée $B$. Le trajet parcouru vaut 5 m. Calculer le travail du poids.

### Étape 1 — Identifier les grandeurs

- $z_A - z_B = 3$ m (différence d'altitude)
- $m = 30$ kg
- $g = 9{,}81$ m/s²

### Étape 2 — Calculer le travail du poids

La formule du poids ne dépend pas du chemin :

$$W_{AB}(\\vec{P}) = mg(z_A - z_B) = 30 \\times 9{,}81 \\times 3$$

$$\\boxed{W_{AB}(\\vec{P}) \\approx 883 \\text{ J}}$$

### Étape 3 — Vérifier le signe

L'enfant descend ($z_A > z_B$), donc $z_A - z_B > 0$, et $W > 0$ : **travail moteur**. ✅

### Étape 4 — Le travail dépend-il du trajet ?

Non ! Que l'enfant descende en ligne droite ou en zigzag, le travail du poids est le même : $883$ J.

> ✅ Le poids est une force **conservative**. C'est l'avantage de cette notion : on peut calculer son travail sans connaître la trajectoire exacte.`,
        },
        {
          type: "mcq",
          title: "Signe du travail",
          question:
            "On monte une valise de 15 kg du rez-de-chaussée au 1er étage (3 m plus haut). Quel est le travail du poids ?",
          explanation:
            "W(P) = mg(zA - zB) = 15 × 9,81 × (0 - 3) = -441 J. Négatif car on monte (le poids résiste au mouvement).",
          choices: [
            {
              text: "−441 J (résistant)",
              isCorrect: true,
              feedback:
                "✅ Exact ! W = mg(zA - zB) = 15 × 9,81 × (-3) = -441 J. Négatif car la force (vers le bas) s'oppose au déplacement (vers le haut).",
            },
            {
              text: "+441 J (moteur)",
              isCorrect: false,
              feedback:
                "❌ Tu as oublié le signe. Quand on monte, zA < zB, donc zA - zB < 0 et W < 0 (travail résistant).",
            },
            {
              text: "0 J (force perpendiculaire)",
              isCorrect: false,
              feedback:
                "❌ Le poids est vertical, et le déplacement a une composante verticale (3 m vers le haut). Donc le travail n'est pas nul.",
            },
            {
              text: "147 J",
              isCorrect: false,
              feedback:
                "❌ Tu as oublié g. m × Δz = 15 × 3 = 45, mais W = m·g·Δz = 15 × 9,81 × (-3) = -441 J.",
            },
          ],
        },
        {
          type: "mcq",
          title: "Force conservative",
          question:
            "Lequel de ces énoncés est vrai pour une force conservative ?",
          explanation:
            "Une force conservative a un travail qui ne dépend que des positions initiale et finale, pas du chemin parcouru. Elle dérive d'une énergie potentielle.",
          choices: [
            {
              text: "Son travail ne dépend que des positions A et B, pas du chemin",
              isCorrect: true,
              feedback:
                "✅ Exact ! C'est la définition. Sur un trajet fermé (A→B→A), le travail est nul pour une force conservative.",
            },
            {
              text: "Son travail dépend du chemin parcouru",
              isCorrect: false,
              feedback:
                "❌ C'est la définition d'une force NON conservative (comme les frottements).",
            },
            {
              text: "Elle est toujours perpendiculaire au déplacement",
              isCorrect: false,
              feedback:
                "❌ C'est le cas de la tension d'un fil idéal (travail nul), mais ce n'est pas la définition d'une force conservative.",
            },
            {
              text: "Elle est toujours attractive",
              isCorrect: false,
              feedback:
                "❌ La nature attractive/répulsive n'a rien à voir avec le caractère conservatif. La force électrique est conservative qu'elle soit attractive ou répulsive.",
            },
          ],
        },
      ],
    },

    // 4.2 Énergie cinétique
    {
      title: "Énergie cinétique et théorème de l'énergie cinétique",
      slug: "energie-cinetique",
      estimatedMinutes: 30,
      isFreePreview: false,
      blocks: [
        {
          type: "text",
          content: `# Énergie cinétique

## 1. Définition

L'**énergie cinétique** d'un point matériel de masse $m$ animé d'une vitesse $v$ est :

$$\\boxed{E_c = \\frac{1}{2} m v^2}$$

- Unité : joule (J)
- Grandeur **scalaire** (un nombre, pas un vecteur)
- Toujours **positive** (c'est un carré de vitesse)

## 2. Théorème de l'énergie cinétique

> Dans un référentiel galiléen, la variation d'énergie cinétique d'un point matériel entre deux positions $A$ et $B$ est égale à la somme des travaux des forces appliquées :

$$\\boxed{\\Delta E_c = E_c(B) - E_c(A) = \\sum W_{AB}(\\vec{F}_{ext})}$$

## 3. Schéma : énergie cinétique en fonction de la vitesse

<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" style="background:#fff;max-width:100%;border-radius:8px;border:1px solid #e5e7eb">
  <!-- Axes -->
  <line x1="50" y1="220" x2="380" y2="220" stroke="#666" stroke-width="1.5"/>
  <line x1="50" y1="220" x2="50" y2="30" stroke="#666" stroke-width="1.5"/>
  <text x="385" y="230" font-size="11" fill="#666">v</text>
  <text x="30" y="25" font-size="11" fill="#666">Ec</text>
  
  <!-- Parabola Ec = ½mv² (m=2) -->
  <path d="M 50 220 Q 200 220 370 40" stroke="#2DD4BF" stroke-width="3" fill="none"/>
  
  <!-- Marks on curve -->
  <circle cx="100" cy="200" r="4" fill="#1B2A4E"/>
  <circle cx="200" cy="140" r="4" fill="#1B2A4E"/>
  <circle cx="300" cy="60" r="4" fill="#1B2A4E"/>
  
  <!-- Dashed lines -->
  <line x1="100" y1="200" x2="100" y2="220" stroke="#999" stroke-dasharray="2 2"/>
  <line x1="100" y1="200" x2="50" y2="200" stroke="#999" stroke-dasharray="2 2"/>
  <text x="60" y="195" font-size="10" fill="#666">Ec₁</text>
  
  <text x="200" y="245" font-size="11" fill="#666" text-anchor="middle">Énergie cinétique = ½·m·v² (parabole)</text>
  <text x="200" y="20" font-size="13" fill="#1B2A4E" text-anchor="middle" font-weight="bold">Croissance quadratique avec v</text>
</svg>

## 4. Relation utile — Force et accélération

En multipliant le PFD par $v = \\frac{dx}{dt}$ :

$$F \\cdot v = m \\cdot a \\cdot v = \\frac{d}{dt}\\left(\\frac{1}{2}mv^2\\right) = \\frac{dE_c}{dt}$$

Donc $\\frac{dE_c}{dt} = P$ (puissance) — la dérivée de l'énergie cinétique est la puissance des forces.

## 5. Énergie cinétique en mouvement de translation

Pour un solide en translation (tous les points ont la même vitesse $v_G$ au centre d'inertie) :

$$E_c = \\frac{1}{2} m v_G^2$$

Pour un solide en rotation autour d'un axe fixe :

$$E_c = \\frac{1}{2} J_\\Delta \\omega^2$$

où $J_\\Delta$ est le moment d'inertie par rapport à l'axe $\\Delta$, et $\\omega$ la vitesse angulaire.`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Distance de freinage

**Énoncé** : Une voiture de 1200 kg roule à 90 km/h. Le conducteur freine avec une force de freinage totale $F = 6000$ N. Calculer la distance de freinage.

### Étape 1 — Convertir la vitesse

$$v_0 = 90 \\text{ km/h} = 25 \\text{ m/s}$$

### Étape 2 — Énergie cinétique initiale

$$E_{c,A} = \\frac{1}{2} m v_0^2 = \\frac{1}{2} \\times 1200 \\times 25^2 = 375\\,000 \\text{ J}$$

### Étape 3 — Appliquer le théorème

À l'arrêt, $E_{c,B} = 0$. La seule force qui travaille est le freinage (travail résistant) :

$$\\Delta E_c = E_{c,B} - E_{c,A} = 0 - 375\\,000 = W(\\vec{F})$$

$$-375\\,000 = -F \\cdot d$$

$$d = \\frac{375\\,000}{6000}$$

$$\\boxed{d = 62{,}5 \\text{ m}}$$

### Étape 4 — Vérification (par MRUV)

On avait trouvé $d = 62{,}5$ m dans le chapitre précédent (avec $a = -5$ m/s²). Ici $a = -F/m = -6000/1200 = -5$ m/s², et $d = v_0^2/(2a) = 625/10 = 62{,}5$ m. ✅

> ✅ La distance de freinage augmente avec le **carré** de la vitesse. À 130 km/h (au lieu de 90), la distance serait $(130/90)^2 \\approx 2{,}1$ fois plus grande — soit environ **130 m**.`,
        },
        {
          type: "mcq",
          title: "Énergie cinétique",
          question:
            "Un camion de 5 tonnes roule à 36 km/h. Un scooter de 100 kg roule à 90 km/h. Lequel a la plus grande énergie cinétique ?",
          explanation:
            "Camion : Ec = ½ × 5000 × 10² = 250 000 J. Scooter : Ec = ½ × 100 × 25² = 31 250 J. Le camion a 8× plus d'énergie cinétique, bien qu'il aille moins vite.",
          choices: [
            {
              text: "Le camion (250 kJ vs 31 kJ)",
              isCorrect: true,
              feedback:
                "✅ Exact ! Le camion a 8× plus d'énergie cinétique. La masse (×50) compense la vitesse (÷2,5).",
            },
            {
              text: "Le scooter (car il va plus vite)",
              isCorrect: false,
              feedback:
                "❌ Même si le scooter va plus vite, il est 50× plus léger. La masse compte autant que v².",
            },
            {
              text: "Ils ont la même énergie cinétique",
              isCorrect: false,
              feedback:
                "❌ Calcul : camion = 250 kJ, scooter = 31 kJ. Très différent !",
            },
            {
              text: "On ne peut pas savoir sans plus d'informations",
              isCorrect: false,
              feedback:
                "❌ On a toutes les infos. Convertis les km/h en m/s et applique Ec = ½mv².",
            },
          ],
        },
        {
          type: "mcq",
          title: "Distance de freinage × 2",
          question:
            "Si on double la vitesse d'un véhicule (v → 2v), la distance de freinage est multipliée par...",
          explanation:
            "Distance de freinage d = v²/(2a). Si v → 2v, alors v² → 4v², donc d → 4d. C'est pourquoi doubler la vitesse multiplie la distance de freinage par 4.",
          choices: [
            {
              text: "4",
              isCorrect: true,
              feedback:
                "✅ Exact ! d ∝ v², donc si v × 2, d × 4. C'est pourquoi les limitations de vitesse sont si importantes pour la sécurité.",
            },
            {
              text: "2",
              isCorrect: false,
              feedback:
                "❌ La distance ne dépend pas linéairement de v mais de v². Donc ×4, pas ×2.",
            },
            {
              text: "8",
              isCorrect: false,
              feedback:
                "❌ Tu as confondu avec la variation d'énergie cinétique (qui serait ×4 aussi, pas ×8).",
            },
            {
              text: "1,41 (√2)",
              isCorrect: false,
              feedback:
                "❌ C'est le cas de la vitesse maximale dans un virage (v_max ∝ √R). Pour le freinage, d ∝ v².",
            },
          ],
        },
        {
          type: "sandbox",
          title: "Visualiser Ec = ½mv²",
          code: `import matplotlib.pyplot as plt
import numpy as np

# Vitesses de 0 à 40 m/s (144 km/h)
v = np.linspace(0, 40, 200)

# Plusieurs masses
masses = [500, 1000, 1500, 2000]  # kg (vélo, voiture, SUV, camion)
colors = ["#2DD4BF", "#1B2A4E", "#C9A227", "#EF4444"]

fig, ax = plt.subplots(figsize=(9, 6))

for m, color in zip(masses, colors):
    Ec = 0.5 * m * v**2 / 1000  # en kJ
    ax.plot(v, Ec, color=color, linewidth=2.5, label=f"m = {m} kg")

ax.set_xlabel("Vitesse v (m/s)")
ax.set_ylabel("Énergie cinétique Ec (kJ)")
ax.set_title("Énergie cinétique = ½·m·v²\\nCroissance quadratique avec la vitesse")
ax.legend()
ax.grid(True, alpha=0.3)

# Marquer les vitesses typiques
for v_typ, label in [(13.9, "50 km/h"), (25, "90 km/h"), (36.1, "130 km/h")]:
    ax.axvline(x=v_typ, color="#999", linestyle=":", alpha=0.5)
    ax.text(v_typ, 50, label, rotation=90, fontsize=9, color="#666", va="bottom")

plt.tight_layout()
plt.savefig("output.png", dpi=100, bbox_inches="tight")
plt.show()
`,
        },
      ],
    },

    // 4.3 Énergie potentielle
    {
      title: "Énergie potentielle",
      slug: "energie-potentielle",
      estimatedMinutes: 25,
      isFreePreview: false,
      blocks: [
        {
          type: "text",
          content: `# Énergie potentielle

L'**énergie potentielle** est l'énergie stockée par un système en raison de sa position ou de sa configuration. Elle peut être convertie en énergie cinétique.

## 1. Énergie potentielle de pesanteur

Pour un objet de masse $m$ à l'altitude $z$ (origine arbitraire) :

$$\\boxed{E_p = mgz}$$

- Unité : joule (J)
- Dépend de l'origine choisie (mais les variations sont absolues)

### Relation avec le travail du poids

$$W_{AB}(\\vec{P}) = -\\Delta E_p = E_p(A) - E_p(B)$$

Le poids « transfère » l'énergie potentielle en énergie cinétique (et inversement).

## 2. Énergie potentielle élastique

Pour un ressort de raideur $k$ étiré/comprimé de $x$ par rapport à sa longueur à vide :

$$\\boxed{E_p = \\frac{1}{2} k x^2}$$

## 3. Énergie potentielle électrique

Pour une charge $q$ dans un potentiel électrique $V$ :

$$E_p = qV$$

## 4. Schéma : énergie potentielle de pesanteur

<svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" style="background:#fff;max-width:100%;border-radius:8px;border:1px solid #e5e7eb">
  <!-- Sol -->
  <line x1="30" y1="240" x2="370" y2="240" stroke="#1B2A4E" stroke-width="2"/>
  
  <!-- Niveau 0 (origine) -->
  <line x1="30" y1="240" x2="370" y2="240" stroke="#999" stroke-width="1" stroke-dasharray="4 4"/>
  <text x="20" y="245" font-size="11" fill="#999">z=0</text>
  
  <!-- Niveau A (haut) -->
  <line x1="30" y1="80" x2="370" y2="80" stroke="#C9A227" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text x="20" y="85" font-size="11" fill="#C9A227">z_A</text>
  
  <!-- Niveau B (bas) -->
  <line x1="30" y1="160" x2="370" y2="160" stroke="#2DD4BF" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text x="20" y="165" font-size="11" fill="#2DD4BF">z_B</text>
  
  <!-- Objet en A -->
  <rect x="180" y="65" width="30" height="20" fill="#C9A227" stroke="#1B2A4E" stroke-width="1.5"/>
  <text x="195" y="80" font-size="11" fill="#1B2A4E" text-anchor="middle" font-weight="bold">m</text>
  <text x="220" y="80" font-size="11" fill="#C9A227" font-weight="bold">Ep(A) = mgz_A</text>
  
  <!-- Objet en B -->
  <rect x="180" y="145" width="30" height="20" fill="#2DD4BF" stroke="#1B2A4E" stroke-width="1.5"/>
  <text x="195" y="160" font-size="11" fill="#1B2A4E" text-anchor="middle" font-weight="bold">m</text>
  <text x="220" y="160" font-size="11" fill="#2DD4BF" font-weight="bold">Ep(B) = mgz_B</text>
  
  <!-- Flèche descente A→B -->
  <path d="M 130 85 L 130 155" stroke="#EF4444" stroke-width="2" marker-end="url(#arrEp)" stroke-dasharray="3 3"/>
  <text x="80" y="125" font-size="11" fill="#EF4444">ΔEp = mg(zB-zA)</text>
  <text x="80" y="140" font-size="11" fill="#EF4444">< 0 (descente)</text>
  
  <defs>
    <marker id="arrEp" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#EF4444"/>
    </marker>
  </defs>
  
  <text x="200" y="270" font-size="11" fill="#666" text-anchor="middle">Plus l'objet est haut, plus son énergie potentielle est grande</text>
</svg>

## 5. Référence d'origine

L'énergie potentielle est définie **à une constante près**. On choisit généralement :

- Pour la pesanteur : $z = 0$ au sol, ou au point le plus bas du système
- Pour un ressort : $E_p = 0$ quand $x = 0$ (longueur à vide)
- Pour l'électrique : $V = 0$ à l'infini ou à la terre

> Seules les **variations** $\\Delta E_p$ ont un sens physique — la valeur absolue est arbitraire.`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Energie potentielle d'un ballon

**Énoncé** : Un ballon de masse $m = 0{,}5$ kg est lancé vers le haut et atteint une hauteur maximale $h = 8$ m au-dessus du point de départ. Calculer son énergie potentielle au sommet (en prenant le point de départ comme origine $z = 0$).

### Étape 1 — Choisir l'origine

On prend $z = 0$ au point de départ du ballon.

### Étape 2 — Appliquer la formule

Au sommet, $z = h = 8$ m :

$$E_p = mgh = 0{,}5 \\times 9{,}81 \\times 8$$

$$\\boxed{E_p = 39{,}24 \\text{ J}}$$

### Étape 3 — Énergie cinétique au départ

Au départ, $z = 0$ donc $E_p = 0$. Toute l'énergie est cinétique :

$$E_{c,depart} = \\frac{1}{2} m v_0^2$$

### Étape 4 — Au sommet

$v_{sommet} = 0$ donc $E_{c,sommet} = 0$. Toute l'énergie est potentielle.

### Étape 5 — Conservation

$$E_{c,depart} = E_{p,sommet} = 39{,}24 \\text{ J}$$

$$\\frac{1}{2} \\times 0{,}5 \\times v_0^2 = 39{,}24 \\Rightarrow v_0 = \\sqrt{2 \\times 9{,}81 \\times 8} = \\sqrt{156{,}96}$$

$$\\boxed{v_0 \\approx 12{,}53 \\text{ m/s} \\approx 45 \\text{ km/h}}$$

> ✅ Sans frottements, toute l'énergie cinétique initiale du ballon (39 J) est convertie en énergie potentielle au sommet. La vitesse initiale nécessaire est 12,5 m/s.`,
        },
        {
          type: "mcq",
          title: "Énergie potentielle de pesanteur",
          question:
            "Une brique de 2 kg est posée sur une étagère à 2 m de haut. Quelle est son énergie potentielle (origine au sol) ?",
          explanation:
            "Ep = mgh = 2 × 9,81 × 2 = 39,24 J. L'origine étant le sol, l'énergie potentielle est positive.",
          choices: [
            {
              text: "39,24 J",
              isCorrect: true,
              feedback:
                "✅ Exact ! Ep = mgh = 2 × 9,81 × 2 = 39,24 J. C'est l'énergie qu'elle libérerait en tombant.",
            },
            {
              text: "19,62 J",
              isCorrect: false,
              feedback:
                "❌ Tu as oublié la masse. Ep = mgh, pas gh seul. 2 × 9,81 × 2 = 39,24 J.",
            },
            {
              text: "0 J (immobile)",
              isCorrect: false,
              feedback:
                "❌ Même immobile, un objet en hauteur a de l'énergie potentielle. C'est l'énergie cinétique qui est nulle (pas Ep).",
            },
            {
              text: "78,48 J",
              isCorrect: false,
              feedback:
                "❌ Tu as multiplié deux fois par 2 (m = 2 et h = 2). Ep = 2 × 9,81 × 2 = 39,24 J.",
            },
          ],
        },
      ],
    },

    // 4.4 Conservation de l'énergie
    {
      title: "Conservation de l'énergie mécanique",
      slug: "conservation-energie",
      estimatedMinutes: 35,
      isFreePreview: false,
      blocks: [
        {
          type: "text",
          content: `# Conservation de l'énergie mécanique

## 1. Énergie mécanique

L'**énergie mécanique** d'un système est la somme de son énergie cinétique et de son énergie potentielle :

$$\\boxed{E_m = E_c + E_p}$$

## 2. Théorème de conservation

> Si toutes les forces appliquées (autre que le poids) sont conservatives ou ne travaillent pas, alors l'énergie mécanique est **constante** :

$$\\boxed{E_m(A) = E_m(B) \\quad \\text{(sans frottements)}}$$

Soit :

$$\\frac{1}{2} m v_A^2 + m g z_A = \\frac{1}{2} m v_B^2 + m g z_B$$

## 3. Cas avec frottements

Si des forces non conservatives (frottements) travaillent, l'énergie mécanique **diminue** :

$$\\boxed{\\Delta E_m = E_m(B) - E_m(A) = W(frottements) < 0}$$

> L'énergie « perdue » est dissipée en chaleur (effet Joule, échauffement).

## 4. Schéma : conservation dans un demi-cercle

<svg viewBox="0 0 500 280" xmlns="http://www.w3.org/2000/svg" style="background:#fff;max-width:100%;border-radius:8px;border:1px solid #e5e7eb">
  <!-- Demi-cercle (glissade) -->
  <path d="M 50 200 A 200 200 0 0 1 450 200" stroke="#1B2A4E" stroke-width="3" fill="none"/>
  
  <!-- Point A (haut gauche) -->
  <circle cx="50" cy="200" r="6" fill="#C9A227"/>
  <text x="20" y="195" font-size="13" fill="#C9A227" font-weight="bold">A</text>
  <text x="20" y="215" font-size="11" fill="#C9A227">Emax</text>
  <text x="20" y="230" font-size="11" fill="#C9A227">Ep(max), Ec=0</text>
  
  <!-- Point milieu (bas) -->
  <circle cx="250" cy="0" r="6" fill="#2DD4BF"/>
  <text x="260" y="-5" font-size="13" fill="#2DD4BF" font-weight="bold">B</text>
  <text x="260" y="10" font-size="11" fill="#2DD4BF">Ec(max)</text>
  <text x="260" y="25" font-size="11" fill="#2DD4BF">Ep=0</text>
  
  <!-- Point C (haut droit) -->
  <circle cx="450" cy="200" r="6" fill="#C9A227"/>
  <text x="465" y="195" font-size="13" fill="#C9A227" font-weight="bold">C</text>
  <text x="465" y="215" font-size="11" fill="#C9A227">Emax</text>
  <text x="465" y="230" font-size="11" fill="#C9A227">Ep(max), Ec=0</text>
  
  <!-- Mobile sur la trajectoire -->
  <circle cx="180" cy="105" r="10" fill="#1B2A4E"/>
  
  <!-- Formule au centre -->
  <text x="250" y="265" font-size="13" fill="#1B2A4E" text-anchor="middle" font-weight="bold">Em = Ec + Ep = constante (sans frottements)</text>
</svg>

## 5. Méthode de résolution

1. Identifier les forces conservatives (poids, ressort, électrique)
2. Vérifier l'absence de frottements (ou les négliger)
3. Calculer $E_m$ en un point connu
4. Égaliser avec $E_m$ en un autre point
5. Résoudre pour la grandeur recherchée

## 6. Application : loopings, montagnes russes

Au sommet d'un looping de rayon $R$, pour que le wagon ne tombe pas :

- Poids = force centripète nécessaire
- $mg \\leq m v^2 / R$
- $v_{min} = \\sqrt{gR}$

À 10 m de haut dans un looping de $R = 5$ m : $v_{min} = \\sqrt{9{,}81 \\times 5} = 7$ m/s`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Descente de montagnes russes

**Énoncé** : Un wagon de montagnes russes de masse $m = 500$ kg part du repos d'une hauteur $h = 30$ m. Sans frottements, calculer sa vitesse en bas.

### Étape 1 — Énergie mécanique au départ (point A)

$$E_m(A) = E_c(A) + E_p(A) = 0 + mgh = 500 \\times 9{,}81 \\times 30 = 147\\,150 \\text{ J}$$

(vitesse initiale nulle, altitude maximale)

### Étape 2 — Énergie mécanique en bas (point B)

En bas, $z_B = 0$ donc $E_p(B) = 0$. Toute l'énergie est cinétique :

$$E_m(B) = E_c(B) = \\frac{1}{2} m v_B^2$$

### Étape 3 — Conservation

Sans frottements, $E_m(A) = E_m(B)$ :

$$mgh = \\frac{1}{2} m v_B^2$$

$$v_B = \\sqrt{2gh} = \\sqrt{2 \\times 9{,}81 \\times 30} = \\sqrt{588{,}6}$$

$$\\boxed{v_B \\approx 24{,}26 \\text{ m/s} \\approx 87 \\text{ km/h}}$$

### Étape 4 — Vérification indépendante de la masse

La masse $m$ se simplifie. La vitesse finale ne dépend que de la hauteur de chute !

### Étape 5 — Avec frottements

Si 20 % de l'énergie est dissipée :

$$\\frac{1}{2} m v_B^2 = 0{,}8 \\times mgh$$

$$v_B = \\sqrt{0{,}8 \\times 2gh} = \\sqrt{0{,}8 \\times 588{,}6} \\approx 21{,}7 \\text{ m/s}$$

> ✅ La vitesse est réduite d'environ 10 % (de 24,3 m/s à 21,7 m/s). Mais l'énergie dissipée est de 30 %, car l'énergie cinétique est proportionnelle à $v^2$.`,
        },
        {
          type: "mcq",
          title: "Vitesse indépendante de la masse",
          question:
            "Dans une chute libre sans frottements depuis une hauteur h, la vitesse finale v dépend de...",
          explanation:
            "Par conservation de l'énergie : mgh = ½mv², donc v = √(2gh). La masse se simplifie !",
          choices: [
            {
              text: "De g et h seulement (pas de la masse)",
              isCorrect: true,
              feedback:
                "✅ Exact ! v = √(2gh). La masse se simplifie dans la conservation de l'énergie. C'est pourquoi Galilée a (peut-être) fait tomber deux boules de masses différentes du haut de la tour de Pise.",
            },
            {
              text: "De la masse m uniquement",
              isCorrect: false,
              feedback:
                "❌ La masse se simplifie. Une plume et un marteau tombent à la même vitesse dans le vide (expérience d'Apollo 15 sur la Lune).",
            },
            {
              text: "De m, g et h",
              isCorrect: false,
              feedback:
                "❌ La masse se simplifie dans mgh = ½mv² → v = √(2gh).",
            },
            {
              text: "De la durée de chute",
              isCorrect: false,
              feedback:
                "❌ La vitesse finale ne dépend que de la hauteur, pas du temps. On peut calculer v sans connaître t.",
            },
          ],
        },
        {
          type: "mcq",
          title: "Énergie dissipée par frottements",
          question:
            "Un skieur descend une piste de 100 m de dénivelé avec un rendement énergétique de 80 %. Sans frottements, sa vitesse finale serait v₀. Sa vitesse réelle est...",
          explanation:
            "Avec frottements : ½mv² = 0,8·mgh. Donc v² = 0,8·v₀², soit v = √0,8·v₀ ≈ 0,89·v₀. La vitesse est réduite de 11%, mais l'énergie est réduite de 20%.",
          choices: [
            {
              text: "v ≈ 0,89 × v₀ (réduction de 11 %)",
              isCorrect: true,
              feedback:
                "✅ Exact ! ½mv² = 0,8·mgh → v = √0,8·v₀ ≈ 0,89·v₀. La vitesse baisse de 11% mais l'énergie baisse de 20% (car Ec ∝ v²).",
            },
            {
              text: "v = 0,8 × v₀ (réduction de 20 %)",
              isCorrect: false,
              feedback:
                "❌ Erreur courante ! La vitesse ne baisse pas linéairement avec l'énergie. Comme Ec ∝ v², c'est v² qui baisse de 20%, donc v baisse de √0,8 ≈ 0,89.",
            },
            {
              text: "v = 0,64 × v₀ (réduction de 36 %)",
              isCorrect: false,
              feedback:
                "❌ Tu as confondu v² et v. C'est v² = 0,8·v₀², donc v = √0,8·v₀ ≈ 0,89·v₀.",
            },
            {
              text: "v = v₀ (pas de changement)",
              isCorrect: false,
              feedback:
                "❌ Si l'énergie est réduite de 20%, la vitesse est forcément réduite aussi (car Ec = ½mv²).",
            },
          ],
        },
        {
          type: "lab",
          title: "Lab : Conversion Ec ↔ Ep",
          instructions:
            "Ajuste la hauteur initiale et la masse pour observer la conversion entre énergie potentielle et énergie cinétique en chute libre.",
          simulationCode: `import matplotlib.pyplot as plt
import numpy as np

g = 9.81

# Paramètres injectés: h0 (hauteur initiale), m (masse)

# Calcul de la chute
t_total = np.sqrt(2 * h0 / g)
t = np.linspace(0, t_total, 100)

z = h0 - 0.5 * g * t**2  # altitude
v = g * t  # vitesse (vers le bas)

Ep = m * g * z
Ec = 0.5 * m * v**2
Em = Ep + Ec  # doit être constant

fig, axes = plt.subplots(1, 2, figsize=(12, 5))

# Énergies au cours du temps
axes[0].plot(t, Ep, color="#C9A227", linewidth=2.5, label="Énergie potentielle Ep")
axes[0].plot(t, Ec, color="#2DD4BF", linewidth=2.5, label="Énergie cinétique Ec")
axes[0].plot(t, Em, color="#1B2A4E", linewidth=2, linestyle="--", label="Énergie mécanique Em")
axes[0].set_xlabel("Temps t (s)")
axes[0].set_ylabel("Énergie (J)")
axes[0].set_title(f"Conversion Ep → Ec\\nm = {m} kg, h₀ = {h0} m")
axes[0].legend()
axes[0].grid(True, alpha=0.3)

# Diagramme en barres empilées à différents instants
sample_idx = [0, 25, 50, 75, 99]
labels = [f"t={t[i]:.1f}s" for i in sample_idx]
ep_vals = [Ep[i] for i in sample_idx]
ec_vals = [Ec[i] for i in sample_idx]

axes[1].bar(labels, ep_vals, color="#C9A227", label="Ep")
axes[1].bar(labels, ec_vals, bottom=ep_vals, color="#2DD4BF", label="Ec")
axes[1].set_ylabel("Énergie (J)")
axes[1].set_title("Énergies à différents instants\\n(la somme Em reste constante)")
axes[1].legend()
axes[1].grid(True, alpha=0.3, axis="y")

plt.tight_layout()
plt.savefig("output.png", dpi=100, bbox_inches="tight")
plt.show()
`,
          sliderConfig: [
            {
              name: "h0",
              label: "Hauteur initiale h₀",
              min: 1,
              max: 100,
              step: 1,
              default: 20,
              unit: "m",
            },
            {
              name: "m",
              label: "Masse m",
              min: 1,
              max: 100,
              step: 1,
              default: 5,
              unit: "kg",
            },
          ],
          challenges: [
            {
              id: "vfinale",
              question:
                "Avec h₀ = 45 m, quelle est la vitesse d'arrivée au sol ?",
              expectedValue: 29.7,
              tolerance: 0.5,
              unit: "m/s",
              hint: "v = √(2gh).",
              explanation:
                "v = √(2 × 9.81 × 45) = √883 ≈ 29.7 m/s (≈ 107 km/h).",
            },
            {
              id: "etotal",
              question:
                "Avec m = 5 kg et h₀ = 20 m, quelle est l'énergie mécanique totale (J) ?",
              expectedValue: 981,
              tolerance: 5,
              unit: "J",
              hint: "Em = mgh (tout est potentiel au départ).",
              explanation:
                "Em = mgh = 5 × 9.81 × 20 = 981 J. Constant pendant toute la chute.",
            },
          ],
        },
      ],
    },
  ],
};
