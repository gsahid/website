#!/usr/bin/env node
/**
 * Upload photography images to Cloudflare R2 via wrangler.
 *
 * Usage:
 *   node scripts/upload-photography.mjs               # upload all folders
 *   node scripts/upload-photography.mjs karachi       # upload a single folder
 *   node scripts/upload-photography.mjs --dry-run     # list what would upload
 *   CONCURRENCY=4 node scripts/upload-photography.mjs # tune parallelism
 *
 * Files land in R2 at: photography/<folder>/<file>
 * (matching the field-notes layout under the same bucket).
 *
 * Source location: ../photos/<folder>/<file> at the repo root.
 * (Outside public/, so Vite never copies it into the build.)
 * Override with PHOTOS_DIR=/some/other/path if you keep them elsewhere.
 */

import { spawn } from 'node:child_process';
import { readdir, stat } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const BUCKET = 'portfolio-images';
const REMOTE_PREFIX = 'photography';
const DEFAULT_ROOT = fileURLToPath(new URL('../photos', import.meta.url));
const ROOT = process.env.PHOTOS_DIR
  ? resolve(process.env.PHOTOS_DIR)
  : DEFAULT_ROOT;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const folderFilter = args.find((a) => !a.startsWith('--'));
const concurrency = Math.max(1, Number(process.env.CONCURRENCY) || 6);

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await listFiles(full)));
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

function uploadOne(localPath, remoteKey) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      'wrangler',
      ['r2', 'object', 'put', `${BUCKET}/${remoteKey}`, `--file=${localPath}`, '--remote'],
      { stdio: ['ignore', 'pipe', 'pipe'] }
    );
    let stderr = '';
    child.stderr.on('data', (c) => (stderr += c.toString()));
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`wrangler exited ${code}: ${stderr.trim()}`));
    });
    child.on('error', reject);
  });
}

async function main() {
  let folders = (await readdir(ROOT, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  if (folderFilter) {
    if (!folders.includes(folderFilter)) {
      console.error(`No folder "${folderFilter}" under ${ROOT}`);
      console.error(`Available: ${folders.join(', ')}`);
      process.exit(1);
    }
    folders = [folderFilter];
  }

  const files = [];
  for (const folder of folders) {
    const subdir = join(ROOT, folder);
    for (const localPath of await listFiles(subdir)) {
      const rel = relative(ROOT, localPath).split('\\').join('/');
      files.push({ localPath, remoteKey: `${REMOTE_PREFIX}/${rel}` });
    }
  }

  let totalBytes = 0;
  for (const f of files) totalBytes += (await stat(f.localPath)).size;

  console.log(
    `${files.length} file(s), ${(totalBytes / 1024 / 1024).toFixed(1)} MB ` +
      `→ ${BUCKET}/${REMOTE_PREFIX}/  (concurrency ${concurrency}${dryRun ? ', dry-run' : ''})`
  );

  if (dryRun) {
    for (const f of files) console.log(`  ${f.localPath} → ${f.remoteKey}`);
    return;
  }

  let done = 0;
  let failed = 0;
  let cursor = 0;

  async function worker() {
    while (cursor < files.length) {
      const i = cursor++;
      const { localPath, remoteKey } = files[i];
      try {
        await uploadOne(localPath, remoteKey);
        done++;
        console.log(`[${done}/${files.length}] ${remoteKey}`);
      } catch (err) {
        failed++;
        console.error(`FAIL ${remoteKey}: ${err.message}`);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));

  console.log(`\nDone. ${done} uploaded, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
