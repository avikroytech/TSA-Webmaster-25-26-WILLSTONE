-- ============================================================
-- Willstone RAG: Vector Database Setup
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create the documents table for storing embedded chunks
CREATE TABLE IF NOT EXISTS documents (
  id BIGSERIAL PRIMARY KEY,
  source_table TEXT NOT NULL,
  source_id TEXT,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  embedding VECTOR(768) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create an index for fast similarity search
CREATE INDEX IF NOT EXISTS documents_embedding_idx
  ON documents
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- 4. Create an index on source_table for fast deletion during re-ingestion
CREATE INDEX IF NOT EXISTS documents_source_table_idx
  ON documents (source_table);

-- 5. RPC function for similarity search
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(768),
  match_threshold FLOAT DEFAULT 0.3,
  match_count INT DEFAULT 8
)
RETURNS TABLE (
  id BIGINT,
  source_table TEXT,
  source_id TEXT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.source_table,
    d.source_id,
    d.content,
    d.metadata,
    (1 - (d.embedding <=> query_embedding))::FLOAT AS similarity
  FROM documents d
  WHERE (1 - (d.embedding <=> query_embedding)) > match_threshold
  ORDER BY d.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
