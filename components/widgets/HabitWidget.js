'use client';
import { useState, useEffect } from 'react';

export default function HabitWidget() {
    const [habits, setHabits] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [newHabitName, setNewHabitName] = useState('');
    const [showInput, setShowInput] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('lifeOS_habits');
        if (saved) {
            try {
                setHabits(JSON.parse(saved));
            } catch (e) {
                console.error(e);
            }
        } else {
            // Default habits for new users
            setHabits([
                { id: 1, name: 'Drink Water', completedDays: '' },
                { id: 2, name: 'Exercise', completedDays: '' },
                { id: 3, name: 'Read', completedDays: '' }
            ]);
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('lifeOS_habits', JSON.stringify(habits));
        }
    }, [habits, isLoaded]);

    const toggleDay = (habitId, dayIndex) => {
        setHabits(habits.map(h => {
            if (h.id !== habitId) return h;

            const days = h.completedDays ? h.completedDays.split(',') : [];
            const strIdx = String(dayIndex);
            const idx = days.indexOf(strIdx);

            if (idx > -1) {
                days.splice(idx, 1);
            } else {
                days.push(strIdx);
            }

            return { ...h, completedDays: days.join(',') };
        }));
    };

    const addHabit = () => {
        if (!newHabitName.trim()) return;
        const newHabit = {
            id: Date.now(),
            name: newHabitName,
            completedDays: ''
        };
        setHabits([...habits, newHabit]);
        setNewHabitName('');
        setShowInput(false);
    };

    const deleteHabit = (id) => {
        setHabits(habits.filter(h => h.id !== id));
    };

    const daysLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    if (!isLoaded) return null;

    return (
        <article className="bento-card habit-widget glass-panel">
            <div className="card-header">
                <h3><i className="fa-solid fa-fire"></i> Habits</h3>
                <button onClick={() => setShowInput(!showInput)} className="add-habit-btn" title="Add Habit">
                    <i className="fa-solid fa-plus"></i>
                </button>
            </div>

            {showInput && (
                <div className="add-habit-input">
                    <input
                        autoFocus
                        type="text"
                        value={newHabitName}
                        onChange={(e) => setNewHabitName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addHabit()}
                        placeholder="Habit name..."
                    />
                </div>
            )}

            <div className="habits-list">
                {habits.map(habit => (
                    <div key={habit.id} className="habit-item">
                        <div className="habit-info">
                            <span>{habit.name}</span>
                            <button className="delete-habit-mini" onClick={() => deleteHabit(habit.id)}>×</button>
                        </div>
                        <div className="habit-checks">
                            {daysLabels.map((day, i) => {
                                const isActive = habit.completedDays.split(',').includes(String(i));
                                return (
                                    <span
                                        key={i}
                                        className={`habit-check ${isActive ? 'active' : ''}`}
                                        onClick={() => toggleDay(habit.id, i)}
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
