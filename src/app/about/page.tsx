"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AboutRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/#about-us");
  }, [router]);

  return (
    <div className="min-h-[80vh] bg-white dark:bg-slate-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9933]"></div>
    </div>
  );
}
