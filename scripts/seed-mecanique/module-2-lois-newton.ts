import type { ModuleInput } from "./types";

export const moduleLoisNewton: ModuleInput = {
  title: "Lois de Newton",
  description:
    "Les trois lois fondamentales de la dynamique : inertie, PFD, actions réciproques.",
  lessons: [
    // ─────────────────────────────────────────────────────────────────────────
    // Lesson 2.1 — Première loi (inertie)
    // ─────────────────────────────────────────────────────────────────────────
    {
      title: "Première loi : principe d'inertie",
      slug: "premiere-loi-inertie",
      estimatedMinutes: 25,
      isFreePreview: false,
      blocks: [
        {
          type: "text",
          content: `# Première loi de Newton — Principe d'inertie

## Énoncé (Newton, 1687)

> Dans un référentiel **galiléen**, tout corps persévère dans son état de **repos** ou de **mouvement rectiligne uniforme** si les forces qui s'exercent sur lui se **compensent** (somme nulle).

Mathématiquement :

$$\\text{Si } \\sum \\vec{F}_{ext} = \\vec{0} \\quad \\text{alors} \\quad \\vec{v} = \\vec{\\text{constante}}$$

## 1. Référentiel galiléen

Un référentiel est **galiléen** si la première loi de Newton y est vérifiée. En pratique :

- **Référentiel de Kepler** (héliocentrique) : galiléen pour l'étude du système solaire
- **Référentiel géocentrique** : approximativement galiléen pour des durées courtes (jours)
- **Référentiel terrestre** (du laboratoire) : approximativement galiléen pour des expériences courtes et locales

> ⚠️ Un référentiel en **rotation** (comme un manège) n'est JAMAIS galiléen — des forces fictives (Coriolis, centrifuge) apparaissent.

## 2. Principe d'inertie : illustration

<svg viewBox="0 0 500 220" xmlns="http://www.w3.org/2000/svg" style="background:#fff;max-width:100%;border-radius:8px;border:1px solid #e5e7eb">
  <!-- Cas 1 : au repos -->
  <text x="20" y="30" font-size="13" fill="#1B2A4E" font-weight="bold">1. Au repos (v = 0)</text>
  <rect x="30" y="50" width="60" height="40" rx="4" fill="#2DD4BF" stroke="#1B2A4E" stroke-width="1"/>
  <text x="55" y="75" font-size="14" fill="#1B2A4E">M</text>
  <!-- forces qui se compensent -->
  <line x1="60" y1="100" x2="60" y2="130" stroke="#EF4444" stroke-width="2" marker-end="url(#arrRed)"/>
  <text x="65" y="120" font-size="11" fill="#EF4444">P (poids)</text>
  <line x1="60" y1="50" x2="60" y2="20" stroke="#2DD4BF" stroke-width="2" marker-end="url(#arrTeal)"/>
  <text x="65" y="35" font-size="11" fill="#2DD4BF">R (réaction)</text>
  <text x="20" y="155" font-size="11" fill="#666">P + R = 0 → v = 0 (repose)</text>

  <!-- Cas 2 : MRU -->
  <text x="280" y="30" font-size="13" fill="#1B2A4E" font-weight="bold">2. MRU (v constante)</text>
  <line x1="260" y1="80" x2="490" y2="80" stroke="#666" stroke-width="1"/>
  <rect x="270" y="60" width="50" height="30" rx="4" fill="#C9A227" stroke="#1B2A4E" stroke-width="1"/>
  <text x="285" y="80" font-size="11" fill="#1B2A4E">M</text>
  <line x1="320" y1="75" x2="370" y2="75" stroke="#1B2A4E" stroke-width="2" marker-end="url(#arrNavy)"/>
  <text x="335" y="68" font-size="11" fill="#1B2A4E">v</text>
  <text x="275" y="115" font-size="11" fill="#666">P + R + F_motrice + F_frot = 0</text>
  <text x="275" y="130" font-size="11" fill="#666">→ v constant en direction et norme</text>

  <defs>
    <marker id="arrRed" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#EF4444"/>
    </marker>
    <marker id="arrTeal" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#2DD4BF"/>
    </marker>
    <marker id="arrNavy" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#1B2A4E"/>
    </marker>
  </defs>

  <text x="250" y="200" font-size="11" fill="#666" text-anchor="middle">Lorsque ΣF = 0, le mouvement est soit nul, soit rectiligne uniforme.</text>
</svg>

## 3. Contre-exemple : forces non compensées

Si $\\sum \\vec{F} \\neq \\vec{0}$, le mouvement **n'est pas** rectiligne uniforme :
- La vitesse peut changer en norme (accélération tangentielle)
- La vitesse peut changer en direction (accélération normale)
- Les deux`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Palet sur glace

**Énoncé** : Un palet de hockey glisse sur la glace avec une vitesse horizontale $v_0 = 10$ m/s. On néglige les frottements. Décrire son mouvement.

### Étape 1 — Bilan des forces

- **Poids** $\\vec{P}$ : vertical, vers le bas, $P = mg$
- **Réaction normale** $\\vec{R}$ : verticale, vers le haut

### Étape 2 — Vérifier que ΣF = 0

Verticalement : $\\vec{P} + \\vec{R} = \\vec{0}$ (le palet ne s'enfonce pas dans la glace).

Horizontalement : aucun frottement → aucune force horizontale.

Donc $\\sum \\vec{F} = \\vec{0}$.

### Étape 3 — Appliquer la première loi

Le palet est en **mouvement rectiligne uniforme** à $v = 10$ m/s.

> ✅ Sur la glace (quasi sans frottement), un palet peut parcourir des dizaines de mètres sans ralentir visiblement. C'est une bonne illustration du principe d'inertie.

### Étape 4 — Sans frottement vs avec frottements

Avec un coefficient de frottement $\\mu = 0{,}1$ :
- Force de frottement : $f = \\mu \\cdot R = \\mu \\cdot mg = 0{,}1 \\times m \\times 9{,}81$
- Accélération : $a = -\\mu g = -0{,}981$ m/s²

Le palet s'arrêterait en $t = v_0/\\mu g = 10{,}2$ s, après avoir parcouru $d = v_0^2/(2\\mu g) = 51$ m.`,
        },
        {
          type: "mcq",
          title: "Identifier un référentiel galiléen",
          question:
            "Lequel de ces référentiels n'est PAS galiléen ?",
          explanation:
            "Un référentiel en rotation (comme un manège) n'est pas galiléen car la rotation introduit des accélérations fictives (Coriolis, centrifuge).",
          choices: [
            {
              text: "Le référentiel d'un manège en rotation",
              isCorrect: true,
              feedback:
                "✅ Exact ! Un manège en rotation n'est pas galiléen. Les forces fictives (centrifuge, Coriolis) apparaissent dans ce référentiel.",
            },
            {
              text: "Le référentiel terrestre du laboratoire",
              isCorrect: false,
              feedback:
                "❌ Approximativement galiléen pour des expériences de courte durée (la rotation de la Terre est négligeable à cette échelle).",
            },
            {
              text: "Le référentiel géocentrique",
              isCorrect: false,
              feedback:
                "❌ Approximativement galiléen pour des durées de l'ordre de la journée. Utilisé pour étudier les satellites.",
            },
            {
              text: "Le référentiel de Copernic (héliocentrique)",
              isCorrect: false,
              feedback:
                "❌ C'est le référentiel le plus galiléen connu — utilisé pour l'étude du système solaire.",
            },
          ],
        },
        {
          type: "mcq",
          title: "Quand ΣF = 0",
          question:
            "Si la somme des forces sur un mobile est nulle, alors...",
          explanation:
            "ΣF = 0 implique soit le repos, soit un mouvement rectiligne uniforme. Tout dépend de l'état initial.",
          choices: [
            {
              text: "Le mobile est soit au repos, soit en MRU",
              isCorrect: true,
              feedback:
                "✅ C'est exactement la première loi de Newton ! Si v = 0 initialement, le mobile reste au repos. Si v ≠ 0, il continue en MRU.",
            },
            {
              text: "Le mobile s'arrête obligatoirement",
              isCorrect: false,
              feedback:
                "❌ Faux ! C'est l'intuition commune (Aristote), mais Newton a montré qu'un corps en mouvement reste en mouvement si les forces se compensent.",
            },
            {
              text: "Le mobile accélère uniformément",
              isCorrect: false,
              feedback:
                "❌ Non, l'accélération est proportionnelle à la force résultante. Si ΣF = 0, a = 0.",
            },
            {
              text: "Le mobile tourne en cercle",
              isCorrect: false,
              feedback:
                "❌ Un mouvement circulaire implique une accélération centripète, donc une force non nulle.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Lesson 2.2 — Deuxième loi (PFD)
    // ─────────────────────────────────────────────────────────────────────────
    {
      title: "Deuxième loi : principe fondamental de la dynamique (PFD)",
      slug: "pfd-deuxieme-loi",
      estimatedMinutes: 35,
      isFreePreview: false,
      blocks: [
        {
          type: "text",
          content: `# Principe Fondamental de la Dynamique (PFD)

## Énoncé moderne

Dans un référentiel galiléen, la somme des forces extérieures appliquées à un point matériel est égale au produit de sa masse par son accélération :

$$\\boxed{\\sum \\vec{F}_{ext} = m \\cdot \\vec{a}}$$

## 1. Composantes

En coordonnées cartésiennes, le PFD se projette en trois équations scalaires :

$$\\begin{cases} \\sum F_x = m \\cdot a_x \\\\ \\sum F_y = m \\cdot a_y \\\\ \\sum F_z = m \\cdot a_z \\end{cases}$$

## 2. Méthode de résolution d'un problème de dynamique

1. **Système** : choisir le point matériel étudié
2. **Référentiel** : préciser le référentiel galiléen
3. **Bilan des forces** : lister toutes les forces appliquées
4. **Schéma** : représenter les forces sur un dessin
5. **Projection** : projeter sur les axes adaptés
6. **PFD** : appliquer $\\sum \\vec{F} = m\\vec{a}$
7. **Résolution** : intégrer pour obtenir v(t) et x(t)

## 3. Schéma type : plan incliné

<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" style="background:#fff;max-width:100%;border-radius:8px;border:1px solid #e5e7eb">
  <!-- ground -->
  <line x1="20" y1="220" x2="380" y2="220" stroke="#1B2A4E" stroke-width="2"/>
  <!-- incline -->
  <polygon points="50,220 350,220 350,80" fill="#f0f9f8" stroke="#1B2A4E" stroke-width="1.5"/>
  <!-- angle -->
  <path d="M 320 220 A 30 30 0 0 0 335 195" stroke="#C9A227" stroke-width="1.5" fill="none"/>
  <text x="335" y="215" font-size="12" fill="#C9A227" font-weight="bold">α</text>
  <!-- block -->
  <rect x="280" y="135" width="40" height="35" rx="2" fill="#2DD4BF" stroke="#1B2A4E" stroke-width="1" transform="rotate(-21.8, 300, 152)"/>
  <text x="295" y="160" font-size="13" fill="#1B2A4E" font-weight="bold">m</text>
  <!-- P (poids) -->
  <line x1="300" y1="152" x2="300" y2="222" stroke="#EF4444" stroke-width="2.5" marker-end="url(#arrP)"/>
  <text x="305" y="200" font-size="13" fill="#EF4444" font-weight="bold">P = mg</text>
  <!-- R (réaction normale) -->
  <line x1="300" y1="152" x2="265" y2="138" stroke="#2DD4BF" stroke-width="2.5" marker-end="url(#arrR)"/>
  <text x="225" y="135" font-size="13" fill="#2DD4BF" font-weight="bold">R</text>
  <!-- f (frottement) -->
  <line x1="300" y1="152" x2="335" y2="166" stroke="#C9A227" stroke-width="2.5" marker-end="url(#arrF)"/>
  <text x="340" y="170" font-size="13" fill="#C9A227" font-weight="bold">f</text>
  <defs>
    <marker id="arrP" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#EF4444"/>
    </marker>
    <marker id="arrR" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#2DD4BF"/>
    </marker>
    <marker id="arrF" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#C9A227"/>
    </marker>
  </defs>
  <text x="200" y="245" font-size="11" fill="#666" text-anchor="middle">Bilan des forces sur un solide en translation sur un plan incliné</text>
</svg>

## 4. Théorème du centre d'inertie

Pour un système de points matériels :

$$m_{total} \\cdot \\vec{a}_G = \\sum \\vec{F}_{ext}$$

où $G$ est le **centre d'inertie** du système. Le mouvement du centre d'inertie est le même que celui d'un point matériel de masse totale $m_{total}$ soumis à la somme des forces extérieures.

## 5. Unités

- Force : newton (N) — $1 \\text{ N} = 1 \\text{ kg} \\cdot \\text{m/s}^2$
- Masse : kilogramme (kg)
- Accélération : m/s²`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Ascenseur qui démarre

**Énoncé** : Une personne de masse $m = 70$ kg est dans un ascenseur qui démarre vers le haut avec une accélération $a = 1{,}5$ m/s². Calculer la force $T$ exercée par le sol de l'ascenseur sur la personne (c'est-à-dire la « sensation de poids »).

### Étape 1 — Système et référentiel

- Système : la personne (point matériel de masse $m$)
- Référentiel : terrestre (supposé galiléen)

### Étape 2 — Bilan des forces

- Poids : $\\vec{P}$ vers le bas, $P = mg = 70 \\times 9{,}81 = 686{,}7$ N
- Réaction du sol : $\\vec{T}$ vers le haut (inconnue)

### Étape 3 — Projection verticale

Axe vertical orienté vers le haut. Le PFD donne :

$$T - P = m \\cdot a$$

$$T - 686{,}7 = 70 \\times 1{,}5 = 105$$

$$T = 686{,}7 + 105 = 791{,}7 \\text{ N}$$

### Étape 4 — Interprétation

Le « poids apparent » est $T = 792$ N, soit un poids apparent $m_{apparent} = T/g = 80{,}7$ kg.

> ✅ Au démarrage de l'ascenseur, la personne se sent **plus lourde** (comme si elle pesait 81 kg au lieu de 70 kg). À l'arrivée (décélération), elle se sentirait plus légère.

### Étape 5 — Cas limite : chute libre

Si le câble de l'ascenseur casse ($a = -g$) :

$$T - P = m(-g) \\Rightarrow T = P - mg = 0$$

Le poids apparent est nul : c'est l'**apesanteur** (le célèbre « zéro G »).`,
        },
        {
          type: "mcq",
          title: "PFD et accélération",
          question:
            "Une force constante $F = 12$ N s'exerce sur un objet de masse $m = 3$ kg. Quelle est son accélération ?",
          explanation:
            "Le PFD donne a = F/m = 12/3 = 4 m/s². L'accélération est dans le même sens que la force.",
          choices: [
            {
              text: "4 m/s²",
              isCorrect: true,
              feedback:
                "✅ Exact ! a = F/m = 12/3 = 4 m/s².",
            },
            {
              text: "36 m/s²",
              isCorrect: false,
              feedback:
                "❌ Tu as multiplié au lieu de diviser. a = F/m, pas F×m.",
            },
            {
              text: "0,25 m/s²",
              isCorrect: false,
              feedback:
                "❌ Tu as fait m/F. C'est l'inverse : a = F/m.",
            },
            {
              text: "12 m/s²",
              isCorrect: false,
              feedback:
                "❌ Tu n'as pas divisé par la masse. La force seule ne donne pas l'accélération.",
            },
          ],
        },
        {
          type: "mcq",
          title: "Force et mouvement",
          question:
            "Si la somme des forces sur un objet est non nulle et constante, alors l'objet...",
          explanation:
            "ΣF = ma. Si ΣF est constante, alors a est constante. Le mouvement est uniformément accéléré (MRUV).",
          choices: [
            {
              text: "A une accélération constante (MRUV)",
              isCorrect: true,
              feedback:
                "✅ Exact ! a = ΣF/m est constante si ΣF est constante. Donc mouvement uniformément varié.",
            },
            {
              text: "A une vitesse constante (MRU)",
              isCorrect: false,
              feedback:
                "❌ Une vitesse constante implique a = 0, donc ΣF = 0. Contradiction.",
            },
            {
              text: "Reste immobile",
              isCorrect: false,
              feedback:
                "❌ Une force non nulle provoque nécessairement une accélération.",
            },
            {
              text: "Tourne en cercle",
              isCorrect: false,
              feedback:
                "❌ Un mouvement circulaire requiert une force dont la direction change en permanence, pas une force constante.",
            },
          ],
        },
        {
          type: "sandbox",
          title: "Visualiser F = ma",
          code: `import matplotlib.pyplot as plt
import numpy as np

# Forces de 1 à 20 N
F = np.linspace(1, 20, 50)

# Pour différentes masses
masses = [1, 2, 5, 10]  # kg
colors = ["#1B2A4E", "#2DD4BF", "#C9A227", "#EF4444"]

fig, ax = plt.subplots(figsize=(8, 6))

for m, color in zip(masses, colors):
    a = F / m
    ax.plot(F, a, color=color, linewidth=2, label=f"m = {m} kg")

ax.set_xlabel("Force F (N)")
ax.set_ylabel("Accélération a (m/s²)")
ax.set_title("Deuxième loi de Newton : a = F/m\\nPlus la masse est grande, plus l'accélération est petite")
ax.legend()
ax.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig("output.png", dpi=100, bbox_inches="tight")
plt.show()
`,
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Lesson 2.3 — Troisième loi (actions réciproques)
    // ─────────────────────────────────────────────────────────────────────────
    {
      title: "Troisième loi : actions réciproques",
      slug: "troisieme-loi-actions-reciproques",
      estimatedMinutes: 25,
      isFreePreview: false,
      blocks: [
        {
          type: "text",
          content: `# Troisième loi de Newton — Actions réciproques

## Énoncé

> Si un corps $A$ exerce une force $\\vec{F}_{A \\to B}$ sur un corps $B$, alors $B$ exerce sur $A$ une force $\\vec{F}_{B \\to A}$ de même intensité, de même direction, mais de **sens opposé** :

$$\\boxed{\\vec{F}_{A \\to B} = -\\vec{F}_{B \\to A}}$$

> Aussi appelée **loi de l'action et de la réaction** ou **principe des actions réciproques**.

## 1. Caractéristiques

- Les deux forces ont **même direction** (la droite qui joint les deux corps)
- Elles ont **même norme** : $|F_{A \\to B}| = |F_{B \\to A}|$
- Elles sont de **sens opposés**
- Elles s'exercent sur **deux corps différents** (donc elles ne s'annulent jamais dans le PFD !)

## 2. Schéma : interaction gravitationnelle

<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style="background:#fff;max-width:100%;border-radius:8px;border:1px solid #e5e7eb">
  <circle cx="120" cy="100" r="35" fill="#1B2A4E"/>
  <text x="100" y="105" font-size="16" fill="white" font-weight="bold">A</text>
  
  <circle cx="280" cy="100" r="25" fill="#2DD4BF" stroke="#1B2A4E" stroke-width="1"/>
  <text x="270" y="105" font-size="14" fill="#1B2A4E" font-weight="bold">B</text>
  
  <!-- F A->B -->
  <line x1="155" y1="100" x2="240" y2="100" stroke="#2DD4BF" stroke-width="3" marker-end="url(#arr1)"/>
  <text x="170" y="90" font-size="13" fill="#2DD4BF" font-weight="bold">F(A→B)</text>
  
  <!-- F B->A -->
  <line x1="245" y1="120" x2="160" y2="120" stroke="#EF4444" stroke-width="3" marker-end="url(#arr2)"/>
  <text x="170" y="145" font-size="13" fill="#EF4444" font-weight="bold">F(B→A)</text>
  
  <defs>
    <marker id="arr1" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#2DD4BF"/>
    </marker>
    <marker id="arr2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#EF4444"/>
    </marker>
  </defs>
  
  <text x="200" y="180" font-size="11" fill="#666" text-anchor="middle">F(A→B) et F(B→A) ont même direction, même norme, mais sens opposés.</text>
</svg>

## 3. Exemples concrets

| Action | Réaction |
|---|---|
| Pied pousse le sol vers l'arrière | Sol pousse le pied vers l'avant (marche, course) |
| Hélice pousse l'air vers l'arrière | Air pousse l'avion vers l'avant |
| Fusée éjecte des gaz vers le bas | Gaz poussent la fusée vers le haut |
| Terre attire la Lune | Lune attire la Terre |
| Aimant attire un clou | Clou attire l'aimant |

## 4. Piège fréquent

> « Si A pousse B avec 10 N, et B pousse A avec 10 N, alors les forces s'annulent et le système ne bouge pas. »

**FAUX** ❌ — Les deux forces s'exercent sur **deux corps différents**. On ne peut pas les additionner dans le PFD d'un seul corps.

- Pour étudier $B$ : on utilise $\\vec{F}_{A \\to B}$ (et pas l'autre)
- Pour étudier $A$ : on utilise $\\vec{F}_{B \\to A}$

## 5. Système isolé

Pour un système $\\{A, B\\}$ isolé (aucune force extérieure), les forces internes se compensent :

$$\\vec{F}_{A \\to B} + \\vec{F}_{B \\to A} = \\vec{0}$$

C'est le **principe de conservation de la quantité de mouvement** (vu plus loin).`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Marche

**Énoncé** : Une personne de 70 kg marche. À chaque pas, son pied pousse le sol vers l'arrière avec une force horizontale de 50 N. Quelle est l'accélération horizontale de la personne ?

### Étape 1 — Identifier les deux forces

- **Action** : pied pousse sol vers l'arrière, $\\vec{F}_{pied \\to sol}$ (sur le sol, vers l'arrière)
- **Réaction** : sol pousse pied vers l'avant, $\\vec{F}_{sol \\to pied}$ (sur la personne, vers l'avant)

### Étape 2 — Appliquer la troisième loi

$$|\\vec{F}_{sol \\to pied}| = |\\vec{F}_{pied \\to sol}| = 50 \\text{ N}$$

### Étape 3 — PFD sur la personne

$$\\sum F_{ext} = F_{sol \\to pied} = m \\cdot a$$

$$50 = 70 \\cdot a \\Rightarrow a = 0{,}71 \\text{ m/s²}$$

### Étape 4 — Interprétation

À chaque pas, la personne accélère vers l'avant à $0{,}71$ m/s² tant qu'elle pousse le sol. Si elle pousse pendant 0,5 s, elle gagne $\\Delta v = 0{,}36$ m/s à chaque pas.

> ✅ Plus on pousse fort le sol vers l'arrière, plus on accélère vers l'avant. C'est ainsi qu'un sprinter peut atteindre 10 m/s en quelques secondes.`,
        },
        {
          type: "mcq",
          title: "Action et réaction",
          question:
            "Un cheval tire une charrette. D'après la 3ème loi de Newton, la charrette exerce sur le cheval une force...",
          explanation:
            "La troisième loi dit que F(charret→cheval) = -F(cheval→charret). Même norme, sens opposé. Mais le système {cheval+charrette} avance car le sol pousse le cheval vers l'avant (réaction du sol sur les sabots).",
          choices: [
            {
              text: "De même intensité, sens opposé (vers l'arrière)",
              isCorrect: true,
              feedback:
                "✅ Exact ! C'est la troisième loi. Mais le système avance quand même car le sol pousse le cheval vers l'avant.",
            },
            {
              text: "Plus petite (sinon le système ne pourrait pas avancer)",
              isCorrect: false,
              feedback:
                "❌ Erreur courante ! Les deux forces sont TOUJOURS de même intensité. Le mouvement vient des forces externes (sol → cheval), pas de l'interaction interne.",
            },
            {
              text: "Plus grande (c'est ce qui fait avancer)",
              isCorrect: false,
              feedback:
                "❌ Non, les deux forces ont la même norme. Et si F(charret→cheval) était plus grande, le cheval reculerait !",
            },
            {
              text: "Nulle (la charrette ne résiste pas)",
              isCorrect: false,
              feedback:
                "❌ La charrette exerce bien une force sur le cheval (résistance au mouvement).",
            },
          ],
        },
        {
          type: "mcq",
          title: "Système isolé",
          question:
            "Deux astronautes en apesanteur, A et B, se poussent l'un l'autre. A (masse 80 kg) pousse B (masse 60 kg) avec une force de 30 N pendant 0,5 s. Que se passe-t-il ?",
          explanation:
            "D'après la 3ème loi, B exerce aussi 30 N sur A (vers l'arrière). a_A = 30/80 = 0,375 m/s² ; a_B = 30/60 = 0,5 m/s². Ils s'éloignent avec des vitesses opposées : v_A = -0,1875 m/s, v_B = +0,25 m/s. Quantité de mouvement totale conservée.",
          choices: [
            {
              text: "Ils s'éloignent avec v_A = -0,19 m/s et v_B = +0,25 m/s",
              isCorrect: true,
              feedback:
                "✅ Parfait ! a_A = -30/80 × 0,5 = -0,1875 m/s, v_B = +30/60 × 0,5 = +0,25 m/s. Les vitesses sont opposées (quantité de mouvement conservée).",
            },
            {
              text: "Seul B s'éloigne (car A a poussé)",
              isCorrect: false,
              feedback:
                "❌ Faux ! La 3ème loi dit que B exerce aussi une force sur A. Donc A recule.",
            },
            {
              text: "Ils s'éloignent avec la même vitesse",
              isCorrect: false,
              feedback:
                "❌ Seulement si leurs masses étaient égales. Ici m_A ≠ m_B donc v_A ≠ v_B.",
            },
            {
              text: "Ils restent immobiles (forces compensées)",
              isCorrect: false,
              feedback:
                "❌ Les forces internes au système se compensent, mais chaque astronaute subit une force qui l'accélère.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Lesson 2.4 — Applications du PFD
    // ─────────────────────────────────────────────────────────────────────────
    {
      title: "Applications du PFD : chute libre et plan incliné",
      slug: "applications-pfd",
      estimatedMinutes: 40,
      isFreePreview: false,
      blocks: [
        {
          type: "text",
          content: `# Applications du PFD

## 1. Chute libre

Un objet est en **chute libre** s'il n'est soumis qu'à son poids $\\vec{P} = m\\vec{g}$ (pas de frottements).

### PFD

$$m\\vec{a} = m\\vec{g} \\Rightarrow \\vec{a} = \\vec{g} = -g\\,\\vec{j}$$

L'accélération est **indépendante de la masse** ! Galilée l'avait pressenti (légende de la tour de Pise).

### Équations horaires (avec v₀ = 0, départ de l'origine)

$$\\begin{cases} v(t) = -gt \\\\ y(t) = -\\frac{1}{2}gt^2 \\end{cases}$$

## 2. Plan incliné sans frottement

Un solide de masse $m$ glisse sans frottement sur un plan incliné d'angle $\\alpha$.

### Bilan des forces

- $\\vec{P} = m\\vec{g}$ (vertical, vers le bas)
- $\\vec{R}$ (perpendiculaire au plan, vers le haut)

### Projection (axe parallèle au plan, orienté vers le bas)

$$\\sum F_{\\parallel} = mg \\sin\\alpha = m \\cdot a$$

$$\\boxed{a = g \\sin\\alpha}$$

> Indépendante de la masse ! Plus l'angle est grand, plus l'accélération est grande. Pour $\\alpha = 90°$ (chute verticale), on retrouve $a = g$.

### Projection (axe perpendiculaire au plan)

$$R - mg \\cos\\alpha = 0 \\Rightarrow R = mg \\cos\\alpha$$

## 3. Plan incliné avec frottements

Si le coefficient de frottement est $\\mu$ (cinétique), la force de frottement vaut $f = \\mu R = \\mu mg \\cos\\alpha$.

$$mg \\sin\\alpha - \\mu mg \\cos\\alpha = m \\cdot a$$

$$\\boxed{a = g(\\sin\\alpha - \\mu \\cos\\alpha)}$$

### Condition de glissement

Le solide glisse si $a > 0$, soit :

$$\\tan\\alpha > \\mu$$

Sinon, le solide reste immobile (statique).`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Toboggan

**Énoncé** : Un enfant de masse $m = 30$ kg glisse sur un toboggan incliné à $\\alpha = 30°$, avec un coefficient de frottement cinétique $\\mu = 0{,}15$. Le toboggan mesure $L = 4$ m. Calculer :
1. L'accélération de l'enfant
2. Sa vitesse en bas du toboggan

### Étape 1 — Accélération

$$a = g(\\sin\\alpha - \\mu \\cos\\alpha)$$

$$a = 9{,}81 \\times (\\sin 30° - 0{,}15 \\times \\cos 30°)$$

$$a = 9{,}81 \\times (0{,}5 - 0{,}15 \\times 0{,}866)$$

$$a = 9{,}81 \\times (0{,}5 - 0{,}130) = 9{,}81 \\times 0{,}370$$

$$\\boxed{a \\approx 3{,}63 \\text{ m/s²}}$$

### Étape 2 — Vitesse en bas

On utilise $v^2 - v_0^2 = 2aL$ avec $v_0 = 0$ :

$$v^2 = 2 \\times 3{,}63 \\times 4 = 29{,}04$$

$$\\boxed{v \\approx 5{,}39 \\text{ m/s} \\approx 19{,}4 \\text{ km/h}}$$

### Étape 3 — Vérification : l'enfant glisse-t-il ?

$$\\tan 30° \\approx 0{,}577 > \\mu = 0{,}15 \\checkmark$$

Oui, l'enfant glisse bien.

### Étape 4 — Comparaison : sans frottements

$$a_{sans frottements} = g \\sin 30° = 4{,}91 \\text{ m/s²}$$

$$v_{sans frottements} = \\sqrt{2 \\times 4{,}91 \\times 4} = 6{,}26 \\text{ m/s}$$

> ✅ Les frottements réduisent la vitesse d'environ **14 %** (de 6,26 m/s à 5,39 m/s). C'est pourquoi les toboggans sont parfois lubrifiés pour réduire ce ralentissement.`,
        },
        {
          type: "lab",
          title: "Lab : Optimiser un plan incliné",
          instructions:
            "Ajuste l'angle α et le coefficient de frottement μ pour observer l'accélération et la vitesse finale après 4 m de glisse.",
          simulationCode: `import matplotlib.pyplot as plt
import numpy as np

g = 9.81
L = 4  # m (longueur du toboggan)

# Paramètres injectés: alpha (°), mu

alpha_rad = np.radians(alpha)
a = g * (np.sin(alpha_rad) - mu * np.cos(alpha_rad))

# Si a < 0, l'objet ne glisse pas (statique)
if a <= 0:
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.text(0.5, 0.5, f"Pas de glissement\\n tan(α)={np.tan(alpha_rad):.3f} ≤ μ={mu}",
            ha='center', va='center', fontsize=18, color="#EF4444", transform=ax.transAxes)
    ax.set_title("L'objet reste immobile (frottements trop élevés)")
    ax.axis('off')
    plt.savefig("output.png", dpi=100, bbox_inches="tight")
    plt.show()
else:
    t_max = np.sqrt(2 * L / a)
    t = np.linspace(0, t_max, 100)
    v = a * t
    x = 0.5 * a * t**2
    
    fig, axes = plt.subplots(1, 2, figsize=(12, 5))
    
    axes[0].plot(t, v, color="#2DD4BF", linewidth=2.5)
    axes[0].set_xlabel("Temps t (s)")
    axes[0].set_ylabel("Vitesse v (m/s)")
    axes[0].set_title(f"Vitesse — a = {a:.2f} m/s²")
    axes[0].grid(True, alpha=0.3)
    axes[0].axhline(y=v[-1], color="#1B2A4E", linestyle="--", alpha=0.5)
    axes[0].text(t_max/2, v[-1]*0.9, f"v_final = {v[-1]:.2f} m/s",
                 color="#1B2A4E", fontsize=11)
    
    axes[1].plot(t, x, color="#C9A227", linewidth=2.5)
    axes[1].set_xlabel("Temps t (s)")
    axes[1].set_ylabel("Position x (m)")
    axes[1].set_title(f"Position — t_final = {t_max:.2f} s")
    axes[1].grid(True, alpha=0.3)
    axes[1].axhline(y=L, color="#1B2A4E", linestyle="--", alpha=0.5)
    
    plt.suptitle(f"Plan incliné — α = {alpha}°, μ = {mu}")
    plt.tight_layout()
    plt.savefig("output.png", dpi=100, bbox_inches="tight")
    plt.show()
`,
          sliderConfig: [
            {
              name: "alpha",
              label: "Angle α",
              min: 0,
              max: 60,
              step: 1,
              default: 30,
              unit: "°",
            },
            {
              name: "mu",
              label: "Coefficient de frottement μ",
              min: 0,
              max: 1,
              step: 0.05,
              default: 0.15,
            },
          ],
          challenges: [
            {
              id: "acc",
              question:
                "Avec α = 30° et μ = 0, quelle est l'accélération (m/s²) ?",
              expectedValue: 4.91,
              tolerance: 0.1,
              unit: "m/s²",
              hint: "Sans frottement, a = g·sin(α).",
              explanation:
                "a = 9.81 × sin(30°) = 9.81 × 0.5 = 4.905 m/s².",
            },
            {
              id: "cond",
              question:
                "Avec α = 20°, à partir de quelle valeur de μ l'objet arrête-t-il de glisser ?",
              expectedValue: 0.364,
              tolerance: 0.02,
              hint: "L'objet glisse si tan(α) > μ.",
              explanation:
                "L'objet ne glisse plus quand μ ≥ tan(20°) ≈ 0.364.",
            },
          ],
        },
        {
          type: "mcq",
          title: "Chute libre",
          question:
            "Deux objets sphériques, l'un de 1 kg et l'autre de 10 kg, sont lâchés simultanément depuis 2 m de haut dans le vide (sans frottement). Lequel touche le sol en premier ?",
          explanation:
            "En chute libre, a = g pour les deux, indépendamment de la masse. Ils atteignent le sol en même temps. C'est l'expérience (légende ?) de Galilée à Pise.",
          choices: [
            {
              text: "Ils touchent le sol en même temps",
              isCorrect: true,
              feedback:
                "✅ Exact ! En chute libre, a = g indépendamment de la masse. Les deux objets tombent en même temps. C'est la célèbre expérience de Galilée.",
            },
            {
              text: "Le plus lourd (10 kg) touche le sol en premier",
              isCorrect: false,
              feedback:
                "❌ C'est l'intuition aristotélicienne (plus lourd = plus rapide). Mais Newton nous a appris que a = g, indépendamment de m.",
            },
            {
              text: "Le plus léger (1 kg) touche le sol en premier",
              isCorrect: false,
              feedback:
                "❌ Non plus. La masse n'intervient pas en chute libre sans frottement.",
            },
            {
              text: "Ça dépend de la forme des objets",
              isCorrect: false,
              feedback:
                "❌ Pas dans le vide ! La forme n'intervient que si on tient compte des frottements de l'air.",
            },
          ],
        },
      ],
    },
  ],
};
