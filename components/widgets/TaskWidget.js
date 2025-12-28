'use client';
import { useState, useEffect } from 'react';
import CalendarSync from '@/components/CalendarSync';

export default function TaskWidget() {
    const [tasks, setTasks] = useState([]);
    const [newItem, setNewItem] = useState('');

    const fetchTasks = async () => {
        try {
            const res = await fetch('/api/tasks');
            const data = await res.json();
            if (Array.isArray(data)) setTasks(data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => { fetchTasks(); }, []);

    const addTask = async () => {
        if (!newItem.trim()) return;
        const res = await fetch('/api/tasks', {
            method: 'POST',
            body: JSON.stringify({ text: newItem })
        });
        const todo = await res.json();
        setTasks([todo, ...tasks]);
        setNewItem('');
    };

    const toggle = async (id, completed) => {
        await fetch('/api/tasks', {
            method: 'PATCH',
            body: JSON.stringify({ id, completed: !completed })
        });
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !completed } : t));
    };

    const remove = async (id) => {
        await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
        setTasks(tasks.filter(t => t.id !== id));
    };

    return (
        <article className="bento-card task-widget glass-panel">
            <div className="card-header">
                <h3><i className="fa-solid fa-check-circle"></i> Tasks</h3>
            </div>
            <div className="task-list">
                {tasks.map(task => (
                    <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                        <input
                            type="checkbox"
                            className="task-checkbox"
                            checked={task.completed}
                            onChange={() => toggle(task.id, task.completed)}
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
            <CalendarSync onSync={fetchTasks} />
        </article>
    );
}
