'use client';
import { useState, useEffect } from 'react';

export default function NotesWidget() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await fetch('/api/notes');
            if (res.ok) {
                const data = await res.json();
                setContent(data.content);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const saveNote = async () => {
        setSaving(true);
        try {
            await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });
        } catch (e) { console.error(e); }
        finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="bento-card notes-widget glass-panel">Loading Notes...</div>;

    return (
        <article className="bento-card notes-widget glass-panel">
            <div className="card-header">
                <h3><i className="fa-solid fa-note-sticky"></i> Quick Notes</h3>
                {saving && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Saving...</span>}
            </div>
            <textarea
                id="notes-area"
                placeholder="Write your thoughts here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={saveNote}
                style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', resize: 'none', color: 'inherit', outline: 'none' }}
            ></textarea>
        </article>
    );
}
