import { NextResponse } from 'next/server';
import { db, initDB } from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Ensure DB is initialized
        await initDB();

        // Check if user exists
        const existing = await db.execute({
            sql: 'SELECT * FROM users WHERE username = ?',
            args: [username]
        });

        if (existing.rows.length > 0) {
            return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
        }

        // Create user
        const hashedPassword = await hashPassword(password);
        const result = await db.execute({
            sql: 'INSERT INTO users (username, password_hash) VALUES (?, ?)',
            args: [username, hashedPassword]
        });

        const userId = Number(result.lastInsertRowid);

        // Create Session
        await createSession(userId, username);

        return NextResponse.json({ success: true, user: { id: userId, username } });

    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
