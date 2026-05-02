import type { KnowledgeResponse } from '@/types/knowledge';

const translationCache = new Map<string, string>();

/**
 * Translates text using the free, unauthenticated Google Translate API.
 * Includes basic caching to minimize redundant network requests.
 *
 * @param text The text to translate.
 * @param targetLang The language code to translate to (e.g., 'hi', 'ta').
 * @param sourceLang The source language code (defaults to 'auto').
 * @returns The translated text. If translation fails, returns the original text.
 */
export async function translateText(text: string, targetLang: string, sourceLang: string = 'auto'): Promise<string> {
  if (!text || text.trim() === '') return text;
  if (targetLang === 'en' && sourceLang === 'en') return text;
  if (targetLang === sourceLang) return text;

  // Generate cache key
  const cacheKey = `${sourceLang}-${targetLang}-${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const encodedText = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodedText}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // The API returns an array of arrays. The translated string pieces are in the first element.
    let translated = '';
    if (data && data[0]) {
      for (let i = 0; i < data[0].length; i++) {
        if (data[0][i][0]) {
          translated += data[0][i][0];
        }
      }
    }

    if (translated) {
      // Store in cache
      translationCache.set(cacheKey, translated);
      return translated;
    }

    return text; // Fallback to original text if parsing fails
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Ultimate fallback to avoid breaking UI
  }
}

/**
 * Detects user intent from input string.
 * @param input user query
 * @returns detected intent or null
 */
export async function translateStructuredResponse(data: KnowledgeResponse, targetLang: string): Promise<KnowledgeResponse> {
  if (targetLang === 'en') return data; // No translation needed

  try {
    const translatedExplanation = await translateText(data.explanation, targetLang);

    const translatedSteps = await Promise.all(
      (data.steps || []).map((step: string) => translateText(step, targetLang))
    );

    const translatedTips = await Promise.all(
      (data.tips || []).map((tip: string) => translateText(tip, targetLang))
    );

    let translatedTable = undefined;
    if (data.table) {
      // If there's a table, translate headers and rows
      translatedTable = {
        headers: await Promise.all(data.table.headers.map((h: string) => translateText(h, targetLang))),
        rows: await Promise.all(data.table.rows.map(async (row: string[]) => {
          return await Promise.all(row.map(cell => translateText(cell, targetLang)));
        }))
      };
    }

    return {
      ...data,
      explanation: translatedExplanation,
      steps: translatedSteps,
      tips: translatedTips,
      table: translatedTable
    };
  } catch (error) {
    console.error('Structured translation error:', error);
    return data; // Return original English data if structured translation fails completely
  }
}
