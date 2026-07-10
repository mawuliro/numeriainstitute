import Link from "next/link";
import { NumeriaLogoFull } from "@/components/numeria-logo";
import { MobileNav } from "@/components/mobile-nav";

export function SiteFooter() {
  return (
    <>
      <footer className="mt-auto border-t border-border/40 bg-[#1B2A4E] pb-16 lg:pb-0">
        <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <NumeriaLogoFull size={36} variant="light" />
            <p className="text-sm text-white/60">
              Quality scientific courses designed for African and French-speaking
              learners worldwide. From high school to advanced AI.
            </p>
          </div>

          {/* Links columns */}
          {[
            {
              title: "Courses",
              links: [
                { label: "All courses", href: "/cours" },
                { label: "Python · Algorithmique", href: "/cours" },
                { label: "Mécanique Classique", href: "/cours" },
                { label: "Mécanique Quantique I", href: "/cours" },
                { label: "LaTeX", href: "/cours" },
              ],
            },
            {
              title: "Platform",
              links: [
                { label: "Training Programmes", href: "/formations" },
                { label: "Blog", href: "/blog" },
                { label: "Community", href: "/communaute" },
                { label: "Mentorship", href: "/mentorat" },
                { label: "Applications", href: "/admissions" },
              ],
            },
            {
              title: "Resources",
              links: [
                { label: "About us", href: "/a-propos" },
                { label: "Contact", href: "/contact" },
                { label: "FAQ", href: "/contact" },
                { label: "Terms of use", href: "/contact" },
                { label: "Privacy", href: "/contact" },
              ],
            },
          ].map((col) => (
            <div key={col.title} className="space-y-3">
              <h3 className="text-sm font-semibold text-white">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Numeria Institute. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            📍 Lomé, Togo · Built with ❤️ for African learners
          </p>
        </div>
      </div>
    </footer>
    <MobileNav />
    </>
  );
}
