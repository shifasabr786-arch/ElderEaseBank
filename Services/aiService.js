// services/aiService.js
const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY"; // <-- REPLACE for local dev only

async function openAIRequest(path, options = {}) {
  const res = await fetch(`https://api.openai.com/v1${path}`, {
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      ...(options.headers || {}),
    },
    method: options.method || "POST",
    body: options.body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${text}`);
  }
  return res.json();
}

/**
 * Transcribe audio file (local uri) using OpenAI Whisper
 * Expects uri to be a file path accessible by fetch (expo-file-system path should work)
 */
export async function transcribeAudio(fileUri) {
  // create multipart/form-data
  const uriParts = fileUri.split("/");
  const filename = uriParts[uriParts.length - 1];
  const type = "audio/m4a"; // adjust if needed

  const formData = new FormData();
  // @ts-ignore - React Native FormData file object
  formData.append("file", {
    uri: fileUri,
    name: filename,
    type,
  });
  formData.append("model", "whisper-1");

  const result = await openAIRequest("/audio/transcriptions", {
    body: formData,
    headers: {
      // Let fetch set content-type with boundary
      "Accept": "application/json",
    },
  });

  // result.text contains the transcription
  return result.text;
}

/**
 * Send user message(s) to chat completion and get assistant reply.
 * messages should be [{role: "user"|"system"|"assistant", content: "..."}, ...]
 */
export async function getChatResponse(messages) {
  const body = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.2,
    max_tokens: 400,
  });

  const result = await openAIRequest("/chat/completions", {
    body,
    headers: { "Content-Type": "application/json" },
  });

  const reply = result.choices?.[0]?.message?.content;
  return reply || "I'm sorry — I couldn't get a reply right now.";
}
