import { ArrowRight, MapPin, Wrench } from "lucide-react";
import { useGetBusinessInfo } from "../hooks/useQueries";

export default function Hero() {
  const { data: info } = useGetBusinessInfo();

  return (
    <section id="top" className="relative overflow-hidden bg-gradient-subtle">
      <div className="container grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p
            data-ocid="hero.tagline"
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-primary"
          >
            <Wrench className="h-3.5 w-3.5" />
            {info?.tagline ?? "Service komputer & gadget profesional"}
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Perangkat Anda,{" "}
            <span className="text-gradient">diperbaiki dengan presisi.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Diagnosa cepat, perbaikan terpercaya untuk laptop, PC, dan
            smartphone. Tim teknisi berpengalaman siap mengembalikan perangkat
            Anda ke performa terbaiknya.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#book"
              data-ocid="hero.primary_button"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              Ajukan Service
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#services"
              data-ocid="hero.secondary_button"
              className="rounded-lg border border-border bg-card px-7 py-3.5 font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              Lihat Layanan & Harga
            </a>
          </div>
          {info && (
            <p
              data-ocid="hero.address"
              className="mt-8 flex items-center gap-2 text-sm text-muted-foreground"
            >
              <MapPin className="h-4 w-4 text-primary" />
              {info.address}
            </p>
          )}
        </div>
        <div className="relative">
          <img
            src="/assets/generated/hero-repair.dim_1200x900.jpg"
            alt="Teknisi sedang memperbaiki motherboard laptop dengan alat presisi di bengkel yang remang-remang"
            className="aspect-[4/3] w-full rounded-2xl border border-border object-cover shadow-2xl"
          />
          <div
            data-ocid="hero.badge"
            className="absolute -bottom-5 left-6 flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-medium text-foreground shadow-lg"
          >
            <span className="h-2 w-2 rounded-full bg-success" />
            Garansi hasil perbaikan
          </div>
        </div>
      </div>
    </section>
  );
}
