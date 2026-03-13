/** Number of posts per page in blog listing */
export const POSTS_PER_PAGE = 10;

/**
 * Returns Tailwind classes for category pill styling.
 * Uses CSS custom properties defined in global.css that auto-switch in dark mode.
 */
export function categoryClass(category: string): string {
  if (category === '日誌') {
    return 'bg-cat-journal-bg text-cat-journal-text';
  }
  // Default: 技術 and any other category
  return 'bg-cat-tech-bg text-cat-tech-text';
}
