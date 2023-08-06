import { createClient } from "@supabase/supabase-js";
import { writeFile } from 'fs/promises'
import { join, dirname } from "path"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPABASE_URL = "paste url here"
const SUPABASE_KEY = "paste token here"

const db = createClient(SUPABASE_URL, SUPABASE_KEY,);

const dms = await db.from('dms').select().csv()
const events = await db.from('events').select().csv()
const users = await db.from('users').select().csv()

await writeFile(join(__dirname, '../../sql/backups/05-08-2023/dms.csv'), dms.data || "", "utf-8")
await writeFile(join(__dirname, '../../sql/backups/05-08-2023/events.csv'), events.data || "", "utf-8")
await writeFile(join(__dirname, '../../sql/backups/05-08-2023/users.csv'), users.data || "", "utf-8")
