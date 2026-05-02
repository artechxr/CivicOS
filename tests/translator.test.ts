import { translateStructuredResponse } from '../src/utils/translator';

describe('Translator', () => {
it('should preserve structure', async () => {
const input = {
explanation: 'Hello',
steps: ['Step 1'],
tips: ['Tip']
};

const result = await translateStructuredResponse(input, 'en');

expect(result).toHaveProperty('explanation');
expect(Array.isArray(result.steps)).toBe(true);

});

it('should handle invalid input safely', async () => {
const result = await translateStructuredResponse({} as any, 'en');
expect(result).toBeDefined();
});
});
