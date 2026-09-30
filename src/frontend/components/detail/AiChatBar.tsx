"use client";

import { useState } from "react";
import type { ChatMessage, PolicyCitation } from "@/lib/api/types";
import { askQuestion } from "@/lib/api/client";

export function AiChatBar({
  applicationId,
  onCitationClick,
}: {
  applicationId: string;
  onCitationClick: (citationId: string) => void;
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    setMessages((current) => [...current, { role: "user", content: trimmed }]);
    setMessage("");

    try {
      const response = await askQuestion(applicationId, trimmed);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: response.reply,
          citations: response.citations,
        },
      ]);
    } catch {
      setError("Could not reach the case assistant.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-t border-slate-200 bg-white">
      {messages.length > 0 ? (
        <div className="max-h-48 space-y-3 overflow-y-auto border-b border-slate-100 px-4 py-3">
          {messages.map((entry, index) => (
            <div
              key={`${entry.role}-${index}`}
              className={`rounded-lg px-3 py-2 text-sm ${
                entry.role === "user"
                  ? "ml-8 bg-blue-50 text-blue-900"
                  : "mr-8 bg-slate-50 text-slate-800"
              }`}
            >
              <p>{entry.content}</p>
              {entry.citations?.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {entry.citations.map((citation: PolicyCitation) => (
                    <button
                      key={citation.id}
                      type="button"
                      onClick={() => onCitationClick(citation.id)}
                      className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200"
                    >
                      {citation.documentName}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      <form onSubmit={(event) => void handleSubmit(event)} className="flex gap-3 px-4 py-3">
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Ask about this application..."
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Sending..." : "Ask"}
        </button>
      </form>
      {error ? <p className="px-4 pb-3 text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
