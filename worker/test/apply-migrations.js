import {
  applyD1Migrations,
  env,
} from 'cloudflare:test';
import { beforeAll } from 'vitest';

beforeAll(async () => {
  await applyD1Migrations(
    env.dhe_studio_inquiries_db,
    env.TEST_MIGRATIONS
  );
});

// Create inquires table inside the temporary test database before running the tests