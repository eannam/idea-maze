import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const getTextEmbedding = async (text: string) => {
  try {
    const response = await openai.embeddings.create({
      input: text,
      model: "text-embedding-ada-002",
    });
    const embedding = response.data[0].embedding;
    return JSON.stringify(embedding);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const openaiService = {
  getTextEmbedding,
};

export default openaiService;
