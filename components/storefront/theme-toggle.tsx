"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="relative flex items-center gap-0.5 rounded-full border border-line bg-page p-[3px]">
      <span
        className={`absolute left-[3px] top-[3px] size-8 rounded-full bg-ink transition-transform duration-200 ${isDark ? "translate-x-[34px]" : "translate-x-0"}`}
      />
      <button
        className={`relative z-10 grid size-8 place-items-center rounded-full ${isDark ? "text-ink-dim" : "text-page"}`}
        aria-label="Use light theme"
        onClick={() => setTheme("light")}
      >
        <Sun className="size-3.5" />
      </button>
      <button
        className={`relative z-10 grid size-8 place-items-center rounded-full ${isDark ? "text-page" : "text-ink-dim"}`}
        aria-label="Use dark theme"
        onClick={() => setTheme("dark")}
      >
        <Moon className="size-3.5" />
      </button>
    </div>
  );
}
