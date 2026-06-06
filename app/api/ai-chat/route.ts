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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, apiKey, model = "gpt-4o-mini" } = body;

    if (!apiKey) {
      return Response.json(
        { error: "API key is required. Please configure it in the chat settings." },
        { status: 400 },
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: "Messages array is required." },
        { status: 400 },
      );
    }

    // Determine the API endpoint based on the model
    const isAnthropicModel = model.startsWith("claude-");
    const isGoogleModel = model.startsWith("gemini-");

    let response: Response;

    if (isAnthropicModel) {
      response = await callAnthropic(apiKey, model, messages);
    } else if (isGoogleModel) {
      response = await callGoogle(apiKey, model, messages);
    } else {
      response = await callOpenAI(apiKey, model, messages);
    }

    return response;
  } catch (error) {
    console.error("AI Chat error:", error);
    return Response.json(
      { error: "Failed to get AI response. Please check your API key and try again." },
      { status: 500 },
    );
  }
}

async function callOpenAI(apiKey: string, model: string, messages: { role: string; content: string }[]) {
  const systemMessages = [
    { role: "system", content: DEFAULT_SYSTEM_PROMPT },
    ...messages,
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: systemMessages,
      stream: false,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

  return Response.json({ content });
}

async function callAnthropic(apiKey: string, model: string, messages: { role: string; content: string }[]) {
  // Convert messages to Anthropic format
  const systemPrompt = DEFAULT_SYSTEM_PROMPT;
  const userMessages = messages.filter((m) => m.role === "user" || m.role === "assistant");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      system: systemPrompt,
      messages: userMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const content = data.content?.[0]?.text ?? "Sorry, I couldn't generate a response.";

  return Response.json({ content });
}

async function callGoogle(apiKey: string, model: string, messages: { role: string; content: string }[]) {
  const systemPrompt = DEFAULT_SYSTEM_PROMPT;
  const userMessages = messages.filter((m) => m.role === "user" || m.role === "assistant");

  const contents = userMessages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't generate a response.";

  return Response.json({ content });
}
