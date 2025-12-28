'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Something went wrong');
                return;
            }

            // Success -> Redirect to dashboard
            window.location.href = '/';
        } catch (err) {
            setError('Failed to connect to server');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card glass-panel">
                <div className="logo-section">
                    <img src="/logo.png" alt="Life OS" className="login-logo" />
                    <h1>Life OS</h1>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>

                    {error && <div className="error-msg">{error}</div>}

                    <div className="input-group">
                        <i className="fa-solid fa-user"></i>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <i className="fa-solid fa-lock"></i>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="cta-btn">
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <p className="toggle-text">
                    {isLogin ? "New here? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)} className="link-btn">
                        {isLogin ? 'Create Account' : 'Login'}
                    </button>
                </p>
            </div>

            <style jsx>{`
                .login-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background: var(--bg-color);
                    padding: 20px;
                }
                .login-card {
                    width: 100%;
                    max-width: 400px;
                    padding: 40px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    backdrop-filter: blur(20px);
                }
                .logo-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 30px;
                }
                .login-logo {
                    width: 80px;
                    margin-bottom: 10px;
                }
                h1 {
                    font-size: 1.5rem;
                    color: var(--neon-cyan);
                    letter-spacing: 2px;
                }
                h2 {
                    margin-bottom: 24px;
                    font-size: 1.8rem;
                }
                .auth-form {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .input-group {
                    position: relative;
                }
                .input-group i {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                }
                .input-group input {
                    width: 100%;
                    padding: 12px 12px 12px 40px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--glass-border);
                    border-radius: 8px;
                    color: white;
                    font-size: 1rem;
                }
                .input-group input:focus {
                    border-color: var(--neon-cyan);
                    outline: none;
                }
                .cta-btn {
                    margin-top: 8px;
                    padding: 12px;
                    background: linear-gradient(90deg, var(--neon-blue), var(--neon-purple));
                    border: none;
                    border-radius: 8px;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .cta-btn:hover {
                    transform: scale(1.02);
                }
                .error-msg {
                    color: #ff4d4d;
                    background: rgba(255, 77, 77, 0.1);
                    padding: 10px;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    text-align: center;
                }
                .toggle-text {
                    margin-top: 24px;
                    color: var(--text-muted);
                    font-size: 0.9rem;
                }
                .link-btn {
                    background: none;
                    border: none;
                    color: var(--neon-cyan);
                    cursor: pointer;
                    font-weight: 600;
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
}
