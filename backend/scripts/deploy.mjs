#!/usr/bin/env node
/**
 * Smart migration script untuk Railway.
 * Jika P3005: baseline semua migrasi KECUALI yang perlu benar-benar dijalankan
 * (migrasi yang mengubah schema yang belum ada di DB Railway).
 */
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, '..', 'prisma', 'migrations');

// Migrasi ini HARUS benar-benar dijalankan (bukan hanya di-baseline)
// karena mengandung ALTER TABLE yang belum ada di Railway
const MUST_RUN = [
  '20260518000000_fix_short_description_text',
];

function run(cmd) {
  console.log(`$ ${cmd}`);
  const r = spawnSync(cmd, { shell: true, stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`Failed: ${cmd}`);
}

function runCapture(cmd) {
  const r = spawnSync(cmd, { shell: true, encoding: 'utf-8' });
  return { ok: r.status === 0, output: (r.stdout || '') + (r.stderr || '') };
}

console.log('🚀 Running database migrations...');
const first = runCapture('npx prisma migrate deploy');

if (first.ok) {
  console.log('✅ Migrations applied successfully.');
  process.exit(0);
}

if (!first.output.includes('P3005')) {
  console.error('❌ Migration failed:\n', first.output);
  process.exit(1);
}

console.log('⚠️  P3005 detected — baseling existing migrations...');

const allMigrations = readdirSync(migrationsDir)
  .filter((f) => /^\d{14}/.test(f))
  .sort();

for (const migration of allMigrations) {
  if (MUST_RUN.includes(migration)) {
    console.log(`  ⏭  Skipping baseline for: ${migration} (will run for real)`);
    continue;
  }
  console.log(`  → Baseling: ${migration}`);
  const r = runCapture(`npx prisma migrate resolve --applied ${migration}`);
  if (!r.ok && !r.output.includes('already recorded')) {
    console.warn(`  ⚠️  ${r.output.slice(0, 200)}`);
  }
}

console.log('🔄 Running prisma migrate deploy to apply new migrations...');
try {
  run('npx prisma migrate deploy');
  console.log('✅ Done.');
  process.exit(0);
} catch {
  console.error('❌ Migration deploy failed after baseline.');
  process.exit(1);
}
