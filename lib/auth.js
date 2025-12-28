import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET || 'dev-secret-key-change-this-in-prod';
const key = new TextEncoder().encode(SECRET_KEY);

export async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

export async function createSession(userId, username) {
    const jwt = await new SignJWT({ userId, username })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('30d') // Long session
        .sign(key);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('session', jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
    });

    return jwt;
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) return null;

    try {
        const { payload } = await jwtVerify(session, key);
        return payload;
    } catch (error) {
        return null;
    }
}

export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}
