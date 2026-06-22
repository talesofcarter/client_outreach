"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, Loader2 } from "lucide-react";

function GlobalSearchContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from the URL so it persists if the user refreshes the page
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // 1. Debounce mechanism to protect API bandwidth
    const delayDebounceFn = setTimeout(() => {
      const currentQuery = searchParams.get("q") || "";

      // Only push to the router if the value actually changed
      if (searchTerm !== currentQuery) {
        setIsSearching(true);
        const params = new URLSearchParams(searchParams.toString());

        if (searchTerm) {
          params.set("q", searchTerm);
        } else {
          params.delete("q");
        }

        // 2. Intelligent Routing: Funnel external searches to the leads page
        const targetPath = pathname.includes("/leads") ? pathname : "/leads";

        router.push(`${targetPath}?${params.toString()}`);

        // Small timeout for visual UX to show the query processed
        setTimeout(() => setIsSearching(false), 300);
      }
    }, 400); // 400ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pathname, router, searchParams]);

  return (
    <div className="relative w-full max-w-180">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#444746]" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search in Tracker"
        className="w-full bg-[#edf2fc] hover:bg-[#e9eef6] focus:bg-white focus:shadow-[0_1px_3px_0_rgba(60,64,67,0.3)] transition-all duration-200 rounded-full py-3.5 pl-12 pr-4 text-[#1f1f1f] placeholder:text-[#444746] outline-none border border-transparent focus:border-[#e0e0e0]"
      />
      {isSearching && (
        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3186ff] animate-spin" />
      )}
    </div>
  );
}

// 3. Export wrapped in Suspense to prevent Next.js build crashes
export function GlobalSearch() {
  return (
    <Suspense
      fallback={
        <div className="relative w-full max-w-180">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#444746]" />
          <input
            type="text"
            disabled
            placeholder="Loading..."
            className="w-full bg-[#edf2fc] rounded-full py-3.5 pl-12 pr-4 text-[#1f1f1f] outline-none border border-transparent opacity-70"
          />
        </div>
      }
    >
      <GlobalSearchContent />
    </Suspense>
  );
}
