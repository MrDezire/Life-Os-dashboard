import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await initDB();
        return NextResponse.json({ message: 'Database initialized successfully (Tables Created)!' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to init DB: ' + error.message }, { status: 500 });
    }
}
