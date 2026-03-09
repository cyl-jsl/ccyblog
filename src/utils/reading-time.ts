export function getReadingTime(content: string): string {
  const wordsPerMinute = 300; // CJK text reads slightly differently
  const words = content.trim().split(/\s+/).length;
  const cjkChars = (content.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
  const totalWords = words + cjkChars;
  const minutes = Math.ceil(totalWords / wordsPerMinute);
  return `${minutes} min read`;
}
