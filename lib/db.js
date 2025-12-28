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
            id INTEGER PRIMARY KEY CHECK (id = 1),
            name TEXT DEFAULT 'User',
            theme TEXT DEFAULT 'dark'
        );
        `);
        await db.execute(`INSERT OR IGNORE INTO settings (id) VALUES (1);`);

        await db.execute(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            completed INTEGER DEFAULT 0,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        );
        `);

        await db.execute(`
        CREATE TABLE IF NOT EXISTS habits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            completedDays TEXT DEFAULT '' 
        );
        `);
        // Seed default habits
        await db.execute(`INSERT OR IGNORE INTO habits (id, name, completedDays) VALUES (1, 'Drink Water', '');`);
        await db.execute(`INSERT OR IGNORE INTO habits (id, name, completedDays) VALUES (2, 'Exercise', '');`);

        await db.execute(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            amount REAL NOT NULL,
            description TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        );
        `);

        await db.execute(`
        CREATE TABLE IF NOT EXISTS goals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            progress INTEGER DEFAULT 0
        );
        `);
        await db.execute(`INSERT OR IGNORE INTO goals (id, title, progress) VALUES (1, 'Learn React', 25);`);

        await db.execute(`
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT DEFAULT '',
            updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
        );
        `);
        await db.execute(`INSERT OR IGNORE INTO notes (id, content) VALUES (1, '');`);
    } catch (e) {
        console.error('Database Init Error:', e);
    }
};

// Start initialization (this is async now)
initDb();

export default db;
