import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

export const dynamic = 'force-dynamic';

export async function GET() {
    const url = process.env.TURSO_DATABASE_URL;
    const token = process.env.TURSO_AUTH_TOKEN;

    const debugInfo = {
        hasUrl: !!url,
        urlProtocol: url ? url.split(':')[0] : 'N/A',
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        nodeEnv: process.env.NODE_ENV
    };

    try {
        if (!url) throw new Error('Missing Database URL');

        // If using libsql protocol, token is mandatory
        if (url.startsWith('libsql') && !token) {
            throw new Error('Using libsql:// URL but TURSO_AUTH_TOKEN is missing');
        }

        const client = createClient({
            url,
            authToken: token
        });

        const start = Date.now();
        await client.execute('SELECT 1');
        const duration = Date.now() - start;

        return NextResponse.json({
            status: 'Success',
            message: 'Connected to Database Successfully!',
            latency: `${duration}ms`,
            envCheck: debugInfo
        });
    } catch (error) {
        return NextResponse.json({
            status: 'Connection Failed',
            error: error.message,
            envCheck: debugInfo
        }, { status: 500 });
    }
}
