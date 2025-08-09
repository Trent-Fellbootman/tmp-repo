# LLM Chat WebUI

A minimal OpenAI-compatible chat UI. Users can input API base URL and API key and chat with LLMs. Supports multiple model configurations and local chat history (localStorage). Built with Next.js (App Router) + TypeScript.

Features:
- Multiple provider configs: name, baseUrl, apiKey, model, temperature
- LocalStorage persistence for configs and chats
- Streaming responses via a Next.js API route that proxies to provider
- Tailwind reset + simple CSS
- Deployable on Vercel

## Local dev

```bash
npm i
npm run dev
# open http://localhost:3000
```

## Environment
No server secrets are required. The API key is stored in the browser only and sent with each request from the client to the Next.js API route which immediately forwards upstream. For production, ensure your Vercel project allows edge/body streaming.

## Deploy to Vercel

One-click deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FTrent-Fellbootman%2Ftmp-repo&project-name=llm-chat-webui&repository-name=llm-chat-webui)

Manual steps:
1. Import the GitHub repo into Vercel → Framework: Next.js
2. Build command: `next build` (default), Output: `.next` (default)
3. No env vars required
4. Deploy and open the URL. First, create a Config on the left: baseUrl, apiKey, model

## Provider notes
- OpenAI: baseUrl `https://api.openai.com`, model `gpt-4o-mini` (or others)
- Ollama: baseUrl `http://localhost:11434`, model `llama3:8b`
- Other OpenAI-compatible providers should work if they implement `/v1/chat/completions` and Bearer auth

If a provider needs a different path or headers, adjust `src/app/api/chat/route.ts` accordingly.
