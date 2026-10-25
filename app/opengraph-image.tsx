import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const runtime = "nodejs";

export const alt = "BCA Department | PSMO College (Autonomous), Tirurangadi";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

/** The real college crest, inlined so the image builds offline too. */
function logoDataUrl(): string | null {
  try {
    const bytes = readFileSync(join(process.cwd(), "public", "college-logo.png"));
    return `data:image/png;base64,${bytes.toString("base64")}`;
  } catch {
    return null;
  }
}

export default function OpengraphImage() {
  const logo = logoDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          color: "#ffffff",
          fontFamily: "sans-serif",
          background:
            "linear-gradient(135deg, #1e1b4b 0%, #312e81 48%, #4338ca 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {logo ? (
            <img
              src={logo}
              width={104}
              height={98}
              alt=""
              style={{ borderRadius: 16, background: "#ffffff" }}
            />
          ) : null}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 30, fontWeight: 700 }}>
              PSMO College (Autonomous)
            </span>
            <span
              style={{
                fontSize: 20,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#c7d2fe",
              }}
            >
              Tirurangadi · Kerala
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.08 }}>
            Department of Computer Applications
          </span>
          <span style={{ fontSize: 34, color: "#c7d2fe" }}>
            4-Year BCA Programme · Eight Semesters
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
          }}
        >
          <span style={{ color: "#e0e7ff" }}>bcapsmoc.vercel.app</span>
          <span
            style={{
              padding: "10px 24px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.14)",
            }}
          >
            Official Department Website
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
