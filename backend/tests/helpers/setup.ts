// Resets local db
import { afterEach } from 'node:test'
import resetDb from './reset-db'
import { beforeEach, afterAll } from 'vitest'

beforeEach(async () => {
  await resetDb()
})
