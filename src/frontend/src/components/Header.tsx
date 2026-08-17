import { Cpu, Search } from "lucide-react";
import { useGetBusinessInfo } from "../hooks/useQueries";

const NAV_LINKS = [
  { href: "#services", label: "Layanan" },
  { href: "#gallery", label: "Galeri" },
  { href: "#team", label: "Teknisi" },
  { href: "#visit", label: "Kunjungi" },
];

export default function Header({
  onOpenTracker,
}: {
  onOpenTracker: () => void;
}) {
  const { data: info } = useGetBusinessInfo();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <a
          href="#top"
          className="flex items-center gap-2.5"
          data-ocid="header.brand"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
            <Cpu className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            {info?.name ?? "TechFix"}
          </span>
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={onOpenTracker}
            data-ocid="header.tracker_link"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Search className="h-4 w-4" />
            Lacak Status
          </button>
        </nav>
        <a
          href="#book"
          data-ocid="header.book_button"
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
        >
          Ajukan Service
        </a>
      </div>
    </header>
  );
}
