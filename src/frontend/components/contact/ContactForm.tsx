"use client";

import { useState } from "react";
import { ui } from "@/lib/ui/classes";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className={`${ui.card} p-8 text-center`}>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
          ✓
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
          Message received
        </h3>
        <p className={`mt-2 ${ui.muted}`}>
          Risk operations will respond within one business day. This demo form does
          not send email yet.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-5 ${ui.card} p-6 sm:p-8`}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            Full name
          </span>
          <input required name="name" className={`mt-1.5 ${ui.input}`} />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            Work email
          </span>
          <input
            required
            type="email"
            name="email"
            className={`mt-1.5 ${ui.input}`}
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-300">
          Subject
        </span>
        <select name="subject" className={`mt-1.5 ${ui.select}`}>
          <option>Platform access</option>
          <option>Policy / RAG question</option>
          <option>Assessment workflow</option>
          <option>Technical issue</option>
          <option>Other</option>
        </select>
      </label>

      <label className="block text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-300">
          Message
        </span>
        <textarea
          required
          name="message"
          rows={5}
          className={`mt-1.5 ${ui.input}`}
          placeholder="Describe your request or issue..."
        />
      </label>

      <button type="submit" className={ui.btnPrimary}>
        Send message
      </button>
    </form>
  );
}
