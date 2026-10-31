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
  assert.equal(host, "www.pdfcompressinkb.com");
  const sitemap = await readFile(new URL("../sitemap.xml", import.meta.url), "utf8");
  const urls = [...sitemap.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)].map((m) => m[1]);
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

test("sitemap hreflang alternates are present, self-referencing, unique and reciprocal", async () => {
  const sitemap = await readFile(new URL("../sitemap.xml", import.meta.url), "utf8");
  const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    const alternates = [...block.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map(([, lang, href]) => ({ lang, href }));
    assert.ok(loc, "each sitemap entry should have a loc");
    return { loc, alternates };
  });
  const byLoc = new Map(entries.map((entry) => [entry.loc, entry]));
  assert.equal(byLoc.size, entries.length, "sitemap should not contain duplicate loc URLs");

  for (const entry of entries) {
    const languages = entry.alternates.map((alternate) => alternate.lang);
    assert.equal(new Set(languages).size, languages.length, `duplicate hreflang on ${entry.loc}`);
    assert.ok(entry.alternates.some((alternate) => alternate.href === entry.loc && alternate.lang !== "x-default"),
      `each URL should have a self-referencing language alternate: ${entry.loc}`);

    for (const alternate of entry.alternates) {
      assert.ok(byLoc.has(alternate.href), `hreflang target must exist in sitemap: ${alternate.href}`);
      const target = byLoc.get(alternate.href);
      assert.ok(target.alternates.some((backlink) => backlink.href === entry.loc),
        `hreflang relationship must be reciprocal: ${entry.loc} -> ${alternate.href}`);
    }
  }
});

test("PDF processing libraries are lazy-loaded only when compression is requested", () => {
  assert.equal(html.includes('src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"'), false,
    "PDF.js should not be parser-loaded during the initial page load");
  assert.equal(html.includes('src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"'), false,
    "pdf-lib should not be parser-loaded during the initial page load");
  assert.match(html, /function loadPdfLibraries\\(/);
  assert.match(html, /await loadPdfLibraries\\(\\)/);
  assert.match(html, /GlobalWorkerOptions\\.workerSrc/);
  assert.match(html, /libraries-unavailable/);
});
