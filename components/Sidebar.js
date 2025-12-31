'use client';
import { useSettings } from '@/components/Providers';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';

export default function Sidebar() {
    const { toggleTheme, theme } = useSettings();
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(() => router.push('/sign-in'));
    };

    return (
        <>
            <button
                className="mobile-menu-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
            >
                <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </button>

            <aside className={`sidebar glass-panel ${isOpen ? 'open' : ''}`}>
                <div className="profile-section">
                    <div className="avatar-container">
                        <img src={user?.imageUrl || "/logo.png"} alt="User" className="simple-avatar" />
                    </div>
                    <div className="user-info">
                        <span className="user-name">{user?.firstName || user?.username || 'User'}</span>
                    </div>
                </div>

                <div className="actions-group">
                    <nav className="nav-menu">
                        <Link
                            href="/"
                            className="nav-link-btn"
                            title="Dashboard"
                            onClick={() => setIsOpen(false)} // Close on click
                        >
                            <i className="fa-solid fa-layer-group"></i>
                            <span>Dashboard</span>
                        </Link>
                        <Link
                            href="/analytics"
                            className="nav-link-btn"
                            title="Analytics"
                            onClick={() => setIsOpen(false)}
                        >
                            <i className="fa-solid fa-chart-line"></i>
                            <span>Analytics</span>
                        </Link>
                    </nav>

                    <div className="bottom-actions">
                        <div className="theme-toggle-container">
                            <button onClick={toggleTheme} className="theme-btn" title="Toggle Theme">
                                <i className={`fa-solid ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`}></i>
                            </button>
                        </div>
                        <button onClick={handleLogout} className="logout-btn" title="Logout">
                            <i className="fa-solid fa-right-from-bracket"></i>
                        </button>
                    </div>
                </div>
            </aside>
            <style jsx>{`
                .user-name {
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: var(--text-main);
                }
                .bottom-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                }
                .logout-btn {
                    width: 45px;
                    height: 45px;
                    border-radius: 12px;
                    background: rgba(255, 71, 87, 0.1);
                    border: 1px solid rgba(255, 71, 87, 0.3);
                    color: #ff4757;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.1rem;
                    transition: all 0.2s;
                }
                .logout-btn:hover {
                    background: rgba(255, 71, 87, 0.2);
                    transform: translateY(-2px);
                }
            `}</style>
        </>
    );
}
