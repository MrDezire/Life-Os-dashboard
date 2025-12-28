import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        // Check if already seeded
        const checkHabits = await db.execute('SELECT COUNT(*) as count FROM habits');
        const habitCount = checkHabits.rows[0].count;

        if (habitCount > 0) {
            return NextResponse.json({
                message: 'Database already seeded',
                habitCount
            });
        }

        // Seed habits with the requested ones
        await db.execute({
            sql: 'INSERT INTO habits (id, name, completedDays) VALUES (?, ?, ?)',
            args: [1, 'Drink Water', '']
        });
        await db.execute({
            sql: 'INSERT INTO habits (id, name, completedDays) VALUES (?, ?, ?)',
            args: [2, 'Exercise', '']
        });
        await db.execute({
            sql: 'INSERT INTO habits (id, name, completedDays) VALUES (?, ?, ?)',
            args: [3, 'Study', '']
        });

        // Seed default goal
        await db.execute({
            sql: 'INSERT INTO goals (id, title, progress) VALUES (?, ?, ?)',
            args: [1, 'Learn React', 25]
        });

        // Seed empty notes
        await db.execute({
            sql: 'INSERT INTO notes (id, content) VALUES (?, ?)',
            args: [1, '']
        });

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully with habits: Drink Water, Exercise, Study'
        });
    } catch (e) {
        console.error('Seed error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
