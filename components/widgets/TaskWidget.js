'use client';
import { useState, useEffect } from 'react';
import CalendarSync from '../CalendarSync';

export default function TaskWidget() {
    const [tasks, setTasks] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch tasks from API on mount
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await fetch('/api/tasks');
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
            }
        } catch (e) {
            console.error('Failed to fetch tasks', e);
        } finally {
            setLoading(false);
        }
    };

    const addTask = async (textOverride) => {
        const text = textOverride || newItem;
        if (!text.trim()) return;

        // Optimistic update
        const tempId = Date.now();
        const newTask = { id: tempId, text: text, completed: false };
        setTasks([newTask, ...tasks]);
        if (!textOverride) setNewItem('');

        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, completed: false })
            });
            const data = await res.json();
            if (data.success) {
                // Update with real ID
                setTasks(prev => prev.map(t => t.id === tempId ? { ...t, id: data.id } : t));
            }
        } catch (e) {
            console.error('Failed to save task', e);
        }
    };

    const toggle = async (id, currentStatus) => {
        // Optimistic
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

        try {
            await fetch('/api/tasks', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, completed: !currentStatus })
            });
        } catch (e) {
            console.error(e);
        }
    };

    const remove = async (id) => {
        // Optimistic
        setTasks(tasks.filter(t => t.id !== id));

        try {
            await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
        } catch (e) {
            console.error(e);
        }
    };

    const handleCalendarSync = (newTasks) => {
        if (Array.isArray(newTasks)) {
            newTasks.forEach(t => addTask(t.summary || t.text)); // Adjust based on obj shape
        } else {
            addTask(newTasks.text);
        }
    };

    if (loading) return <div className="bento-card task-widget glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Tasks...</div>;

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
                            onChange={() => toggle(task.id, task.completed)}
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
