import Link from "next/link";
import { Globe, Mail, Phone } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
  WhatsAppIcon,
  XIcon,
  YoutubeIcon,
} from "./SocialIcons";
import { CollegeLogo } from "./CollegeLogo";
import { Container } from "./ui";
import { MAIN_NAV } from "@/lib/nav";
import { ORGANISATION, SOCIAL_LINKS } from "@/lib/site";

type SocialIconComponent = React.ComponentType<{ className?: string }>;

const SOCIAL_ICONS: Record<string, SocialIconComponent> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  x: XIcon,
  twitter: TwitterIcon,
  youtube: YoutubeIcon,
  whatsapp: WhatsAppIcon,
};

function iconFor(label: string): SocialIconComponent {
  return SOCIAL_ICONS[label.toLowerCase()] ?? Globe;
}

export function SiteFooter({
  hiddenHrefs = [],
}: {
  hiddenHrefs?: string[];
}) {
  const nav = MAIN_NAV.filter((item) => !hiddenHrefs.includes(item.href));

  return (
    <footer className="relative mt-20 overflow-hidden bg-brand-950 text-brand-100">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-500 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-600/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-accent-600/20 blur-3xl"
      />

      <Container className="relative grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <CollegeLogo className="h-12 w-12" />
            <div className="leading-tight">
              <div className="font-display text-base font-semibold text-white">
                PSMO College (Autonomous)
              </div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-300">
                Department of Computer Applications
              </div>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-brand-100/80">
            Nurturing skilled software professionals through a modern BCA
            programme, active student associations and hands-on technical
            training.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-brand-100/70">
            Explore
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-brand-100/90 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-brand-100/70">
            Department Office
          </h3>
          <address className="mt-4 space-y-2.5 text-sm not-italic text-brand-100/90">
            <p>
              PSMO College (Autonomous)
              <br />
              Tirurangadi, Malappuram
              <br />
              Kerala, India
            </p>
            {ORGANISATION.telephone ? (
              <p>
                <a
                  href={`tel:${ORGANISATION.telephone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {ORGANISATION.telephone}
                </a>
              </p>
            ) : null}
            {ORGANISATION.email ? (
              <p>
                <a
                  href={`mailto:${ORGANISATION.email}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {ORGANISATION.email}
                </a>
              </p>
            ) : null}
          </address>

          {SOCIAL_LINKS.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {SOCIAL_LINKS.map((social) => {
                const Icon = iconFor(social.label);
                return (
                  <li key={social.href}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      title={social.label}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-brand-100/90 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : null}

          <p className="mt-4 text-xs text-brand-100/60">
            Affiliated to University of Calicut · NAAC Accredited
          </p>
        </div>
      </Container>

      <div className="relative border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-xs text-brand-100/70 sm:flex-row">
          <span>
            © {new Date().getFullYear()} BCA Department, PSMO College. All
            rights reserved.
          </span>
          <span>Designed for BCA Students &amp; Faculty</span>
        </Container>
      </div>
    </footer>
  );
}
