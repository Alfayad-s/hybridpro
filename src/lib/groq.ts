const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
/** llama-3.3-70b-versatile was shut down Aug 16, 2026 — use Groq's recommended replacement. */
const DEFAULT_MODEL =
  process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-120b";

/** Status codes that should trigger trying the next API key. */
const FAILOVER_STATUSES = new Set([401, 403, 429, 500, 502, 503, 504]);

export function getGroqApiKeys(): string[] {
  const raw =
    process.env.GROQ_API_KEYS?.trim() ||
    process.env.GROQ_API_KEY?.trim() ||
    "";
  return raw
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

export type GroqChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type GroqChatOptions = {
  messages: GroqChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
};

export type GroqChatSuccess = {
  content: string;
  model: string;
  keyIndex: number;
};

/**
 * Call Groq chat completions, rotating through GROQ_API_KEYS when a key
 * is rate-limited, unauthorized, or the upstream is temporarily down.
 */
export async function groqChatCompletion(
  options: GroqChatOptions,
): Promise<GroqChatSuccess> {
  const keys = getGroqApiKeys();
  if (keys.length === 0) {
    throw new Error(
      "No Groq API keys configured. Set GROQ_API_KEYS in .env.local",
    );
  }

  const body = {
    model: options.model ?? DEFAULT_MODEL,
    messages: options.messages,
    temperature: options.temperature ?? 0.55,
    max_tokens: options.maxTokens ?? 2200,
    ...(options.jsonMode
      ? { response_format: { type: "json_object" as const } }
      : {}),
  };

  let lastError: Error | null = null;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        const message = `Groq key ${i + 1}/${keys.length} failed (${res.status}): ${errText.slice(0, 200)}`;

        // Model ID mistakes won't be fixed by rotating keys — fail fast.
        if (
          res.status === 404 &&
          /model_not_found|does not exist/i.test(errText)
        ) {
          throw new Error(message);
        }

        if (FAILOVER_STATUSES.has(res.status) && i < keys.length - 1) {
          console.warn(`[groq] ${message} — switching key`);
          lastError = new Error(message);
          continue;
        }

        throw new Error(message);
      }

      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
        model?: string;
      };

      const content = data.choices?.[0]?.message?.content?.trim();
      if (!content) {
        lastError = new Error(`Groq key ${i + 1} returned empty content`);
        if (i < keys.length - 1) continue;
        throw lastError;
      }

      return {
        content,
        model: data.model ?? body.model,
        keyIndex: i,
      };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      // Network / parse errors: try next key
      if (i < keys.length - 1) {
        console.warn(
          `[groq] key ${i + 1} error — switching key:`,
          lastError.message,
        );
        continue;
      }
    }
  }

  throw lastError ?? new Error("All Groq API keys failed");
}
