"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, MessageSquare, FileText, LayoutGrid } from "lucide-react";

const MOBILE_NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/cours", label: "Courses", icon: BookOpen },
  { href: "/communaute", label: "Forum", icon: MessageSquare },
  { href: "/blog", label: "Blog", icon: FileText },
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
];

export function MobileNav() {
  const pathname = usePathname();

  // Don't show on admin pages
  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-background/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] lg:hidden">
      {MOBILE_NAV.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors ${
              isActive ? "text-[#2DD4BF]" : "text-muted-foreground"
            }`}
          >
            <item.icon className={`h-5 w-5 ${isActive ? "fill-[#2DD4BF]/10" : ""}`} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
