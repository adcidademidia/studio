"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Monitor, Palette, Settings, Tv } from "lucide-react";
import { Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Configure", icon: Settings },
  { href: "/themes", label: "Themes", icon: Palette },
];

export function Header() {
  const pathname = usePathname();

  const openDisplayWindow = () => {
    window.open("/display", "StreamDeckLowerThirdsDisplay", "width=1920,height=1080");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              Lower Thirds
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center transition-colors hover:text-foreground/80",
                    pathname === item.href
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <Button onClick={openDisplayWindow}>
            <Tv className="mr-2 h-4 w-4" />
            Open Display
          </Button>
        </div>
      </div>
    </header>
  );
}
