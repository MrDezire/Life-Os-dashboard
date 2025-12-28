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

        // Seed habits without specifying IDs (let AUTOINCREMENT handle it)
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

        // Seed default goal
        await db.execute({
            sql: 'INSERT INTO goals (title, progress) VALUES (?, ?)',
            args: ['Learn React', 25]
        });

        // Seed empty notes
        await db.execute({
            sql: 'INSERT INTO notes (content) VALUES (?)',
            args: ['']
        });

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully with habits: Drink Water, Exercise, Study'
        });
    } catch (e) {
        console.error('Seed error:', e);
        return NextResponse.json({ error: e.message, details: e.toString() }, { status: 500 });
    }
}
