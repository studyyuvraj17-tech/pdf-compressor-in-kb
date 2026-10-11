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
