# CCYBlog 全站設計翻新（文房書齋）Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform ccyblog from generic Tailwind template aesthetic to a warm, editorial "文房書齋" (Scholar's Study) design with magazine-style homepage, list-based blog, refined article reading experience, and full warm-brown dark mode.

**Architecture:** Full visual redesign touching every page and component. CSS custom properties switch light/dark values under `.dark` class, so Tailwind utilities like `bg-page`, `text-heading` work automatically in both modes — no `dark:` prefix needed for design tokens. Work proceeds foundation-up: design tokens → shell (Header/Footer) → pages (Homepage → Blog List → Article → Others).

**Tech Stack:** Astro 5.17 + Tailwind CSS 4.2 (via `@theme` block + CSS custom properties in global.css) + Google Fonts CDN (Inter, JetBrains Mono, Noto Serif TC, Noto Sans TC)

**Spec document:** `docs/superpowers/specs/2026-03-13-ccyblog-redesign-design.md`

---

## File Structure

### Files to Modify (in order of dependency)

| File | Responsibility | Key Changes |
|------|---------------|-------------|
| `src/content.config.ts` | Content schema | Add `featured: z.boolean().default(false)` to blog collection |
| `src/styles/global.css` | Design tokens + prose | CSS custom properties with `.dark` auto-switching, serif font, rewrite prose |
| `src/layouts/BaseLayout.astro` | Page shell | Add Google Fonts links, remove max-w-5xl from main |
| `src/components/Header.astro` | Site navigation | Serif "CCY" logo, warm colors, gold-brown active indicator |
| `src/components/Footer.astro` | Site footer | Simplify to "© 2026 CCY", warm text colors |
| `src/components/ThemeToggle.astro` | Theme switch | Update icon colors to warm brown tokens |
| `src/components/Search.astro` | Search modal | Update modal/input colors to warm palette |
| `src/pages/index.astro` | Homepage | Full rewrite: masthead + featured/recent + divider + featured projects |
| `src/components/PostCard.astro` | Blog list item | Rewrite from card to list-item style |
| `src/components/BlogListPage.astro` | Blog list container | Remove sidebar, add category tabs, list layout, styled pagination |
| `src/pages/blog/index.astro` | Blog page 1 | Pass category counts to BlogListPage |
| `src/pages/blog/page/[page].astro` | Blog page N | Pass category counts to BlogListPage |
| `src/layouts/PostLayout.astro` | Article layout | 960px frame, 640px+180px TOC flex, header padding-left, back link |
| `src/components/TableOfContents.astro` | TOC sidebar | Left border line, 12px font, active heading highlight |
| `src/pages/blog/[...slug].astro` | Article page | Prev/next via props (not slot), inline tag pills |
| `src/components/ProjectCard.astro` | Project card | Warm card style (surface bg, serif title, tech pills) |
| `src/pages/projects.astro` | Projects page | Serif title "作品", warm colors |
| `src/pages/about.astro` | About page | 640px centered, serif title, warm prose |
| `src/pages/blog/tags/[tag].astro` | Tag filter page | List-item style, back link, warm colors |
| `src/pages/blog/categories/[category].astro` | Category filter page | List-item style, back link, warm colors |

### Files to Create

| File | Responsibility |
|------|---------------|
| `src/utils/style-helpers.ts` | Shared `categoryClass()` function + `POSTS_PER_PAGE` constant |

### Files to Delete

| File | Reason |
|------|--------|
| `src/components/TagList.astro` | Tag rendering inlined in PostLayout (pill-style 10px) |

---

## Chunk 1: Design Foundation

### Task 1: Add `featured` field to blog content schema

**Files:**
- Modify: `src/content.config.ts:6-15`

- [ ] **Step 1: Add featured field to blog schema**

In `src/content.config.ts`, add `featured` field after `draft`:

```typescript
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});
```

- [ ] **Step 2: Verify build passes**

Run: `cd /Users/ccy/repos/sideprojects/ccyblog && npx astro check 2>&1 | tail -5`
Expected: No errors related to content schema

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat: add featured field to blog content schema"
```

---

### Task 2: Create shared style helpers

**Files:**
- Create: `src/utils/style-helpers.ts`

- [ ] **Step 1: Create style-helpers.ts with categoryClass and POSTS_PER_PAGE**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/style-helpers.ts
git commit -m "feat: add shared style helpers (categoryClass, POSTS_PER_PAGE)"
```

---

### Task 3: Replace design system in global.css

**Files:**
- Modify: `src/styles/global.css` (full rewrite)

- [ ] **Step 1: Rewrite global.css with CSS custom properties that auto-switch in dark mode**

The key design decision: define all colors as CSS custom properties in `:root` (light) and `.dark` (dark). Then reference them in `@theme` so Tailwind generates utility classes (`bg-page`, `text-heading`, etc.) that automatically resolve to the correct value in both modes.

Replace the entire `src/styles/global.css` with:

```css
@import "tailwindcss";

/* ═══════════════════════════════════════════
   Design Tokens — auto-switch via .dark class
   Raw values use --c-* prefix to avoid circular
   references with @theme's --color-* namespace.
   ═══════════════════════════════════════════ */

@layer base {
  :root {
    --c-page: #faf6f1;
    --c-surface: #f3ece2;
    --c-heading: #3d3028;
    --c-body: #5a4d40;
    --c-secondary: #9a8470;
    --c-muted: #b5a48e;
    --c-divider: #e8dfd3;
    --c-divider-light: #f0e9df;
    --c-accent: #c4a882;
    --c-accent-hover: #a8895c;
    --c-blockquote-bg: #f5efe6;
    --c-code-bg: #2d2a24;
    --c-code-text: #d4c8b8;
    --c-inline-code-bg: #f3ece2;

    /* Category colors */
    --c-cat-tech-bg: #efe8dd;
    --c-cat-tech-text: #9a8470;
    --c-cat-journal-bg: #e8f0e4;
    --c-cat-journal-text: #6b8c5e;
  }

  .dark {
    --c-page: #1c1917;
    --c-surface: #262119;
    --c-heading: #e8dfd3;
    --c-body: #a89b8c;
    --c-secondary: #8a7e72;
    --c-muted: #6b6158;
    --c-divider: #302a24;
    --c-divider-light: #2a241e;
    --c-accent: #d4a86a;
    --c-accent-hover: #e0be88;
    --c-blockquote-bg: #262119;
    --c-code-bg: #131110;
    --c-code-text: #d4c8b8;
    --c-inline-code-bg: #131110;

    /* Category colors */
    --c-cat-tech-bg: #302a24;
    --c-cat-tech-text: #b5a48e;
    --c-cat-journal-bg: #1e2a1a;
    --c-cat-journal-text: #8aab7f;
  }
}

@theme {
  /* Typography */
  --font-sans: "Inter", "Noto Sans TC", ui-sans-serif, system-ui, sans-serif;
  --font-serif: Georgia, "Noto Serif TC", serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  /* Colors — reference --c-* raw values, no circular refs */
  --color-page: var(--c-page);
  --color-surface: var(--c-surface);
  --color-heading: var(--c-heading);
  --color-body: var(--c-body);
  --color-secondary: var(--c-secondary);
  --color-muted: var(--c-muted);
  --color-divider: var(--c-divider);
  --color-divider-light: var(--c-divider-light);
  --color-accent: var(--c-accent);
  --color-accent-hover: var(--c-accent-hover);
  --color-blockquote-bg: var(--c-blockquote-bg);
  --color-code-bg: var(--c-code-bg);
  --color-code-text: var(--c-code-text);
  --color-inline-code-bg: var(--c-inline-code-bg);
  --color-cat-tech-bg: var(--c-cat-tech-bg);
  --color-cat-tech-text: var(--c-cat-tech-text);
  --color-cat-journal-bg: var(--c-cat-journal-bg);
  --color-cat-journal-text: var(--c-cat-journal-text);
}

/* Base styles */
@layer base {
  body {
    @apply bg-page text-body antialiased;
    transition: background-color 0.2s, color 0.2s;
  }

  /* Prose / article typography */
  .prose {
    @apply max-w-none text-body;
    line-height: 1.85;
  }

  .prose h1 {
    @apply font-serif font-normal text-heading mt-10 mb-4;
    font-size: 28px;
  }

  .prose h2 {
    @apply font-serif font-normal text-heading mt-8 mb-3 pb-2 border-b border-divider-light;
    font-size: 20px;
  }

  .prose h3 {
    @apply font-serif font-normal text-heading mt-6 mb-2;
    font-size: 16px;
  }

  .prose p {
    @apply my-4;
  }

  .prose a {
    @apply text-accent underline underline-offset-2 transition-colors;
  }
  .prose a:hover {
    @apply text-accent-hover;
  }

  .prose ul {
    @apply my-4 pl-6 list-disc;
  }

  .prose ol {
    @apply my-4 pl-6 list-decimal;
  }

  .prose li {
    @apply my-1;
    line-height: 2;
  }

  .prose blockquote {
    @apply pl-4 my-4 italic text-body rounded-r-lg;
    border-left: 3px solid var(--c-accent);
    background: var(--c-blockquote-bg);
    padding: 0.75rem 1rem;
  }

  .prose code {
    @apply px-1.5 py-0.5 rounded text-sm font-mono;
    background: var(--c-inline-code-bg);
  }

  .prose pre {
    @apply my-4 overflow-x-auto text-sm;
    border-radius: 8px;
    /* !important overrides Shiki's inline background-color */
    background: var(--c-code-bg) !important;
    color: var(--c-code-text);
  }

  .prose pre code {
    @apply bg-transparent p-0 rounded-none;
    color: inherit;
  }

  .prose img {
    @apply rounded-lg my-6;
  }

  .prose hr {
    @apply my-8 border-divider;
  }

  .prose table {
    @apply w-full my-4 text-sm;
  }

  .prose th {
    @apply px-3 py-2 text-left font-semibold text-heading border-b border-divider;
  }

  .prose td {
    @apply px-3 py-2 border-b border-divider-light;
  }
}
```

- [ ] **Step 2: Verify Tailwind compiles without errors**

Run: `cd /Users/ccy/repos/sideprojects/ccyblog && npx astro build 2>&1 | tail -10`
Expected: Build succeeds (pages may look broken visually — expected since components still reference old color classes)

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: replace design system with 文房書齋 warm color palette (auto dark mode)"
```

---

### Task 4: Add Google Fonts and update BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro:21-65`

- [ ] **Step 1: Add Google Fonts preconnect and links to `<head>`**

In `src/layouts/BaseLayout.astro`, after the `<meta name="viewport">` line (line 23), add:

```html
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&family=Noto+Sans+TC:wght@400;500&family=Noto+Serif+TC:wght@400;700&display=swap" rel="stylesheet" />
```

- [ ] **Step 2: Simplify body tag (colors handled by global.css tokens)**

Replace the `<body>` tag (line 63):

Old:
```html
  <body class="min-h-screen flex flex-col">
```

New (bg-page and text-body are already set by global.css base layer, so body just needs layout):
```html
  <body class="min-h-screen flex flex-col">
```

No change needed — global.css `body { @apply bg-page text-body }` handles it.

- [ ] **Step 3: Remove max-w-5xl from main container**

Each page will manage its own max-width and padding. Replace line 65:

Old:
```html
    <main class="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
```

New:
```html
    <main class="flex-1 w-full">
```

- [ ] **Step 4: Verify dev server starts**

Run: `cd /Users/ccy/repos/sideprojects/ccyblog && npx astro build 2>&1 | tail -10`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add Google Fonts and update BaseLayout for 文房書齋 design"
```

---

## Chunk 2: Site Shell (Header + Footer + ThemeToggle + Search)

### Task 5: Redesign Header

**Files:**
- Modify: `src/components/Header.astro` (full rewrite)

- [ ] **Step 1: Rewrite Header with serif logo, warm tokens, gold-brown active indicator**

Replace the entire content of `src/components/Header.astro`:

```astro
---
import ThemeToggle from './ThemeToggle.astro';
import Search from './Search.astro';

const navLinks = [
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
];

const currentPath = Astro.url.pathname;
---

<header class="border-b border-divider bg-page/80 backdrop-blur-sm sticky top-0 z-50">
  <nav class="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
    <!-- Logo -->
    <a href="/" class="font-serif text-xl text-heading tracking-wider hover:text-accent transition-colors" style="letter-spacing: 1px;">
      CCY
    </a>

    <!-- Desktop nav -->
    <div class="hidden sm:flex items-center gap-6">
      {navLinks.map(({ href, label }) => (
        <a
          href={href}
          class:list={[
            'text-sm font-medium transition-colors',
            currentPath.startsWith(href)
              ? 'text-heading border-b-[1.5px] border-accent pb-0.5'
              : 'text-secondary hover:text-heading',
          ]}
        >
          {label}
        </a>
      ))}
      <Search />
      <ThemeToggle />
    </div>

    <!-- Mobile menu button -->
    <div class="flex sm:hidden items-center gap-3">
      <Search />
      <ThemeToggle />
      <button
        id="mobile-menu-btn"
        class="text-secondary hover:text-heading"
        aria-label="Toggle menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </nav>

  <!-- Mobile nav -->
  <div id="mobile-menu" class="hidden sm:hidden border-t border-divider">
    <div class="px-4 py-3 space-y-2">
      {navLinks.map(({ href, label }) => (
        <a
          href={href}
          class:list={[
            'block py-2 text-sm font-medium transition-colors',
            currentPath.startsWith(href)
              ? 'text-heading'
              : 'text-secondary',
          ]}
        >
          {label}
        </a>
      ))}
    </div>
  </div>
</header>

<script>
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  btn?.addEventListener('click', () => {
    menu?.classList.toggle('hidden');
  });
</script>
```

Note: All color classes (`text-heading`, `text-secondary`, `text-accent`, `border-divider`, `bg-page`) use design tokens that auto-switch in dark mode. No `dark:` prefixes needed.

- [ ] **Step 2: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: redesign Header with serif CCY logo and warm-brown palette"
```

---

### Task 6: Simplify Footer

**Files:**
- Modify: `src/components/Footer.astro` (full rewrite)

- [ ] **Step 1: Rewrite Footer to minimal style**

Replace the entire content of `src/components/Footer.astro`:

```astro
---
const year = new Date().getFullYear();
---

<footer class="border-t border-divider mt-auto">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
      <p>&copy; {year} CCY</p>
      <div class="flex items-center gap-4">
        <a href="/rss.xml" class="hover:text-secondary transition-colors" aria-label="RSS Feed">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.18 15.64a2.18 2.18 0 010 4.36 2.18 2.18 0 010-4.36M4 4.44A15.56 15.56 0 0119.56 20h-2.83A12.73 12.73 0 004 7.27V4.44m0 5.66a9.9 9.9 0 019.9 9.9h-2.83A7.07 7.07 0 004 12.93v-2.83z" />
          </svg>
        </a>
        <a href="https://github.com" class="hover:text-secondary transition-colors" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: simplify Footer to minimal warm-brown style"
```

---

### Task 7: Update ThemeToggle colors

**Files:**
- Modify: `src/components/ThemeToggle.astro`

- [ ] **Step 1: Update icon button colors**

In `src/components/ThemeToggle.astro`, replace the button's class (line 4):

Old:
```
  class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
```

New:
```
  class="text-secondary hover:text-heading transition-colors"
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ThemeToggle.astro
git commit -m "feat: update ThemeToggle colors to warm-brown tokens"
```

---

### Task 8: Update Search modal colors

**Files:**
- Modify: `src/components/Search.astro`

- [ ] **Step 1: Update search button color**

Line 4 — replace:
```
  class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
```
With:
```
  class="text-secondary hover:text-heading transition-colors"
```

- [ ] **Step 2: Update modal container colors**

Line 14 — replace:
```html
    <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
```
With:
```html
    <div class="bg-page rounded-xl shadow-2xl overflow-hidden border border-divider">
```

- [ ] **Step 3: Update modal title and close button colors**

Line 17 — replace:
```html
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">搜尋</h3>
```
With:
```html
          <h3 class="text-lg font-semibold text-heading">搜尋</h3>
```

Line 18 — replace:
```html
          <button id="search-close" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" aria-label="Close search">
```
With:
```html
          <button id="search-close" class="text-muted hover:text-secondary" aria-label="Close search">
```

- [ ] **Step 4: Update Pagefind CSS overrides**

Replace the `<style is:global>` block (lines 84-99):

```css
<style is:global>
  @reference "../styles/global.css";

  .pagefind-ui__search-input {
    @apply w-full px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent border border-divider bg-surface text-heading;
  }
  .pagefind-ui__result {
    @apply border-b border-divider-light py-3;
  }
  .pagefind-ui__result-link {
    @apply text-accent font-medium hover:underline;
  }
  .pagefind-ui__result-excerpt {
    @apply text-sm text-secondary mt-1;
  }
</style>
```

- [ ] **Step 5: Verify build**

Run: `cd /Users/ccy/repos/sideprojects/ccyblog && npx astro build 2>&1 | tail -10`
Expected: Build succeeds

- [ ] **Step 6: Commit**

```bash
git add src/components/Search.astro
git commit -m "feat: update Search modal to warm-brown 文房書齋 palette"
```

---

## Chunk 3: Homepage Rewrite

### Task 9: Rewrite homepage to magazine editorial layout

**Files:**
- Modify: `src/pages/index.astro` (full rewrite)

- [ ] **Step 1: Rewrite index.astro with masthead, featured+recent, divider, featured projects**

Replace the entire content of `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ProjectCard from '../components/ProjectCard.astro';
import { getCollection } from 'astro:content';
import { categoryClass } from '../utils/style-helpers';

const allPosts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

// Featured post: newest with featured=true, or fallback to latest
// allPosts is sorted newest-first, so .find() returns the most recent featured post
const featuredPost = allPosts.find((p) => p.data.featured) || allPosts[0];

// Recent posts: 4 most recent excluding the featured post
const recentPosts = allPosts
  .filter((p) => p.id !== featuredPost?.id)
  .slice(0, 4);

const featuredProjects = (await getCollection('projects'))
  .filter((p) => p.data.featured)
  .sort((a, b) => a.data.order - b.data.order)
  .slice(0, 3);

const dateFormatter = new Intl.DateTimeFormat('zh-TW', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<BaseLayout title="首頁">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">

    {/* ── Masthead ── */}
    <section class="text-center py-12 sm:py-16">
      <p class="text-[10px] uppercase tracking-[4px] text-muted mb-4">Writings & Works</p>
      <h1 class="font-serif text-[28px] font-normal text-heading mb-3">
        在混亂中找到秩序，然後寫下來。
      </h1>
      <p class="text-[13px] text-secondary">
        寫程式、做工具、偶爾記錄一些還沒想通的事情。
      </p>
      <div class="w-10 h-px bg-accent mx-auto mt-6"></div>
    </section>

    {/* ── Featured + Recent ── */}
    {featuredPost && (
      <section class="flex flex-col lg:flex-row gap-0 mb-12">
        {/* Left: Featured */}
        <div class="flex-[13] lg:pr-8">
          <p class="text-[10px] uppercase tracking-[4px] text-muted mb-4">精選文章</p>
          <a href={`/blog/${featuredPost.id}`} class="group block">
            <h2 class="font-serif text-[20px] font-normal text-heading group-hover:text-accent transition-colors mb-3">
              {featuredPost.data.title}
            </h2>
            <p class="text-[13px] text-secondary mb-3 leading-relaxed">
              {featuredPost.data.description}
            </p>
            <div class="flex items-center gap-3">
              <time class="font-mono text-[10px] text-muted" datetime={featuredPost.data.pubDate.toISOString()}>
                {dateFormatter.format(featuredPost.data.pubDate)}
              </time>
              <span class:list={['text-[10px] px-2 py-0.5 rounded-full', categoryClass(featuredPost.data.category)]}>
                {featuredPost.data.category}
              </span>
            </div>
          </a>
        </div>

        {/* Vertical divider (desktop only) */}
        <div class="hidden lg:block w-px bg-divider"></div>

        {/* Right: Recent */}
        <div class="flex-[7] lg:pl-8 mt-8 lg:mt-0">
          <p class="text-[10px] uppercase tracking-[4px] text-muted mb-4">近期文章</p>
          <ul class="space-y-0">
            {recentPosts.map((post, i) => (
              <li class:list={[i > 0 && 'border-t border-divider-light', 'py-3']}>
                <a href={`/blog/${post.id}`} class="group block">
                  <h3 class="font-serif text-[14px] font-normal text-heading group-hover:text-accent transition-colors mb-1">
                    {post.data.title}
                  </h3>
                  <time class="font-mono text-[10px] text-muted" datetime={post.data.pubDate.toISOString()}>
                    {dateFormatter.format(post.data.pubDate)}
                  </time>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )}

    {/* ── Ornamental Divider ── */}
    <div class="flex items-center gap-4 my-12">
      <div class="flex-1 h-px bg-divider"></div>
      <span class="text-muted text-xs">✦</span>
      <div class="flex-1 h-px bg-divider"></div>
    </div>

    {/* ── Featured Projects ── */}
    {featuredProjects.length > 0 && (
      <section class="mb-12">
        <p class="text-[10px] uppercase tracking-[4px] text-muted mb-6">精選作品</p>
        <div class:list={[
          'grid gap-6',
          featuredProjects.length >= 3 ? 'sm:grid-cols-2 lg:grid-cols-3' :
          featuredProjects.length === 2 ? 'sm:grid-cols-2' : ''
        ]}>
          {featuredProjects.map((project) => (
            <ProjectCard
              title={project.data.title}
              description={project.data.description}
              url={project.data.url}
              github={project.data.github}
              image={project.data.image}
              tech={project.data.tech}
            />
          ))}
        </div>
      </section>
    )}

  </div>
</BaseLayout>
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/ccy/repos/sideprojects/ccyblog && npx astro build 2>&1 | tail -10`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: rewrite homepage to magazine editorial layout with masthead and featured sections"
```

---

## Chunk 4: Blog List System

### Task 10: Rewrite PostCard as list item

**Files:**
- Modify: `src/components/PostCard.astro` (full rewrite)

- [ ] **Step 1: Rewrite PostCard from card to list-item style**

Replace the entire content of `src/components/PostCard.astro`:

```astro
---
import { categoryClass } from '../utils/style-helpers';

interface Props {
  title: string;
  description: string;
  pubDate: Date;
  category: string;
  tags: string[];
  slug: string;
  heroImage?: string;
}

const { title, description, pubDate, category, tags, slug } = Astro.props;

const dateFormatter = new Intl.DateTimeFormat('zh-TW', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<article>
  <a href={`/blog/${slug}`} class="group block py-5">
    <div class="flex items-center gap-3 mb-2">
      <time class="font-mono text-[10px] text-muted" datetime={pubDate.toISOString()}>
        {dateFormatter.format(pubDate)}
      </time>
      <span class:list={['text-[10px] px-2 py-0.5 rounded-full', categoryClass(category)]}>
        {category}
      </span>
    </div>
    <h3 class="font-serif text-[17px] font-normal text-heading group-hover:text-accent transition-colors mb-1.5">
      {title}
    </h3>
    <p class="text-[12px] text-secondary leading-relaxed mb-2">
      {description}
    </p>
    {tags.length > 0 && (
      <div class="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span class="text-[9px] text-muted">
            #{tag}
          </span>
        ))}
      </div>
    )}
  </a>
</article>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PostCard.astro
git commit -m "feat: rewrite PostCard from card grid to list-item style"
```

---

### Task 11: Rewrite BlogListPage with category tabs and list layout

**Files:**
- Modify: `src/components/BlogListPage.astro` (full rewrite)

- [ ] **Step 1: Rewrite BlogListPage removing sidebar, adding category tabs**

Replace the entire content of `src/components/BlogListPage.astro`:

```astro
---
import PostCard from './PostCard.astro';

interface Props {
  posts: Array<{
    id: string;
    data: {
      title: string;
      description: string;
      pubDate: Date;
      category: string;
      tags: string[];
      heroImage?: string;
    };
  }>;
  currentPage: number;
  totalPages: number;
  categoryCounts: Record<string, number>;
  totalPostCount: number;
  activeCategory?: string;
}

const { posts, currentPage, totalPages, categoryCounts, totalPostCount, activeCategory } = Astro.props;

function pageUrl(page: number) {
  return page === 1 ? '/blog' : `/blog/page/${page}`;
}

const tabs = [
  { label: '全部', count: totalPostCount, href: '/blog' },
  { label: '技術', count: categoryCounts['技術'] || 0, href: '/blog/categories/tech' },
  { label: '日誌', count: categoryCounts['日誌'] || 0, href: '/blog/categories/journal' },
];
---

<div class="max-w-3xl mx-auto px-4 sm:px-6 py-8">
  {/* Header */}
  <h1 class="font-serif text-[28px] font-normal text-heading mb-6">所有文章</h1>

  {/* Category tabs */}
  <div class="flex gap-6 mb-8 border-b border-divider">
    {tabs.map((tab) => {
      const isActive = activeCategory
        ? tab.label === activeCategory
        : tab.label === '全部';
      return (
        <a
          href={tab.href}
          class:list={[
            'pb-3 text-sm transition-colors',
            isActive
              ? 'text-heading border-b-[1.5px] border-accent'
              : 'text-secondary hover:text-heading',
          ]}
        >
          {tab.label} ({tab.count})
        </a>
      );
    })}
  </div>

  {/* Post list */}
  <div>
    {posts.map((post, i) => (
      <div class:list={[i > 0 && 'border-t border-divider-light']}>
        <PostCard
          title={post.data.title}
          description={post.data.description}
          pubDate={post.data.pubDate}
          category={post.data.category}
          tags={post.data.tags}
          slug={post.id}
          heroImage={post.data.heroImage}
        />
      </div>
    ))}
  </div>

  {/* End dots */}
  <div class="text-center text-muted text-sm my-8 tracking-[8px]">· · ·</div>

  {/* Pagination */}
  {totalPages > 1 && (
    <nav class="flex justify-center gap-2 mt-6">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <a
          href={pageUrl(page)}
          class:list={[
            'w-7 h-7 flex items-center justify-center rounded text-sm transition-colors',
            page === currentPage
              ? 'bg-heading text-page'
              : 'text-secondary hover:text-heading',
          ]}
        >
          {page}
        </a>
      ))}
    </nav>
  )}
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/BlogListPage.astro
git commit -m "feat: rewrite BlogListPage with category tabs, list layout, styled pagination"
```

---

### Task 12: Update blog page routes to pass category counts

**Files:**
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/blog/page/[page].astro`

- [ ] **Step 1: Update blog/index.astro**

Replace the entire content of `src/pages/blog/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import BlogListPage from '../../components/BlogListPage.astro';
import { getCollection } from 'astro:content';
import { POSTS_PER_PAGE } from '../../utils/style-helpers';

const allPosts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

const categoryCounts: Record<string, number> = {};
allPosts.forEach((p) => {
  categoryCounts[p.data.category] = (categoryCounts[p.data.category] || 0) + 1;
});

const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
const paginatedPosts = allPosts.slice(0, POSTS_PER_PAGE);
---

<BaseLayout title="Blog" description="所有文章列表">
  <BlogListPage
    posts={paginatedPosts}
    currentPage={1}
    totalPages={totalPages}
    categoryCounts={categoryCounts}
    totalPostCount={allPosts.length}
  />
</BaseLayout>
```

- [ ] **Step 2: Update blog/page/[page].astro**

Replace the entire content of `src/pages/blog/page/[page].astro`:

```astro
---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import BlogListPage from '../../../components/BlogListPage.astro';
import { getCollection } from 'astro:content';
import { POSTS_PER_PAGE } from '../../../utils/style-helpers';

export async function getStaticPaths() {
  const allPosts = await getCollection('blog', ({ data }) => !data.draft);
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  return Array.from({ length: totalPages - 1 }, (_, i) => ({
    params: { page: String(i + 2) },
    props: { page: i + 2 },
  }));
}

const { page: currentPage } = Astro.props;

const allPosts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

const categoryCounts: Record<string, number> = {};
allPosts.forEach((p) => {
  categoryCounts[p.data.category] = (categoryCounts[p.data.category] || 0) + 1;
});

const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
const paginatedPosts = allPosts.slice(
  (currentPage - 1) * POSTS_PER_PAGE,
  currentPage * POSTS_PER_PAGE
);
---

<BaseLayout title={`Blog - 第 ${currentPage} 頁`} description="所有文章列表">
  <BlogListPage
    posts={paginatedPosts}
    currentPage={currentPage}
    totalPages={totalPages}
    categoryCounts={categoryCounts}
    totalPostCount={allPosts.length}
  />
</BaseLayout>
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/ccy/repos/sideprojects/ccyblog && npx astro build 2>&1 | tail -10`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/index.astro src/pages/blog/page/\[page\].astro
git commit -m "feat: update blog routes with shared POSTS_PER_PAGE and category counts"
```

---

## Chunk 5: Article Reading Page

### Task 13: Rewrite PostLayout with 960px frame and refined typography

**Files:**
- Modify: `src/layouts/PostLayout.astro` (full rewrite)
- Delete: `src/components/TagList.astro`

Note: PostLayout now accepts `prevPost` and `nextPost` props so prev/next navigation lives outside `.prose`, avoiding style inheritance issues.

- [ ] **Step 1: Rewrite PostLayout with 960/640/180 layout, back link, padding-left header, prev/next via props**

Replace the entire content of `src/layouts/PostLayout.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';
import TableOfContents from '../components/TableOfContents.astro';
import { getReadingTime } from '../utils/reading-time';
import { categoryClass } from '../utils/style-helpers';

interface Props {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  category: string;
  tags: string[];
  heroImage?: string;
  headings: { depth: number; slug: string; text: string }[];
  rawContent: string;
  prevPost?: { id: string; title: string } | null;
  nextPost?: { id: string; title: string } | null;
}

const { title, description, pubDate, updatedDate, category, tags, heroImage, headings, rawContent, prevPost, nextPost } = Astro.props;
const readingTime = getReadingTime(rawContent);

const dateFormatter = new Intl.DateTimeFormat('zh-TW', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<BaseLayout title={title} description={description} image={heroImage}>
  <div class="max-w-[960px] mx-auto px-4 sm:px-10 py-8">
    <div class="flex justify-center gap-[60px]">
      {/* Main content column */}
      <article class="flex-[0_1_640px] min-w-0">
        {/* Header with padding-left: 24px */}
        <header class="mb-8 pl-6">
          <a href="/blog" class="text-[11px] text-secondary hover:text-accent transition-colors">
            &larr; 返回文章列表
          </a>
          <div class="flex items-center gap-3 mt-4 mb-3">
            <time class="font-mono text-[11px] text-muted" datetime={pubDate.toISOString()}>
              {dateFormatter.format(pubDate)}
            </time>
            <span class:list={['text-[10px] px-2 py-0.5 rounded-full', categoryClass(category)]}>
              {category}
            </span>
            <span class="text-[11px] text-muted">{readingTime}</span>
          </div>
          <h1 class="font-serif text-[30px] font-normal text-heading leading-snug">
            {title}
          </h1>
          {description && (
            <p class="text-[14px] text-secondary mt-3">{description}</p>
          )}
          {updatedDate && (
            <p class="text-[11px] text-muted mt-2">
              最後更新：{dateFormatter.format(updatedDate)}
            </p>
          )}
        </header>

        {/* Full-width divider */}
        <hr class="border-divider mb-8" />

        {heroImage && (
          <img src={heroImage} alt={title} class="w-full rounded-lg mb-8 object-cover max-h-96" />
        )}

        {/* Content — slot is inside .prose */}
        <div class="prose">
          <slot />
        </div>

        {/* Tags (outside .prose to avoid style inheritance) */}
        {tags.length > 0 && (
          <div class="mt-8 pt-6 border-t border-divider">
            <div class="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <a
                  href={`/blog/tags/${tag}`}
                  class="text-[10px] bg-surface text-secondary hover:text-accent px-3 py-1 rounded-full transition-colors"
                >
                  #{tag}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Prev/Next navigation (outside .prose to avoid style inheritance) */}
        {(prevPost || nextPost) && (
          <nav class="flex justify-between gap-4 pt-6 mt-8 border-t border-divider">
            {prevPost ? (
              <a href={`/blog/${prevPost.id}`} class="group flex-1">
                <span class="text-[10px] text-muted">&larr; 上一篇</span>
                <p class="font-serif text-[13px] text-heading group-hover:text-accent transition-colors mt-1">
                  {prevPost.title}
                </p>
              </a>
            ) : <div />}
            {nextPost ? (
              <a href={`/blog/${nextPost.id}`} class="group flex-1 text-right">
                <span class="text-[10px] text-muted">下一篇 &rarr;</span>
                <p class="font-serif text-[13px] text-heading group-hover:text-accent transition-colors mt-1">
                  {nextPost.title}
                </p>
              </a>
            ) : <div />}
          </nav>
        )}
      </article>

      {/* TOC sidebar (desktop) */}
      {headings.length > 0 && (
        <aside class="hidden lg:block w-[180px] flex-shrink-0">
          <div class="sticky top-20">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      )}
    </div>
  </div>

  <script>
    import mermaid from 'mermaid';

    mermaid.initialize({
      startOnLoad: false,
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
    });

    async function renderMermaid() {
      const codeBlocks = document.querySelectorAll('pre > code.language-mermaid');
      for (const codeBlock of codeBlocks) {
        const pre = codeBlock.parentElement!;
        const container = document.createElement('div');
        container.className = 'mermaid';
        container.textContent = codeBlock.textContent ?? '';
        pre.replaceWith(container);
      }
      await mermaid.run({ querySelector: '.mermaid' });
    }

    renderMermaid();
  </script>
</BaseLayout>
```

Key design decisions:
- `px-4 sm:px-10`: 16px padding on mobile, 40px on desktop (reviewer feedback: 40px too wide on phones)
- Prev/next and tags are **outside** `.prose` div to avoid inheriting prose link styles (underline, accent color)
- Prev/next passed via props instead of slot, so they render in the correct position within the 640px column

- [ ] **Step 2: Delete TagList.astro (no longer imported anywhere)**

Run: `rm /Users/ccy/repos/sideprojects/ccyblog/src/components/TagList.astro`

- [ ] **Step 3: Commit**

```bash
git add src/layouts/PostLayout.astro
git rm src/components/TagList.astro
git commit -m "feat: rewrite PostLayout with 960px frame, 640px content, prev/next via props"
```

---

### Task 14: Redesign TableOfContents

**Files:**
- Modify: `src/components/TableOfContents.astro` (full rewrite)

- [ ] **Step 1: Rewrite TOC with left border, 12px font, label styling, active heading highlight**

Replace the entire content of `src/components/TableOfContents.astro`:

```astro
---
interface Props {
  headings: { depth: number; slug: string; text: string }[];
}

const { headings } = Astro.props;
const filteredHeadings = headings.filter((h) => h.depth >= 2 && h.depth <= 3);
---

{filteredHeadings.length > 0 && (
  <nav>
    <p class="text-[10px] uppercase tracking-[4px] text-muted mb-3">目錄</p>
    <ul class="border-l border-divider space-y-1.5">
      {filteredHeadings.map((heading) => (
        <li style={heading.depth === 3 ? 'padding-left: 1.5rem;' : 'padding-left: 0.75rem;'}>
          <a
            href={`#${heading.slug}`}
            class="toc-link text-[12px] text-secondary hover:text-heading transition-colors leading-snug block py-0.5"
            data-heading={heading.slug}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  </nav>
)}

<script>
  // Highlight current heading in TOC based on scroll position
  const tocLinks = document.querySelectorAll('.toc-link');
  if (tocLinks.length > 0) {
    const headingElements = Array.from(tocLinks).map((link) => {
      const slug = link.getAttribute('data-heading');
      return slug ? document.getElementById(slug) : null;
    }).filter(Boolean) as HTMLElement[];

    function updateActiveHeading() {
      let activeIndex = 0;
      for (let i = 0; i < headingElements.length; i++) {
        if (headingElements[i].getBoundingClientRect().top <= 100) {
          activeIndex = i;
        }
      }
      tocLinks.forEach((link, i) => {
        if (i === activeIndex) {
          link.classList.remove('text-secondary');
          link.classList.add('text-heading');
        } else {
          link.classList.remove('text-heading');
          link.classList.add('text-secondary');
        }
      });
    }

    window.addEventListener('scroll', updateActiveHeading, { passive: true });
    updateActiveHeading();
  }
</script>
```

Note: Since `text-heading` and `text-secondary` use CSS custom properties that auto-switch in dark mode, the scroll highlight script works correctly in both themes without extra class toggling.

- [ ] **Step 2: Commit**

```bash
git add src/components/TableOfContents.astro
git commit -m "feat: redesign TOC with left border, active heading highlight, 10px label"
```

---

### Task 15: Update article page to pass prev/next via props

**Files:**
- Modify: `src/pages/blog/[...slug].astro`

- [ ] **Step 1: Pass prevPost and nextPost as props to PostLayout**

Replace the entire content of `src/pages/blog/[...slug].astro`:

```astro
---
import PostLayout from '../../layouts/PostLayout.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content, headings } = await render(post);

// Get all posts for prev/next navigation
const allPosts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

const currentIndex = allPosts.findIndex((p) => p.id === post.id);
const prevPost = currentIndex < allPosts.length - 1
  ? { id: allPosts[currentIndex + 1].id, title: allPosts[currentIndex + 1].data.title }
  : null;
const nextPost = currentIndex > 0
  ? { id: allPosts[currentIndex - 1].id, title: allPosts[currentIndex - 1].data.title }
  : null;
---

<PostLayout
  title={post.data.title}
  description={post.data.description}
  pubDate={post.data.pubDate}
  updatedDate={post.data.updatedDate}
  category={post.data.category}
  tags={post.data.tags}
  heroImage={post.data.heroImage}
  headings={headings}
  rawContent={post.body ?? ''}
  prevPost={prevPost}
  nextPost={nextPost}
>
  <Content />
</PostLayout>
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/ccy/repos/sideprojects/ccyblog && npx astro build 2>&1 | tail -10`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/\[...slug\].astro
git commit -m "feat: pass prev/next post data as props to PostLayout"
```

---

## Chunk 6: Remaining Pages & Components

### Task 16: Update ProjectCard to warm card style

**Files:**
- Modify: `src/components/ProjectCard.astro` (full rewrite)

- [ ] **Step 1: Rewrite ProjectCard with warm palette using design tokens**

Replace the entire content of `src/components/ProjectCard.astro`:

```astro
---
interface Props {
  title: string;
  description: string;
  url?: string;
  github?: string;
  image?: string;
  tech: string[];
}

const { title, description, url, github, image, tech } = Astro.props;
---

<div class="bg-surface rounded-lg overflow-hidden hover:shadow-md transition-shadow">
  {image && (
    <img src={image} alt={title} class="w-full h-48 object-cover" />
  )}
  <div class="p-5">
    <h3 class="font-serif text-[14px] font-normal text-heading mb-2">{title}</h3>
    <p class="text-[11px] text-secondary mb-4">{description}</p>

    {tech.length > 0 && (
      <div class="flex flex-wrap gap-1.5 mb-4">
        {tech.map((t) => (
          <span class="text-[10px] bg-cat-tech-bg text-cat-tech-text px-2 py-0.5 rounded-full">
            {t}
          </span>
        ))}
      </div>
    )}

    <div class="flex items-center gap-3">
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          class="text-[11px] text-accent hover:underline"
        >
          Live Demo &rarr;
        </a>
      )}
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          class="text-[11px] text-secondary hover:text-heading transition-colors"
        >
          GitHub
        </a>
      )}
    </div>
  </div>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProjectCard.astro
git commit -m "feat: update ProjectCard to warm 文房書齋 card style"
```

---

### Task 17: Update Projects page

**Files:**
- Modify: `src/pages/projects.astro`

- [ ] **Step 1: Update projects page with serif title and warm colors**

Replace the entire content of `src/pages/projects.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ProjectCard from '../components/ProjectCard.astro';
import { getCollection } from 'astro:content';

const projects = (await getCollection('projects'))
  .sort((a, b) => a.data.order - b.data.order);
---

<BaseLayout title="Projects" description="我的作品集">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
    <h1 class="font-serif text-[28px] font-normal text-heading mb-8">作品</h1>
    <div class="grid gap-6 sm:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard
          title={project.data.title}
          description={project.data.description}
          url={project.data.url}
          github={project.data.github}
          image={project.data.image}
          tech={project.data.tech}
        />
      ))}
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/projects.astro
git commit -m "feat: update Projects page with serif title and warm palette"
```

---

### Task 18: Update About page

**Files:**
- Modify: `src/pages/about.astro`

- [ ] **Step 1: Update about page with 640px centered, warm prose**

Replace the entire content of `src/pages/about.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="About" description="關於我">
  <div class="max-w-[640px] mx-auto px-4 sm:px-6 py-8">
    <h1 class="font-serif text-[28px] font-normal text-heading mb-8">About</h1>

    <div class="prose">
      <p>
        Hi，我是 CCY，一位熱愛技術的軟體工程師。
      </p>

      <h2>技能</h2>
      <ul>
        <li><strong>前端：</strong>React, Vue, TypeScript, Tailwind CSS, Astro</li>
        <li><strong>後端：</strong>Node.js, Python, Go</li>
        <li><strong>DevOps：</strong>Docker, CI/CD, Cloudflare</li>
        <li><strong>其他：</strong>Git, Linux, SQL</li>
      </ul>

      <h2>關於這個部落格</h2>
      <p>
        這個部落格使用 <a href="https://astro.build">Astro</a> 建置，搭配 Tailwind CSS 進行樣式設計，部署在 Cloudflare Pages 上。
        內容涵蓋技術文章、學習筆記、以及個人日誌。
      </p>

      <h2>聯絡方式</h2>
      <p>
        歡迎透過 <a href="https://github.com">GitHub</a> 與我聯繫。
      </p>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: update About page with 640px centered warm prose"
```

---

### Task 19: Update tag and category filter pages

**Files:**
- Modify: `src/pages/blog/tags/[tag].astro`
- Modify: `src/pages/blog/categories/[category].astro`

- [ ] **Step 1: Rewrite tags page to list-item style**

Replace the entire content of `src/pages/blog/tags/[tag].astro`:

```astro
---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import PostCard from '../../../components/PostCard.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const allTags = [...new Set(posts.flatMap((post) => post.data.tags))];

  return allTags.map((tag) => ({
    params: { tag },
    props: {
      tag,
      posts: posts
        .filter((post) => post.data.tags.includes(tag))
        .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()),
    },
  }));
}

const { tag, posts } = Astro.props;
---

<BaseLayout title={`#${tag}`} description={`所有標記為 #${tag} 的文章`}>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8">
    <div class="mb-8">
      <a href="/blog" class="text-[11px] text-secondary hover:text-accent transition-colors">&larr; 返回文章列表</a>
      <h1 class="font-serif text-[28px] font-normal text-heading mt-4">
        #{tag}
      </h1>
      <p class="text-[13px] text-secondary mt-2">{posts.length} 篇文章</p>
    </div>

    <div>
      {posts.map((post, i) => (
        <div class:list={[i > 0 && 'border-t border-divider-light']}>
          <PostCard
            title={post.data.title}
            description={post.data.description}
            pubDate={post.data.pubDate}
            category={post.data.category}
            tags={post.data.tags}
            slug={post.id}
            heroImage={post.data.heroImage}
          />
        </div>
      ))}
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Rewrite categories page to list-item style**

Replace the entire content of `src/pages/blog/categories/[category].astro`:

```astro
---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import PostCard from '../../../components/PostCard.astro';
import { getCollection } from 'astro:content';
import { categoryToSlug, slugToCategory } from '../../../utils/category';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const allCategories = [...new Set(posts.map((post) => post.data.category))];

  return allCategories.map((categoryName) => ({
    params: { category: categoryToSlug(categoryName) },
    props: {
      categoryName,
      posts: posts
        .filter((post) => post.data.category === categoryName)
        .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()),
    },
  }));
}

const { categoryName, posts } = Astro.props;
---

<BaseLayout title={categoryName} description={`所有「${categoryName}」分類的文章`}>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8">
    <div class="mb-8">
      <a href="/blog" class="text-[11px] text-secondary hover:text-accent transition-colors">&larr; 返回文章列表</a>
      <h1 class="font-serif text-[28px] font-normal text-heading mt-4">
        {categoryName}
      </h1>
      <p class="text-[13px] text-secondary mt-2">{posts.length} 篇文章</p>
    </div>

    <div>
      {posts.map((post, i) => (
        <div class:list={[i > 0 && 'border-t border-divider-light']}>
          <PostCard
            title={post.data.title}
            description={post.data.description}
            pubDate={post.data.pubDate}
            category={post.data.category}
            tags={post.data.tags}
            slug={post.id}
            heroImage={post.data.heroImage}
          />
        </div>
      ))}
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Verify full build**

Run: `cd /Users/ccy/repos/sideprojects/ccyblog && npx astro build 2>&1 | tail -10`
Expected: Build succeeds with zero errors

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/tags/\[tag\].astro src/pages/blog/categories/\[category\].astro
git commit -m "feat: update tag and category filter pages to list-item warm style"
```

---

## Final Verification

### Task 20: Full build and visual check

- [ ] **Step 1: Run full build**

Run: `cd /Users/ccy/repos/sideprojects/ccyblog && npx astro build 2>&1`
Expected: Build succeeds, all pages generated

- [ ] **Step 2: Start preview server and visual check**

Run: `cd /Users/ccy/repos/sideprojects/ccyblog && npx astro preview`

Check each page in both light and dark mode:
- `/` — Masthead centered, featured+recent asymmetric layout, ornamental divider, featured projects cards
- `/blog` — "所有文章" serif title, category tabs with counts, list-item posts, styled pagination, "· · ·" end dots
- `/blog/[slug]` — 960px frame, 640px content, TOC on right with left border + active highlight, header padding-left: 24px, prev/next below tags
- `/projects` — Serif "作品" title, warm surface cards
- `/about` — 640px centered, warm prose
- `/blog/tags/[tag]` — List-item style, back link, warm colors
- `/blog/categories/[category]` — Same as tags
- Toggle dark mode on each page — all warm brown (no cold grays), all tokens auto-switch

- [ ] **Step 3: Final commit (if any adjustments needed)**

```bash
git add -A
git commit -m "fix: visual adjustments after full review"
```
