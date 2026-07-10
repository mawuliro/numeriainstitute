"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, Users, MessageSquare, FileText } from "lucide-react";

const MOBILE_NAV = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/cours", label: "Cours", icon: BookOpen },
  { href: "/communaute", label: "Forum", icon: MessageSquare },
  { href: "/blog", label: "Blog", icon: FileText },
  { href: "/a-propos", label: "À propos", icon: Users },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-background/95 backdrop-blur-xl lg:hidden">
      {MOBILE_NAV.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
              isActive
                ? "text-[#2DD4BF]"
                : "text-muted-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
