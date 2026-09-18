import { cookies } from "next/headers";
import type { ReactNode } from "react";

import { AdminShell } from "../admin-shell";
import {
  ADMIN_SIDEBAR_COLLAPSED_VALUE,
  ADMIN_SIDEBAR_COOKIE,
} from "../constants";

export default async function AdminCrmLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const collapsed =
    cookieStore.get(ADMIN_SIDEBAR_COOKIE)?.value ===
    ADMIN_SIDEBAR_COLLAPSED_VALUE;

  return <AdminShell initialCollapsed={collapsed}>{children}</AdminShell>;
}
