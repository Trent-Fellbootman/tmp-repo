import type { ChatMessage, ModelConfig } from "@/types";

export async function streamChat(
  config: ModelConfig,
  messages: ChatMessage[],
  onToken: (chunk: string) => void
): Promise<string> {
  // Build OpenAI-compatible payload by default
  const payload = {
    model: config.model,
    temperature: config.temperature ?? 0.7,
    stream: true,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (config.apiKey) headers['Authorization'] = `Bearer ${config.apiKey}`;

  // call our Next.js API route to avoid CORS and keep key client-side only in localStorage
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers,
    body: JSON.stringify({ config, messages }),
  });
  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed: ${res.status} ${res.statusText} ${text}`);
  }

  // Read SSE-like stream (OpenAI style)
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    // Parse data: lines starting with 'data:'
    for (const line of chunk.split(/\n/)) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.replace(/^data:\s*/, '');
      if (data === '[DONE]') {
        reader.cancel();
        break;
      }
      try {
        const json = JSON.parse(data);
        const delta = json.choices?.[0]?.delta?.content ?? '';
        if (delta) {
          full += delta;
          onToken(delta);
        }
      } catch {
        // ignore
      }
    }
  }

  return full;
}
