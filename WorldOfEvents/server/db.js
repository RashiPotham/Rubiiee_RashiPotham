import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const dataDir=path.join(here,"data");fs.mkdirSync(dataDir,{recursive:true});
const db=new Database(path.join(dataDir,"worldofevents.db"));
db.pragma("journal_mode = WAL");
db.exec(`
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS committees (id INTEGER PRIMARY KEY AUTOINCREMENT, organization_name TEXT NOT NULL, organization_type TEXT NOT NULL, category TEXT NOT NULL, contact_name TEXT NOT NULL, role TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, city TEXT NOT NULL, website TEXT, description TEXT NOT NULL, first_event TEXT, status TEXT NOT NULL DEFAULT 'pending_review', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS bookings (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL REFERENCES users(id), event_id TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(user_id,event_id));
`);
export default db;