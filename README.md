# CCY Blog

CCY Blog 是以 Astro 建置的靜態個人網站，內容包含技術文章、AI Agent 實作、個人作品與書寫紀錄。

## Commands

所有指令都在專案根目錄執行。

| Command        | Action                                      |
| :------------- | :------------------------------------------ |
| `pnpm install` | 安裝相依套件                                |
| `pnpm dev`     | 啟動本機開發伺服器                          |
| `pnpm build`   | 產生正式建置、更新 sitemap 與 Pagefind 索引 |
| `pnpm preview` | 以 production 輸出預覽網站                  |

## SEO 與部署備忘

- Google Search Console 驗證碼透過 `PUBLIC_GOOGLE_SITE_VERIFICATION` 注入；未設定時不會輸出驗證 meta tag。
- `pnpm build` 會一併產生預設 OG 圖 fallback、文章 JSON-LD、以及含 `lastmod` 的 sitemap。
- 部署到 Cloudflare 後，優先確認 `https://ccyblog.pages.dev/og-default.png` 與 `https://ccyblog.pages.dev/sitemap-index.xml` 可正常存取。
- 完成網域切換時，記得同步更新 `astro.config.mjs` 裡的 `site` 與 `public/robots.txt` 內的 sitemap URL。
- Search Console 驗證完成後，提交 `https://ccyblog.pages.dev/sitemap-index.xml`；若之後換成自訂網域，也要重新提交新網域版本。
