import { Quote } from "lucide-react";
import { useGetTestimonials } from "../hooks/useQueries";

export default function Testimonials() {
  const { data: testimonials = [] } = useGetTestimonials();

  return (
    <section id="testimonials" className="bg-gradient-subtle py-16 md:py-24">
      <div className="container">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            Testimoni
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Kata pelanggan kami
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Kepercayaan pelanggan adalah prioritas utama kami.
          </p>
        </div>
        <ul className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <li
              key={testimonial.id.toString()}
              data-ocid={`testimonials.item.${testimonial.id.toString()}`}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              <Quote className="h-6 w-6 text-primary" />
              <blockquote className="mt-4 flex-1 leading-relaxed text-foreground">
                {testimonial.quote}
              </blockquote>
              <p className="mt-5 font-mono text-sm font-semibold text-primary">
                {testimonial.author}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
