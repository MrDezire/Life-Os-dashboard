'use client';
import { useState, useEffect } from 'react';

export default function FinanceWidget() {
    const [transactions, setTransactions] = useState([]);
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await fetch('/api/finance');
            if (res.ok) {
                const data = await res.json();
                setTransactions(data);
                calcTotals(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const calcTotals = (data) => {
        let inc = 0, exp = 0;
        data.forEach(t => {
            if (t.type === 'income') inc += t.amount;
            else exp += t.amount;
        });
        setIncome(inc);
        setExpense(exp);
    };

    const addTx = async (type) => {
        const amountStr = prompt(`Enter ${type} amount in ₹:`);
        if (!amountStr) return;
        const amount = parseFloat(amountStr);
        if (isNaN(amount)) return;

        // Optimistic
        const tempTx = {
            id: Date.now(),
            type,
            amount,
            description: 'Manual Entry',
            date: new Date().toISOString()
        };
        const newList = [tempTx, ...transactions];
        setTransactions(newList);
        calcTotals(newList);

        try {
            const res = await fetch('/api/finance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, amount, category: 'General', description: 'Manual Entry' })
            });
            const data = await res.json();
            if (data.success) {
                // Update ID
                setTransactions(prev => prev.map(t => t.id === tempTx.id ? { ...t, id: data.id } : t));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const resetFinances = async () => {
        const confirmed = confirm('Are you sure you want to reset all finance data? This cannot be undone.');
        if (!confirmed) return;

        setTransactions([]);
        setIncome(0);
        setExpense(0);

        try {
            await fetch('/api/finance', { method: 'DELETE' });
        } catch (e) { console.error(e); }
    };

    if (loading) return <div className="bento-card finance-widget glass-panel">Loading Finance...</div>;

    return (
        <article className="bento-card finance-widget glass-panel">
            <div className="card-header">
                <h3><i className="fa-solid fa-wallet"></i> Finance</h3>
                <button
                    onClick={resetFinances}
                    className="reset-btn"
                    title="Reset all finance data"
                >
                    <i className="fa-solid fa-rotate-right"></i>
                </button>
            </div>
            <div className="finance-summary">
                <div className="finance-item income">
                    <span className="label">Income</span>
                    <div className="amount-wrapper" onClick={() => addTx('income')} style={{ cursor: 'pointer' }} title="Click to add Income">
                        <span className="currency">₹</span>
                        <span className="finance-value">{income}</span>
                        <i className="fa-solid fa-plus" style={{ fontSize: '0.8em', marginLeft: '8px', color: 'var(--neon-cyan)' }}></i>
                    </div>
                </div>
                <div className="finance-item expense">
                    <span className="label">Expenses</span>
                    <div className="amount-wrapper" onClick={() => addTx('expense')} style={{ cursor: 'pointer' }} title="Click to add Expense">
                        <span className="currency">₹</span>
                        <span className="finance-value">{expense}</span>
                        <i className="fa-solid fa-plus" style={{ fontSize: '0.8em', marginLeft: '8px', color: '#ff4757' }}></i>
                    </div>
                </div>
                <div className="finance-item balance">
                    <span className="label">Balance</span>
                    <span className="amount">₹{income - expense}</span>
                </div>
            </div>

            <style jsx>{`
                .reset-btn {
                    background: rgba(255, 71, 87, 0.1);
                    border: 1px solid rgba(255, 71, 87, 0.3);
                    color: #ff4757;
                    padding: 6px 10px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 0.9rem;
                }
                .reset-btn:hover {
                    background: rgba(255, 71, 87, 0.2);
                    transform: rotate(180deg);
                }
            `}</style>
        </article>
    );
}
