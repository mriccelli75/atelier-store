"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  MenuIcon,
} from "@/components/icons";
import type { NavItem } from "@/lib/catalog";

const panel =
  "absolute inset-0 flex flex-col overflow-y-auto px-gutter transition-[translate,opacity] duration-500 ease-luxe motion-reduce:transition-none";

/**
 * Site menu as a full-height drawer from the left, at every breakpoint.
 * Items with children open a second panel that slides over the first.
 */
export function MenuDrawer({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Label of the item whose sub-panel is showing; null = top level.
  const [active, setActive] = useState<string | null>(null);
  // Last sub-panel opened; kept so its contents stay visible while it slides out.
  const [shown, setShown] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());
  const lastActive = useRef<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    // Keep the page behind the drawer from scrolling.
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // Move focus into the panel that just came into view.
  useEffect(() => {
    if (active) {
      backRef.current?.focus();
    } else if (lastActive.current) {
      triggerRefs.current.get(lastActive.current)?.focus();
    }
    lastActive.current = active;
  }, [active]);

  const close = () => setOpen(false);
  const current = items.find((item) => item.label === shown);
  const isCurrent = (href: string) => pathname === href;
  const inSection = (item: NavItem) =>
    pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center gap-2.5 px-2.5 transition-colors hover:text-ink-muted"
      >
        <MenuIcon />
        <span className="text-eyebrow max-lg:sr-only">Menu</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Menu"
        onClose={() => {
          setOpen(false);
          setActive(null);
          setShown(null);
          lastActive.current = null;
        }}
        onClick={(e) => {
          // Clicking the backdrop (outside the panel) closes the menu.
          if (e.target === e.currentTarget) close();
        }}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-paper p-0 text-ink backdrop:bg-overlay sm:w-[28rem] motion-safe:open:animate-slide-in"
      >
        <div className="flex h-full flex-col pt-[env(safe-area-inset-top,0px)]">
          <div className="flex h-header shrink-0 items-center justify-between px-gutter lg:h-header-lg">
            <span className="font-display text-[1.75rem] leading-none">Atelier</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={close}
              className="-mr-2.5 inline-flex size-10 items-center justify-center transition-colors hover:text-ink-muted"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="relative min-h-0 flex-1 overflow-hidden">
            {/* Level 1 */}
            <nav
              aria-label="Main"
              inert={active !== null}
              className={`${panel} ${active ? "-translate-x-1/4 opacity-0" : ""}`}
            >
              <ul className="mt-4 lg:mt-8">
                {items.map((item) => {
                  const rowClass = `flex w-full items-center justify-between py-3.5 text-left font-display text-heading-sm transition-colors hover:text-ink-muted ${
                    inSection(item) ? "italic" : ""
                  }`;
                  return (
                    <li key={item.label}>
                      {item.children ? (
                        <button
                          ref={(el) => {
                            if (el) triggerRefs.current.set(item.label, el);
                            else triggerRefs.current.delete(item.label);
                          }}
                          type="button"
                          aria-expanded={active === item.label}
                          onClick={() => {
                            setActive(item.label);
                            setShown(item.label);
                          }}
                          className={rowClass}
                        >
                          {item.label}
                          <ChevronRightIcon className="text-ink-muted" />
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={close}
                          aria-current={isCurrent(item.href) ? "page" : undefined}
                          className={rowClass}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="mt-auto flex flex-col gap-3 border-t border-line py-6 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] text-body-sm">
                <Link href="/account" onClick={close} className="hover:text-ink-muted">
                  Sign in or create an account
                </Link>
                <Link href="/services/appointments" onClick={close} className="hover:text-ink-muted">
                  Book an appointment
                </Link>
              </div>
            </nav>

            {/* Level 2 */}
            <nav
              aria-label={current?.label}
              inert={active === null}
              className={`${panel} bg-paper ${active ? "" : "translate-x-full"}`}
            >
              {current?.children && (
                <>
                  <button
                    ref={backRef}
                    type="button"
                    onClick={() => setActive(null)}
                    className="-ml-1 mt-2 inline-flex items-center gap-1.5 self-start py-2 text-eyebrow text-ink-muted transition-colors hover:text-ink lg:mt-6"
                  >
                    <ChevronLeftIcon width={16} height={16} />
                    Back
                  </button>
                  <h2 className="mt-4 text-heading">{current.label}</h2>
                  <ul className="mt-6 border-t border-line">
                    {current.children.map((child) => (
                      <li key={child.href} className="border-b border-line">
                        <Link
                          href={child.href}
                          onClick={close}
                          aria-current={isCurrent(child.href) ? "page" : undefined}
                          className="group flex items-center justify-between py-4 text-body transition-colors hover:text-ink-muted aria-[current=page]:font-medium"
                        >
                          {child.label}
                          <ChevronRightIcon
                            width={16}
                            height={16}
                            className="text-ink-faint transition-transform group-hover:translate-x-0.5"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </nav>
          </div>
        </div>
      </dialog>
    </>
  );
}
