'use client';
import { useState, useEffect } from 'react';

export default function HabitWidget() {
    const [habits, setHabits] = useState([]);

    const fetchHabits = async () => {
        try {
            const res = await fetch('/api/habits');
            const data = await res.json();
            if (Array.isArray(data)) setHabits(data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchHabits(); }, []);

    const toggleDay = async (habitId, dayIndex, currentString) => {
        // Parse current string
        const days = currentString && currentString.length > 0 ? currentString.split(',') : [];
        const strIdx = String(dayIndex);
        const idx = days.indexOf(strIdx);

        if (idx > -1) {
            days.splice(idx, 1);
        } else {
            days.push(strIdx);
        }

        const newString = days.join(',');

        // Optimistic update
        setHabits(habits.map(h => h.id === habitId ? { ...h, completedDays: newString } : h));

        await fetch('/api/habits', {
            method: 'PATCH',
            body: JSON.stringify({ id: habitId, completedDays: newString })
        });
    };

    const daysLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
        <article className="bento-card habit-widget glass-panel">
            <div className="card-header">
                <h3><i className="fa-solid fa-fire"></i> Habits</h3>
            </div>
            <div className="habits-list">
                {habits.map(habit => (
                    <div key={habit.id} className="habit-item">
                        <span>{habit.name}</span>
                        <div className="habit-checks">
                            {daysLabels.map((day, i) => {
                                const isActive = habit.completedDays.split(',').includes(String(i));
                                return (
                                    <span
                                        key={i}
                                        className={`habit-check ${isActive ? 'active' : ''}`}
                                        onClick={() => toggleDay(habit.id, i, habit.completedDays)}
                                    >
                                        {day}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </article>
    );
}
