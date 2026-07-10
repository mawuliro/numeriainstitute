import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  Settings,
  type LucideIcon,
} from "lucide-react";

const ADMIN_NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cours", label: "Cours", icon: BookOpen },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || (user.role !== "STAFF" && user.role !== "ADMIN")) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 border-r bg-[#1B2A4E] text-white lg:flex lg:flex-col">
        <div className="border-b border-white/10 p-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold">NUMERIA</span>
            <span className="text-xs uppercase tracking-widest text-[#2DD4BF]">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Settings className="h-4 w-4" />
            Retour au site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex items-center justify-between border-b bg-[#1B2A4E] px-4 py-3 lg:hidden">
          <Link href="/" className="text-lg font-bold text-white">
            NUMERIA <span className="text-[#2DD4BF]">Admin</span>
          </Link>
          <div className="flex gap-1">
            {ADMIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg p-2 text-white/70 hover:bg-white/10"
              >
                <item.icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
