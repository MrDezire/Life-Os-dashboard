'use client';
import { useState, useEffect } from 'react';

export default function GoalWidget() {
    const [title, setTitle] = useState(''); // Default empty
    const [progress, setProgress] = useState(0);
    const [target, setTarget] = useState(100);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGoal();
    }, []);

    const fetchGoal = async () => {
        try {
            const res = await fetch('/api/goals');
            if (res.ok) {
                const data = await res.json();
                if (data) {
                    setTitle(data.title);
                    setProgress(data.progress);
                    setTarget(data.target);
                    // If DB has data, we are in non-editing mode. If empty, maybe prompt editing?
                    if (!data.title) setIsEditing(true);
                } else {
                    setIsEditing(true);
                    setTitle('Monthly Goal');
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const updateProgress = async (val) => {
        const newProgress = Math.max(0, Math.min(target, Number(progress) + val));
        setProgress(newProgress);

        try {
            await fetch('/api/goals', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ progress: newProgress })
            });
        } catch (e) {
            console.error('Failed to update progress:', e);
        }
    };

    const saveGoal = async () => {
        setIsEditing(false);
        try {
            await fetch('/api/goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, target, progress })
            });
        } catch (e) { console.error(e); }
    };

    if (loading) return <div className="bento-card goal-widget glass-panel">Loading Goal...</div>;

    return (
        <article className="bento-card goal-widget glass-panel">
            <div className="card-header">
                <h3><i className="fa-solid fa-bullseye"></i> Goal</h3>
                <button onClick={() => setIsEditing(!isEditing)} className="edit-goal-btn">
                    <i className="fa-solid fa-pen"></i>
                </button>
            </div>

            {isEditing ? (
                <div className="goal-edit-form">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Goal Title"
                    />
                    <input
                        type="number"
                        value={target}
                        onChange={(e) => setTarget(Number(e.target.value))}
                        placeholder="Target (e.g. 100)"
                    />
                    <button onClick={saveGoal}>Save</button>
                </div>
            ) : (
                <div className="goal-display">
                    <h4>{title || 'Set your goal'}</h4>
                    <div className="progress-container">
                        <div className="progress-bar-bg">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${target > 0 ? (progress / target) * 100 : 0}%` }}
                            ></div>
                        </div>
                        <div className="progress-meta">
                            <span className="progress-text">{progress} / {target}</span>
                            <span className="percent-text">{target > 0 ? Math.round((progress / target) * 100) : 0}%</span>
                        </div>
                    </div>
                    <div className="progress-controls">
                        <button onClick={() => updateProgress(-1)} aria-label="Decrease">
                            <i className="fa-solid fa-minus"></i>
                        </button>
                        <button onClick={() => updateProgress(1)} aria-label="Increase">
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
            )}
        </article>
    );
}
