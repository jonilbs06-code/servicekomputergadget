import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useGetBusinessInfo } from "../hooks/useQueries";
import BookingForm from "./BookingForm";

export default function Visit() {
  const { data: info } = useGetBusinessInfo();

  return (
    <section id="visit" className="bg-background py-16 md:py-24">
      <div className="container grid gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            Kunjungi Kami
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Ajukan permintaan service
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
            Kirim permintaan service dan tim kami akan menghubungi Anda untuk
            konfirmasi — biasanya di hari yang sama.
          </p>

          {info && (
            <dl className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <dt className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Alamat
                  </dt>
                  <dd className="mt-1 text-foreground">{info.address}</dd>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <dt className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Jam Operasional
                  </dt>
                  <dd className="mt-1 space-y-1">
                    {info.openingHours.map((entry) => (
                      <div key={entry.days} className="flex gap-4">
                        <span className="w-44 text-foreground">
                          {entry.days}
                        </span>
                        <span className="text-muted-foreground">
                          {entry.hours}
                        </span>
                      </div>
                    ))}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <dt className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Telepon
                  </dt>
                  <dd className="mt-1 text-foreground">{info.phone}</dd>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <dt className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email
                  </dt>
                  <dd className="mt-1 text-foreground">{info.email}</dd>
                </div>
              </div>
            </dl>
          )}
        </div>

        <BookingForm />
      </div>
    </section>
  );
}
