import Link from "next/link";
import { Container } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-5">
      <Container className="max-w-lg text-center">
        <div className="font-display text-6xl font-semibold text-brand-600">
          404
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink-900">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-ink-500">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Back to dashboard
        </Link>
      </Container>
    </div>
  );
}
