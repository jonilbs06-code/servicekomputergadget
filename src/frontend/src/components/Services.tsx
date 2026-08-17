import {
  Clock,
  Cpu,
  MonitorSmartphone,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { useGetServices } from "../hooks/useQueries";

function iconFor(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("software") || lower.includes("instalasi")) return Cpu;
  if (lower.includes("perawatan") || lower.includes("maintenance"))
    return ShieldCheck;
  if (lower.includes("smartphone") || lower.includes("hp"))
    return MonitorSmartphone;
  return Wrench;
}

export default function Services() {
  const { data: services = [] } = useGetServices();

  return (
    <section id="services" className="bg-background py-16 md:py-24">
      <div className="container">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            Layanan & Harga
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Solusi untuk setiap perangkat
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Setiap perbaikan diawali dengan diagnosa menyeluruh, sehingga Anda
            selalu tahu apa yang dikerjakan dan berapa biayanya.
          </p>
        </div>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = iconFor(service.name);
            return (
              <li
                key={service.id.toString()}
                data-ocid={`services.item.${service.id.toString()}`}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {service.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    {service.duration}
                  </span>
                  <span className="font-mono text-lg font-semibold text-primary">
                    {service.price}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
