import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";

// ─── Config ──────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY! });

const EMBEDDING_MODEL = "gemini-embedding-2-preview";
const CHAT_MODEL = "gemini-2.5-flash";

const SYSTEM_PROMPT = `You are Willstone's friendly AI assistant. Willstone is a fictional island community with four islands: Emerald, Coastal, Central, and Talon.

Your job is to help users find community resources, events, government information, news, and guides using ONLY the context provided below.

Rules:
- Answer based ONLY on the provided context. Do not make up information.
- Be helpful, concise, and conversational.
- When referencing a resource, event, guide, or news article, mention it by name.
- If you cannot find the answer in the context, follow this template: "I cannot find information about [user query] relating to Willstone." and suggest what the user could try (e.g., browsing the Resource Hub or Calendar).
- Keep responses under 300 words unless the user asks for detail.

Formatting rules:
- Use **bold** for emphasis or names of resources/places.
- Use bullet points (- item) for lists.
- Use numbered lists (1. item) for step-by-step instructions.
- Use ### for section headers when organizing longer responses.
- Do NOT use markdown links like [text](url). Instead, mention the page name naturally (e.g., "visit the Resource Hub" or "check the Calendar page").
- Do NOT use code blocks, images, or tables.`;

// ─── Embed Helper ────────────────────────────────────────────────────
async function embedQuery(text: string): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: text,
    config: { outputDimensionality: 768 },
  });

  return response.embeddings![0].values!;
}

// ─── Search Helper ───────────────────────────────────────────────────
async function searchDocuments(
  queryEmbedding: number[],
  matchCount = 8,
  threshold = 0.3
) {
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: `[${queryEmbedding.join(",")}]`,
    match_threshold: threshold,
    match_count: matchCount,
  });

  if (error) {
    console.error("Search error:", error.message);
    return [];
  }

  return data || [];
}

// ─── Route Handler ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userMessage = body.message;

    if (!userMessage || typeof userMessage !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'message' field" },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GOOGLE_GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // 1. Embed the user query
    const queryEmbedding = await embedQuery(userMessage);

    // 2. Retrieve relevant documents
    const documents = await searchDocuments(queryEmbedding);

    // 3. Build context from retrieved documents
    const contextBlocks = documents.map(
      (doc: any, i: number) =>
        `[Source ${i + 1} | ${doc.source_table} | similarity: ${doc.similarity.toFixed(3)}]\n${doc.content}`
    );

    const context =
      contextBlocks.length > 0
        ? contextBlocks.join("\n\n---\n\n")
        : "No relevant documents found in the knowledge base.";

    // 4. Call Gemini LLM
    const response = await ai.models.generateContent({
      model: CHAT_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\n--- CONTEXT ---\n${context}\n--- END CONTEXT ---\n\nUser question: ${userMessage}`,
            },
          ],
        },
      ],
    });

    const assistantMessage =
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I couldn't generate a response. Please try again.";

    // 5. Build source citations
    const sources = documents.map((doc: any) => ({
      source_table: doc.source_table,
      title: doc.metadata?.title || "Unknown",
      link: doc.metadata?.link || null,
      similarity: doc.similarity,
    }));

    return NextResponse.json({
      response: assistantMessage,
      sources,
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
