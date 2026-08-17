import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSubmitServiceRequest } from "../hooks/useQueries";

const inputClasses =
  "w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-smooth";

const labelClasses = "mb-1.5 block text-sm font-medium text-muted-foreground";

const DEVICE_TYPES = [
  "Laptop",
  "PC",
  "Smartphone",
  "Tablet",
  "Printer",
  "Lainnya",
];

const SERVICES = [
  "Perbaikan Hardware",
  "Perbaikan Software",
  "Instalasi Sistem Operasi",
  "Pembersihan & Perawatan",
  "Penggantian Baterai / Layar",
  "Upgrade Komponen",
  "Lainnya",
];

export default function BookingForm() {
  const submitService = useSubmitServiceRequest();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [service, setService] = useState("");
  const [complaint, setComplaint] = useState("");
  const [handoverTime, setHandoverTime] = useState("");
  const [price, setPrice] = useState("");
  const [serviceId, setServiceId] = useState<bigint | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !contact.trim()) return;

    const priceValue = BigInt(price.trim() || "0");

    const id = await submitService.mutateAsync({
      name: name.trim(),
      contact: contact.trim(),
      deviceType,
      service,
      complaint: complaint.trim(),
      handoverTime: handoverTime.trim(),
      price: priceValue,
    });
    setServiceId(id);
  };

  const resetForm = () => {
    setServiceId(null);
    setName("");
    setContact("");
    setDeviceType("");
    setService("");
    setComplaint("");
    setHandoverTime("");
    setPrice("");
  };

  if (serviceId !== null) {
    return (
      <div
        data-ocid="success_state"
        className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-10 text-center shadow-subtle"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
          <CheckCircle2 className="h-9 w-9 text-success" />
        </div>
        <h3 className="mt-5 font-display text-2xl font-semibold text-foreground">
          Permintaan Terkirim
        </h3>
        <p className="mt-3 max-w-sm text-muted-foreground">
          Terima kasih, {name.trim()}. Permintaan service Anda telah kami terima
          dan sedang diproses.
        </p>

        <div className="mt-6 w-full max-w-sm rounded-2xl border border-border bg-secondary/40 p-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Nomor Antrian / ID Layanan
            </span>
            <span
              data-ocid="service_id"
              className="font-mono text-lg font-semibold text-primary"
            >
              #{serviceId.toString()}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Status Awal
            </span>
            <span
              data-ocid="status_badge"
              className="rounded-full bg-warning/15 px-3 py-1 font-mono text-xs font-semibold text-warning"
            >
              Diterima
            </span>
          </div>
        </div>

        <button
          type="button"
          data-ocid="reset_button"
          onClick={resetForm}
          className="mt-6 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          Kirim permintaan lain
        </button>
      </div>
    );
  }

  return (
    <form
      id="book"
      data-ocid="service_form"
      onSubmit={handleSubmit}
      className="rounded-3xl border border-border bg-card p-8 shadow-subtle"
    >
      <h3 className="font-display text-2xl font-semibold text-foreground">
        Permintaan Service
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Isi detail perangkat Anda dan kami akan segera menindaklanjuti.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelClasses}>Nama *</span>
          <input
            type="text"
            required
            data-ocid="name_input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama lengkap Anda"
            className={inputClasses}
          />
        </label>
        <label className="block">
          <span className={labelClasses}>Kontak *</span>
          <input
            type="text"
            required
            data-ocid="contact_input"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="No. HP atau email"
            className={inputClasses}
          />
        </label>
        <label className="block">
          <span className={labelClasses}>Jenis Perangkat</span>
          <select
            data-ocid="device_type_select"
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            className={inputClasses}
          >
            <option value="" className="bg-card">
              Pilih jenis perangkat
            </option>
            {DEVICE_TYPES.map((type) => (
              <option key={type} value={type} className="bg-card">
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelClasses}>Layanan yang Dipilih</span>
          <select
            data-ocid="service_select"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className={inputClasses}
          >
            <option value="" className="bg-card">
              Pilih layanan
            </option>
            {SERVICES.map((item) => (
              <option key={item} value={item} className="bg-card">
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block">
        <span className={labelClasses}>Keluhan / Deskripsi</span>
        <textarea
          data-ocid="complaint_textarea"
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          rows={4}
          placeholder="Jelaskan masalah pada perangkat Anda, misalnya: layar tidak menyala, baterai cepat habis, sering restart sendiri…"
          className={inputClasses}
        />
      </label>

      <label className="mt-4 block">
        <span className={labelClasses}>Waktu Penyerahan</span>
        <input
          type="text"
          data-ocid="handover_time_input"
          value={handoverTime}
          onChange={(e) => setHandoverTime(e.target.value)}
          placeholder="Contoh: Senin, 09:00 - 12:00"
          className={inputClasses}
        />
      </label>

      <label className="mt-4 block">
        <span className={labelClasses}>Estimasi Biaya (Rp)</span>
        <input
          type="number"
          min="0"
          data-ocid="price_input"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Contoh: 350000"
          className={inputClasses}
        />
      </label>

      {submitService.isError && (
        <p data-ocid="error_state" className="mt-4 text-sm text-destructive">
          Terjadi kesalahan saat mengirim permintaan. Silakan coba lagi.
        </p>
      )}

      <button
        type="submit"
        data-ocid="submit_button"
        disabled={submitService.isPending}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 font-semibold text-primary-foreground transition-smooth hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitService.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Mengirim…
          </>
        ) : (
          "Kirim Permintaan Service"
        )}
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Setelah terkirim, Anda akan menerima nomor antrian/ID layanan.
      </p>
    </form>
  );
}
