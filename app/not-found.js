export const dynamic = 'force-dynamic';

export default function NotFound() {
    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: 'white', fontFamily: 'sans-serif' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
            <p>Page Not Found</p>
            <a href="/" style={{ marginTop: '2rem', color: '#00f3ff', textDecoration: 'none', border: '1px solid #00f3ff', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                Go Home
            </a>
        </div>
    );
}
