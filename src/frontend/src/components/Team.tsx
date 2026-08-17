import { useGetTeam } from "../hooks/useQueries";

export default function Team() {
  const { data: team = [] } = useGetTeam();

  return (
    <section id="team" className="bg-background py-16 md:py-24">
      <div className="container">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            Tim Teknisi
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Ahli di balik setiap perbaikan
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Teknisi bersertifikat dengan pengalaman menangani berbagai merek dan
            jenis perangkat.
          </p>
        </div>
        <ul className="grid gap-6 md:grid-cols-3">
          {team.map((member) => (
            <li
              key={member.id.toString()}
              data-ocid={`team.item.${member.id.toString()}`}
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40"
            >
              <img
                src={member.photo}
                alt={`Foto ${member.name}`}
                loading="lazy"
                className="aspect-square w-full rounded-xl border border-border object-cover"
              />
              <h3 className="mt-5 font-display text-xl font-semibold">
                {member.name}
              </h3>
              <p className="mt-1 font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                {member.role}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {member.bio}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
