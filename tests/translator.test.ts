import { translateStructuredResponse } from '../src/utils/translator';
import { KnowledgeResponse } from '../src/data/knowledgeBase';

test('should return same text for english', async () => {
  const data = { explanation: 'Hello' } as KnowledgeResponse;
  const result = await translateStructuredResponse(data, 'en');
  expect(result.explanation).toBe('Hello');
});
