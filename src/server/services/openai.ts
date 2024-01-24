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

const generateIdea = async () => {
  try {
    const prompt =
      "Generate an interesting and novel idea for a new startup. Keep the description to one or two sentences and do not make up company names, just describe what the company does.\n\nIdea:";

    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      temperature: 0.9,
      max_tokens: 75,
    });
    const text = response.choices[0].text.trim();
    return text;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const openaiService = {
  getTextEmbedding,
  generateIdea,
};

export default openaiService;
