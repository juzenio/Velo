import { Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url' // 1. Adicione este import
import { Database } from './schema'

// 2. Adicione estas duas linhas para recriar o __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carrega as variáveis de ambiente do .env na raiz do projeto
dotenv.config({ path: path.resolve(__dirname, '../../../.env') })



const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error(
    'DATABASE_URL não está definida no .env. ' +
    'Adicione a connection string do PostgreSQL do Supabase: ' +
    'DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres'
  )
}

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({
      connectionString: DATABASE_URL,
      max: 2,
    }),
  }),
})

export async function closeDatabase() {
  await db.destroy()
}
