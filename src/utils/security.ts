export const sanitizeInput = (text: string) =>
  text.replace(/<[^>]*>?/gm, '').trim();

export const validateInput = (text: string) => {
  if (!text || text.trim().length === 0) return false;
  if (text.length > 500) return false;
  return true;
};
