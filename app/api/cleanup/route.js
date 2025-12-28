import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        // Get all habits
        const habitsResult = await db.execute('SELECT * FROM habits ORDER BY id');
        const habits = habitsResult.rows;

        // Find duplicates by name
        const seen = new Set();
        const duplicateIds = [];

        for (const habit of habits) {
            if (seen.has(habit.name)) {
                duplicateIds.push(habit.id);
            } else {
                seen.add(habit.name);
            }
        }

        // Delete duplicates
        for (const id of duplicateIds) {
            await db.execute({
                sql: 'DELETE FROM habits WHERE id = ?',
                args: [id]
            });
        }

        return NextResponse.json({
            success: true,
            message: `Removed ${duplicateIds.length} duplicate habits`,
            duplicatesRemoved: duplicateIds.length
        });
    } catch (e) {
        console.error('Cleanup error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
