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
1. Push this repo to GitHub/GitLab
2. Import to Vercel → framework: Next.js
3. Build command: `next build`, Output: default
4. No environment vars required

## Notes
- Supports any OpenAI-compatible endpoint (OpenAI, Together, Groq-compatible if they expose chat/completions, local server or Ollama). For Ollama, set baseUrl to `http://localhost:11434` and model like `llama3:8b`. Some providers use `/v1/chat/completions`, others `/v1/chat/completions` as well; this project assumes the OpenAI chat endpoint.
- If your provider needs a different path or headers, adjust `src/app/api/chat/route.ts`.
