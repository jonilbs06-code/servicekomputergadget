import { useGetGallery } from "../hooks/useQueries";

export default function Gallery() {
  const { data: gallery = [] } = useGetGallery();

  return (
    <section id="gallery" className="bg-gradient-subtle py-16 md:py-24">
      <div className="container">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            Galeri Pekerjaan
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Hasil kerja tim kami
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Sekilas tentang perangkat yang telah kami perbaiki dan rawat.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {gallery.map((image) => (
            <li
              key={image.id.toString()}
              data-ocid={`gallery.item.${image.id.toString()}`}
              className="group relative overflow-hidden rounded-2xl border border-border"
            >
              <img
                src={image.url}
                alt={image.caption}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-10 text-sm font-medium text-foreground">
                {image.caption}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
