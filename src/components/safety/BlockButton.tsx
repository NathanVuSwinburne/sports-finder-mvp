"use client";

import { useState } from "react";

/**
 * Placeholder block control. v1 stores nothing server-side — it just gives
 * users a sense of control. Real blocking (hiding events/messages) is future work.
 */
export function BlockButton() {
  const [blocked, setBlocked] = useState(false);

  if (blocked) {
    return (
      <p className="text-xs text-slate-500">
        You&rsquo;ve blocked this user (demo — not yet persisted).
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setBlocked(true)}
      className="text-xs font-medium text-slate-400 hover:text-slate-700"
    >
      🚫 Block this user
    </button>
  );
}
