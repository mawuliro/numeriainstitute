"use client";
import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";

type SearchResult = { type: string; title: string; href: string; category?: string };

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (query.length < 2) return;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch { setResults([]); }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const typeIcons: Record<string, string> = { course: "📚", lesson: "📄", blog: "✍️" };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Search">
        <Search className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 max-w-[90vw] rounded-xl border border-border bg-card shadow-xl">
          <div className="flex items-center gap-2 border-b p-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher cours, leçons, articles..." className="flex-1 bg-transparent text-sm outline-none" />
            <button onClick={() => { setOpen(false); setQuery(""); }} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {loading && <p className="p-4 text-center text-xs text-muted-foreground">Recherche...</p>}
            {!loading && query.length >= 2 && results.length === 0 && <p className="p-4 text-center text-xs text-muted-foreground">Aucun résultat</p>}
            {results.map((r, i) => (
              <Link key={i} href={r.href} onClick={() => { setOpen(false); setQuery(""); }} className="flex items-center gap-2 border-b p-3 hover:bg-muted/50 transition-colors">
                <span className="text-lg">{typeIcons[r.type] ?? "🔍"}</span>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{r.title}</p><p className="text-xs text-muted-foreground capitalize">{r.type}{r.category ? ` · ${r.category}` : ""}</p></div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
