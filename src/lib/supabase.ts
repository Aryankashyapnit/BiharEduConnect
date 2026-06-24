import { createClient } from "@supabase/supabase-js";

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (e) {
    return false;
  }
};

if (!supabaseUrl || !isValidUrl(supabaseUrl)) {
  supabaseUrl = "https://placeholder-project.supabase.co";
}
if (!supabaseAnonKey) {
  supabaseAnonKey = "placeholder-anon-key";
}

// Log a development-only warning if environment variables are not configured
if (
  typeof window !== "undefined" &&
  (supabaseUrl.includes("placeholder-project") || supabaseAnonKey === "placeholder-anon-key")
) {
  console.warn(
    "Supabase credentials are not configured. The app will fall back to local storage and offline mock data. " +
    "Please create a .env.local file with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
