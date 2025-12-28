'use client';
import { useState, useEffect } from 'react';

export default function HabitWidget() {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newHabitName, setNewHabitName] = useState('');
    const [showInput, setShowInput] = useState(false);

    useEffect(() => {
        fetchHabits();
    }, []);

    const fetchHabits = async () => {
        try {
            const res = await fetch('/api/habits');
            if (res.ok) {
                const data = await res.json();
                setHabits(data.length > 0 ? data : []); // Don't set defaults if DB is empty, or better: prompt user
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const toggleDay = async (habitId, dayIndex) => {
        const habit = habits.find(h => h.id === habitId);
        if (!habit) return;

        let days = habit.completed_days ? habit.completed_days.split(',') : [];
        const dayStr = dayIndex.toString();

        if (days.includes(dayStr)) {
            days = days.filter(d => d !== dayStr);
        } else {
            days.push(dayStr);
        }

        const newDaysStr = days.join(',');

        // Optimistic update
        setHabits(habits.map(h => h.id === habitId ? { ...h, completed_days: newDaysStr } : h));

        try {
            await fetch('/api/habits', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: habitId, completed_days: newDaysStr })
            });
        } catch (e) {
            console.error(e);
        }
    };

    const addHabit = async () => {
        if (!newHabitName.trim()) return;

        // Optimistic
        const tempId = Date.now();
        const newHabit = { id: tempId, name: newHabitName, completed_days: '' };
        setHabits([...habits, newHabit]);
        setNewHabitName('');
        setShowInput(false);

        try {
            const res = await fetch('/api/habits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newHabit.name })
            });
            const data = await res.json();
            if (data.success) {
                setHabits(prev => prev.map(h => h.id === tempId ? { ...h, id: data.id } : h));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const deleteHabit = async (id) => {
        if (confirm('Delete this habit?')) {
            setHabits(habits.filter(h => h.id !== id));
            try {
                await fetch(`/api/habits?id=${id}`, { method: 'DELETE' });
            } catch (e) { console.error(e); }
        }
    };

    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const today = new Date().getDay();

    if (loading) return <div className="bento-card habit-widget glass-panel">Loading Habits...</div>;

    return (
        <article className="bento-card habit-widget glass-panel">
            <div className="card-header">
                <h3><i className="fa-solid fa-fire"></i> Habits</h3>
                <button className="add-btn" onClick={() => setShowInput(!showInput)}>
                    <i className={`fa-solid ${showInput ? 'fa-minus' : 'fa-plus'}`}></i>
                </button>
            </div>

            {showInput && (
                <div className="add-habit-form">
                    <input
                        type="text"
                        value={newHabitName}
                        onChange={(e) => setNewHabitName(e.target.value)}
                        placeholder="New habit..."
                        onKeyDown={(e) => e.key === 'Enter' && addHabit()}
                        autoFocus
                    />
                    <button onClick={addHabit}>Add</button>
                </div>
            )}

            <div className="habit-list">
                {habits.map(habit => {
                    const completedDays = habit.completed_days ? habit.completed_days.split(',') : [];
                    return (
                        <div key={habit.id} className="habit-item">
                            <div className="habit-info">
                                <span className="habit-name">{habit.name}</span>
                                <button className="delete-habit-btn" onClick={() => deleteHabit(habit.id)}>×</button>
                            </div>
                            <div className="habit-days">
                                {days.map((d, i) => (
                                    <div
                                        key={i}
                                        className={`day-circle ${completedDays.includes(i.toString()) ? 'active' : ''} ${i === today ? 'today' : ''}`}
                                        onClick={() => toggleDay(habit.id, i)}
                                    >
                                        {d}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
                {habits.length === 0 && <p className="empty-state">Add a habit to get started!</p>}
            </div>

            <style jsx>{`
                .add-habit-form {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 12px;
                }
                .add-habit-form input {
                    flex: 1;
                    padding: 8px;
                    border-radius: 6px;
                    border: 1px solid var(--glass-border);
                    background: rgba(255,255,255,0.05);
                    color: white;
                }
                .add-habit-form button {
                    padding: 8px 12px;
                    background: var(--neon-cyan);
                    color: black;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                }
                .delete-habit-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 0 4px;
                    line-height: 1;
                }
                .delete-habit-btn:hover {
                    color: #ff4d4d;
                }
            `}</style>
        </article>
    );
}
