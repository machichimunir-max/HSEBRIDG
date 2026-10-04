import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-slate-50">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">404</p>
        <h1 className="mt-3 text-4xl font-bold">Page not found</h1>
        <p className="mt-3 text-slate-400">The page you are looking for doesn&apos;t exist or is unavailable.</p>
        <Link href="/" className="mt-6 inline-block rounded-full bg-cyan-500 px-5 py-3 font-medium text-slate-950">
          Back home
        </Link>
      </div>
    </main>
  );
}
