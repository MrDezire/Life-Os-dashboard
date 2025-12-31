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

    const updateProgress = async (newProgress) => {
        if (newProgress < 0) newProgress = 0;
        if (newProgress > target) newProgress = target;

        setProgress(newProgress);

        try {
            // Check if we need to POST first (create) or PATCH
            await fetch('/api/goals', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ progress: newProgress })
            });
        } catch (e) { console.error(e); }
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
                    <h4>{title}</h4>
                    <div className="progress-container">
                        <div className="progress-bar-bg">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${(progress / target) * 100}%` }}
                            ></div>
                        </div>
                        <span className="progress-text">{progress} / {target}</span>
                    </div>
                    <div className="progress-controls">
                        <button onClick={() => updateProgress(progress - 1)}>-</button>
                        <button onClick={() => updateProgress(progress + 1)}>+</button>
                    </div>
                </div>
            )}

            <style jsx>{`
                .goal-edit-form {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .goal-edit-form input {
                    padding: 8px;
                    border-radius: 6px;
                    border: 1px solid var(--glass-border);
                    background: rgba(255,255,255,0.05);
                    color: var(--text-main);
                }
                .goal-edit-form button {
                    padding: 8px;
                    background: var(--neon-cyan);
                    color: black;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                }
                .goal-display h4 {
                    margin-bottom: 12px;
                    font-size: 1.1rem;
                }
                .progress-container {
                    margin-bottom: 12px;
                }
                .progress-bar-bg {
                    width: 100%;
                    height: 10px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 5px;
                    overflow: hidden;
                    margin-bottom: 4px;
                }
                .progress-bar-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--neon-cyan), var(--neon-blue));
                    transition: width 0.3s;
                }
                .progress-text {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                }
                .progress-controls {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                }
                .progress-controls button {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: 1px solid var(--glass-border);
                    background: rgba(255,255,255,0.05);
                    color: var(--text-main);
                    cursor: pointer;
                }
                .edit-goal-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                }
            `}</style>
        </article>
    );
}
