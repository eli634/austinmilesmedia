import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { isAdminDemoMode } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

import { AdminShell } from "../admin-shell";
import {
  ADMIN_SIDEBAR_COLLAPSED_VALUE,
  ADMIN_SIDEBAR_COOKIE,
} from "../constants";

async function assertAdmin() {
  if (isAdminDemoMode()) {
    return;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("admin_profiles").select("id").limit(1);

  if (error || !data?.length) {
    redirect("/admin/login");
  }
}

export default async function AdminCrmLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const collapsed =
    cookieStore.get(ADMIN_SIDEBAR_COOKIE)?.value ===
    ADMIN_SIDEBAR_COLLAPSED_VALUE;

  await assertAdmin();

  return <AdminShell initialCollapsed={collapsed}>{children}</AdminShell>;
}
