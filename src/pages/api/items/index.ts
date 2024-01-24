// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import db from "@/server/services/db";
import openaiService from "@/server/services/openai";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const NUMBER_OF_NEIGHBOURS = 5;

const schema = z.object({
  text: z
    .string()
    .min(10, { message: "Input must be at least 10 characters." })
    .max(300, { message: "Input can be no more than 300 characters." }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  try {
    if (method === "GET") {
      const id = req.query.id as string;

      if (!id) {
        return res.status(400).json({ message: "Missing id" });
      }

      const record = await db.getEmbeddingById(id);

      if (!record) {
        return res.status(404).json({ message: "Embedding not found" });
      }

      const items = await db.getNearestNeighbours(
        record.text,
        record.embedding,
        NUMBER_OF_NEIGHBOURS,
      );

      return res.status(200).json({ items });
    } else if (method === "POST") {
      const validated = schema.safeParse(req.body);

      if (!validated.success) {
        const [parsedError] = JSON.parse(validated.error.message);
        return res.status(400).json({ message: parsedError.message });
      }

      const { text } = validated.data;

      let embedding: string;

      const record = await db.getEmbeddingByText(text);

      if (!record) {
        embedding = await openaiService.getTextEmbedding(text);
        await db.upsertEmbedding(text, embedding);
      } else {
        embedding = record.embedding;
      }

      const items = await db.getNearestNeighbours(
        text,
        embedding,
        NUMBER_OF_NEIGHBOURS,
      );

      res.status(200).json({ items });
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
}
