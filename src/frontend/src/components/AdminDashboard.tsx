import {
  Banknote,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Inbox,
  Loader2,
  PackageCheck,
  Wrench,
} from "lucide-react";
import type { RevenueSummary } from "../backend";
import { ServiceStatus } from "../backend";
import { useGetRevenueSummary } from "../hooks/useQueries";

const STATUS_ORDER: ServiceStatus[] = [
  ServiceStatus.Diterima,
  ServiceStatus.Dikerjakan,
  ServiceStatus.Selesai,
  ServiceStatus.Diambil,
];

const STATUS_META: Record<
  ServiceStatus,
  { label: string; icon: typeof Inbox; bar: string; text: string }
> = {
  [ServiceStatus.Diterima]: {
    label: "Diterima",
    icon: Inbox,
    bar: "bg-chart-1",
    text: "text-chart-1",
  },
  [ServiceStatus.Dikerjakan]: {
    label: "Dikerjakan",
    icon: Wrench,
    bar: "bg-chart-2",
    text: "text-chart-2",
  },
  [ServiceStatus.Selesai]: {
    label: "Selesai",
    icon: CheckCircle2,
    bar: "bg-chart-3",
    text: "text-chart-3",
  },
  [ServiceStatus.Diambil]: {
    label: "Diambil",
    icon: PackageCheck,
    bar: "bg-chart-4",
    text: "text-chart-4",
  },
};

function formatRupiah(value: bigint): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function countFor(
  summary: RevenueSummary | undefined,
  status: ServiceStatus,
): bigint {
  if (!summary) return 0n;
  switch (status) {
    case ServiceStatus.Diterima:
      return summary.counts.diterima;
    case ServiceStatus.Dikerjakan:
      return summary.counts.dikerjakan;
    case ServiceStatus.Selesai:
      return summary.counts.selesai;
    case ServiceStatus.Diambil:
      return summary.counts.diambil;
  }
}

function StatCard({
  status,
  count,
  total,
}: {
  status: ServiceStatus;
  count: bigint;
  total: bigint;
}) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  const percent = total > 0n ? Number((count * 100n) / total) : 0;

  return (
    <div
      data-ocid={`dashboard.stat_card.${status.toLowerCase()}`}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-subtle transition-smooth hover:border-primary/40 hover:shadow-elevated"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{meta.label}</p>
          <p className="mt-2 font-display text-3xl font-bold tabular-nums text-foreground">
            {count.toString()}
          </p>
        </div>
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted ${meta.text}`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${meta.bar}`}
          style={
            {
              "--progress": `${percent}%`,
            } as React.CSSProperties
          }
        />
      </div>
      <p className="mt-2 font-mono text-xs text-muted-foreground">
        {percent}% dari total
      </p>
    </div>
  );
}

export default function AdminDashboard() {
  const {
    data: summary,
    isPending,
    isError,
    refetch,
  } = useGetRevenueSummary(true);

  const total = summary
    ? summary.counts.diterima +
      summary.counts.dikerjakan +
      summary.counts.selesai +
      summary.counts.diambil
    : 0n;

  return (
    <main className="container max-w-6xl py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Dashboard Statistik
          </h1>
          <p className="mt-2 text-muted-foreground">
            Ringkasan perbaikan dan pendapatan dari semua permintaan layanan.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-xs text-muted-foreground">
          <BarChart3 className="h-3.5 w-3.5" />
          Statistik
        </span>
      </div>

      {isPending ? (
        <div
          data-ocid="dashboard.loading_state"
          className="mt-10 flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card py-16 text-muted-foreground"
        >
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm">Memuat statistik…</p>
        </div>
      ) : isError ? (
        <div
          data-ocid="dashboard.error_state"
          className="mt-10 flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card py-16 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Gagal memuat statistik. Silakan coba lagi.
          </p>
          <button
            data-ocid="dashboard.retry_button"
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-smooth hover:opacity-90"
          >
            Muat Ulang
          </button>
        </div>
      ) : (
        <div data-ocid="dashboard.summary" className="mt-8 space-y-6">
          {/* Revenue readout */}
          <section
            data-ocid="dashboard.revenue"
            className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-subtle"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-subtle" />
            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Banknote className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Pendapatan
                  </p>
                  <p className="mt-1 font-display text-4xl font-bold tabular-nums tracking-tight text-foreground sm:text-5xl">
                    {formatRupiah(summary.totalRevenue)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-success/40 bg-success/10 px-3 py-1.5 font-mono text-xs text-success">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {summary.completedCount.toString()} perbaikan selesai
              </div>
            </div>
          </section>

          {/* Per-status stat cards */}
          <section
            data-ocid="dashboard.status_cards"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {STATUS_ORDER.map((status) => (
              <StatCard
                key={status}
                status={status}
                count={countFor(summary, status)}
                total={total}
              />
            ))}
          </section>

          {/* Summary footer */}
          <section
            data-ocid="dashboard.total"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-subtle"
          >
            <div className="flex items-center gap-3">
              <ClipboardList className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">
                Total permintaan layanan
              </p>
            </div>
            <p className="font-display text-2xl font-bold tabular-nums text-foreground">
              {total.toString()}
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
