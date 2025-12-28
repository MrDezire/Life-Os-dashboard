'use client';
import { useState, useEffect } from 'react';

export default function NotesWidget() {
    const [content, setContent] = useState('');

    useEffect(() => {
        fetch('/api/notes')
            .then(r => r.json())
            .then(d => {
                if (d && d.content !== undefined) setContent(d.content);
            })
            .catch(console.error);
    }, []);

    const handleChange = (e) => {
        setContent(e.target.value);
    };

    const save = async () => {
        await fetch('/api/notes', {
            method: 'POST',
            body: JSON.stringify({ content })
        });
    };

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
                onBlur={save}
                style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', resize: 'none', color: 'inherit', outline: 'none' }}
            ></textarea>
        </article>
    );
}
