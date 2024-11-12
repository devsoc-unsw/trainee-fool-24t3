// Resets local db
import { afterEach } from 'node:test'
import resetDb from './reset-db'
import { beforeEach } from 'vitest'

beforeEach(async () => {
  await resetDb()
})
