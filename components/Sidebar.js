'use client';
import { useSettings } from '@/components/Providers';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Sidebar() {
    const { name, saveName, toggleTheme, theme } = useSettings();



    const [isOpen, setIsOpen] = useState(false);

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
                        <img src="/logo.png" alt="Logo" className="simple-avatar" />
                    </div>
                    <input
                        type="text"
                        className="editable-name"
                        value={name}
                        onChange={(e) => saveName(e.target.value)}
                        placeholder="Your Name"
                    />
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

                    <div className="theme-toggle-container">
                        <button onClick={toggleTheme} className="theme-btn" title="Toggle Theme">
                            <i className={`fa-solid ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`}></i>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
