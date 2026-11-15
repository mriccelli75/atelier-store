import type { Metadata } from "next";
import type { ComponentType, ReactNode, SVGProps } from "react";
import {
  AccountIcon,
  BagIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Design system",
  description: "Atelier's colours, typography, buttons, forms and icons.",
  robots: { index: false },
};

/*
 * Living style guide. Everything here renders the real tokens and utilities
 * from globals.css, so the page stays accurate as long as it uses them.
 */

const sections = [
  { id: "principles", label: "Principles" },
  { id: "colour", label: "Colour" },
  { id: "typography", label: "Typography" },
  { id: "buttons", label: "Buttons" },
  { id: "forms", label: "Forms" },
  { id: "iconography", label: "Iconography" },
  { id: "geometry", label: "Geometry & motion" },
];

type Swatch = { token: string; value: string; className: string; use: string; dark?: boolean };

const neutrals: Swatch[] = [
  { token: "ink", value: "#000000", className: "bg-ink", use: "Text, primary buttons, active rules", dark: true },
  { token: "ink-soft", value: "#1F1F1F", className: "bg-ink-soft", use: "Hover on ink surfaces", dark: true },
  { token: "ink-muted", value: "#6B6B6B", className: "bg-ink-muted", use: "Secondary text, metadata", dark: true },
  { token: "ink-faint", value: "#A3A3A3", className: "bg-ink-faint", use: "Placeholders, disabled text" },
  { token: "paper", value: "#FFFFFF", className: "bg-paper", use: "Page background" },
  { token: "stone", value: "#F5F5F3", className: "bg-stone", use: "Product backdrop, quiet panels" },
  { token: "stone-deep", value: "#EBEBE8", className: "bg-stone-deep", use: "Hover on stone, skeletons" },
  { token: "line", value: "#E3E3E3", className: "bg-line", use: "Hairlines, field rules" },
];

const signals: Swatch[] = [
  { token: "accent", value: "#5A1220", className: "bg-accent", use: "Signature mark. One per view, editorial only", dark: true },
  { token: "sale", value: "#9B1C1C", className: "bg-sale", use: "Reduced prices, errors", dark: true },
  { token: "success", value: "#1D5C3A", className: "bg-success", use: "Confirmations", dark: true },
  { token: "overlay", value: "rgb(0 0 0 / 0.4)", className: "bg-overlay", use: "Drawer and modal scrim", dark: true },
];

const typeScale = [
  { token: "text-display", spec: "48–120px · 0.95 · serif", className: "font-display text-display", sample: "Atelier" },
  { token: "text-heading-lg", spec: "36–64px · 1.05 · serif", className: "font-display text-heading-lg", sample: "The winter collection" },
  { token: "text-heading", spec: "28–40px · 1.15 · serif", className: "font-display text-heading", sample: "Made by hand in Florence" },
  { token: "text-heading-sm", spec: "20–24px · 1.25 · serif", className: "font-display text-heading-sm", sample: "Care and composition" },
  { token: "text-lead", spec: "18px / 28px · sans", className: "text-lead", sample: "Soft calfskin, cut and stitched in a single workshop." },
  { token: "text-body", spec: "15px / 24px · sans", className: "text-body", sample: "Default copy for descriptions, policies and forms." },
  { token: "text-body-sm", spec: "13px / 20px · sans", className: "text-body-sm", sample: "Product names and prices · $2,450" },
  { token: "text-caption", spec: "12px / 18px · sans", className: "text-caption text-ink-muted", sample: "Breadcrumbs, metadata, legal" },
  { token: "text-eyebrow", spec: "11px · 500 · +0.12em · caps", className: "text-eyebrow", sample: "New arrivals" },
];

const icons: { name: string; Icon: ComponentType<SVGProps<SVGSVGElement>>; use: string }[] = [
  { name: "SearchIcon", Icon: SearchIcon, use: "Search" },
  { name: "AccountIcon", Icon: AccountIcon, use: "Account" },
  { name: "BagIcon", Icon: BagIcon, use: "Bag" },
  { name: "MenuIcon", Icon: MenuIcon, use: "Open menu" },
  { name: "CloseIcon", Icon: CloseIcon, use: "Close" },
  { name: "ChevronLeftIcon", Icon: ChevronLeftIcon, use: "Back" },
  { name: "ChevronRightIcon", Icon: ChevronRightIcon, use: "Forward, submenu" },
];

export default function DesignSystemPage() {
  return (
    <main>
      <header className="container-page pt-10 pb-12 lg:pt-16 lg:pb-16">
        <p className="text-eyebrow mb-4 text-accent">Style guide</p>
        <h1 className="text-display">Design system</h1>
        <p className="mt-6 max-w-[56ch] text-lead text-ink-muted">
          The tokens and primitives behind every Atelier page. Photography supplies
          the colour; the interface stays quiet, square and black on white.
        </p>
      </header>

      <nav
        aria-label="Design system sections"
        className="container-page sticky top-[var(--spacing-header)] z-10 bg-paper lg:top-[var(--spacing-header-lg)]"
      >
        <ul className="-mb-px flex gap-6 overflow-x-auto border-b border-line [scrollbar-width:none] sm:gap-8 [&::-webkit-scrollbar]:hidden">
          {sections.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                className="text-eyebrow block border-b border-transparent py-4 text-ink-muted transition-colors hover:border-ink hover:text-ink"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Section id="principles" title="Principles">
        <ol className="grid gap-x-10 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
          {[
            ["Image first", "Campaign and product photography carry the page. Keep text to a title, a line and a call to action."],
            ["Monochrome chrome", "Ink on paper for every control. Colour appears only in imagery, status messages and one signature mark."],
            ["Two voices", "Cormorant for editorial headings, Geist for everything functional. Weights 400 and 500 only."],
            ["Square and hairline", "No radius, no shadows. Structure comes from 1px rules and whitespace."],
            ["Unobtrusive actions", "One primary button per view. Everything else is secondary, a text link or an icon."],
            ["Tell the story", "Give craft and provenance room: a pull quote or a line of heritage earns its space."],
          ].map(([title, body], i) => (
            <li key={title} className="divider pt-5">
              <p className="text-eyebrow text-ink-muted">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 text-heading-sm">{title}</h3>
              <p className="mt-2 text-body text-ink-muted">{body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="colour"
        title="Colour"
        intro="Tailwind's palette is reset, so only these tokens exist: bg-ink, text-ink-muted, border-line and so on."
      >
        <h3 className="text-eyebrow mb-5">Neutrals</h3>
        <SwatchGrid swatches={neutrals} />
        <h3 className="text-eyebrow mt-12 mb-5">Accent, status and overlay</h3>
        <SwatchGrid swatches={signals} />

        <div className="mt-12 grid gap-px bg-line hairline md:grid-cols-2">
          <div className="bg-paper p-6 lg:p-10">
            <p className="text-eyebrow text-accent">Do</p>
            <p className="mt-3 text-body text-ink-muted">
              Use <Code>accent</Code> for a single editorial mark: a season eyebrow, the
              rule beside a pull quote, one word in a campaign headline.
            </p>
          </div>
          <div className="bg-paper p-6 lg:p-10">
            <p className="text-eyebrow text-ink-muted">Don’t</p>
            <p className="mt-3 text-body text-ink-muted">
              Fill buttons, links, badges or prices with it. Reductions and errors use{" "}
              <Code>sale</Code>; confirmations use <Code>success</Code>.
            </p>
          </div>
        </div>
      </Section>

      <Section
        id="typography"
        title="Typography"
        intro="h1–h3 default to the display serif. Fluid sizes scale with the viewport between the listed bounds."
      >
        <div className="grid gap-px bg-line hairline md:grid-cols-2">
          <div className="bg-paper p-6 lg:p-10">
            <p className="text-eyebrow text-ink-muted">Display · font-display</p>
            <p className="mt-6 font-display text-heading-lg">Cormorant Garamond</p>
            <p className="mt-4 font-display text-heading-sm italic text-ink-muted">
              Regular, medium and italic
            </p>
          </div>
          <div className="bg-paper p-6 lg:p-10">
            <p className="text-eyebrow text-ink-muted">Interface · font-sans</p>
            <p className="mt-6 text-heading-lg">Geist</p>
            <p className="mt-4 text-body text-ink-muted">Regular 400 and medium 500</p>
          </div>
        </div>

        <dl className="mt-12">
          {typeScale.map((t) => (
            <div
              key={t.token}
              className="grid gap-2 border-t border-line py-6 md:grid-cols-[14rem_1fr] md:items-baseline md:gap-8"
            >
              <dt>
                <Code>{t.token}</Code>
                <p className="mt-1 text-caption text-ink-muted">{t.spec}</p>
              </dt>
              <dd className={`min-w-0 break-words ${t.className}`}>{t.sample}</dd>
            </div>
          ))}
        </dl>

        <h3 className="text-eyebrow mt-12 mb-5">Pull quote</h3>
        <figure className="max-w-[40rem] border-l border-accent pl-6">
          <blockquote className="font-display text-heading italic">
            “Every bag passes through the same twelve pairs of hands.”
          </blockquote>
          <figcaption className="text-eyebrow mt-4 text-ink-muted">The workshop, Florence</figcaption>
        </figure>
      </Section>

      <Section
        id="buttons"
        title="Buttons"
        intro="Square, 48px tall, uppercase label. Combine btn with one variant; add btn-block for full width."
      >
        <div className="grid gap-px bg-line hairline md:grid-cols-3">
          <Specimen label="btn btn-primary" note="The one decisive action per view.">
            <button type="button" className="btn btn-primary">Add to bag</button>
            <button type="button" className="btn btn-primary" disabled>Sold out</button>
          </Specimen>
          <Specimen label="btn btn-secondary" note="Alternatives and secondary paths.">
            <button type="button" className="btn btn-secondary">Book an appointment</button>
            <button type="button" className="btn btn-secondary" disabled>Unavailable</button>
          </Specimen>
          <Specimen label="btn btn-inverse" note="Over photography and ink panels." dark>
            <button type="button" className="btn btn-inverse">Discover</button>
          </Specimen>
        </div>

        <div className="mt-px grid gap-px bg-line hairline md:grid-cols-2">
          <Specimen label="btn btn-primary btn-block" note="Purchase panels, forms, phone layouts.">
            <button type="button" className="btn btn-primary btn-block">Checkout</button>
          </Specimen>
          <Specimen label="link-underline" note="Inline and low-emphasis actions.">
            <a href="#buttons" className="link-underline text-body-sm">View size guide</a>
            <a href="#buttons" className="text-eyebrow link-underline">Shop the look</a>
          </Specimen>
        </div>
      </Section>

      <Section
        id="forms"
        title="Forms"
        intro="input-field is a bottom-rule input. The rule turns ink on focus and sale when aria-invalid is set."
      >
        <form className="grid max-w-[40rem] gap-8" aria-label="Form field examples">
          <Field id="ds-email" label="Email">
            <input id="ds-email" type="email" className="input-field" placeholder="name@example.com" />
          </Field>
          <Field id="ds-password" label="Password" error="Use at least 8 characters.">
            <input
              id="ds-password"
              type="password"
              className="input-field"
              defaultValue="short"
              aria-invalid="true"
              aria-describedby="ds-password-error"
            />
          </Field>
          <p role="status" className="text-body-sm text-success">Added to your bag.</p>
        </form>
      </Section>

      <Section
        id="iconography"
        title="Iconography"
        intro="A small, hand-drawn set in src/components/icons.tsx: 24px grid, 1.25 stroke, square caps, no fills."
      >
        <ul className="grid grid-cols-2 gap-px bg-line hairline sm:grid-cols-4 xl:grid-cols-7">
          {icons.map(({ name, Icon, use }) => (
            <li key={name} className="flex flex-col items-center gap-4 bg-paper px-4 py-8 text-center">
              <Icon width={24} height={24} />
              <div>
                <p className="text-caption">{name}</p>
                <p className="text-caption text-ink-muted">{use}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="text-eyebrow mb-5">Sizes</h3>
            <div className="flex items-end gap-8">
              {[16, 20, 24, 32].map((size) => (
                <div key={size} className="flex flex-col items-center gap-3">
                  <BagIcon width={size} height={size} />
                  <span className="text-caption text-ink-muted">{size}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-body-sm text-ink-muted">
              20px in the header, 24px standalone. Icons inherit <Code>currentColor</Code>.
            </p>
          </div>
          <div>
            <h3 className="text-eyebrow mb-5">Usage</h3>
            <ul className="grid gap-2 text-body-sm text-ink-muted">
              <li>Icons are decorative (aria-hidden); label the button or link instead.</li>
              <li>Pair an icon with a word wherever there is room, for example a bag icon with “Bag (2)”.</li>
              <li>Keep hit areas at least 44px even when the glyph is 20px.</li>
              <li>New icons follow the same grid and stroke. Don’t mix in an icon library.</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="geometry" title="Geometry & motion">
        <div className="grid gap-px bg-line hairline md:grid-cols-3">
          <Specimen label="Radius" note="Zero everywhere; rounded-full only for swatches.">
            <span className="size-12 bg-ink" />
            <span className="size-6 rounded-full bg-accent" />
          </Specimen>
          <Specimen label="hairline · divider" note="1px line rules; line-strong when active.">
            <span className="h-12 w-20 hairline" />
            <span className="h-12 w-20 border border-line-strong" />
          </Specimen>
          <Specimen label="ease-luxe · 200ms" note="Colour transitions; 600ms for image zoom.">
            <span className="product-media w-16">
              <span className="block h-full bg-stone-deep transition-transform duration-600 hover:scale-105" />
            </span>
          </Specimen>
        </div>
      </Section>
    </main>
  );
}

function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="container-page scroll-mt-32 py-section-sm lg:scroll-mt-40"
    >
      <div className="mb-10 grid gap-3 md:grid-cols-[14rem_1fr] md:gap-8">
        <h2 id={`${id}-title`} className="text-heading">
          {title}
        </h2>
        {intro && <p className="max-w-[60ch] text-body text-ink-muted md:pt-3">{intro}</p>}
      </div>
      {children}
    </section>
  );
}

function SwatchGrid({ swatches }: { swatches: Swatch[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
      {swatches.map((s) => (
        <li key={s.token}>
          <div className={`aspect-square hairline ${s.className}`} />
          <p className="mt-3 text-body-sm">{s.token}</p>
          <p className="text-caption text-ink-muted">{s.value}</p>
          <p className="mt-1 text-caption text-ink-muted">{s.use}</p>
        </li>
      ))}
    </ul>
  );
}

function Specimen({
  label,
  note,
  dark,
  children,
}: {
  label: string;
  note: string;
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-6 p-6 lg:p-8 ${dark ? "bg-ink text-paper" : "bg-paper"}`}>
      <div className="flex min-h-12 flex-wrap items-center gap-3">{children}</div>
      <div>
        <p className="text-caption font-mono">{label}</p>
        <p className={`text-caption ${dark ? "text-ink-faint" : "text-ink-muted"}`}>{note}</p>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-eyebrow text-ink-muted">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-caption text-sale">
          {error}
        </p>
      )}
    </div>
  );
}

function Code({ children }: { children: ReactNode }) {
  return <code className="font-mono text-caption text-ink">{children}</code>;
}
