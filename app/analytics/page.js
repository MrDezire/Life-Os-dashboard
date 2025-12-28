'use client';
import { useSettings } from '@/components/Providers';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';

export default function AnalyticsPage() {
    const { name } = useSettings();
    const [stats, setStats] = useState({
        completedTasks: 0,
        pendingTasks: 0,
        totalIncome: 0,
        totalExpense: 0,
        habitStreak: 0
    });

    // Mock fetching stats - in a real app, this would hit an API
    useEffect(() => {
        const fetchStats = async () => {
            // Simulating API latency / data aggregation
            // In a real implementation, you'd fetch from /api/analytics
            // For now, let's grab from what we can or mock reasonable numbers for the demo
            // Real implementation would require a dedicated endpoint.

            // Let's rely on basic mocked data that "looks" real for the UI structure first as per user request
            setStats({
                completedTasks: 12,
                pendingTasks: 5,
                totalIncome: 45000,
                totalExpense: 12000,
                habitStreak: 7
            });
        };
        fetchStats();
    }, []);

    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                <header className="header-section">
                    <div className="greeting-container">
                        <h1 className="greeting">Analytics</h1>
                        <h2 className="sub-greeting">Track your progress, {name}</h2>
                    </div>
                </header>

                <div className="analytics-grid">
                    {/* Productivity Card */}
                    <article className="bento-card glass-panel productivity-card">
                        <h3><i className="fa-solid fa-check-double"></i> Productivity</h3>
                        <div className="stat-row">
                            <div className="stat-item">
                                <span className="stat-label">Tasks Done</span>
                                <span className="stat-value highlight-cyan">{stats.completedTasks}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Pending</span>
                                <span className="stat-value">{stats.pendingTasks}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Completion Rate</span>
                                <span className="stat-value">{Math.round((stats.completedTasks / (stats.completedTasks + stats.pendingTasks)) * 100)}%</span>
                            </div>
                        </div>
                        <div className="chart-placeholder">
                            {/* Visual Bar representation */}
                            <div className="bar-chart">
                                <div className="bar filled" style={{ height: '60%' }}></div>
                                <div className="bar filled" style={{ height: '80%' }}></div>
                                <div className="bar filled" style={{ height: '40%' }}></div>
                                <div className="bar filled" style={{ height: '90%' }}></div>
                                <div className="bar filled active" style={{ height: '75%' }}></div>
                                <div className="bar" style={{ height: '50%' }}></div>
                                <div className="bar" style={{ height: '60%' }}></div>
                            </div>
                            <span className="chart-label">Weekly Activity</span>
                        </div>
                    </article>

                    {/* Finance Card */}
                    <article className="bento-card glass-panel finance-card">
                        <h3><i className="fa-solid fa-wallet"></i> Financial Overview</h3>
                        <div className="finance-breakdown">
                            <div className="finance-pill income">
                                <span>Income</span>
                                <strong>₹{stats.totalIncome.toLocaleString('en-IN')}</strong>
                            </div>
                            <div className="finance-pill expense">
                                <span>Expenses</span>
                                <strong>₹{stats.totalExpense.toLocaleString('en-IN')}</strong>
                            </div>
                            <div className="finance-pill savings">
                                <span>Savings</span>
                                <strong>₹{(stats.totalIncome - stats.totalExpense).toLocaleString('en-IN')}</strong>
                            </div>
                        </div>
                        <div className="progress-ring-container">
                            <div className="mock-ring" style={{ background: `conic-gradient(var(--neon-cyan) 70%, transparent 0)` }}>
                                <div className="inner-ring">
                                    <span>70%</span>
                                    <small>Saved</small>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Habits Card */}
                    <article className="bento-card glass-panel habit-stats-card">
                        <h3><i className="fa-solid fa-fire"></i> Habit Streak</h3>
                        <div className="streak-display">
                            <i className="fa-solid fa-trophy"></i>
                            <span className="streak-num">{stats.habitStreak} Days</span>
                        </div>
                        <p>You're on fire! Keep it up.</p>
                    </article>
                </div>
            </main>

            <style jsx>{`
                .analytics-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 24px;
                }
                .productivity-card { grid-column: span 2; }
                .finance-card { grid-column: span 1; grid-row: span 2; }
                .habit-stats-card { grid-column: span 2; }

                .stat-row {
                    display: flex;
                    justify-content: space-around;
                    margin: 20px 0;
                }
                .stat-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .stat-label { font-size: 0.8rem; color: var(--text-muted); }
                .stat-value { font-size: 1.5rem; font-weight: 700; color: var(--text-main); }
                .highlight-cyan { color: var(--neon-cyan); text-shadow: 0 0 10px rgba(0,243,255,0.3); }

                .chart-placeholder {
                    background: rgba(0,0,0,0.2);
                    border-radius: 12px;
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }
                .bar-chart {
                    display: flex;
                    gap: 8px;
                    align-items: flex-end;
                    height: 100px;
                }
                .bar {
                    width: 20px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 4px;
                }
                .bar.filled { background: var(--text-muted); }
                .bar.active { background: var(--neon-cyan); box-shadow: 0 0 10px var(--neon-cyan); }
                .chart-label { font-size: 0.7rem; color: var(--text-muted); }

                .finance-breakdown {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 24px;
                }
                .finance-pill {
                    padding: 12px;
                    border-radius: 12px;
                    background: rgba(255,255,255,0.05);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .finance-pill.income { border-left: 3px solid #00ff9d; }
                .finance-pill.expense { border-left: 3px solid #ff4757; }
                .finance-pill.savings { border-left: 3px solid var(--neon-cyan); }
                
                .progress-ring-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 24px;
                }
                .mock-ring {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }
                .inner-ring {
                    width: 90px;
                    height: 90px;
                    background: var(--bg-color);
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .inner-ring span { font-size: 1.5rem; font-weight: 700; }
                .inner-ring small { font-size: 0.8rem; color: var(--text-muted); }

                .streak-display {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    font-size: 2rem;
                    color: #ff9f43;
                    margin: 16px 0;
                }

                @media (max-width: 1024px) {
                    .analytics-grid { grid-template-columns: 1fr; }
                    .productivity-card, .finance-card, .habit-stats-card { grid-column: span 1; }
                }
            `}</style>
        </div>
    );
}
