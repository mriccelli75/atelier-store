import Link from "next/link";
import { Suspense } from "react";
import { navigation } from "@/lib/catalog";
import { AccountIcon, SearchIcon } from "@/components/icons";
import { BagLink, BagLinkFallback } from "./bag-link";
import { MenuDrawer } from "./menu-drawer";

// No display value here: each use sets its own (inline-flex, or hidden + breakpoint).
const iconButton =
  "size-10 items-center justify-center text-ink transition-colors hover:text-ink-muted";

export function SiteHeader() {
  return (
    <header className="header-bar sticky top-0 z-40">
      <div className="container-page grid h-full grid-cols-[1fr_auto_1fr] items-center">
        {/* Left: menu drawer (all breakpoints), plus search on small screens */}
        <div className="-ml-2.5 flex items-center">
          <MenuDrawer items={navigation} />
          <Link href="/search" aria-label="Search" className={`${iconButton} inline-flex lg:hidden`}>
            <SearchIcon />
          </Link>
        </div>

        <Link
          href="/"
          className="font-display text-[1.75rem] leading-none tracking-[0.02em] lg:text-[2.125rem]"
        >
          Atelier
        </Link>

        <div className="-mr-2.5 flex items-center justify-end">
          <Link
            href="/search"
            aria-label="Search"
            className={`${iconButton} hidden lg:inline-flex`}
          >
            <SearchIcon />
          </Link>
          <Link
            href="/account"
            aria-label="Account"
            className={`${iconButton} hidden sm:inline-flex`}
          >
            <AccountIcon />
          </Link>
          <Suspense fallback={<BagLinkFallback />}>
            <BagLink />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
