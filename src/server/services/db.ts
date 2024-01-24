import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;

const sql = neon(DATABASE_URL!);

type Item = {
  id: string;
  text: string;
};

const getEmbeddingByText = async (text: string) => {
  try {
    const result = await sql`
      SELECT embedding
      FROM embeddings
      WHERE text = ${text}
    `;
    if (!result.length) return null;

    return {
      id: result[0].id,
      text: result[0].text,
      embedding: result[0].embedding,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getEmbeddingById = async (id: string) => {
  try {
    const result = await sql`
      SELECT id, text, embedding
      FROM embeddings
      WHERE id = ${id}
    `;

    if (!result.length) return null;

    return {
      id: result[0].id,
      text: result[0].text,
      embedding: result[0].embedding,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const upsertEmbedding = async (text: string, embedding: string) => {
  try {
    const result = await sql`
      INSERT INTO embeddings (text, embedding)
      VALUES (${text}, ${embedding})
      ON CONFLICT (text) DO NOTHING;
    `;
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const incrementClickCount = async (id: string) => {
  try {
    const result = await sql`
      UPDATE embeddings
      SET click_count = click_count + 1
      WHERE id = ${id}
      RETURNING id, text, embedding;
    `;

    if (!result.length) return null;

    return {
      id: result[0].id,
      text: result[0].text,
      embedding: result[0].embedding,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getNearestNeighbours = async (
  text: string,
  embedding: string,
  numberOfNeighbours: number,
) => {
  try {
    const result = await sql`
      SELECT id, text 
      FROM embeddings
      WHERE text <> ${text}
      ORDER BY embedding::VECTOR <=> ${embedding}
      LIMIT ${numberOfNeighbours};
    `;
    return result as Item[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const db = {
  getEmbeddingByText,
  getEmbeddingById,
  upsertEmbedding,
  incrementClickCount,
  getNearestNeighbours,
};

export default db;
