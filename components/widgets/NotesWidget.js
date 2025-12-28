'use client';
import { useState, useEffect } from 'react';

export default function NotesWidget() {
    const [content, setContent] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('lifeOS_notes');
        if (saved) {
            setContent(saved);
        }
        setIsLoaded(true);
    }, []);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setContent(newValue);
        localStorage.setItem('lifeOS_notes', newValue);
    };

    if (!isLoaded) return null;

    return (
        <article className="bento-card notes-widget glass-panel">
            <div className="card-header">
                <h3><i className="fa-solid fa-note-sticky"></i> Quick Notes</h3>
            </div>
            <textarea
                id="notes-area"
                placeholder="Write your thoughts here..."
                value={content}
                onChange={handleChange}
                style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', resize: 'none', color: 'inherit', outline: 'none' }}
            ></textarea>
        </article>
    );
}
