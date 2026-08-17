import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  MonitorSmartphone,
  PackageCheck,
  Search,
  SearchX,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import type { ServiceRequestTracking } from "../backend";
import { ServiceStatus } from "../backend";
import { useGetServiceRequestTracking } from "../hooks/useQueries";

const STATUS_ORDER: ServiceStatus[] = [
  ServiceStatus.Diterima,
  ServiceStatus.Dikerjakan,
  ServiceStatus.Selesai,
  ServiceStatus.Diambil,
];

const STATUS_META: Record<
  ServiceStatus,
  { label: string; description: string; color: string; icon: typeof Circle }
> = {
  [ServiceStatus.Diterima]: {
    label: "Diterima",
    description: "Perangkat telah diterima di bengkel",
    color: "text-primary border-primary/40 bg-primary/10",
    icon: Circle,
  },
  [ServiceStatus.Dikerjakan]: {
    label: "Dikerjakan",
    description: "Perangkat sedang dalam proses perbaikan",
    color: "text-warning border-warning/40 bg-warning/10",
    icon: Wrench,
  },
  [ServiceStatus.Selesai]: {
    label: "Selesai",
    description: "Perbaikan selesai, siap untuk diambil",
    color: "text-success border-success/40 bg-success/10",
    icon: CheckCircle2,
  },
  [ServiceStatus.Diambil]: {
    label: "Diambil",
    description: "Perangkat telah diambil oleh pelanggan",
    color: "text-muted-foreground border-muted-foreground/40 bg-muted",
    icon: PackageCheck,
  },
};

function StatusStepper({ status }: { status: ServiceStatus }) {
  const currentIndex = STATUS_ORDER.indexOf(status);
  const progress = ((currentIndex + 1) / STATUS_ORDER.length) * 100;

  return (
    <div className="mt-8">
      <div className="relative">
        <div className="absolute left-0 right-0 top-5 h-0.5 bg-border" />
        <div
          className="absolute left-0 top-5 h-0.5 bg-primary shadow-status-glow"
          style={{ width: `${progress}%` }}
        />
        <ol className="relative grid grid-cols-4 gap-2">
          {STATUS_ORDER.map((step, index) => {
            const meta = STATUS_META[step];
            const Icon = meta.icon;
            const isReached = index <= currentIndex;
            const isCurrent = index === currentIndex;
            return (
              <li key={step} className="flex flex-col items-center text-center">
                <span
                  data-ocid={`tracker.step.${index + 1}`}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-smooth ${
                    isReached
                      ? `${meta.color} shadow-status-glow`
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${isCurrent ? "animate-status-pulse" : ""}`}
                  />
                </span>
                <span
                  className={`mt-3 font-mono text-xs font-semibold uppercase tracking-wide ${
                    isReached ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {meta.label}
                </span>
                <span className="mt-1 hidden text-xs text-muted-foreground sm:block">
                  {meta.description}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof MonitorSmartphone;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 break-words font-mono text-sm font-semibold text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

function ResultCard({ tracking }: { tracking: ServiceRequestTracking }) {
  const meta = STATUS_META[tracking.status];
  return (
    <div
      data-ocid="tracker.result"
      className="mt-8 rounded-2xl border border-border bg-background p-6 sm:p-8"
    >
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            Kode Pelacakan
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">
            #{tracking.id.toString()}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-sm font-semibold ${meta.color}`}
        >
          <span className="h-2 w-2 animate-status-pulse rounded-full bg-current" />
          {meta.label}
        </span>
      </div>

      <StatusStepper status={tracking.status} />

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <DetailRow
          label="Jenis Perangkat"
          value={tracking.deviceType}
          icon={MonitorSmartphone}
        />
        <DetailRow
          label="Layanan Dipilih"
          value={tracking.service}
          icon={Wrench}
        />
        <DetailRow
          label="Informasi Penyerahan"
          value={tracking.handoverTime}
          icon={Clock}
        />
        <DetailRow
          label="Status Saat Ini"
          value={meta.label}
          icon={CheckCircle2}
        />
      </div>

      <p className="mt-6 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
        {tracking.status === ServiceStatus.Diambil
          ? "Perangkat Anda telah diambil. Terima kasih telah menggunakan layanan kami."
          : tracking.status === ServiceStatus.Selesai
            ? "Perbaikan telah selesai. Silakan datang ke bengkel untuk mengambil perangkat Anda."
            : "Perangkat Anda sedang dalam proses. Pantau halaman ini untuk pembaruan status terbaru."}
      </p>
    </div>
  );
}

export default function StatusTracker({ onBack }: { onBack: () => void }) {
  const [code, setCode] = useState("");
  const [submittedId, setSubmittedId] = useState<bigint | null>(null);
  const { data: tracking, isPending } =
    useGetServiceRequestTracking(submittedId);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    try {
      setSubmittedId(BigInt(trimmed));
    } catch {
      setSubmittedId(null);
    }
  };

  return (
    <main className="container max-w-3xl py-10">
      <button
        type="button"
        onClick={onBack}
        data-ocid="tracker.back_button"
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke situs
      </button>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-subtle sm:p-10">
        <div className="text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 shadow-status-glow">
            <Search className="h-6 w-6 text-primary" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground">
            Lacak Status Perbaikan
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Masukkan kode pelacakan (ID permintaan layanan) untuk melihat
            progres perbaikan perangkat Anda.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="tracking-code" className="sr-only">
            Kode pelacakan
          </label>
          <input
            id="tracking-code"
            type="text"
            inputMode="numeric"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Contoh: 12345"
            data-ocid="tracker.input"
            className="h-12 flex-1 rounded-lg border border-input bg-background px-4 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
          <button
            type="submit"
            disabled={!code.trim()}
            data-ocid="tracker.submit_button"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-smooth hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Search className="h-4 w-4" />
            Lacak
          </button>
        </form>

        <div className="mt-8">
          {isPending && (
            <div
              data-ocid="tracker.loading_state"
              className="flex flex-col items-center gap-3 py-6 text-center"
            >
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Mencari data perbaikan…
              </p>
            </div>
          )}

          {!isPending && submittedId !== null && !tracking && (
            <div
              data-ocid="tracker.empty_state"
              className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-background px-6 py-10 text-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <SearchX className="h-6 w-6 text-muted-foreground" />
              </span>
              <h2 className="font-display text-lg font-semibold text-foreground">
                Kode tidak ditemukan
              </h2>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                Tidak ada data perbaikan untuk kode{" "}
                <span className="font-mono text-foreground">
                  #{submittedId.toString()}
                </span>
                . Periksa kembali kode pelacakan Anda atau hubungi bengkel untuk
                bantuan.
              </p>
            </div>
          )}

          {!isPending && tracking && <ResultCard tracking={tracking} />}
        </div>
      </div>
    </main>
  );
}
