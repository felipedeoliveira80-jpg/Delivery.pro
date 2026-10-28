import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  throw new Error("Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY antes de iniciar o Delivery Max.");
}

// Apenas a chave pública pode ser utilizada no navegador. Nunca use service_role.
export const supabase = createClient<Database>(url, publishableKey);
