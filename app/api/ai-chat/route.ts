import { NextRequest } from "next/server";

const DEFAULT_SYSTEM_PROMPT = `You are NileFlix AI, a friendly and knowledgeable movie, TV show, and anime recommendation assistant.

Your capabilities:
- Recommend movies, TV shows, and anime based on user preferences
- Analyze genres, themes, and styles to find perfect matches
- Suggest hidden gems and underrated titles
- Compare similar titles and explain why someone might prefer one over another
- Provide brief, spoiler-free summaries

When recommending specific titles, include their TMDB ID in this format: {{movie:12345}} for movies or {{tv:67890}} for TV shows/anime.

Keep responses concise, friendly, and helpful. Use emoji occasionally for personality. If the user asks about something unrelated to movies/TV/anime, gently redirect them.`;

// NileFlix AI is powered exclusively by Google Gemini. The key is supplied
// server-side via GEMINI_API_KEY so users never need to configure anything.
const GEMINI_MODEL = "gemini-2.0-flash";

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

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: DEFAULT_SYSTEM_PROMPT }] },
        contents,
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const content =
    data.candidates?.[0]?.content?.parts?.[0]?.text ??
    "Sorry, I couldn't generate a response.";

  return Response.json({ content });
}
