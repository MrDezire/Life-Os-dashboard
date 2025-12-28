'use client';
import { useState, useEffect } from 'react';

export default function QuoteWidget() {
    const [quote, setQuote] = useState({ content: "The only way to do great work is to love what you do.", author: "Steve Jobs" });
    const [loading, setLoading] = useState(true);

    const fetchQuote = async () => {
        setLoading(true);
        try {
            // Using a free quotes API
            const res = await fetch('https://api.quotable.io/random?tags=inspirational,wisdom');
            if (res.ok) {
                const data = await res.json();
                setQuote({ content: data.content, author: data.author });
            }
        } catch (e) {
            console.error("Failed to fetch quote", e);
            // Fallback quotes in case API fails
            const fallbacks = [
                { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
                { content: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
                { content: "Everything you can imagine is real.", author: "Pablo Picasso" }
            ];
            setQuote(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuote();
    }, []);

    return (
        <article className="bento-card quote-widget glass-panel">
            <div className="quote-content">
                <i className="fa-solid fa-quote-left quote-icon"></i>
                <p className="quote-text">
                    {loading ? "Finding inspiration..." : quote.content}
                </p>
                <div className="quote-footer">
                    <span className="quote-author">— {loading ? "..." : quote.author}</span>
                    <button onClick={fetchQuote} className="refresh-btn" title="New Quote">
                        <i className={`fa-solid fa-arrows-rotate ${loading ? 'fa-spin' : ''}`}></i>
                    </button>
                </div>
            </div>

            <style jsx>{`
                .quote-widget {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0));
                }
                .quote-content {
                    position: relative;
                    padding: 10px;
                    text-align: center;
                    width: 100%;
                }
                .quote-icon {
                    font-size: 1.5rem;
                    color: var(--neon-cyan);
                    opacity: 0.5;
                    margin-bottom: 8px;
                    display: block;
                }
                .quote-text {
                    font-size: 1rem;
                    font-style: italic;
                    color: var(--text-main);
                    line-height: 1.4;
                    margin-bottom: 12px;
                    min-height: 60px; /* Prevent jump */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .quote-footer {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    border-top: 1px solid rgba(255,255,255,0.1);
                    padding-top: 8px;
                }
                .quote-author {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    font-weight: 500;
                }
                .refresh-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    font-size: 0.9rem;
                    padding: 4px;
                    transition: color 0.2s;
                }
                .refresh-btn:hover {
                    color: var(--neon-cyan);
                }
            `}</style>
        </article>
    );
}
