import { createClient } from '@libsql/client';
import path from 'path';

// Connection details - handles both local and cloud
const url = process.env.TURSO_DATABASE_URL || `file:${path.join(process.cwd(), 'life-os.db')}`;
const authToken = process.env.TURSO_AUTH_TOKEN;

const db = createClient({
    url,
    authToken,
});

// Initialize tables (using async execution)
const initDb = async () => {
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
    } catch (e) {
        console.error('Database Init Error:', e);
    }
};

// Start initialization (this is async now)
initDb();

export default db;
