import Link from "next/link";
import { NumeriaLogoFull } from "@/components/numeria-logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <NumeriaLogoFull size={36} variant="dark" />
            <p className="text-sm text-muted-foreground">
              La plateforme d&apos;apprentissage interactive pour la physique,
              les mathématiques et la programmation. Pensée pour les
              apprenants africains et francophones.
            </p>
          </div>

          {/* Links columns */}
          {[
            {
              title: "Cours",
              links: [
                { label: "Mécanique Classique", href: "#" },
                { label: "Mécanique Quantique I", href: "#" },
                { label: "Python · Algorithmique", href: "#" },
                { label: "LaTeX", href: "#" },
              ],
            },
            {
              title: "Plateforme",
              links: [
                { label: "Catalogue", href: "#" },
                { label: "Laboratoires interactifs", href: "#" },
                { label: "Communauté", href: "#" },
                { label: "Mentorat", href: "#" },
              ],
            },
            {
              title: "Ressources",
              links: [
                { label: "Blog", href: "#" },
                { label: "FAQ", href: "#" },
                { label: "Conditions générales", href: "#" },
                { label: "Confidentialité", href: "#" },
              ],
            },
          ].map((col) => (
            <div key={col.title} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Numeria Institute. Tous droits réservés.
          </p>
          <p className="text-xs text-muted-foreground">
            Construit avec ❤️ pour les apprenants francophones
          </p>
        </div>
      </div>
    </footer>
  );
}
