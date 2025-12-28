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

        // Check if settings exist, if not create default
        const settingsCheck = await db.execute('SELECT COUNT(*) as count FROM settings');
        if (settingsCheck.rows[0].count === 0) {
            await db.execute(`INSERT INTO settings (id, name, theme) VALUES (1, 'Basha', 'dark');`);
        }

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

        // Seed default habits if table is empty
        const habitsCheck = await db.execute('SELECT COUNT(*) as count FROM habits');
        if (habitsCheck.rows[0].count === 0) {
            await db.execute({
                sql: 'INSERT INTO habits (name, completedDays) VALUES (?, ?)',
                args: ['Drink Water', '']
            });
            await db.execute({
                sql: 'INSERT INTO habits (name, completedDays) VALUES (?, ?)',
                args: ['Exercise', '']
            });
            await db.execute({
                sql: 'INSERT INTO habits (name, completedDays) VALUES (?, ?)',
                args: ['Study', '']
            });
        }

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

        // Seed default goal if table is empty
        const goalsCheck = await db.execute('SELECT COUNT(*) as count FROM goals');
        if (goalsCheck.rows[0].count === 0) {
            await db.execute({
                sql: 'INSERT INTO goals (title, progress) VALUES (?, ?)',
                args: ['Learn React', 25]
            });
        }

        await db.execute(`
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT DEFAULT '',
            updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
        );
        `);

        // Seed default note if table is empty
        const notesCheck = await db.execute('SELECT COUNT(*) as count FROM notes');
        if (notesCheck.rows[0].count === 0) {
            await db.execute({
                sql: 'INSERT INTO notes (content) VALUES (?)',
                args: ['']
            });
        }

        console.log('Database initialized successfully');
    } catch (e) {
        console.error('Database Init Error:', e);
    }
};

// Start initialization (this is async now)
initDb();

export default db;
