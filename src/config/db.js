import {drizzle} from 'drizzle-orm/neon-http'
import {neno} from '@neondatabase/serverless'
import {ENV} from './env.js'
import * as schema from '../db/schema.js'

const sql = neno(ENV.DATABASE_URL)
export const db = drizzle(sql, {schema})
