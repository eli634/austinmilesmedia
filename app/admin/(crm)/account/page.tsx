import { updatePassword } from "../../actions";

const ACCOUNT_ERRORS = new Set([
  "Passwords do not match.",
  "Use at least 8 characters.",
  "Could not update password.",
]);

export default async function AccountPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; updated?: string }>;
}) {
  const params = await searchParams;
  const error = params?.error && ACCOUNT_ERRORS.has(params.error) ? params.error : undefined;
  const updated = params?.updated === "1";

  return (
    <section className="mx-auto w-full max-w-lg rounded-[2rem] border border-[#dbe6f1] bg-white p-6 shadow-sm sm:p-8">
      <h1 className="font-display text-2xl font-black tracking-[-0.04em] text-[#0b4a7a]">
        Change password
      </h1>
      <p className="mt-2 font-body text-sm font-medium leading-relaxed text-[#52677f]">
        Choose a new password for this admin account. Use at least 8 characters.
      </p>

      <form action={updatePassword} className="mt-8 grid gap-4">
        <label className="grid gap-2 font-body text-sm text-[#52677f]">
          New password
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="rounded-xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 text-[#0b4a7a] outline-none transition-colors focus:border-[#0b4a7a]"
          />
        </label>
        <label className="grid gap-2 font-body text-sm text-[#52677f]">
          Confirm password
          <input
            type="password"
            name="confirm"
            required
            minLength={8}
            autoComplete="new-password"
            className="rounded-xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 text-[#0b4a7a] outline-none transition-colors focus:border-[#0b4a7a]"
          />
        </label>

        {updated && (
          <p className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm font-semibold text-[#0b4a7a]">
            Password updated.
          </p>
        )}
        {error && (
          <p className="rounded-2xl border border-[#dbe6f1] bg-[#f8fbff] px-4 py-3 font-body text-sm font-semibold text-[#0b4a7a]">
            {error}
          </p>
        )}

        <button className="mt-2 w-fit rounded-full bg-[#0b4a7a] px-6 py-3 font-body text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,74,122,0.18)] transition-colors hover:bg-[#08395e]">
          Save password
        </button>
      </form>
    </section>
  );
}
