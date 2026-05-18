#!/usr/bin/env node
/**
 * Smart migration script untuk Railway:
 * - Jika database kosong/baru → prisma migrate deploy langsung
 * - Jika P3005 (database ada tapi belum ada _prisma_migrations) → baseline semua migrasi, lalu deploy baru
 */
import { execSync, spawnSync } from 'child_process';
import { readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, '..', 'prisma', 'migrations');

function run(cmd) {
  const result = spawnSync(cmd, { shell: true, stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`Command failed: ${cmd}`);
}

function runCapture(cmd) {
  const result = spawnSync(cmd, { shell: true, encoding: 'utf-8' });
  return {
    ok: result.status === 0,
    output: (result.stdout || '') + (result.stderr || ''),
  };
}

console.log('🚀 Running database migrations...');

const result = runCapture('npx prisma migrate deploy');

if (result.ok) {
  console.log('✅ Migrations applied successfully.');
  process.exit(0);
}

if (result.output.includes('P3005')) {
  console.log('⚠️  P3005: Database exists without migration history. Baseling...');

  // Ambil semua folder migrasi (nama folder = migration name)
  const migrations = readdirSync(migrationsDir)
    .filter((f) => /^\d{14}/.test(f))
    .sort();

  for (const migration of migrations) {
    console.log(`  → Baseling: ${migration}`);
    const r = runCapture(`npx prisma migrate resolve --applied ${migration}`);
    if (!r.ok && !r.output.includes('already recorded')) {
      console.warn(`  ⚠️  Could not baseline ${migration}: ${r.output.slice(0, 200)}`);
    }
  }

  console.log('🔄 Re-running prisma migrate deploy after baseline...');
  try {
    run('npx prisma migrate deploy');
    console.log('✅ Done.');
    process.exit(0);
  } catch {
    console.error('❌ Migration deploy failed after baseline.');
    process.exit(1);
  }
}

// Error lain — tampilkan dan exit
console.error('❌ Migration failed:\n', result.output);
process.exit(1);
