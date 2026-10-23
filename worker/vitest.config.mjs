import { fileURLToPath } from 'node:url';
import {
  cloudflareTest,
  readD1Migrations,
} from '@cloudflare/vitest-plugin';
import { defineConfig } from 'vitest/config';

const migrationsPath = fileURLToPath(
  new URL('./migrations', import.meta.url)
);

export default defineConfig({
  plugins: [
    cloudflareTest(async () => {
      const migrations =
        await readD1Migrations(migrationsPath);

      return {
        wrangler: {
          configPath: './wrangler.jsonc',
        },

        // Tests use fake AI, so don't connect to the real Cloudflare account
        remoteBindings: false,

        miniflare: {
          bindings: {
            TEST_MIGRATIONS: migrations,
          },
        },
      };
    }),
  ],

  test: {
    setupFiles: [
      './test/apply-migrations.js',
    ],
  },
});

// Read SQL files inside migrations/ and make them available to the test environment