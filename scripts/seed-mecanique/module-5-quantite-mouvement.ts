import type { ModuleInput } from "./types";

export const moduleQuantiteMouvement: ModuleInput = {
  title: "Quantité de mouvement et collisions",
  description:
    "Quantité de mouvement, impulsion, conservation, collisions élastiques et inélastiques.",
  lessons: [
    // 5.1 Quantité de mouvement et impulsion
    {
      title: "Quantité de mouvement et impulsion",
      slug: "quantite-mouvement-impulsion",
      estimatedMinutes: 25,
      isFreePreview: false,
      blocks: [
        {
          type: "text",
          content: `# Quantité de mouvement et impulsion

## 1. Quantité de mouvement

La **quantité de mouvement** (ou « moment linéaire ») d'un point matériel est :

$$\\boxed{\\vec{p} = m \\vec{v}}$$

- Vecteur colinéaire à $\\vec{v}$
- Unité : kg·m/s (ou N·s)
- Mesure la « difficulté à arrêter » un objet

> Une voiture de 1000 kg à 10 m/s (p = 10 000 kg·m/s) est aussi difficile à arrêter qu'un camion de 5000 kg à 2 m/s (p = 10 000 kg·m/s).

## 2. PFD reformulé

$$\\vec{F} = m\\vec{a} = m \\frac{d\\vec{v}}{dt} = \\frac{d\\vec{p}}{dt}$$

> La force est la **dérivée temporelle** de la quantité de mouvement. Cette formulation reste valable même quand la masse varie (fusées, particules relativistes).

## 3. Impulsion (choc)

L'**impulsion** d'une force $\\vec{F}$ pendant un intervalle $\\Delta t$ est :

$$\\boxed{\\vec{J} = \\vec{F} \\cdot \\Delta t = \\Delta \\vec{p}}$$

- Même unité que la quantité de mouvement (N·s)
- Égale à la variation de quantité de mouvement

> Une force intense et brève (explosion, choc) peut produire une grande impulsion.

## 4. Schéma : impulsion d'un choc

<svg viewBox="0 0 500 280" xmlns="http://www.w3.org/2000/svg" style="background:#fff;max-width:100%;border-radius:8px;border:1px solid #e5e7eb">
  <!-- Avant le choc -->
  <text x="100" y="40" font-size="13" fill="#1B2A4E" font-weight="bold">Avant</text>
  <circle cx="80" cy="80" r="15" fill="#2DD4BF" stroke="#1B2A4E"/>
  <text x="80" y="84" font-size="11" fill="#1B2A4E" text-anchor="middle" font-weight="bold">m₁</text>
  <line x1="80" y1="80" x2="130" y2="80" stroke="#2DD4BF" stroke-width="2" marker-end="url(#arrQ)"/>
  <text x="140" y="80" font-size="12" fill="#2DD4BF">v₁</text>
  
  <circle cx="350" cy="80" r="15" fill="#C9A227" stroke="#1B2A4E"/>
  <text x="350" y="84" font-size="11" fill="#1B2A4E" text-anchor="middle" font-weight="bold">m₂</text>
  <text x="380" y="80" font-size="12" fill="#C9A227">v₂=0</text>
  
  <!-- Pendant le choc -->
  <text x="100" y="140" font-size="13" fill="#EF4444" font-weight="bold">Choc (Δt très court)</text>
  <circle cx="200" cy="160" r="20" fill="#2DD4BF" stroke="#1B2A4E" stroke-width="2"/>
  <circle cx="240" cy="160" r="20" fill="#C9A227" stroke="#1B2A4E" stroke-width="2"/>
  <text x="200" y="165" font-size="12" fill="#1B2A4E" text-anchor="middle" font-weight="bold">m₁</text>
  <text x="240" y="165" font-size="12" fill="#1B2A4E" text-anchor="middle" font-weight="bold">m₂</text>
  
  <text x="220" y="205" font-size="12" fill="#EF4444" font-weight="bold" text-anchor="middle">Force F intense</text>
  <text x="220" y="220" font-size="11" fill="#666" text-anchor="middle">J = F·Δt = Δp</text>
  
  <defs>
    <marker id="arrQ" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#2DD4BF"/>
    </marker>
  </defs>
</svg>

## 5. Force moyenne lors d'un choc

Si on connaît $\\Delta t$ et $\\Delta \\vec{p}$, on peut estimer la force moyenne :

$$F_{moy} = \\frac{\\Delta p}{\\Delta t}$$

> 💡 Les airbags augmentent $\\Delta t$ (de ~5 ms à ~30 ms), ce qui réduit la force par un facteur 6.`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Airbag

**Énoncé** : Une personne de 70 kg subit un choc qui la fait passer de 15 m/s à 0 m/s. Calculer :
1. L'impulsion nécessaire
2. La force moyenne avec un airbag ($\\Delta t = 30$ ms) vs sans airbag ($\\Delta t = 5$ ms)

### Étape 1 — Impulsion

$$\\vec{J} = \\Delta \\vec{p} = m(v_f - v_i) = 70 \\times (0 - 15)$$

$$\\boxed{\\vec{J} = -1050 \\text{ N·s}}$$

Le signe négatif indique que l'impulsion s'oppose au mouvement (force de freinage).

### Étape 2 — Force moyenne avec airbag

$$F_{airbag} = \\frac{|J|}{\\Delta t_{airbag}} = \\frac{1050}{0{,}030} = 35\\,000 \\text{ N}$$

### Étape 3 — Force moyenne sans airbag

$$F_{sans} = \\frac{1050}{0{,}005} = 210\\,000 \\text{ N}$$

### Étape 4 — Comparaison

$$\\frac{F_{sans}}{F_{airbag}} = \\frac{210\\,000}{35\\,000} = 6$$

> ✅ L'airbag réduit la force moyenne d'un **facteur 6**. Sans airbag, 210 000 N sur le thorax causerait des blessures graves (côtes cassées, traumatismes internes). Avec airbag, 35 000 N reste tolérable pour un humain sain.`,
        },
        {
          type: "mcq",
          title: "Quantité de mouvement",
          question:
            "Un camion de 5 tonnes roule à 36 km/h et une voiture de 1 tonne roule à 90 km/h. Lequel a la plus grande quantité de mouvement ?",
          explanation:
            "p_camion = 5000 × 10 = 50 000 kg·m/s. p_voiture = 1000 × 25 = 25 000 kg·m/s. Le camion a 2× plus de quantité de mouvement.",
          choices: [
            {
              text: "Le camion (50 000 vs 25 000 kg·m/s)",
              isCorrect: true,
              feedback:
                "✅ Exact ! Convertis les km/h en m/s, puis calcule p = mv. Le camion a 2× plus de quantité de mouvement.",
            },
            {
              text: "La voiture (car elle va plus vite)",
              isCorrect: false,
              feedback:
                "❌ La voiture va 2,5× plus vite mais est 5× plus légère. p = mv, le camion gagne.",
            },
            {
              text: "Ils ont la même quantité de mouvement",
              isCorrect: false,
              feedback:
                "❌ Calcul : camion = 5000×10 = 50 000, voiture = 1000×25 = 25 000. Pas égaux !",
            },
            {
              text: "On ne peut pas savoir sans plus d'infos",
              isCorrect: false,
              feedback:
                "❌ On a toutes les infos nécessaires. Juste convertir les vitesses en m/s.",
            },
          ],
        },
        {
          type: "mcq",
          title: "Impulsion d'une force",
          question:
            "Une force constante de 50 N s'exerce pendant 0,2 s sur un objet de 2 kg initialement au repos. Quelle est sa vitesse finale ?",
          explanation:
            "J = F·Δt = 50 × 0,2 = 10 N·s = Δp = m·Δv. Donc Δv = 10/2 = 5 m/s. Comme v_initial = 0, v_final = 5 m/s.",
          choices: [
            {
              text: "5 m/s",
              isCorrect: true,
              feedback:
                "✅ Exact ! J = F·Δt = Δp, donc Δv = J/m = 10/2 = 5 m/s.",
            },
            {
              text: "10 m/s",
              isCorrect: false,
              feedback:
                "❌ Tu as oublié de diviser par la masse. J = Δp = m·Δv, donc Δv = J/m.",
            },
            {
              text: "0,4 m/s",
              isCorrect: false,
              feedback:
                "❌ Tu as divisé la force par le temps au lieu de multiplier. J = F·Δt, pas F/Δt.",
            },
            {
              text: "20 m/s",
              isCorrect: false,
              feedback:
                "❌ Tu as fait m/F. La formule est J = F·Δt = m·Δv, donc Δv = F·Δt/m.",
            },
          ],
        },
      ],
    },

    // 5.2 Conservation de la quantité de mouvement
    {
      title: "Conservation de la quantité de mouvement",
      slug: "conservation-quantite-mouvement",
      estimatedMinutes: 30,
      isFreePreview: false,
      blocks: [
        {
          type: "text",
          content: `# Conservation de la quantité de mouvement

## 1. Énoncé

> Si un système est **isolé** (aucune force extérieure), sa quantité de mouvement totale est **constante** :

$$\\boxed{\\sum \\vec{p}_i = \\text{constante}}$$

### Formulation mathématique

Pour deux corps en interaction :

$$m_1 \\vec{v}_1^{avant} + m_2 \\vec{v}_2^{avant} = m_1 \\vec{v}_1^{après} + m_2 \\vec{v}_2^{après}$$

## 2. Condition de validité

- **Système isolé** : pas de force extérieure (ou leur résultante est nulle)
- En pratique, les **forces internes** (chocs, attractions mutuelles) se compensent par la 3ème loi de Newton

> ⚠️ La quantité de mouvement se conserve **même si l'énergie mécanique est dissipée** (chocs inélastiques).

## 3. Schéma : collision à un degré de liberté

<svg viewBox="0 0 500 280" xmlns="http://www.w3.org/2000/svg" style="background:#fff;max-width:100%;border-radius:8px;border:1px solid #e5e7eb">
  <!-- Avant -->
  <text x="20" y="40" font-size="13" fill="#1B2A4E" font-weight="bold">Avant le choc</text>
  <circle cx="80" cy="70" r="18" fill="#2DD4BF" stroke="#1B2A4E"/>
  <text x="80" y="74" font-size="12" fill="#1B2A4E" text-anchor="middle" font-weight="bold">m₁</text>
  <line x1="100" y1="70" x2="160" y2="70" stroke="#2DD4BF" stroke-width="2" marker-end="url(#arrC)"/>
  <text x="170" y="74" font-size="12" fill="#2DD4BF" font-weight="bold">v₁</text>
  
  <circle cx="350" cy="70" r="18" fill="#C9A227" stroke="#1B2A4E"/>
  <text x="350" y="74" font-size="12" fill="#1B2A4E" text-anchor="middle" font-weight="bold">m₂</text>
  <text x="380" y="74" font-size="12" fill="#C9A227" font-weight="bold">v₂=0</text>
  
  <!-- Conservation équation -->
  <text x="200" y="115" font-size="13" fill="#EF4444" font-weight="bold" text-anchor="middle">m₁v₁ + m₂v₂ = constante</text>
  
  <!-- Après -->
  <text x="20" y="170" font-size="13" fill="#1B2A4E" font-weight="bold">Après le choc</text>
  <circle cx="80" cy="200" r="18" fill="#2DD4BF" stroke="#1B2A4E"/>
  <text x="80" y="204" font-size="12" fill="#1B2A4E" text-anchor="middle" font-weight="bold">m₁</text>
  <line x1="100" y1="200" x2="140" y2="200" stroke="#2DD4BF" stroke-width="2" marker-end="url(#arrC)"/>
  <text x="150" y="204" font-size="12" fill="#2DD4BF" font-weight="bold">v₁'</text>
  
  <circle cx="350" cy="200" r="18" fill="#C9A227" stroke="#1B2A4E"/>
  <text x="350" y="204" font-size="12" fill="#1B2A4E" text-anchor="middle" font-weight="bold">m₂</text>
  <line x1="370" y1="200" x2="430" y2="200" stroke="#C9A227" stroke-width="2" marker-end="url(#arrC)"/>
  <text x="440" y="204" font-size="12" fill="#C9A227" font-weight="bold">v₂'</text>
  
  <!-- Conservation équation -->
  <text x="200" y="245" font-size="13" fill="#EF4444" font-weight="bold" text-anchor="middle">m₁v₁' + m₂v₂' = m₁v₁ (même valeur)</text>
  
  <defs>
    <marker id="arrC" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#2DD4BF"/>
    </marker>
  </defs>
</svg>

## 4. Cas particuliers

### Masse identique ($m_1 = m_2$), collision élastique, v₂ = 0

Les vitesses s'échangent : $v_1' = 0$ et $v_2' = v_1$.

> C'est ce qu'on observe au billard quand une bille en frappe une autre de plein fouet.

### Masse très différente ($m_1 \\ll m_2$)

- La petite masse rebondit (presque) sans perdre d'énergie
- La grande masse est à peine ébranlée

### Cas d'un système isolé à 2 corps

La quantité de mouvement se conserve, ce qui permet de résoudre le problème même si l'énergie mécanique est perdue (choc inélastique).`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Recoil d'une arme à feu

**Énoncé** : Une arme de masse $M = 4$ kg tire une balle de masse $m = 0{,}02$ kg (20 g) avec une vitesse $v_b = 400$ m/s. Calculer la vitesse de recul $V$ de l'arme.

### Étape 1 — Avant le tir

Système au repos : $p_{avant} = 0$.

### Étape 2 — Après le tir

$$p_{après} = m v_b + M V$$

### Étape 3 — Conservation

$$p_{avant} = p_{après}$$

$$0 = m v_b + M V$$

$$V = -\\frac{m v_b}{M} = -\\frac{0{,}02 \\times 400}{4}$$

$$\\boxed{V = -2 \\text{ m/s}}$$

Le signe négatif indique que l'arme recule en sens opposé à la balle.

### Étape 4 — Interprétation

- La balle part vers l'avant à 400 m/s avec $p_b = 8$ kg·m/s
- L'arme recule à 2 m/s vers l'arrière avec $p_a = -8$ kg·m/s
- Total : $p = 0$ (conservé) ✅

### Étape 5 — Énergie cinétique

- Balle : $E_{c,b} = \\frac{1}{2} \\times 0{,}02 \\times 400^2 = 1600$ J
- Arme : $E_{c,a} = \\frac{1}{2} \\times 4 \\times 2^2 = 8$ J

> ✅ La balle emporte **99,5 %** de l'énergie cinétique. C'est pourquoi une petite balle légère à haute vitesse est beaucoup plus dangereuse qu'une arme lourde reculant lentement.

### Étape 6 — Vérification

Les quantités de mouvement : $|p_b| = |p_a| = 8$ kg·m/s ✅`,
        },
        {
          type: "mcq",
          title: "Conservation de p",
          question:
            "Une patineuse de 50 kg lance une balle de 1 kg à 10 m/s horizontalement. Elle était initialement immobile. Quelle est sa vitesse après le lancer ?",
          explanation:
            "p_avant = 0, p_après = 1×10 + 50×V = 0, donc V = -10/50 = -0,2 m/s (recul).",
          choices: [
            {
              text: "0,2 m/s en sens opposé à la balle",
              isCorrect: true,
              feedback:
                "✅ Exact ! Par conservation de p : m_balle·v_balle + m_patineuse·V = 0, donc V = -10/50 = -0,2 m/s.",
            },
            {
              text: "0,2 m/s dans le même sens que la balle",
              isCorrect: false,
              feedback:
                "❌ La patineuse recule, elle ne va pas dans le même sens que la balle. C'est la 3ème loi de Newton.",
            },
            {
              text: "0,5 m/s (recul)",
              isCorrect: false,
              feedback:
                "❌ Tu as probablement inversé les masses. V = -m_balle·v_balle/m_patineuse = -1×10/50 = -0,2 m/s.",
            },
            {
              text: "La patineuse reste immobile",
              isCorrect: false,
              feedback:
                "❌ Si la balle part, par conservation de p, la patineuse doit reculer. Sinon p_total augmenterait sans raison.",
            },
          ],
        },
      ],
    },

    // 5.3 Collisions élastiques
    {
      title: "Collisions élastiques",
      slug: "collisions-elastiques",
      estimatedMinutes: 30,
      isFreePreview: false,
      blocks: [
        {
          type: "text",
          content: `# Collisions élastiques

## 1. Définition

Une collision est **élastique** si :
- La quantité de mouvement totale est conservée (toujours le cas)
- L'**énergie cinétique totale** est aussi conservée

$$\\boxed{\\begin{cases} m_1 v_1 + m_2 v_2 = m_1 v_1' + m_2 v_2' \\\\ \\frac{1}{2}m_1 v_1^2 + \\frac{1}{2}m_2 v_2^2 = \\frac{1}{2}m_1 v_1'^2 + \\frac{1}{2}m_2 v_2'^2 \\end{cases}}$$

## 2. Solution générale (1D, m₂ initialement au repos)

Si $v_2 = 0$, après résolution du système :

$$v_1' = \\frac{m_1 - m_2}{m_1 + m_2} v_1$$

$$v_2' = \\frac{2 m_1}{m_1 + m_2} v_1$$

## 3. Cas particuliers

### m₁ = m₂ (même masse)

$$v_1' = 0 \\quad ; \\quad v_2' = v_1$$

> Les deux objets échangent leurs vitesses. C'est ce qu'on voit au billard.

### m₁ ≫ m₂ (petite masse heurtée)

- $v_1' \\approx v_1$ (la grande masse est peu ralentie)
- $v_2' \\approx 2 v_1$ (la petite masse part à 2× la vitesse initiale)

### m₁ ≪ m₂ (mur massif)

- $v_1' \\approx -v_1$ (rebond, vitesse inversée)
- $v_2' \\approx 0$ (la grande masse ne bouge presque pas)

## 4. Schéma : choc élastique 1D

<svg viewBox="0 0 500 280" xmlns="http://www.w3.org/2000/svg" style="background:#fff;max-width:100%;border-radius:8px;border:1px solid #e5e7eb">
  <!-- Avant -->
  <text x="20" y="40" font-size="13" fill="#1B2A4E" font-weight="bold">Cas général : m₁ ≠ m₂, v₂ = 0</text>
  
  <circle cx="80" cy="100" r="22" fill="#2DD4BF" stroke="#1B2A4E"/>
  <text x="80" y="105" font-size="13" fill="#1B2A4E" text-anchor="middle" font-weight="bold">m₁</text>
  <line x1="105" y1="100" x2="170" y2="100" stroke="#2DD4BF" stroke-width="2.5" marker-end="url(#arrE)"/>
  <text x="135" y="92" font-size="12" fill="#2DD4BF" font-weight="bold">v₁</text>
  
  <circle cx="380" cy="100" r="14" fill="#C9A227" stroke="#1B2A4E"/>
  <text x="380" y="105" font-size="11" fill="#1B2A4E" text-anchor="middle" font-weight="bold">m₂</text>
  <text x="400" y="105" font-size="12" fill="#C9A227" font-weight="bold">v₂=0</text>
  
  <!-- Equations -->
  <text x="250" y="180" font-size="12" fill="#1B2A4E" font-weight="bold" text-anchor="middle">Après le choc :</text>
  <text x="250" y="200" font-size="13" fill="#EF4444" font-weight="bold" text-anchor="middle">v₁' = (m₁-m₂)/(m₁+m₂) · v₁</text>
  <text x="250" y="220" font-size="13" fill="#EF4444" font-weight="bold" text-anchor="middle">v₂' = 2m₁/(m₁+m₂) · v₁</text>
  <text x="250" y="250" font-size="11" fill="#666" font-weight="bold" text-anchor="middle">Si m₁ = m₂ : échange des vitesses (billard)</text>
  
  <defs>
    <marker id="arrE" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#2DD4BF"/>
    </marker>
  </defs>
</svg>

## 5. Conservation de l'énergie cinétique

$$\\frac{1}{2}m_1 v_1^2 + \\frac{1}{2}m_2 v_2^2 = \\frac{1}{2}m_1 v_1'^2 + \\frac{1}{2}m_2 v_2'^2$$

> ⚠️ Une collision **n'est jamais parfaitement élastique** dans la réalité. Aux billard, environ 5 % de l'énergie est dissipée. Mais l'approximation reste utile.`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Collisions au billard

**Énoncé** : Une boule de billard de masse $m_1 = 0{,}2$ kg se déplace à $v_1 = 3$ m/s et tape une autre boule identique ($m_2 = 0{,}2$ kg) immobile. Le choc est élastique. Calculer $v_1'$ et $v_2'$.

### Étape 1 — Identifier les masses égales

$m_1 = m_2$, donc $v_2 = 0$ initialement. On peut utiliser le cas particulier :

$$v_1' = \\frac{m_1 - m_2}{m_1 + m_2} v_1 = \\frac{0}{0{,}4} v_1 = 0$$

$$v_2' = \\frac{2 m_1}{m_1 + m_2} v_1 = \\frac{0{,}4}{0{,}4} \\times 3 = 3 \\text{ m/s}$$

$$\\boxed{v_1' = 0 \\text{ m/s} \\quad ; \\quad v_2' = 3 \\text{ m/s}}$$

### Étape 2 — Vérifier la conservation de la quantité de mouvement

Avant : $p_{avant} = 0{,}2 \\times 3 = 0{,}6$ kg·m/s

Après : $p_{après} = 0{,}2 \\times 0 + 0{,}2 \\times 3 = 0{,}6$ kg·m/s ✅

### Étape 3 — Vérifier la conservation de l'énergie cinétique

Avant : $E_c^{avant} = \\frac{1}{2} \\times 0{,}2 \\times 9 = 0{,}9$ J

Après : $E_c^{après} = 0 + \\frac{1}{2} \\times 0{,}2 \\times 9 = 0{,}9$ J ✅

### Étape 4 — Interprétation

> ✅ Les deux boules ont **échangé leurs vitesses**. La première s'arrête net, la deuxième part à la vitesse qu'avait la première. C'est la signature d'un choc élastique entre masses égales.

### Étape 5 — Cas d'une boule frappant un mur

Si $m_2 \\to \\infty$ (mur), $v_2' \\to 0$ et $v_1' \\to -v_1$. La boule rebondit avec la même vitesse en sens opposé.`,
        },
        {
          type: "mcq",
          title: "Collision élastique entre masses égales",
          question:
            "Une boule A de masse m, animée d'une vitesse v, heurte de plein fouet une boule B identique au repos. Que se passe-t-il ?",
          explanation:
            "En choc élastique 1D entre masses égales, les deux objets échangent leurs vitesses. Donc A s'arrête et B part à v.",
          choices: [
            {
              text: "A s'arrête, B part à la vitesse v",
              isCorrect: true,
              feedback:
                "✅ Exact ! v_A' = (m-m)/(m+m) · v = 0, v_B' = 2m/(m+m) · v = v. C'est le fameux « échange des vitesses ».",
            },
            {
              text: "A et B partent ensemble à v/2",
              isCorrect: false,
              feedback:
                "❌ Ce serait un choc parfaitement inélastique (les deux objets restent collés), pas élastique.",
            },
            {
              text: "A rebondit à -v, B reste immobile",
              isCorrect: false,
              feedback:
                "❌ C'est ce qui se passerait si B était un mur (masse infinie). Pour des masses égales, il y a échange.",
            },
            {
              text: "A et B partent en sens opposés à v",
              isCorrect: false,
              feedback:
                "❌ Cela ne conserverait pas la quantité de mouvement (p_final = 0 ≠ p_initial = mv).",
            },
          ],
        },
        {
          type: "mcq",
          title: "Choc petit objet / grand objet",
          question:
            "Une balle de ping-pong (m₁ = 2,7 g) tape un mur (m₂ → ∞) à 5 m/s. Sa vitesse après rebond est...",
          explanation:
            "Quand m₂ → ∞ : v₁' = (m₁-m₂)/(m₁+m₂) · v₁ ≈ -v₁. La balle rebondit avec la même vitesse en sens opposé.",
          choices: [
            {
              text: "-5 m/s (rebond à la même vitesse)",
              isCorrect: true,
              feedback:
                "✅ Exact ! Quand m₂ ≫ m₁, v₁' ≈ -v₁ : la balle rebondit avec la même vitesse en sens opposé.",
            },
            {
              text: "0 m/s (la balle s'arrête)",
              isCorrect: false,
              feedback:
                "❌ L'énergie cinétique est conservée en choc élastique. Si la balle s'arrêtait, où irait l'énergie ?",
            },
            {
              text: "-2,5 m/s (vitesse divisée par 2)",
              isCorrect: false,
              feedback:
                "❌ Pas de raison. En choc élastique contre un mur massif, la vitesse est inversée, pas diminuée.",
            },
            {
              text: "+5 m/s (continue tout droit)",
              isCorrect: false,
              feedback:
                "❌ La balle ne peut pas traverser le mur ! Elle rebondit.",
            },
          ],
        },
      ],
    },

    // 5.4 Collisions inélastiques
    {
      title: "Collisions inélastiques",
      slug: "collisions-inelastiques",
      estimatedMinutes: 30,
      isFreePreview: false,
      blocks: [
        {
          type: "text",
          content: `# Collisions inélastiques

## 1. Définition

Une collision est **inélastique** si une partie de l'énergie cinétique est convertie en d'autres formes (chaleur, déformation, son). La quantité de mouvement est toujours conservée, mais l'énergie cinétique diminue.

### Collision parfaitement inélastique

Les deux objets **restent accrochés** après le choc, formant un seul système de masse $m_1 + m_2$.

$$\\boxed{m_1 v_1 + m_2 v_2 = (m_1 + m_2) v_{final}}$$

$$v_{final} = \\frac{m_1 v_1 + m_2 v_2}{m_1 + m_2}$$

## 2. Perte d'énergie cinétique

L'énergie cinétique avant et après :

$$E_c^{avant} = \\frac{1}{2} m_1 v_1^2 + \\frac{1}{2} m_2 v_2^2$$

$$E_c^{après} = \\frac{1}{2} (m_1 + m_2) v_{final}^2$$

La différence $\\Delta E_c = E_c^{après} - E_c^{avant} < 0$ est l'énergie dissipée.

### Cas particulier : m₂ au repos ($v_2 = 0$)

$$\\Delta E_c = -\\frac{1}{2} \\frac{m_1 m_2}{m_1 + m_2} v_1^2$$

## 3. Coefficient de restitution

Pour un choc partiellement élastique, on définit :

$$e = -\\frac{v_1' - v_2'}{v_1 - v_2}$$

- $e = 1$ : choc parfaitement élastique (énergie conservée)
- $e = 0$ : choc parfaitement inélastique (les corps restent collés)
- $0 < e < 1$ : choc partiellement élastique (réalité)

### Valeurs typiques

| Matériaux | $e$ |
|---|---|
| Acier / acier | 0,95 |
| Bois / bois | 0,5 |
| Argile / argile | 0,0 |
| Balle de tennis / sol | 0,75 |
| Balle de golf / sol | 0,85 |`,
        },
        {
          type: "text",
          content: `## Exemple corrigé — Accident de voiture

**Énoncé** : Une voiture de masse $m_1 = 1000$ kg roulant à $v_1 = 20$ m/s percute une voiture de masse $m_2 = 1500$ kg à l'arrêt. Les deux véhicules restent emboîtés (collision parfaitement inélastique). Calculer :
1. La vitesse finale des deux voitures
2. L'énergie cinétique perdue

### Étape 1 — Vitesse finale

$$v_f = \\frac{m_1 v_1 + m_2 v_2}{m_1 + m_2} = \\frac{1000 \\times 20 + 0}{1000 + 1500}$$

$$v_f = \\frac{20\\,000}{2500}$$

$$\\boxed{v_f = 8 \\text{ m/s} \\approx 29 \\text{ km/h}}$$

### Étape 2 — Énergie cinétique avant

$$E_c^{avant} = \\frac{1}{2} \\times 1000 \\times 400 + 0 = 200\\,000 \\text{ J} = 200 \\text{ kJ}$$

### Étape 3 — Énergie cinétique après

$$E_c^{après} = \\frac{1}{2} \\times 2500 \\times 64 = 80\\,000 \\text{ J} = 80 \\text{ kJ}$$

### Étape 4 — Énergie dissipée

$$\\Delta E_c = 80 - 200 = -120 \\text{ kJ}$$

> ✅ **60 %** de l'énergie cinétique initiale (120 kJ sur 200 kJ) est dissipée en chaleur et en déformation des véhicules. Cette énergie correspond à peu près à l'énergie nécessaire pour chauffer 30 litres d'eau de 0°C à 100°C. C'est pourquoi les voitures modernes sont conçues pour absorber cette énergie dans des zones de déformation programmées, protégeant ainsi les passagers.`,
        },
        {
          type: "mcq",
          title: "Collision parfaitement inélastique",
          question:
            "Deux wagons de masses m₁ = 5 t et m₂ = 3 t entrent en collision parfaitement inélastique. Le premier roule à 4 m/s, le second à 2 m/s dans la même direction. Quelle est leur vitesse commune après accrochage ?",
          explanation:
            "v_f = (m₁v₁ + m₂v₂)/(m₁+m₂) = (5×4 + 3×2)/(5+3) = (20+6)/8 = 26/8 = 3,25 m/s.",
          choices: [
            {
              text: "3,25 m/s",
              isCorrect: true,
              feedback:
                "✅ Exact ! v_f = (5000×4 + 3000×2)/(5000+3000) = 26000/8000 = 3,25 m/s.",
            },
            {
              text: "6 m/s",
              isCorrect: false,
              feedback:
                "❌ Tu as additionné les vitesses. La vitesse commune n'est pas la somme, c'est la moyenne pondérée par les masses.",
            },
            {
              text: "3 m/s",
              isCorrect: false,
              feedback:
                "❌ Tu as fait la moyenne arithmétique simple. C'est une moyenne pondérée par les masses : (m₁v₁+m₂v₂)/(m₁+m₂).",
            },
            {
              text: "0 m/s",
              isCorrect: false,
              feedback:
                "❌ Les deux wagons ont des vitesses dans le même sens, donc ils ne s'arrêtent pas. La vitesse finale est non nulle.",
            },
          ],
        },
        {
          type: "mcq",
          title: "Énergie dissipée",
          question:
            "Dans une collision parfaitement inélastique entre deux masses égales, l'une au repos, quelle fraction de l'énergie cinétique est dissipée ?",
          explanation:
            "E_c_avant = ½mv₁². v_f = mv₁/(2m) = v₁/2. E_c_après = ½(2m)(v₁/2)² = ¼mv₁². Donc 50% de l'énergie est dissipée.",
          choices: [
            {
              text: "50 % (la moitié)",
              isCorrect: true,
              feedback:
                "✅ Exact ! E_avant = ½mv₁², E_après = ½(2m)(v₁/2)² = ¼mv₁². Donc ½mv₁² - ¼mv₁² = ¼mv₁² dissipée, soit 50% de E_avant.",
            },
            {
              text: "100 % (toute l'énergie)",
              isCorrect: false,
              feedback:
                "❌ Pas toute ! Le système final a encore une énergie cinétique (= ¼mv₁²).",
            },
            {
              text: "25 % (un quart)",
              isCorrect: false,
              feedback:
                "❌ C'est l'énergie RESTANTE, pas l'énergie dissipée. 25% reste, donc 75% est dissipée... non, attends : E_après = ¼mv², E_avant = ½mv², donc 50% dissipée.",
            },
            {
              text: "0 % (aucune perte)",
              isCorrect: false,
              feedback:
                "❌ Ce serait un choc élastique, pas inélastique. En collision parfaitement inélastique, l'énergie cinétique diminue.",
            },
          ],
        },
      ],
    },
  ],
};
