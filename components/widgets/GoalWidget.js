'use client';
import { useState, useEffect } from 'react';

export default function GoalWidget() {
    const [goal, setGoal] = useState({ id: 1, title: 'My Monthly Goal', progress: 0 });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('lifeOS_goal');
        if (saved) {
            try {
                setGoal(JSON.parse(saved));
            } catch (e) {
                console.error(e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('lifeOS_goal', JSON.stringify(goal));
        }
    }, [goal, isLoaded]);

    const updateProgress = (delta) => {
        const newProg = Math.min(100, Math.max(0, goal.progress + delta));
        setGoal({ ...goal, progress: newProg });
    };

    const updateTitle = (newTitle) => {
        setGoal({ ...goal, title: newTitle });
    };

    if (!isLoaded) return null;

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
                    placeholder="Enter goal..."
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
