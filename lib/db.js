import { createClient } from '@libsql/client';
import path from 'path';

// Connection details - handles both local and cloud
// Robust check for URL to prevent "Invalid URL" errors during build
const rawUrl = process.env.TURSO_DATABASE_URL;
let url = (rawUrl && rawUrl.trim() !== "")
    ? rawUrl
    : `file:${path.join(process.cwd(), 'life-os.db')}`;

// Ensure the URL uses forward slashes (crucial for Windows/Vercel URL parsing)
if (url.startsWith('file:')) {
    url = url.replace(/\\/g, '/');
}

const authToken = process.env.TURSO_AUTH_TOKEN;

const db = createClient({
    url,
    authToken: authToken || undefined,
});

let isInitialized = false;

// Initialize tables (using async execution)
const initDb = async () => {
    if (isInitialized) return;
    try {
        await db.execute(`
        CREATE TABLE IF NOT EXISTS settings (
            userId TEXT PRIMARY KEY,
            name TEXT DEFAULT 'User',
            theme TEXT DEFAULT 'dark'
        );
        `);

        await db.execute(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT NOT NULL,
            text TEXT NOT NULL,
            completed INTEGER DEFAULT 0,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        );
        `);

        await db.execute(`
        CREATE TABLE IF NOT EXISTS habits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT NOT NULL,
            name TEXT NOT NULL,
            completedDays TEXT DEFAULT '' 
        );
        `);

        await db.execute(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT NOT NULL,
            type TEXT NOT NULL,
            amount REAL NOT NULL,
            description TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        );
        `);

        await db.execute(`
        CREATE TABLE IF NOT EXISTS goals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT NOT NULL,
            title TEXT NOT NULL,
            progress INTEGER DEFAULT 0
        );
        `);

        await db.execute(`
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT NOT NULL,
            content TEXT DEFAULT '',
            updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
        );
        `);

        console.log('Database initialized successfully with multi-tenancy support');
        isInitialized = true;
    } catch (e) {
        console.error('Database Init Error:', e);
    }
};

// Start initialization (this is async now)
// Removed top-level auto-execution to prevent build crashes
// initDb(); 

export { initDb };
export default db;
