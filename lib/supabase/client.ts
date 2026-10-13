import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_KEY, SUPABASE_URL } from "./config";

/** Browser client (singleton inside @supabase/ssr). Only call when supabaseConfigured. */
export const createClient = () => createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
