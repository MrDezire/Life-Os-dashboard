'use client';
import { useSettings } from '@/components/Providers';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TaskWidget from '@/components/widgets/TaskWidget';
import HabitWidget from '@/components/widgets/HabitWidget';
import FinanceWidget from '@/components/widgets/FinanceWidget';
import MusicWidget from '@/components/widgets/MusicWidget';
import GoalWidget from '@/components/widgets/GoalWidget';
import WeatherWidget from '@/components/widgets/WeatherWidget';
import NotesWidget from '@/components/widgets/NotesWidget';
import PomodoroWidget from '@/components/widgets/PomodoroWidget';

export default function Home() {
    const { name } = useSettings();
    const [time, setTime] = useState(null); // Fix hydration mismatch by starting null

    useEffect(() => {
        setTime(new Date()); // Set on client
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getGreeting = (d) => {
        const h = d.getHours();
        if (h < 12) return 'Good Morning';
        if (h < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    if (!time) return <div className="loading-screen">Loading Life OS...</div>;

    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                <header className="header-section">
                    <div className="greeting-container">
                        <h1 className="greeting">{getGreeting(time)}, <span>{name}</span></h1>
                        <h2 className="sub-greeting">Ready to conquer the day?</h2>
                    </div>
                    <div className="time-widget glass-panel">
                        <h2 id="current-time">
                            {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </h2>
                        <p id="current-date">
                            {time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>
                </header>

                <div className="bento-grid">
                    <TaskWidget />
                    <WeatherWidget />
                    <HabitWidget />
                    <FinanceWidget />
                    <GoalWidget />
                    <PomodoroWidget />
                    <NotesWidget />
                    <MusicWidget />
                </div>

                <div className="watermark">
                    made by Husenabasha 🐼
                </div>
            </main>
        </div>
    );

}
