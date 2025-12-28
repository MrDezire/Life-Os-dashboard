'use client';
import { useState, useEffect } from 'react';

export default function GoalWidget() {
    // Default fallback
    const [goal, setGoal] = useState({ id: 1, title: 'Learn React', progress: 0 });

    const fetchGoal = async () => {
        try {
            const res = await fetch('/api/goals');
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                setGoal(data[0]);
            }
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchGoal(); }, []);

    const updateProgress = async (delta) => {
        const newProg = Math.min(100, Math.max(0, goal.progress + delta));
        // Optimistic
        setGoal({ ...goal, progress: newProg });
        await fetch('/api/goals', {
            method: 'PATCH',
            body: JSON.stringify({ id: goal.id, progress: newProg })
        });
    };

    const updateTitle = (newTitle) => {
        setGoal({ ...goal, title: newTitle });
    };

    const persistTitle = async () => {
        await fetch('/api/goals', {
            method: 'PATCH',
            body: JSON.stringify({ id: goal.id, title: goal.title })
        });
    };

    return (
        <article className="bento-card goals-widget glass-panel">
            <div className="card-header">
                <h3><i className="fa-solid fa-bullseye"></i> Monthly Goal</h3>
            </div>
            <div className="goal-item">
                <input
                    type="text"
                    className="goal-title-input"
                    value={goal.title}
                    onChange={(e) => updateTitle(e.target.value)}
                    onBlur={persistTitle} // Save on blur
                />
                <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${goal.progress}%` }}></div>
                </div>
                <div className="goal-controls">
                    <button onClick={() => updateProgress(-5)}>-</button>
                    <span>{goal.progress}%</span>
                    <button onClick={() => updateProgress(5)}>+</button>
                </div>
            </div>
        </article>
    );
}
