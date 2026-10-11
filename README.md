# PDFCompressInKB

A static, browser-based PDF compressor that attempts a lossless PDF re-save first, then uses image-based compression when needed.

## How compression works

1. The browser validates the PDF signature and input limits.
2. The tool tries to re-save the original PDF without image conversion.
3. If that does not reach the target, it tests a bounded set of page-rendering scales and JPEG quality levels.
4. Each candidate is serialized as a PDF and measured by its actual byte size.
5. The tool reports whether the requested limit was reached. Image-based compression may remove selectable text, links, form fields, bookmarks, tags and other document features.

A target size is not guaranteed for every document. Always inspect the downloaded PDF before submitting it to a portal.

## Browser limits

- Input file limit: 100 MiB.
- Page limit for image-based compression: 150 pages.
- Maximum rendered canvas area per page: 8 million pixels.
- Compression tries five scales and five JPEG quality settings. This bounds the amount of browser work, but complex PDFs may still take time.

These limits are deliberate safeguards for browser memory and responsiveness. The workflow runs locally in the browser; analytics and external library requests are separate website requests.

## Development checks

No package installation is required for the static regression checks. With Node.js 22 or later, run:

```sh
node --test tests/review-checks.mjs
```

GitHub Actions runs these checks for pull requests and pushes to `main` or `fix/**`.

## Deployment / SEO checks

The homepage canonical URL and sitemap currently use `https://www.pdfcompressinkb.com/`. Before deployment, verify that this is the production hostname, HTTPS works, and redirects consistently resolve to the canonical host. If the production hostname changes, update canonical URLs, hreflang links, structured data and sitemap entries together.
