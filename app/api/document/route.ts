import { NextRequest, NextResponse } from "next/server";

// Same-origin proxy for public Supabase Storage files.
// Why: Supabase serves objects with `sandbox` CSP, which blocks Chrome's PDF
// viewer inside an <iframe>. Serving through our own origin avoids that.
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("url");
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw || !base) {
    return new NextResponse("Bad request", { status: 400 });
  }

  let target: URL;
  let allowed: URL;
  try {
    target = new URL(raw);
    allowed = new URL(base);
  } catch {
    return new NextResponse("Bad request", { status: 400 });
  }

  // SSRF guard: only our Supabase project, only public storage objects.
  if (
    target.protocol !== "https:" ||
    target.host !== allowed.host ||
    !target.pathname.startsWith("/storage/v1/object/public/")
  ) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  target.search = ""; // drop ?download= etc, we want inline

  const upstream = await fetch(target.toString(), { cache: "no-store" });
  if (!upstream.ok || !upstream.body) {
    return new NextResponse("Not found", { status: 404 });
  }

  const upstreamType = upstream.headers.get("content-type") ?? "";
  const type =
    upstreamType && upstreamType !== "application/octet-stream"
      ? upstreamType
      : target.pathname.toLowerCase().endsWith(".pdf")
        ? "application/pdf"
        : "application/octet-stream";

  const headers = new Headers({
    "Content-Type": type,
    "Content-Disposition": "inline",
    "Cache-Control": "public, max-age=300, s-maxage=3600",
    "X-Content-Type-Options": "nosniff",
  });
  const length = upstream.headers.get("content-length");
  if (length) headers.set("Content-Length", length);

  return new NextResponse(upstream.body, { status: 200, headers });
}
