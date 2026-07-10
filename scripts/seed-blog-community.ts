/**
 * Seed blog posts + community topics
 */
import { db } from "@/lib/db";

async function main() {
  // Find admin user
  const admin = await db.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) {
    console.log("No admin user found — skipping");
    return;
  }

  // ── Blog posts ──
  await db.blogPost.upsert({
    where: { slug: "welcome-to-numeria" },
    update: {},
    create: {
      slug: "welcome-to-numeria",
      title: "Bienvenue sur Numeria Institute",
      excerpt: "Découvrez notre mission : rendre la science accessible à tous les apprenants africains.",
      content: `# Bienvenue sur Numeria Institute

Numeria Institute est né d'un constat simple : l'Afrique subsaharienne connaît une transformation numérique accélérée, avec une jeunesse ambitieuse, mais un manque flagrant de formations pratiques en sciences computationnelles et en IA.

## Notre mission

Former une nouvelle génération de scientifiques et d'ingénieurs numériques africains, équipés des outils modernes (Python, Fortran, ML/AI).

## Ce que nous proposons

- Des **cours gratuits** en physique, mathématiques et programmation
- Des **laboratoires interactifs** style PhET avec simulations Python
- Des **exercices corrigés** pas-à-pas
- Un **mentorat** personnalisé

> 💡 **Inscris-toi gratuitement** pour accéder à tout le contenu !`,
      category: "Annonce",
      authorId: admin.id,
      isPublished: true,
      publishedAt: new Date("2025-01-15"),
    },
  });

  await db.blogPost.upsert({
    where: { slug: "why-python-for-african-students" },
    update: {},
    create: {
      slug: "why-python-for-african-students",
      title: "Pourquoi Python est essentiel pour les étudiants africains",
      excerpt: "Python est devenu le langage de référence en science des données, IA et calcul scientifique.",
      content: `# Pourquoi Python ?

Python est devenu le **lingua franca** de la science des données, de l'IA et du calcul scientifique. Voici pourquoi il est essentiel.

## 1. Simplicité

La syntaxe de Python est proche du pseudocode :
\`\`\`python
for i in range(10):
    print(f"Itération {i}")
\`\`\`

## 2. Écosystème scientifique

- **NumPy** : calcul numérique
- **Pandas** : analyse de données
- **Matplotlib** : visualisation
- **SciPy** : calcul scientifique
- **Scikit-learn** : machine learning

## 3. Communauté

Python a l'une des plus grandes communautés de développeurs au monde.

> 💡 Commence notre cours **Python : de l'Algorithmique à la POO** dès aujourd'hui !`,
      category: "Programmation",
      authorId: admin.id,
      isPublished: true,
      publishedAt: new Date("2025-02-01"),
    },
  });

  await db.blogPost.upsert({
    where: { slug: "latex-scientific-writing" },
    update: {},
    create: {
      slug: "latex-scientific-writing",
      title: "L'importance de LaTeX en rédaction scientifique",
      excerpt: "Pourquoi LaTeX reste le standard pour les documents scientifiques.",
      content: `# LaTeX : le standard scientifique

LaTeX reste le **standard** pour la rédaction de documents scientifiques.

## Pourquoi LaTeX ?

- **Formules mathématiques** : rendu parfait
- **Bibliographie** : gestion automatique avec BibTeX
- **Mise en page** : professionnelle sans effort
- **Stabilité** : le même document compile identiquement partout

## Exemple

$$E = mc^2$$

$$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$

> 💡 Découvrez notre cours **LaTeX : Typographie Scientifique** !`,
      category: "Outils",
      authorId: admin.id,
      isPublished: true,
      publishedAt: new Date("2025-02-15"),
    },
  });

  console.log("✓ Seeded 3 blog posts");

  // ── Community topics ──
  await db.communityTopic.create({
    data: {
      title: "Bienvenue sur le forum Numeria !",
      authorId: admin.id,
      isPinned: true,
      posts: {
        create: {
          authorId: admin.id,
          content: "Bienvenue à toutes et à tous sur le forum de Numeria Institute !\n\nC'est l'endroit idéal pour :\n- Poser vos questions sur les cours\n- Partager vos projets\n- Discuter avec d'autres apprenants\n- Trouver de l'aide\n\nN'hésitez pas à créer de nouveaux sujets !",
        },
      },
    },
  });

  console.log("✓ Seeded 1 community topic");
}

main().catch(console.error).finally(() => db.$disconnect());
