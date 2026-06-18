/**
 * Generates public/og-image.png from public/og-image.svg
 * using a headless Chromium browser for pixel-accurate rendering.
 */
import { spawnSync } from 'node:child_process'
import { writeFileSync, readFileSync, rmSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const svgPath  = resolve(root, 'public/og-image.svg')
const pngPath  = resolve(root, 'public/og-image.png')
const tmpHtml  = resolve(root, '.tmp-og-render.html')

// Inline the SVG into an HTML page — gives accurate browser rendering
// (avoids font / filter differences from native SVG renderers like librsvg)
const svg  = readFileSync(svgPath, 'utf-8')
const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>
  * { margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; background: #050508; }
  svg { display: block; }
</style>
</head>
<body>${svg}</body>
</html>`

writeFileSync(tmpHtml, html)

// Find first available Chromium-based browser
const candidates = [
  '/snap/bin/chromium',
  'chromium',
  'chromium-browser',
  'google-chrome',
  'google-chrome-stable',
]
let browser = null
for (const bin of candidates) {
  const r = spawnSync('which', [bin], { encoding: 'utf-8' })
  if (r.status === 0) { browser = r.stdout.trim(); break }
  // also try absolute path directly
  const abs = spawnSync('test', ['-x', bin])
  if (abs.status === 0) { browser = bin; break }
}

if (!browser) {
  console.warn('⚠  No Chromium browser found — skipping og-image.png generation.')
  rmSync(tmpHtml, { force: true })
  process.exit(0)
}

console.log(`Using: ${browser}`)

try {
  const result = spawnSync(browser, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--screenshot=${pngPath}`,
    '--window-size=1200,630',
    `file://${tmpHtml}`,
  ], { stdio: 'inherit', timeout: 30_000 })

  if (result.status !== 0) {
    throw new Error(`Chromium exited with code ${result.status}`)
  }

  console.log(`✓  og-image.png saved → ${pngPath}`)
} finally {
  rmSync(tmpHtml, { force: true })
}
