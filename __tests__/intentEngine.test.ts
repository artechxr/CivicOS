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

  it('should handle empty input safely', async () => {
    const result = await detectIntent('');
    expect(result).toBeNull();
  });

  it('should handle case insensitive input', async () => {
    const result = await detectIntent('HOW TO VOTE');
    expect(result?.intent).toBe('voting_process');
  });

  it('should ignore extra spaces', async () => {
    const result = await detectIntent('   how to vote   ');
    expect(result?.intent).toBe('voting_process');
  });

  it('should not crash on random symbols', async () => {
    const result = await detectIntent('@@@###$$$');
    expect(result).toBeNull();
  });

  it('should always return consistent structure', async () => {
    const result = await detectIntent('how to vote');
    expect(result).toHaveProperty('intent');
  });
});
