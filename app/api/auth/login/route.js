import { NextResponse } from 'next/server';
import { db, initDB } from '@/lib/db';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        // Ensure DB schema is up to date (for new tables)
        await initDB();

        const result = await db.execute({
            sql: 'SELECT * FROM users WHERE username = ?',
            args: [username]
        });

        const user = result.rows[0];

        if (!user || !(await verifyPassword(password, user.password_hash))) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create Session
        await createSession(user.id, user.username);

        return NextResponse.json({ success: true, user: { id: user.id, username: user.username } });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
