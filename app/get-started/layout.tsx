import type { ReactNode } from "react";

export default function GetStartedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-[60] min-h-screen bg-[#f6f9fc]">{children}</div>
  );
}
