import { detectIntent, getGeneralGuide } from '../src/utils/intentEngine';

describe('intentEngine', () => {
  it('should detect voting_process intent for "how to vote"', async () => {
    const result = await detectIntent('how to vote');
    expect(result?.intent).toBe('voting_process');
  });

  it('should detect documents intent for "documents required"', async () => {
    const result = await detectIntent('documents required');
    expect(result?.intent).toBe('documents');
  });

  it('should return null for unmatched intent, which then uses fallback', async () => {
    const result = await detectIntent('gibberish random text');
    expect(result).toBeNull();
    const fallback = getGeneralGuide();
    expect(fallback.intent).toBe('fallback');
  });
});
