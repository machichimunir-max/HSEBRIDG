"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function DebugClickWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link) {
        const href = link.getAttribute("href");
        console.log("🔍 Click detected on link:", {
          href,
          text: link.textContent,
          defaultPrevented: e.defaultPrevented,
          target: e.target,
          currentTarget: e.currentTarget,
          timestamp: new Date().toISOString(),
        });

        // If Next.js Link isn't working, force navigation
        if (href && !e.defaultPrevented && !link.getAttribute("target")) {
          console.log("⚠️ Forcing navigation to:", href);
          // Uncomment to force navigation as fallback
          // e.preventDefault();
          // router.push(href);
        }
      }
    };

    document.addEventListener("click", handleClick, true);
    console.log("🚀 Debug click listener activated");

    return () => {
      document.removeEventListener("click", handleClick, true);
      console.log("🛑 Debug click listener removed");
    };
  }, [router]);

  return <>{children}</>;
}
