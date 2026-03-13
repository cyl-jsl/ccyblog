/** Category display name → URL slug mapping */
const categorySlugMap: Record<string, string> = {
  '技術': 'tech',
  '日誌': 'journal',
};

const slugToCategoryMap: Record<string, string> = Object.fromEntries(
  Object.entries(categorySlugMap).map(([name, slug]) => [slug, name])
);

export function categoryToSlug(category: string): string {
  return categorySlugMap[category] ?? category;
}

export function slugToCategory(slug: string): string {
  return slugToCategoryMap[slug] ?? slug;
}
