"use server";

import { redirect } from "next/navigation";

import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

function loginError(message: string): never {
  redirect(`/admin/login?error=${encodeURIComponent(message)}`);
}

export async function signInAdmin(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!hasSupabaseEnv()) {
    loginError("Supabase env vars are missing.");
  }

  if (!email || !password) {
    loginError("Email and password are required.");
  }

  const supabase = await createClient();
  const result = await Promise.race([
    supabase.auth.signInWithPassword({ email, password }),
    new Promise<{ error: { message: string } }>((resolve) =>
      setTimeout(
        () => resolve({ error: { message: "Login timed out. Check Supabase settings and try again." } }),
        12000,
      ),
    ),
  ]);

  if (result.error) {
    loginError(result.error.message);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    loginError("Login succeeded, but no session was created.");
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.auth.signOut();
    loginError("This user is not authorized for Austin admin.");
  }

  redirect("/admin");
}
