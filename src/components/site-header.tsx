import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLocale, t } from "@/lib/i18n";
import { NumeriaLogoFull } from "@/components/numeria-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/notification-bell";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/mobile-menu";

export async function SiteHeader() {
  const session = await auth();
  const locale = await getLocale();

  const navItems = [
    { href: "/cours", label: t(locale, "nav.courses") },
    { href: "/formations", label: t(locale, "nav.training") },
    { href: "/blog", label: t(locale, "nav.blog") },
    { href: "/admissions", label: t(locale, "nav.applications") },
    { href: "/communaute", label: t(locale, "nav.community") },
    { href: "/visioconference", label: t(locale, "nav.videoconference") },
    { href: "/a-propos", label: t(locale, "nav.about") },
    { href: "/contact", label: t(locale, "nav.contact") },
  ];

  let notifications: {
    id: string; title: string; message: string; link: string | null;
    isRead: boolean; createdAt: string;
  }[] = [];

  if (session?.user) {
    const dbNotifs = await db.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    notifications = dbNotifs.map((n) => ({
      ...n, createdAt: n.createdAt.toISOString(),
    }));
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:h-16 sm:px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <NumeriaLogoFull size={32} variant="dark" />
          </Link>
          <nav className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}
                className="rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <LanguageSwitcher currentLocale={locale} />
          <ThemeToggle />

          {session?.user ? (
            <>
              <NotificationBell initialNotifications={notifications} />
              <Link href="/dashboard" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block">
                {t(locale, "auth.dashboard")}
              </Link>
              <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
                <Button type="submit" variant="ghost" size="sm" className="text-sm">
                  <span className="hidden sm:inline">{t(locale, "auth.logout")}</span>
                  <span className="sm:hidden">⏻</span>
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block">
                {t(locale, "auth.login")}
              </Link>
              <Link href="/signup" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:px-4 sm:py-2 sm:text-sm">
                <span className="hidden sm:inline">{t(locale, "auth.signupFree")}</span>
                <span className="sm:hidden">{t(locale, "auth.signup")}</span>
              </Link>
            </>
          )}
          <div className="lg:hidden">
            <MobileMenu navItems={navItems} isLoggedIn={!!session?.user} />
          </div>
        </div>
      </div>
    </header>
  );
}
