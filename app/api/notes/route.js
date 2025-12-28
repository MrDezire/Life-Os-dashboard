export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

// Simplified API - data is managed client-side in localStorage

export async function GET() {
    return NextResponse.json({ content: '' });
}

export async function POST(request) {
    try {
        const data = await request.json();
        return NextResponse.json({ success: true, ...data });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const data = await request.json();
        return NextResponse.json({ success: true, ...data });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
