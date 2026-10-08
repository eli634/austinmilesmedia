"use client";

import { useState } from "react";

export function ConfirmDeleteButton({
  formAction,
  label,
  confirmLabel,
  className,
}: {
  formAction: (formData: FormData) => void | Promise<void>;
  label: string;
  confirmLabel: string;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);

  if (!armed) {
    return (
      <button type="button" onClick={() => setArmed(true)} className={className}>
        {label}
      </button>
    );
  }

  return (
    <button
      type="submit"
      formAction={formAction}
      name="confirm"
      value="delete"
      className={className}
    >
      {confirmLabel}
    </button>
  );
}
