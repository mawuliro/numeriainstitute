import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { NumeriaLogoFull } from "@/components/numeria-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/mobile-menu";

const NAV_ITEMS = [
  { href: "/cours", label: "Courses" },
  { href: "/formations", label: "Training Programmes" },
  { href: "/blog", label: "Blog" },
  { href: "/admissions", label: "Applications" },
  { href: "/communaute", label: "Community" },
  { href: "/mentorat", label: "Mentorship" },
  { href: "/a-propos", label: "About" },
  { href: "/contact", label: "Contact" },
];

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:h-16 sm:px-4">
        {/* Left: logo + desktop nav */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <NumeriaLogoFull size={32} variant="dark" />
          </Link>

          {/* Desktop nav — hidden on mobile/tablet */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1.5">
          {/* Language flags — hidden on mobile */}
          <div className="hidden items-center gap-0.5 sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg text-sm" title="Français">🇫🇷</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg text-sm opacity-50" title="English">🇬🇧</span>
          </div>

          {/* Dark mode toggle */}
          <ThemeToggle />

          {/* Auth — compact on mobile */}
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
              >
                Dashboard
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button type="submit" variant="ghost" size="sm" className="text-sm">
                  <span className="hidden sm:inline">Log out</span>
                  <span className="sm:hidden">⏻</span>
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:px-4 sm:py-2 sm:text-sm"
              >
                <span className="hidden sm:inline">Sign up for free</span>
                <span className="sm:hidden">Sign up</span>
              </Link>
            </>
          )}

          {/* Hamburger menu — mobile only */}
          <div className="lg:hidden">
            <MobileMenu navItems={NAV_ITEMS} isLoggedIn={!!session?.user} />
          </div>
        </div>
      </div>
    </header>
  );
}
