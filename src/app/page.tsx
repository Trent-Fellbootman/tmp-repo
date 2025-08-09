"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/store";
import type { ChatMessage, ModelConfig } from "@/types";
import { nanoid } from "nanoid";
import { streamChat } from "@/lib/client";
import { Plus, Settings, Send, Trash2, Edit, Save, RefreshCcw } from "lucide-react";
import clsx from "classnames";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

function useAutoScroll(dep: any) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [dep]);
  return ref;
}

function ConfigForm({ value, onChange }: { value: Partial<ModelConfig>; onChange: (v: Partial<ModelConfig>) => void }) {
  return (
    <div className="space-y-2">
      <input className="input" placeholder="Display Name" value={value.name ?? ""} onChange={e=>onChange({ ...value, name: e.target.value })} />
      <select className="input" value={value.provider ?? "openai"} onChange={e=>onChange({ ...value, provider: e.target.value as any })}>
        <option value="openai">OpenAI compatible</option>
        <option value="ollama">Ollama</option>
      </select>
      <input className="input" placeholder="Base URL (e.g. https://api.openai.com)" value={value.baseUrl ?? ""} onChange={e=>onChange({ ...value, baseUrl: e.target.value })} />
      <input className="input" placeholder="API Key (if required)" value={value.apiKey ?? ""} onChange={e=>onChange({ ...value, apiKey: e.target.value })} />
      <input className="input" placeholder="Model name (e.g. gpt-4o-mini or llama3:8b)" value={value.model ?? ""} onChange={e=>onChange({ ...value, model: e.target.value })} />
      <label className="text-sm text-gray-500">Temperature</label>
      <input type="range" min={0} max={2} step={0.1} value={value.temperature ?? 0.7} onChange={e=>onChange({ ...value, temperature: parseFloat(e.target.value) })} className="w-full"/>
    </div>
  );
}

export default function Page() {
  const {
    sessions, configs, activeSessionId, activeConfigId,
    createConfig, updateConfig, deleteConfig,
    createSession, deleteSession, addMessage,
    setActiveSession, setActiveConfig, renameSession, resetAll,
  } = useStore();

  // Seed a default config on first load
  useEffect(() => {
    if (configs.length === 0) {
      const id = createConfig({
        name: "My OpenAI",
        provider: "openai",
        baseUrl: "https://api.openai.com",
        apiKey: "",
        model: "gpt-4o-mini",
        temperature: 0.7,
      });
      setActiveConfig(id);
    }
  }, []);

  const [cfgDraft, setCfgDraft] = useState<Partial<ModelConfig> | null>(null);
  const [editingConfigId, setEditingConfigId] = useState<string | null>(null);

  const activeSession = useMemo(() => sessions.find(s => s.id === activeSessionId) || null, [sessions, activeSessionId]);
  const activeConfig = useMemo(() => configs.find(c => c.id === (activeSession?.configId || activeConfigId || "")) || null, [configs, activeSession, activeConfigId]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useAutoScroll(activeSession?.messages);

  const onSend = async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    if (!activeConfig) { setError("Please create a model config first"); return; }
    const sid = activeSession?.id || createSession(activeConfig.id, input.slice(0, 30) || "New Chat");

    const history = [...(activeSession?.messages || [])];
    // include optional system prompt
    const sys = (sessions.find(s=>s.id===sid)?.systemPrompt || '').trim();
    if (sys) {
      history.unshift({ id: 'sys', role: 'system', content: sys, createdAt: Date.now() } as ChatMessage);
    }

    const userMsg: ChatMessage = { id: nanoid(), role: 'user', content: input, createdAt: Date.now() };
    addMessage(sid, userMsg);
    setInput("");

    const assistantMsg: ChatMessage = { id: nanoid(), role: 'assistant', content: "", createdAt: Date.now() };
    addMessage(sid, assistantMsg);
    setLoading(true); setError(null);
    try {
      await streamChat(activeConfig, [...history, userMsg], (delta) => {
        // append to the last assistant message instead of pushing new messages
        useStore.getState().updateMessage(sid, assistantMsg.id, ({ content }) => ({ content: (content || '') + delta })) as any;
      }, { signal: abortRef.current?.signal });
    } catch (e:any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen grid grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <aside className="border-r p-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">LLM Chat</h1>
          <button className="btn" onClick={() => resetAll()} title="Reset all data"><RefreshCcw size={16}/></button>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn" onClick={() => activeConfig && setActiveSession(createSession(activeConfig.id))}><Plus size={16}/> New Chat</button>
          <button className="btn" onClick={() => { setCfgDraft({}); setEditingConfigId("new"); }}><Settings size={16}/> New Config</button>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">Configurations</div>
          <div className="space-y-1 max-h-44 overflow-auto pr-1">
            {configs.map(cfg => (
              <div key={cfg.id} className={clsx("item", { selected: activeConfig?.id === cfg.id })} onClick={() => setActiveConfig(cfg.id)}>
                <div className="flex-1">
                  <div className="font-medium">{cfg.name}</div>
                  <div className="text-xs text-gray-500 break-all">{cfg.baseUrl} · {cfg.model}</div>
                </div>
                <button className="icon" onClick={(e)=>{ e.stopPropagation(); setCfgDraft(cfg); setEditingConfigId(cfg.id); }}><Edit size={14}/></button>
                <button className="icon" onClick={(e)=>{ e.stopPropagation(); deleteConfig(cfg.id); }}><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="text-xs text-gray-500 mb-1">Chats</div>
          <div className="space-y-1 pr-1">
            {sessions.map(s => (
              <div key={s.id} className={clsx("item", { selected: s.id === activeSessionId })} onClick={()=>setActiveSession(s.id)}>
                <div className="flex-1 truncate">
                  <div className="font-medium truncate">{s.title}</div>
                  <div className="text-xs text-gray-500">{new Date(s.updatedAt).toLocaleString()}</div>
                </div>
                <button className="icon" onClick={(e)=>{e.stopPropagation(); const title = prompt('Rename chat', s.title); if (title) renameSession(s.id, title);}}><Edit size={14}/></button>
                <button className="icon" onClick={(e)=>{e.stopPropagation(); deleteSession(s.id);}}><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex flex-col h-screen">
        <header className="border-b p-3 flex items-center gap-2">
          <div className="flex-1">
            <div className="font-medium">{activeSession?.title || 'No chat selected'}</div>
            {activeConfig && (<div className="text-xs text-gray-500">Using: {activeConfig.name} · {activeConfig.model}</div>)}
          </div>
          {activeSession && (
            <input
              className="input max-w-xl"
              placeholder="System prompt (optional)"
              defaultValue={activeSession.systemPrompt || ''}
              onBlur={(e)=> useStore.setState(s=>({ sessions: s.sessions.map(ss=> ss.id===activeSession.id ? { ...ss, systemPrompt: e.target.value } : ss) }))}
            />
          )}
        </header>

        <div className="flex-1 overflow-auto p-4 space-y-3 bg-gray-50" ref={messagesEndRef}>
          {activeSession?.messages.map(m => (
            <div key={m.id} className={clsx("bubble", m.role)}>
              <div className="role">{m.role}</div>
              <div className="content whitespace-pre-wrap"><Markdown remarkPlugins={[remarkGfm]}>{m.content}</Markdown></div>
            </div>
          ))}
          {!activeSession && <div className="text-center text-gray-400 mt-20">Create a chat to start</div>}
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>

        <div className="border-t p-3 flex items-center gap-2">
          <input className="input flex-1" placeholder="Type your message..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); onSend(); }}}/>
          {loading ? (
            <button className="btn" onClick={()=>{ abortRef.current?.abort(); setLoading(false); }}>Cancel</button>
          ) : (
            <button className="btn" disabled={!input || !activeConfig} onClick={onSend}><Send size={16}/> Send</button>
          )}
        </div>
      </main>

      {/* Modal for config editing */}
      {editingConfigId && (
        <div className="modal" onClick={()=>setEditingConfigId(null)}>
          <div className="modal-card" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium">{editingConfigId === 'new' ? 'New Config' : 'Edit Config'}</div>
              <button className="icon" onClick={()=>setEditingConfigId(null)}>✕</button>
            </div>
            <ConfigForm value={cfgDraft || {}} onChange={setCfgDraft as any} />
            <div className="flex justify-end gap-2 mt-4">
              <button className="btn" onClick={()=>setEditingConfigId(null)}>Cancel</button>
              <button className="btn" onClick={()=>{
                if (!cfgDraft?.name || !cfgDraft.baseUrl || !cfgDraft.model) { alert('Please fill name/baseUrl/model'); return; }
                if (editingConfigId === 'new') {
                  const id = createConfig(cfgDraft as any);
                  setActiveConfig(id);
                } else {
                  updateConfig(editingConfigId, cfgDraft as any);
                }
                setEditingConfigId(null);
              }}><Save size={16}/> Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
