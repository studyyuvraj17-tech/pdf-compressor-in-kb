import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

test("inline JavaScript parses without executing browser code", () => {
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  const executable = scripts.filter(([, attrs, body]) =>
    !/\bsrc\s*=/.test(attrs) &&
    !/application\/ld\+json/i.test(attrs) &&
    body.trim().length > 0
  );
  assert.ok(executable.length > 0, "expected at least one inline JavaScript block");
  for (const [, attrs, body] of executable) {
    assert.doesNotThrow(() => new Function(body), `inline script should parse (attributes: ${attrs})`);
  }
});

test("homepage exposes 300 KB and 400 KB presets and explains maximum-size targets", () => {
  for (const size of [20, 50, 100, 200, 300, 400, 500, 1024]) {
    assert.match(html, new RegExp(`data-kb="${size}"`), `expected ${size} KB preset`);
  }
  assert.match(html, /maximum file-size limits, not exact output sizes/i);
  assert.match(html, /Within your size limit/);
});

test("target size has matching HTML and JavaScript bounds", () => {
  assert.match(html, /id="kb"[^>]*min="10"[^>]*max="100000"[^>]*step="1"/);
  assert.match(html, /kb<10\|\|kb>100000/);
  assert.match(html, /file\.size>100\*1024\*1024/);
});

test("compression validates the PDF and limits browser workload", () => {
  assert.match(html, /invalid-pdf/);
  assert.match(html, /encrypted-pdf/);
  assert.match(html, /pdf\.numPages>150/);
  assert.match(html, /maxPixels=8000000/);
  assert.match(html, /isEvalSupported:false/);
});

test("lossless save is attempted without pretending encryption is ignored", () => {
  assert.match(html, /PDFDocument\.load\(bytes,\{updateMetadata:false\}\)/);
  assert.doesNotMatch(html, /ignoreEncryption\s*:\s*true/);
  assert.match(html, /Target reached using image-based compression/);
});

test("download object URLs are revoked when replaced and on page unload", () => {
  assert.match(html, /URL\.revokeObjectURL\(activeObjectUrl\)/);
  assert.match(html, /beforeunload/);
});

test("the page reports the measured output size and whether the target was met", () => {
  assert.match(html, /var under=result\.size<=target/);
  assert.match(html, /result\.size>target/);
  assert.match(html, /Target not reached/);
});

test("canonical and sitemap metadata use the production host consistently", async () => {
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  assert.ok(canonical, "homepage should declare a canonical URL");
  const host = new URL(canonical).host;
  assert.equal(host, "pdfcompressinkb.com");
  const sitemap = await readFile(new URL("../sitemap.xml", import.meta.url), "utf8");
  const urls = sitemap.split("<loc>").slice(1).map((part) => part.split("</loc>")[0]);
  assert.ok(urls.length > 0, "sitemap should contain URLs");
  assert.ok(urls.every((url) => new URL(url).host === host), "sitemap URLs should use the canonical host");
});

test("Vercel deployment defines baseline security headers and permits required assets", async () => {
  const config = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
  const apexRedirect = config.redirects?.find((rule) =>
    rule.source === "/:path*" &&
    rule.destination === "https://www.pdfcompressinkb.com/:path*" &&
    rule.permanent === true
  );
  assert.ok(apexRedirect, "Vercel should permanently redirect the apex host to the canonical www host");
  assert.deepEqual(apexRedirect.has, [{ type: "host", value: "pdfcompressinkb.com" }]);
  const headers = config.headers?.[0]?.headers ?? [];
  const values = Object.fromEntries(headers.map(({ key, value }) => [key.toLowerCase(), value]));
  assert.equal(values["x-content-type-options"], "nosniff");
  assert.equal(values["x-frame-options"], "DENY");
  assert.match(values["content-security-policy"] ?? "", /object-src 'none'/);
  assert.match(values["content-security-policy"] ?? "", /https:\/\/cdnjs\.cloudflare\.com/);
  assert.match(values["content-security-policy"] ?? "", /worker-src 'self' blob:/);
});


test("robots.txt advertises the sitemap on the canonical host", async () => {
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  assert.ok(canonical, "homepage should declare a canonical URL");
  const canonicalOrigin = new URL(canonical).origin;
  const robots = await readFile(new URL("../robots.txt", import.meta.url), "utf8");
  const sitemapUrl = robots.match(/^Sitemap:\s*(\S+)\s*$/im)?.[1];
  assert.ok(sitemapUrl, "robots.txt should advertise a sitemap");
  assert.equal(new URL(sitemapUrl).origin, canonicalOrigin, "robots sitemap should use the canonical origin");
});

test("sitemap contains only the maintained canonical English pages", async () => {
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  assert.ok(canonical, "homepage should declare a canonical URL");
  const canonicalOrigin = new URL(canonical).origin;
  const sitemap = await readFile(new URL("../sitemap.xml", import.meta.url), "utf8");
  const urls = sitemap.split("<loc>").slice(1).map((part) => part.split("</loc>")[0]);
  assert.deepEqual(urls, [
    "/",
    "/about/",
    "/contact/",
    "/how-it-works/",
    "/privacy-policy/",
    "/terms/",
    "/disclaimer/"
  ].map((path) => new URL(path, canonicalOrigin).href));
  assert.ok(!sitemap.includes("hreflang="), "unreviewed translated pages should not be advertised as language alternates");
  const cloudflareHeaders = await readFile(new URL("../_headers", import.meta.url), "utf8");
  assert.match(cloudflareHeaders, /X-Robots-Tag: noindex, follow/);
  assert.match(cloudflareHeaders, /\/compress-pdf-between-\*/);
});
test("PDF processing libraries are lazy-loaded only when compression is requested", () => {
  assert.equal(html.includes('src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"'), false,
    "PDF.js should not be parser-loaded during the initial page load");
  assert.equal(html.includes('src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"'), false,
    "pdf-lib should not be parser-loaded during the initial page load");
  assert.ok(html.includes("function loadPdfLibraries()"));
  assert.ok(html.includes("await loadPdfLibraries()"));
  assert.ok(html.includes("GlobalWorkerOptions.workerSrc"));
  assert.ok(html.includes("libraries-unavailable"));
});

test("homepage retains the site-wide design stylesheet and shared homepage styles", async () => {
  assert.ok(html.includes('href="/assets/site-system.css?v=2"'),
    "homepage should retain its current shared stylesheet");
  assert.ok(html.includes("box-sizing:border-box"), "critical box sizing should remain inline");
  assert.ok(html.includes("body{"), "critical body reset should remain inline");
  const consent = await readFile(new URL("../assets/consent.js", import.meta.url), "utf8");
  assert.ok(consent.includes('if (!document.querySelector(\'link[rel="stylesheet"][href^="/assets/site-system.css"]\'))'),
    "consent script should not inject a second copy of the shared stylesheet");
});


test("compression results provide a before-download PDF preview and method disclosure", () => {
  assert.match(html, /function addPreview\(card,result,sourceFile,method\)/);
  assert.match(html, /Image-based compression/);
  assert.match(html, /Lossless/);
  assert.match(html, /Text may be flattened into images/);
  assert.match(html, /Preview before download/);
  assert.match(html, /Download compressed PDF/);
});

test("preview is bounded to three pages and supports comparison and zoom", () => {
  assert.match(html, /Math\.min\(3,docs\[0\]\.numPages,docs\[1\]\.numPages\)/);
  assert.match(html, /previewState\.mode="both"/);
  assert.match(html, /previewState\.zoom=Math\.min\(2\.2,previewState\.zoom\+\.15\)/);
  assert.match(html, /previewState\.zoom=Math\.max\(\.65,previewState\.zoom-\.15\)/);
  assert.match(html, /Try a softer quality/);
  assert.match(html, /Adjust target size/);
});
