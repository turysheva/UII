
import { GoogleGenAI } from "@google/genai";
import type { TrendAnalysis, Source } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("Переменная окружения API_KEY не установлена.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const parseResponseText = (text: string): { insight: string; post: string } => {
  const insightMatch = text.match(/\[INSIGHT_START\]([\s\S]*?)\[INSIGHT_END\]/);
  const postMatch = text.match(/\[POST_START\]([\s\S]*?)\[POST_END\]/);

  const insight = insightMatch ? insightMatch[1].trim() : 'Не удалось извлечь инсайт.';
  const post = postMatch ? postMatch[1].trim() : 'Не удалось извлечь пост.';

  if (!insightMatch || !postMatch) {
    console.error("Failed to parse the Gemini response. Raw text:", text);
    throw new Error("ИИ вернул ответ в неожиданном формате. Попробуйте другую тему или перефразируйте запрос.");
  }
  
  return { insight, post };
};

export const fetchTrendAnalysis = async (topic: string): Promise<TrendAnalysis> => {
  const systemInstruction = `You are a provocative tech analyst like Ben Thompson or Casey Newton. Your job is to find the hidden story behind the news, challenge conventional wisdom, and provide insights that make CEOs think. Use short, punchy sentences in Russian. Avoid corporate jargon. Your analysis must be based on the provided Google Search results from the last month.`;
  
  const prompt = `Based on the latest news about "${topic}", generate a contrarian analysis. Find a contradiction, tension, or a non-obvious connection.

  Your output must contain two sections:
  1.  A main, provocative conclusion (the insight).
  2.  A complete, ready-to-share social media post with a hook, your insight explained simply, a brief reference to the news, a question to provoke discussion, and relevant hashtags.

  Format your response EXACTLY as follows, with no extra text or explanations before or after the specified tags:

  [INSIGHT_START]
  Your contrarian insight here. Start with a bold question or statement.
  [INSIGHT_END]

  [POST_START]
  Your full social media post text here.
  [POST_END]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: systemInstruction,
      },
    });
    
    const rawText = response.text;
    const { insight, post } = parseResponseText(rawText);

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources: Source[] = groundingChunks
      .map(chunk => ({
        title: chunk.web?.title ?? 'Источник без названия',
        uri: chunk.web?.uri ?? '#',
      }))
      .filter(source => source.uri !== '#')
       // Deduplicate sources based on URI
      .filter((source, index, self) => 
        index === self.findIndex((s) => s.uri === source.uri)
      )
      .slice(0, 3); // Limit to 3 sources

    if (sources.length === 0) {
        console.warn("Источники не найдены в метаданных.");
    }

    return { insight, post, sources };

  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    if (error instanceof Error && error.message.includes('SAFETY')) {
        throw new Error("Ответ был заблокирован из-за настроек безопасности. Пожалуйста, попробуйте другую тему.");
    }
    throw new Error("Не удалось получить анализ трендов от ИИ-модели.");
  }
};
