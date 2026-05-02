export interface KnowledgeResponse {
    intent: string;
    explanation: string;
    steps: string[];
    tips?: string[];
    category?: string;

    table?: {
        headers: string[];
        rows: string[][];
    };

    relatedIntents?: string[];
}
