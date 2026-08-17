import {
  CheckCircle2,
  ClipboardList,
  Inbox,
  Loader2,
  Trash2,
  Wrench,
} from "lucide-react";
import type { ServiceRequest, StatusSummary } from "../backend";
import { ServiceStatus } from "../backend";
import {
  useDeleteServiceRequest,
  useGetServiceRequestStatusSummary,
  useListServiceRequests,
  useSetServiceRequestStatus,
} from "../hooks/useQueries";

const STATUS_ORDER: ServiceStatus[] = [
  ServiceStatus.Diterima,
  ServiceStatus.Dikerjakan,
  ServiceStatus.Selesai,
  ServiceStatus.Diambil,
];

const STATUS_META: Record<
  ServiceStatus,
  { label: string; badge: string; dot: string }
> = {
  [ServiceStatus.Diterima]: {
    label: "Diterima",
    badge: "border-primary/40 bg-primary/10 text-primary",
    dot: "bg-primary",
  },
  [ServiceStatus.Dikerjakan]: {
    label: "Dikerjakan",
    badge: "border-warning/40 bg-warning/10 text-warning",
    dot: "bg-warning",
  },
  [ServiceStatus.Selesai]: {
    label: "Selesai",
    badge: "border-success/40 bg-success/10 text-success",
    dot: "bg-success",
  },
  [ServiceStatus.Diambil]: {
    label: "Diambil",
    badge: "border-muted-foreground/40 bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
};

function formatDate(createdAt: bigint): string {
  return new Date(Number(createdAt / 1_000_000n)).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function nextStatus(status: ServiceStatus): ServiceStatus | null {
  const index = STATUS_ORDER.indexOf(status);
  return index >= 0 && index < STATUS_ORDER.length - 1
    ? STATUS_ORDER[index + 1]
    : null;
}

function StatusBadge({ status }: { status: ServiceStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs font-medium ${meta.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

function SummaryCard({
  label,
  count,
  tone,
}: {
  label: string;
  count: bigint;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <span className={`h-2.5 w-2.5 rounded-full ${tone}`} />
      <div className="min-w-0">
        <p className="font-mono text-2xl font-semibold leading-none text-foreground">
          {count.toString()}
        </p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function RequestCard({ request }: { request: ServiceRequest }) {
  const setStatus = useSetServiceRequestStatus();
  const deleteRequest = useDeleteServiceRequest();

  const next = nextStatus(request.status);
  const isFinished =
    request.status === ServiceStatus.Selesai ||
    request.status === ServiceStatus.Diambil;

  return (
    <li className="rounded-2xl border border-border bg-card p-5 shadow-subtle">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              #{request.id.toString()}
            </span>
            <StatusBadge status={request.status} />
          </div>
          <h3 className="mt-2 font-display text-lg font-semibold text-foreground">
            {request.name}
          </h3>
          <p className="text-sm text-muted-foreground">{request.contact}</p>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {formatDate(request.createdAt)}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-muted/40 p-3">
          <dt className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            Perangkat
          </dt>
          <dd className="mt-1 font-medium text-foreground">
            {request.deviceType}
          </dd>
        </div>
        <div className="rounded-lg border border-border bg-muted/40 p-3">
          <dt className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            Layanan
          </dt>
          <dd className="mt-1 font-medium text-foreground">
            {request.service}
          </dd>
        </div>
        <div className="rounded-lg border border-border bg-muted/40 p-3">
          <dt className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            Waktu serah terima
          </dt>
          <dd className="mt-1 font-medium text-foreground">
            {request.handoverTime || "—"}
          </dd>
        </div>
        <div className="rounded-lg border border-border bg-muted/40 p-3 sm:col-span-2">
          <dt className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            Keluhan
          </dt>
          <dd className="mt-1 leading-relaxed text-foreground">
            {request.complaint}
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
        {next && (
          <button
            type="button"
            onClick={() => setStatus.mutate({ id: request.id, status: next })}
            disabled={setStatus.isPending}
            data-ocid={`admininbox.advance_button.${request.id.toString()}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-smooth hover:opacity-90 disabled:opacity-50"
          >
            {setStatus.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wrench className="h-4 w-4" />
            )}
            Tandai {STATUS_META[next].label}
          </button>
        )}

        {request.status !== ServiceStatus.Selesai &&
          request.status !== ServiceStatus.Diambil && (
            <button
              type="button"
              onClick={() =>
                setStatus.mutate({
                  id: request.id,
                  status: ServiceStatus.Selesai,
                })
              }
              disabled={setStatus.isPending}
              data-ocid={`admininbox.mark_done_button.${request.id.toString()}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-success/40 bg-success/10 px-3 py-2 text-sm font-semibold text-success transition-smooth hover:bg-success/20 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              Tandai Selesai
            </button>
          )}

        {isFinished && (
          <button
            type="button"
            onClick={() => deleteRequest.mutate(request.id)}
            disabled={deleteRequest.isPending}
            data-ocid={`admininbox.delete_button.${request.id.toString()}`}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive transition-smooth hover:bg-destructive/20 disabled:opacity-50"
          >
            {deleteRequest.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Hapus
          </button>
        )}
      </div>
    </li>
  );
}

export default function AdminInbox() {
  const { data: requests = [], isPending } = useListServiceRequests(true);
  const { data: summary } = useGetServiceRequestStatusSummary(true);

  const sorted = [...requests].sort((a, b) => Number(b.id - a.id));

  return (
    <main className="container max-w-4xl py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Antrian Service
          </h1>
          <p className="mt-2 text-muted-foreground">
            Kelola semua permintaan service pelanggan dan perbarui status
            pengerjaan.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-xs text-muted-foreground">
          <ClipboardList className="h-3.5 w-3.5" />
          {requests.length} permintaan
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard
          label="Diterima"
          count={summary?.diterima ?? 0n}
          tone="bg-primary"
        />
        <SummaryCard
          label="Dikerjakan"
          count={summary?.dikerjakan ?? 0n}
          tone="bg-warning"
        />
        <SummaryCard
          label="Selesai"
          count={summary?.selesai ?? 0n}
          tone="bg-success"
        />
        <SummaryCard
          label="Diambil"
          count={summary?.diambil ?? 0n}
          tone="bg-muted-foreground"
        />
      </div>

      {isPending ? (
        <div
          data-ocid="admininbox.loading_state"
          className="mt-10 flex justify-center"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : sorted.length === 0 ? (
        <div
          data-ocid="admininbox.empty_state"
          className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-border bg-card p-12 text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Inbox className="h-7 w-7 text-primary" />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
            Belum ada permintaan service
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Permintaan service baru dari pelanggan akan muncul di sini beserta
            ringkasan statusnya.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {sorted.map((request) => (
            <RequestCard key={request.id.toString()} request={request} />
          ))}
        </ul>
      )}
    </main>
  );
}
