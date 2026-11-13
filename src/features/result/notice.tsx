"use client";

import { useEffect, useState } from "react";

const focusRing = "focus-visible:outline-primary-ink focus-visible:outline-2 focus-visible:outline-offset-2";

export function Notice({ title, body, action }: { title: string; body: string; action: { label: string; onClick: () => void; disabled?: boolean } }) {
  return (
    <div role="status" className="bg-card border-border-strong flex flex-col items-start gap-3 rounded-2xl border-[1.5px] p-8 xl:col-span-2">
      <h3 className="font-display text-[26px] font-extrabold tracking-[-0.02em]">{title}</h3>
      <p className="text-muted-foreground max-w-[46ch]">{body}</p>
      <button
        type="button"
        disabled={action.disabled}
        onClick={action.onClick}
        className={`bg-primary border-border-strong hover:bg-primary-hover mt-2 rounded-xl border-[1.5px] px-5 py-2.5 text-[17px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
      >
        {action.label}
      </button>
    </div>
  );
}

export function BusyNotice({ seconds, onRetry }: { seconds: number; onRetry: () => void }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return (
    <Notice
      title="Spotify is busy right now"
      body={left > 0 ? `Too many requests. Try again in ${left} s.` : "You can try again now."}
      action={{ label: "Try again", onClick: onRetry, disabled: left > 0 }}
    />
  );
}
