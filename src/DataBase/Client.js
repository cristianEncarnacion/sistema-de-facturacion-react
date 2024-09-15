import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://shixblygqkejolsfrxgp.supabase.co"; // Reemplaza con tu URL
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoaXhibHlncWtlam9sc2ZyeGdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM0MjczMTcsImV4cCI6MjAzOTAwMzMxN30.i82usRUUnEN6dABkeYsNP9XAqY4r1oEuvWTNYcJjTu4"; // Reemplaza con tu clave pública
export const supabase = createClient(supabaseUrl, supabaseKey);
