export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

// Simplified API - calendar sync not needed for local storage

export async function POST(request) {
    try {
        const data = await request.json();
        return NextResponse.json({ success: true, message: 'Calendar sync disabled for local storage mode' });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
