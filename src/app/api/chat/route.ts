import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { config, messages } = await req.json();
    if (!config?.baseUrl || !config?.model) {
      return new Response("Missing config.baseUrl or config.model", { status: 400 });
    }

    const url = `${String(config.baseUrl).replace(/\/$/, "")}/v1/chat/completions`;
    const payload = {
      model: config.model,
      temperature: config.temperature ?? 0.7,
      stream: true,
      messages: messages?.map((m: any) => ({ role: m.role, content: m.content })) ?? [],
    };

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (config.apiKey) headers["Authorization"] = `Bearer ${config.apiKey}`;

    const upstream = await fetch(url, { method: "POST", headers, body: JSON.stringify(payload) });
    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text().catch(() => "");
      return new Response(`Upstream error: ${upstream.status} ${upstream.statusText} ${text}`, { status: upstream.status });
    }

    // Pipe-through streaming body as-is (SSE style)
    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (e: any) {
    return new Response(`Server error: ${e?.message || String(e)}`, { status: 500 });
  }
}
