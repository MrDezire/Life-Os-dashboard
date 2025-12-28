'use client';
import { useState, useEffect } from 'react';
import CalendarSync from '../CalendarSync';

export default function TaskWidget() {
    const [tasks, setTasks] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    // Load tasks from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('lifeOS_tasks');
        if (saved) {
            try {
                setTasks(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse tasks', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save tasks to localStorage whenever they change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('lifeOS_tasks', JSON.stringify(tasks));
        }
    }, [tasks, isLoaded]);

    const addTask = () => {
        if (!newItem.trim()) return;
        const newTask = {
            id: Date.now(),
            text: newItem,
            completed: false,
            createdAt: new Date().toISOString()
        };
        setTasks([newTask, ...tasks]);
        setNewItem('');
    };

    const toggle = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const remove = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const handleCalendarSync = (newTasks) => {
        // newTasks is an array of task objects
        // Merge with existing tasks avoiding duplicates? IDs are timestamps so unlikely to collide unless batch added rapidly.
        // But Google Calendar events might be re-added? Custom logic.
        // For simplicity, just append.

        // Ensure newTasks is array
        const tasksToAdd = Array.isArray(newTasks) ? newTasks : [newTasks];
        setTasks(prev => [...tasksToAdd, ...prev]);
    };

    if (!isLoaded) return null; // Avoid hydration mismatch

    return (
        <article className="bento-card task-widget glass-panel">
            <div className="card-header">
                <h3><i className="fa-solid fa-check-circle"></i> Tasks</h3>
            </div>

            <CalendarSync onSync={handleCalendarSync} />

            <div className="task-list">
                {tasks.length === 0 && <p className="empty-state">No tasks yet</p>}
                {tasks.map(task => (
                    <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggle(task.id)}
                            className="task-checkbox"
                        />
                        <span className="task-text">{task.text}</span>
                        <button className="delete-task-btn" onClick={() => remove(task.id)}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                ))}
            </div>
            <div className="add-task-input-container">
                <input
                    type="text"
                    id="new-task-input"
                    placeholder="New task..."
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                />
            </div>
        </article>
    );
}
