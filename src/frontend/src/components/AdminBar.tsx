import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { ArrowLeft, BarChart3, ListOrdered, LogOut } from "lucide-react";

export type AdminView = "home" | "inbox" | "dashboard";

export default function AdminBar({
  view,
  onNavigate,
}: {
  view: AdminView;
  onNavigate: (view: AdminView) => void;
}) {
  const { clear } = useInternetIdentity();

  return (
    <div className="sticky top-0 z-50 border-b border-border bg-gradient-primary text-primary-foreground">
      <div className="container flex h-12 items-center justify-between text-sm">
        <span className="font-display font-semibold">
          Masuk sebagai pemilik
        </span>
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            data-ocid="adminbar.dashboard_button"
            className={`flex items-center gap-1.5 font-semibold hover:opacity-80 ${
              view === "dashboard" ? "underline underline-offset-4" : ""
            }`}
          >
            <BarChart3 className="h-4 w-4" /> Dashboard
          </button>
          <button
            type="button"
            onClick={() => onNavigate("inbox")}
            data-ocid="adminbar.toggle_queue_button"
            className={`flex items-center gap-1.5 font-semibold hover:opacity-80 ${
              view === "inbox" ? "underline underline-offset-4" : ""
            }`}
          >
            {view === "inbox" ? (
              <>
                <ArrowLeft className="h-4 w-4" /> Kembali ke situs
              </>
            ) : (
              <>
                <ListOrdered className="h-4 w-4" /> Antrian Service
              </>
            )}
          </button>
          <button
            type="button"
            onClick={clear}
            data-ocid="adminbar.sign_out_button"
            className="flex items-center gap-1.5 hover:opacity-80"
          >
            <LogOut className="h-4 w-4" /> Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
