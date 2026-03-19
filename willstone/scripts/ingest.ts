/**
 * Willstone RAG Ingestion Script
 *
 * Fetches data from Supabase tables + sitemap content,
 * generates embeddings via Google text-embedding-004,
 * and stores them in the documents table (pgvector).
 *
 * Usage: npx tsx scripts/ingest.ts
 *
 * Prerequisites:
 *   1. Run scripts/setup-vector-db.sql in Supabase SQL Editor
 *   2. Set GOOGLE_GEMINI_API_KEY in .env.local
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";
import { siteMapContent } from "./sitemap-content";

// ─── Config ──────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const GEMINI_KEY = process.env.GOOGLE_GEMINI_API_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_KEY) {
  console.error(
    "❌ Missing environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and GOOGLE_GEMINI_API_KEY are set."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

const EMBEDDING_MODEL = "gemini-embedding-2-preview";
const BATCH_SIZE = 20; // Supabase insert batch size
const EMBED_BATCH_SIZE = 1; // Embeddings per API call (1 at a time for free tier)
const EMBED_DELAY_MS = 4000; // Delay between embedding API calls

// ─── Embedding Helper ────────────────────────────────────────────────
async function embedTexts(texts: string[]): Promise<number[][]> {
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += EMBED_BATCH_SIZE) {
    const batch = texts.slice(i, i + EMBED_BATCH_SIZE);
    let retries = 0;
    const maxRetries = 3;

    while (retries <= maxRetries) {
      try {
        const response = await ai.models.embedContent({
          model: EMBEDDING_MODEL,
          contents: batch,
          config: { outputDimensionality: 768 },
        });

        if (response.embeddings) {
          for (const emb of response.embeddings) {
            allEmbeddings.push(emb.values!);
          }
        }
        break; // Success, exit retry loop
      } catch (err: any) {
        if (err.status === 429 && retries < maxRetries) {
          retries++;
          const waitTime = 10000 * Math.pow(2, retries);
          console.log(`  ⏳ Rate limited, retrying in ${waitTime / 1000}s (attempt ${retries}/${maxRetries})...`);
          await new Promise((r) => setTimeout(r, waitTime));
        } else {
          throw err;
        }
      }
    }

    // Delay between batches
    if (i + EMBED_BATCH_SIZE < texts.length) {
      await new Promise((r) => setTimeout(r, EMBED_DELAY_MS));
    }
  }

  return allEmbeddings;
}

// ─── Chunk Types ─────────────────────────────────────────────────────
interface Chunk {
  source_table: string;
  source_id: string;
  content: string;
  metadata: Record<string, unknown>;
}

// ─── Chunking Functions ──────────────────────────────────────────────

function chunkCommunityResources(rows: any[]): Chunk[] {
  return rows.map((r) => ({
    source_table: "community_resources",
    source_id: String(r.id),
    content: [
      `Resource: ${r.title}`,
      r.category ? `Category: ${r.category}` : null,
      r.type ? `Type: ${r.type}` : null,
      r.address ? `Address: ${r.address}` : null,
      r.island ? `Island: ${r.island}` : null,
      r.phone ? `Phone: ${r.phone}` : null,
      r.description ? `Description: ${r.description}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
    metadata: {
      title: r.title,
      slug: r.slug,
      category: r.category,
      type: r.type,
      link: `/resource-hub/${r.slug}`,
    },
  }));
}

function chunkEvents(rows: any[]): Chunk[] {
  return rows.map((r) => ({
    source_table: "events",
    source_id: String(r.id),
    content: [
      `Event: ${r.title}`,
      r.date ? `Date: ${r.date}` : null,
      r.time ? `Time: ${r.time}` : null,
      r.address ? `Location: ${r.address}` : null,
      r.type ? `Event Type: ${r.type}` : null,
      r.virtual ? `This is a virtual event.` : null,
      r.description ? `Description: ${r.description}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
    metadata: {
      title: r.title,
      date: r.date,
      type: r.type,
      link: "/calendar",
    },
  }));
}

function chunkGovernment(rows: any[]): Chunk[] {
  return rows.map((r) => ({
    source_table: "government",
    source_id: String(r.id),
    content: [
      `Government Official: ${r.name}`,
      r.role ? `Role: ${r.role}` : null,
      r.email ? `Email: ${r.email}` : null,
      r.mission ? `Mission: "${r.mission}"` : null,
    ]
      .filter(Boolean)
      .join("\n"),
    metadata: {
      title: r.name,
      role: r.role,
      link: "/government",
    },
  }));
}

function chunkNews(rows: any[]): Chunk[] {
  const chunks: Chunk[] = [];

  for (const r of rows) {
    // Summary chunk
    chunks.push({
      source_table: "news",
      source_id: String(r.id),
      content: [
        `News Article: ${r.title}`,
        r.date ? `Published: ${r.date}` : null,
        r.description ? `Summary: ${r.description}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
      metadata: {
        title: r.title,
        date: r.date,
        slug: r.slug,
        link: `/news/${r.slug}`,
        chunk_type: "summary",
      },
    });

    // Content chunks (split long content into ~500 word segments)
    if (r.content && r.content.length > 600) {
      const words = r.content.split(/\s+/);
      const chunkSize = 400;
      const overlap = 50;

      for (let i = 0; i < words.length; i += chunkSize - overlap) {
        const segment = words.slice(i, i + chunkSize).join(" ");
        if (segment.trim().length < 50) continue;

        chunks.push({
          source_table: "news",
          source_id: `${r.id}-chunk-${Math.floor(i / (chunkSize - overlap))}`,
          content: `News Article: ${r.title}\nContent: ${segment}`,
          metadata: {
            title: r.title,
            slug: r.slug,
            link: `/news/${r.slug}`,
            chunk_type: "content",
          },
        });
      }
    } else if (r.content) {
      // Short content — include it all in one chunk
      chunks.push({
        source_table: "news",
        source_id: `${r.id}-content`,
        content: `News Article: ${r.title}\nFull Content: ${r.content}`,
        metadata: {
          title: r.title,
          slug: r.slug,
          link: `/news/${r.slug}`,
          chunk_type: "content",
        },
      });
    }
  }

  return chunks;
}

function chunkGuides(rows: any[]): Chunk[] {
  const chunks: Chunk[] = [];

  for (const r of rows) {
    // Summary chunk
    chunks.push({
      source_table: "guides",
      source_id: String(r.id || r.slug),
      content: [
        `Guide: ${r.title}`,
        r.category ? `Category: ${r.category}` : null,
        r.description ? `Description: ${r.description}` : null,
        r.steps && Array.isArray(r.steps)
          ? `This guide has ${r.steps.length} steps: ${r.steps.map((s: any) => s.title).join(", ")}`
          : null,
      ]
        .filter(Boolean)
        .join("\n"),
      metadata: {
        title: r.title,
        slug: r.slug,
        category: r.category,
        link: `/guides/${r.slug}`,
        chunk_type: "summary",
      },
    });

    // Individual step chunks
    if (r.steps && Array.isArray(r.steps)) {
      for (let i = 0; i < r.steps.length; i++) {
        const step = r.steps[i];
        chunks.push({
          source_table: "guides",
          source_id: `${r.id || r.slug}-step-${i}`,
          content: `Guide: ${r.title}\nStep ${i + 1}: ${step.title}\n${step.content}`,
          metadata: {
            title: r.title,
            slug: r.slug,
            link: `/guides/${r.slug}`,
            chunk_type: "step",
            step_number: i + 1,
          },
        });
      }
    }
  }

  return chunks;
}

function chunkSiteMap(): Chunk[] {
  return siteMapContent.map((page) => ({
    source_table: "sitemap",
    source_id: page.path,
    content: [
      `Page: ${page.title} (${page.path})`,
      page.description,
      page.features.length > 0
        ? `Features: ${page.features.join(", ")}`
        : null,
      page.relatedData.length > 0
        ? `Data sources: ${page.relatedData.join(", ")}`
        : null,
    ]
      .filter(Boolean)
      .join("\n"),
    metadata: {
      title: page.title,
      link: page.path,
      chunk_type: "sitemap",
    },
  }));
}

// ─── Ingest Function ─────────────────────────────────────────────────

async function ingestChunks(chunks: Chunk[]): Promise<void> {
  if (chunks.length === 0) return;

  const sourceTable = chunks[0].source_table;
  console.log(`  📝 Generated ${chunks.length} chunks from "${sourceTable}"`);

  // Generate embeddings
  const texts = chunks.map((c) => c.content);
  console.log(`  🧠 Generating embeddings...`);
  const embeddings = await embedTexts(texts);

  // Clear old data for this source
  console.log(`  🗑️  Clearing old "${sourceTable}" entries...`);
  const { error: deleteError } = await supabase
    .from("documents")
    .delete()
    .eq("source_table", sourceTable);

  if (deleteError) {
    console.error(`  ❌ Error clearing old data:`, deleteError.message);
    return;
  }

  // Insert in batches
  console.log(`  💾 Inserting ${chunks.length} documents...`);
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE).map((chunk, idx) => ({
      source_table: chunk.source_table,
      source_id: chunk.source_id,
      content: chunk.content,
      metadata: chunk.metadata,
      embedding: `[${embeddings[i + idx].join(",")}]`,
    }));

    const { error: insertError } = await supabase
      .from("documents")
      .insert(batch);

    if (insertError) {
      console.error(
        `  ❌ Error inserting batch ${Math.floor(i / BATCH_SIZE) + 1}:`,
        insertError.message
      );
    }
  }

  console.log(`  ✅ Done with "${sourceTable}"\n`);
}

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Willstone RAG Ingestion Starting...\n");
  const startTime = Date.now();

  // 1. Community Resources
  console.log("📦 Fetching community_resources...");
  const { data: resources, error: resErr } = await supabase
    .from("community_resources")
    .select("*");
  if (resErr) console.error("  ❌", resErr.message);
  else await ingestChunks(chunkCommunityResources(resources || []));

  // 2. Events
  console.log("📦 Fetching events...");
  const { data: events, error: evtErr } = await supabase
    .from("events")
    .select("*");
  if (evtErr) console.error("  ❌", evtErr.message);
  else await ingestChunks(chunkEvents(events || []));

  // 3. Government
  console.log("📦 Fetching government...");
  const { data: government, error: govErr } = await supabase
    .from("government")
    .select("*");
  if (govErr) console.error("  ❌", govErr.message);
  else await ingestChunks(chunkGovernment(government || []));

  // 4. News
  console.log("📦 Fetching news...");
  const { data: news, error: newsErr } = await supabase
    .from("news")
    .select("*");
  if (newsErr) console.error("  ❌", newsErr.message);
  else await ingestChunks(chunkNews(news || []));

  // 5. Guides
  console.log("📦 Fetching guides...");
  const { data: guides, error: guideErr } = await supabase
    .from("guides")
    .select("*");
  if (guideErr) console.error("  ❌", guideErr.message);
  else await ingestChunks(chunkGuides(guides || []));

  // 6. Site Map
  console.log("🗺️  Processing sitemap...");
  await ingestChunks(chunkSiteMap());

  // Summary
  const { count } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log("═══════════════════════════════════════");
  console.log(`✨ Ingestion complete in ${elapsed}s`);
  console.log(`📊 Total documents in vector store: ${count}`);
  console.log("═══════════════════════════════════════");
}

main().catch((err) => {
  console.error("💥 Fatal error:", err);
  process.exit(1);
});
