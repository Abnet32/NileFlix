import { NextRequest } from "next/server";

const DEFAULT_SYSTEM_PROMPT = `You are NileFlix AI, a warm, conversational mood-based recommendation companion for movies, TV shows, and anime.

How you work:
- Your main job is to chat with the user about how they're feeling and what kind of experience they're in the mood for, then suggest things to watch that fit.
- If the user shares a mood or vibe (e.g. "I'm sad", "feeling cozy", "want something exciting", "bored", "stressed"), tune your picks to it. Sad → comforting or uplifting picks; energetic → action/thrillers; cozy → feel-good or slice-of-life; etc.
- If their mood or taste is unclear, ask ONE short, friendly follow-up question first (e.g. movie vs series vs anime, alone or with friends, light vs intense) before recommending.
- Always mix in a couple of concrete titles across movies, TV, and anime when relevant. For each, give a one-line, spoiler-free reason it fits their mood.
- Keep the conversation going: end with a light question or offer (e.g. "Want more like this, or a different vibe?").

When recommending specific titles, include their TMDB ID in this exact format: {{movie:12345}} for movies or {{tv:67890}} for TV shows and anime (anime use the tv format).

Keep responses concise and friendly. Use an emoji occasionally for warmth. If the user asks about something unrelated to watching things, gently steer back to their mood and what they might enjoy.`;

// NileFlix AI is powered exclusively by Google Gemini. The key is supplied
// server-side via GEMINI_API_KEY so users never need to configure anything.
// gemini-2.5-flash is used because the free-tier quota for 2.0-flash is 0 on
// this key (generateContent returns HTTP 429 RESOURCE_EXHAUSTED).
const GEMINI_MODEL = "gemini-2.5-flash";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          error:
            "AI assistant is not configured. Set GEMINI_API_KEY in the server environment.",
        },
        { status: 503 },
      );
    }

    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: "Messages array is required." },
        { status: 400 },
      );
    }

    return await callGemini(apiKey, messages);
  } catch (error) {
    console.error("AI Chat error:", error);
    return Response.json(
      { error: "Failed to get AI response. Please try again." },
      { status: 500 },
    );
  }
}

async function callGemini(
  apiKey: string,
  messages: { role: string; content: string }[],
) {
  const userMessages = messages.filter(
    (m) => m.role === "user" || m.role === "assistant",
  );

  const contents = userMessages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  // Stream Server-Sent Events from Gemini so tokens arrive progressively
  // instead of all at once, giving a ChatGPT-style typing effect.
  const upstream = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: DEFAULT_SYSTEM_PROMPT }] },
        contents,
      }),
    },
  );

  if (!upstream.ok || !upstream.body) {
    const err = await upstream.text();
    console.error(`Gemini API error: ${upstream.status} ${err}`);
    const message =
      upstream.status === 429
        ? "I'm a little overwhelmed right now (rate limit). Please try again in a moment."
        : "Sorry, I couldn't generate a response right now. Please try again.";
    return Response.json({ error: message }, { status: 502 });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstream.body.getReader();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // SSE events are separated by blank lines; each line is "data: {...}"
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
              const json = JSON.parse(payload);
              const text =
                json.candidates?.[0]?.content?.parts
                  ?.map((p: { text?: string }) => p.text ?? "")
                  .join("") ?? "";
              if (text) controller.enqueue(encoder.encode(text));
            } catch {
              // Partial/non-JSON keep-alive line — skip it.
            }
          }
        }
      } catch (err) {
        console.error("AI stream error:", err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Content-Type-Options": "nosniff",
      "X-Accel-Buffering": "no",
    },
  });
}
