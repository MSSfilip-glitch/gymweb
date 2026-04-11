import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import * as schema from "./schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// When compiled, __dirname is server/dist/. When running via tsx, it's server/.
// In both cases we need to go up to the project root (gymWeb/).
const serverDir = __dirname.endsWith('dist') ? path.resolve(__dirname, '..') : __dirname;
const projectRoot = path.resolve(serverDir, '..');

// Store the DB file in the project root (gymWeb/gszz.db)
const dbPath = path.resolve(projectRoot, "gszz.db");
const sqlite = new Database(dbPath);

// Enable WAL mode for better performance
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });

// Create tables if they don't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT,
    category TEXT NOT NULL,
    image_url TEXT,
    published INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    event_date TEXT NOT NULL,
    event_time TEXT,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    published INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS clubs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    latitude TEXT,
    longitude TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    event_date TEXT NOT NULL,
    location TEXT NOT NULL,
    pdf_url TEXT,
    content TEXT,
    published INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS gallery_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    event TEXT NOT NULL,
    event_date TEXT NOT NULL,
    published INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS gallery_albums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    event_date TEXT NOT NULL,
    published INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS gallery_album_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    album_id INTEGER NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    pdf_url TEXT,
    published INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

// Try to alter clubs to add new columns if they don't exist
try {
  sqlite.exec("ALTER TABLE clubs ADD COLUMN map_url TEXT");
} catch (e) { /* column already exists */ }
try {
  sqlite.exec("ALTER TABLE clubs ADD COLUMN member_count TEXT");
} catch (e) { /* column already exists */ }
try {
  sqlite.exec("ALTER TABLE clubs ADD COLUMN founded_year TEXT");
} catch (e) { /* column already exists */ }
try {
  sqlite.exec("ALTER TABLE clubs ADD COLUMN manager_name TEXT");
} catch (e) { /* column already exists */ }

console.log("Database initialized at:", dbPath);
