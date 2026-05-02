describe('basic sanity', () => {
    it('should pass basic math', () => {
        expect(2 + 2).toBe(4);
    });

    it('should handle strings', () => {
        expect('vote'.toUpperCase()).toBe('VOTE');
    });
});