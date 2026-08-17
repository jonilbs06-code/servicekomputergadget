import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useGetBusinessInfo, useIsCallerAdmin } from "../hooks/useQueries";

export default function Footer({
  onOwnerSignIn,
}: {
  onOwnerSignIn: () => void;
}) {
  const { data: info } = useGetBusinessInfo();
  const { identity, clear } = useInternetIdentity();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const isAuthenticated = !!identity;

  return (
    <footer className="border-t border-border bg-card py-10">
      <div className="container flex flex-col items-center gap-4 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
        <p>
          © {new Date().getFullYear()} {info?.name ?? "TechFix"}.{" "}
          {info?.address}
        </p>
        <div className="flex items-center gap-4">
          {isAuthenticated && !isAdmin && (
            <span className="text-muted-foreground/70">
              Masuk (bukan pemilik)
            </span>
          )}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={clear}
              data-ocid="footer.sign_out_button"
              className="font-semibold underline-offset-4 hover:underline"
            >
              Keluar
            </button>
          ) : (
            <button
              type="button"
              onClick={onOwnerSignIn}
              data-ocid="footer.owner_sign_in_button"
              className="font-semibold underline-offset-4 hover:underline"
            >
              Masuk sebagai pemilik
            </button>
          )}
        </div>
      </div>
      <div className="container mt-6 border-t border-border pt-6 text-center text-xs text-muted-foreground/70">
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
            window.location.hostname,
          )}`}
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground"
        >
          © {new Date().getFullYear()}. Dibuat dengan ❤️ menggunakan caffeine.ai
        </a>
      </div>
    </footer>
  );
}
