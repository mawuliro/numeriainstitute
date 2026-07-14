import Link from "next/link";
import { NumeriaLogoFull } from "@/components/numeria-logo";
import { MobileNav } from "@/components/mobile-nav";
import { getLocale, t } from "@/lib/i18n";

export async function SiteFooter() {
  const locale = await getLocale();
  const year = new Date().getFullYear();

  const columns = [
    {
      title: t(locale, "footer.courses"),
      links: [
        { label: t(locale, "footer.allCourses"), href: "/cours" },
        { label: "Python · Algorithmique", href: "/cours" },
        { label: "Mécanique Classique", href: "/cours" },
        { label: "Mécanique Quantique I", href: "/cours" },
        { label: "LaTeX", href: "/cours" },
      ],
    },
    {
      title: t(locale, "footer.platform"),
      links: [
        { label: t(locale, "nav.training"), href: "/formations" },
        { label: t(locale, "nav.blog"), href: "/blog" },
        { label: t(locale, "nav.community"), href: "/communaute" },
        { label: t(locale, "nav.mentorship"), href: "/mentorat" },
        { label: t(locale, "nav.applications"), href: "/admissions" },
      ],
    },
    {
      title: t(locale, "footer.resources"),
      links: [
        { label: t(locale, "footer.about"), href: "/a-propos" },
        { label: t(locale, "footer.contact"), href: "/contact" },
        { label: t(locale, "footer.faq"), href: "/contact" },
        { label: t(locale, "footer.terms"), href: "/contact" },
        { label: t(locale, "footer.privacy"), href: "/contact" },
      ],
    },
  ];

  return (
    <>
      <footer className="mt-auto border-t border-border/40 bg-[#1B2A4E] pb-16 lg:pb-0">
        <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <NumeriaLogoFull size={36} variant="light" />
            <p className="text-sm text-white/60">
              {t(locale, "footer.subtitle")}
            </p>
          </div>

          {/* Links columns */}
          {columns.map((col) => (
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
            © {year} Numeria Institute. {t(locale, "footer.rights")}
          </p>
          <p className="text-xs text-white/40">
            📍 {t(locale, "footer.location")} · {t(locale, "footer.builtFor")}
          </p>
        </div>
      </div>
    </footer>
    <MobileNav />
    </>
  );
}
