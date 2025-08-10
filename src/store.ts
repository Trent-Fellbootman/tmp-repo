import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { storage } from './lib/storage';
import type { ChatMessage, ChatSession, ModelConfig } from './types';

interface StoreState {
  sessions: ChatSession[];
  configs: ModelConfig[];
  activeSessionId: string | null;
  activeConfigId: string | null;

  // actions
  createConfig: (partial: Omit<ModelConfig, 'id'>) => string;
  updateConfig: (id: string, patch: Partial<ModelConfig>) => void;
  deleteConfig: (id: string) => void;

  createSession: (configId: string, title?: string, systemPrompt?: string) => string;
  deleteSession: (id: string) => void;
  addMessage: (sessionId: string, msg: Omit<ChatMessage, 'id' | 'createdAt'>) => ChatMessage;
  updateMessage: (sessionId: string, messageId: string, patch: Partial<ChatMessage> | ((m: ChatMessage) => Partial<ChatMessage>)) => void;
  setActiveSession: (id: string | null) => void;
  setActiveConfig: (id: string | null) => void;
  renameSession: (id: string, title: string) => void;
  updateSession: (id: string, patch: Partial<ChatSession>) => void;

  resetAll: () => void;

  // optional convenience
  importState?: (state: Partial<Pick<StoreState, 'sessions' | 'configs' | 'activeSessionId' | 'activeConfigId'>>) => void;
}

const KEY = 'llm-chat-state-v1';

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      sessions: [],
      configs: [],
      activeSessionId: null,
      activeConfigId: null,

      createConfig: (partial) => {
        const id = nanoid();
        const cfg: ModelConfig = { id, temperature: 0.7, ...partial };
        set((s) => ({ configs: [cfg, ...s.configs], activeConfigId: id }));
        return id;
      },
      updateConfig: (id, patch) => set((s) => ({
        configs: s.configs.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      })),
      deleteConfig: (id) => set((s) => ({
        configs: s.configs.filter((c) => c.id !== id),
        sessions: s.sessions.filter((ss) => ss.configId !== id),
        activeConfigId: s.activeConfigId === id ? null : s.activeConfigId,
        activeSessionId: s.activeSessionId && s.sessions.find((x) => x.id === s.activeSessionId && x.configId === id) ? null : s.activeSessionId,
      })),

      createSession: (configId, title, systemPrompt) => {
        const id = nanoid();
        const now = Date.now();
        const session: ChatSession = {
          id,
          title: title || 'New Chat',
          configId,
          systemPrompt,
          messages: [],
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ sessions: [session, ...s.sessions], activeSessionId: id }));
        return id;
      },
      deleteSession: (id) => set((s) => ({
        sessions: s.sessions.filter((x) => x.id !== id),
        activeSessionId: s.activeSessionId === id ? null : s.activeSessionId,
      })),
      renameSession: (id, title) => set((s) => ({
        sessions: s.sessions.map((x) => (x.id === id ? { ...x, title } : x)),
      })),
      updateSession: (id, patch) => set((s) => ({
        sessions: s.sessions.map((x) => (
          x.id === id ? { ...x, ...patch, updatedAt: Date.now() } : x
        )),
      })),

      addMessage: (sessionId, msg) => {
        const message: ChatMessage = { id: nanoid(), createdAt: Date.now(), ...msg };
        set((s) => ({
          sessions: s.sessions.map((ss) =>
            ss.id === sessionId
              ? { ...ss, messages: [...ss.messages, message], updatedAt: Date.now() }
              : ss
          ),
        }));
        return message;
      },
      updateMessage: (sessionId, messageId, patch) => set((s) => ({
        sessions: s.sessions.map((ss) =>
          ss.id === sessionId
            ? {
                ...ss,
                messages: ss.messages.map((m) =>
                  m.id === messageId
                    ? { ...m, ...(typeof patch === 'function' ? (patch as any)(m) : patch) }
                    : m
                ),
                updatedAt: Date.now(),
              }
            : ss
        ),
      })),
      setActiveSession: (id) => set({ activeSessionId: id }),
      setActiveConfig: (id) => set({ activeConfigId: id }),

      resetAll: () => set({ sessions: [], configs: [], activeSessionId: null, activeConfigId: null }),
      importState: (state) => set((s) => ({
        sessions: state.sessions ?? s.sessions,
        configs: state.configs ?? s.configs,
        activeSessionId: state.activeSessionId ?? s.activeSessionId,
        activeConfigId: state.activeConfigId ?? s.activeConfigId,
      })),
    }),
    {
      name: KEY,
      storage: {
        getItem: (name: string) => {
          const value = storage.get<any>(name, null as any);
          return value ? { state: value, version: 0 } : (null as any);
        },
        setItem: (name: string, value: any) => storage.set(name, value),
        removeItem: (name: string) => storage.set(name, null as any),
      } as any,
      partialize: (state) => state, // persist all
    }
  )
);
