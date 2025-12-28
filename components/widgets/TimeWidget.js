'use client';
import { useState, useEffect } from 'react';

export default function TimeWidget() {
    const [time, setTime] = useState(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!time) {
        // Render a placeholder or empty div to avoid hydration mismatch
        return <div className="time-widget glass-panel" style={{ height: '90px' }}></div>;
    }

    return (
        <div className="time-widget glass-panel">
            <h2 id="current-time">
                {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </h2>
            <p id="current-date">
                {time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
        </div>
    );
}
