import { knowledgeBase, KnowledgeResponse } from '../data/knowledgeBase';
import { translateText } from './translator';

interface IntentMap {
  intent: string;
  keywords: string[];
}

const intentMappings: IntentMap[] = [
  {
    intent: 'voting_process',
    keywords: ['vote', 'how to vote', 'process', 'steps', 'booth', 'evm', 'vvpat', 'machine', 'inside']
  },
  {
    intent: 'registration',
    keywords: ['register', 'apply', 'form 6', 'enroll', 'new voter', 'voter portal', 'blo', 'verification']
  },
  {
    intent: 'documents',
    keywords: ['document', 'id', 'proof', 'aadhaar', 'pan', 'passport', 'voter id', 'epic', 'identity', 'carry']
  },
  {
    intent: 'timeline',
    keywords: ['date', 'when', 'timeline', 'schedule', 'phase', 'calendar', 'announcement', 'counting']
  },
  {
    intent: 'types_of_elections',
    keywords: ['type', 'lok sabha', 'vidhan sabha', 'state ones', 'assembly', 'parliament', 'difference', 'panchayat']
  },
  {
    intent: 'political_parties',
    keywords: ['party', 'parties', 'bjp', 'inc', 'congress', 'ideology', 'manifesto', 'national party']
  },
  {
    intent: 'candidate_choice',
    keywords: ['choose', 'candidate', 'representative', 'whom to vote', 'compare', 'difference', 'mla', 'mp']
  },
  {
    intent: 'fake_news',
    keywords: ['fake news', 'misinformation', 'whatsapp', 'rumor', 'myth', 'verify', 'fact check', 'deepfake']
  },
  {
    intent: 'election_day',
    keywords: ['election day', 'holiday', 'time', 'opening', 'queue', 'closing', 'when to go']
  },
  {
    intent: 'common_mistakes',
    keywords: ['mistake', 'error', 'wrong', 'avoid', 'problem', 'invalid', 'rejected']
  }
];

/**
 * Detects the intent of a user's input string.
 * Uses exact keyword matching and contextual fallbacks.
 *
 * @param input The raw user input string.
 * @param userLang The user's current language code (e.g., 'en', 'hi'). Defaults to 'en'.
 * @param previousContext The intent key of the previous interaction, if any.
 * @returns A Promise resolving to a KnowledgeResponse object, or null if no intent is found.
 */
export async function detectIntent(input: string, userLang: string = 'en', previousContext?: string): Promise<KnowledgeResponse | null> {
  let normalizedInput = input.toLowerCase().trim();
  
  if (!normalizedInput) return null;

  if (userLang !== 'en') {
    normalizedInput = await translateText(normalizedInput, 'en', userLang);
    normalizedInput = normalizedInput.toLowerCase();
  }

  // 1. Check for explicit exact or fuzzy matches
  let bestIntent: string | null = null;
  let maxMatches = 0;

  for (const mapping of intentMappings) {
    let matches = 0;
    for (const keyword of mapping.keywords) {
      if (normalizedInput.includes(keyword)) {
        matches++;
      }
    }
    
    if (matches > maxMatches) {
      maxMatches = matches;
      bestIntent = mapping.intent;
    }
  }

  // 2. Context-Aware Fallback
  // If no clear match, but the user is asking a follow-up (e.g. "what about state ones?")
  if (!bestIntent && previousContext) {
    if (normalizedInput.includes('state') && previousContext === 'types_of_elections') {
       return knowledgeBase['types_of_elections']; 
    }
    if (normalizedInput.includes('how') && previousContext === 'registration') {
       return knowledgeBase['registration'];
    }
    // Simple heuristic: if it looks like a follow up but we didn't catch keywords, stick to context
    if (normalizedInput.length < 25 && !normalizedInput.includes('?')) {
       // Just keeping context might be confusing, so let it fall through to null for the smart fallback
    }
  }

  return bestIntent ? knowledgeBase[bestIntent] : null;
}

/**
 * Returns a fallback general guide when an intent cannot be detected.
 *
 * @returns A generic KnowledgeResponse object.
 */
export function getGeneralGuide(): KnowledgeResponse {
  return {
    intent: 'fallback',
    category: 'general',
    explanation: 'Sorry, I am experiencing high traffic right now and couldn\'t perfectly understand that. Here is a general guide to help you navigate the Indian Elections:',
    steps: [
      'Voting Process: "How to cast your vote?"',
      'Registration: "How do I become a new voter?"',
      'Documents: "What IDs are accepted at the booth?"',
      'Candidates: "How to compare candidates?"',
      'Parties: "Information about political parties."'
    ],
    tips: [
      'You can type your query in your preferred language (English, Hindi, Tamil, etc.).'
    ]
  };
}
