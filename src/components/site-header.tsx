import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { NumeriaLogoFull } from "@/components/numeria-logo";
import { Button } from "@/components/ui/button";

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
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <NumeriaLogoFull size={36} variant="dark" />
        </Link>

        {/* Desktop nav */}
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

        {/* Auth buttons */}
        <div className="flex items-center gap-2">
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
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="text-sm"
                >
                  Log out
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
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Sign up for free
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile nav — scrollable */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border/40 px-4 py-1.5 lg:hidden">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
