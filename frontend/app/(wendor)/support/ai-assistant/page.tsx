'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  askAi,
  fetchAiConversations,
  fetchAiPersonas,
  fetchAiSuggestedPrompts,
  startAiConversation,
} from '@/lib/api';
import { AiConversation, AiPersona } from '@/types/ai-assistant';

// PRD 3.2.3 — AI Assistant
export default function AiAssistantPage() {
  const [personas, setPersonas] = useState<AiPersona[]>([]);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [conversations, setConversations] = useState<AiConversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [personaId, setPersonaId] = useState<string>('ops');
  const [question, setQuestion] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadConversations = () => fetchAiConversations().then((list) => {
    setConversations(list);
    if (!activeId && list.length) setActiveId(list[0].id);
  });

  useEffect(() => {
    fetchAiPersonas().then(setPersonas).catch(() => undefined);
    fetchAiSuggestedPrompts().then(setPrompts).catch(() => undefined);
    loadConversations().catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [activeId, conversations]);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  async function handleSend(text?: string) {
    const q = (text ?? question).trim();
    if (!q || sending) return;
    setSending(true);
    setQuestion('');
    try {
      const updated = await askAi({ question: q, conversationId: activeId ?? undefined, personaId });
      setConversations((prev) => {
        const withoutOld = prev.filter((c) => c.id !== updated.id);
        return [updated, ...withoutOld];
      });
      setActiveId(updated.id);
    } finally {
      setSending(false);
    }
  }

  async function handleNewConversation() {
    const created = await startAiConversation(personaId);
    setConversations((prev) => [created, ...prev]);
    setActiveId(created.id);
  }

  return (
    <main className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <p className="console-label text-xs text-accent">
            <Link href="/support/service-tickets" className="hover:underline">
              Support
            </Link>{' '}
            / PRD 3.2.3
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-100">AI Assistant</h1>
          <p className="mt-1 text-sm text-slate-400">
            Analyze machines, warehouses, teammates, products, and business performance using
            natural language.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
          {/* Chat history / persona sidebar */}
          <div className="flex flex-col gap-4">
            <div className="rounded-console border border-line bg-panel p-3">
              <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Persona</p>
              <select
                value={personaId}
                onChange={(e) => setPersonaId(e.target.value)}
                className="w-full rounded-console border border-line bg-ink px-3 py-2 text-sm text-slate-200 focus:border-accent focus:outline-none"
              >
                {personas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-500">
                {personas.find((p) => p.id === personaId)?.description}
              </p>
            </div>

            <button
              onClick={handleNewConversation}
              className="rounded-console border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-accent hover:bg-accent/15"
            >
              + New Conversation
            </button>

            <div className="rounded-console border border-line bg-panel p-3">
              <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Chat History</p>
              <ul className="flex flex-col gap-1">
                {conversations.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => setActiveId(c.id)}
                      className={`w-full truncate rounded-console px-2.5 py-2 text-left text-sm transition-colors ${
                        c.id === activeId
                          ? 'bg-accent/15 text-accent'
                          : 'text-slate-300 hover:bg-ink hover:text-slate-100'
                      }`}
                    >
                      {c.title || 'New conversation'}
                    </button>
                  </li>
                ))}
                {conversations.length === 0 && (
                  <li className="px-2.5 py-2 text-sm text-slate-500">No conversations yet.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Conversation window */}
          <div className="flex h-[560px] flex-col rounded-console border border-line bg-panel">
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
              {!activeConversation && (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <p className="text-sm text-slate-400">Ask a question to get started, or try:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {prompts.map((p) => (
                      <button
                        key={p}
                        onClick={() => handleSend(p)}
                        className="rounded-full border border-line bg-ink px-3 py-1.5 text-xs text-slate-300 hover:border-accent hover:text-accent"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeConversation?.messages.map((m) => (
                <div key={m.id} className={`mb-4 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75%] rounded-console px-4 py-2.5 text-sm ${
                      m.role === 'user'
                        ? 'bg-accent/20 text-slate-100'
                        : 'border border-line bg-ink text-slate-200'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="mb-4 flex justify-start">
                  <div className="rounded-console border border-line bg-ink px-4 py-2.5 text-sm text-slate-500">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 border-t border-line p-3">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about machines, sales, inventory, or billing..."
                className="flex-1 rounded-console border border-line bg-ink px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-accent focus:outline-none"
              />
              <button
                onClick={() => handleSend()}
                disabled={sending || !question.trim()}
                className="rounded-console bg-accent px-4 py-2 text-sm font-medium text-ink disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
