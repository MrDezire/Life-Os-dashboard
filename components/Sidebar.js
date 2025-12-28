'use client';
import { useSettings } from '@/components/Providers';
import Link from 'next/link';

export default function Sidebar() {
    const { name, saveName, toggleTheme, theme } = useSettings();

    return (
        <aside className="sidebar glass-panel">
            <div className="profile-section">
                <div className="avatar-container">
                    <img src={`https://ui-avatars.com/api/?name=${name}&background=random`} alt="Profile" />
                </div>
                <input
                    type="text"
                    className="editable-name"
                    value={name}
                    onChange={(e) => saveName(e.target.value)}
                />
            </div>

            <nav className="nav-menu">
                <Link href="/" className="nav-item">
                    <i className="fa-solid fa-layer-group"></i> <span>Dashboard</span>
                </Link>
                <Link href="/analytics" className="nav-item">
                    <i className="fa-solid fa-chart-line"></i> <span>Analytics</span>
                </Link>
            </nav>

            <div className="theme-toggle-container">
                <button onClick={toggleTheme} className="theme-btn">
                    <i className={`fa-solid ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`}></i>
                </button>
            </div>
        </aside>
    );
}
