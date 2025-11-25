import React from 'react';
import { useHabitStore } from '../lib/store';

export const DevControls: React.FC = () => {
    const simulatedDate = useHabitStore((state) => state.simulatedDate);
    const setSimulatedDate = useHabitStore((state) => state.setSimulatedDate);

    const changeDate = (days: number) => {
        const date = new Date(simulatedDate);
        date.setDate(date.getDate() + days);
        setSimulatedDate(date.toISOString().split('T')[0]);
    };

    return (
        <div style={{
            background: '#333',
            color: '#fff',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            fontSize: '0.9rem'
        }}>
            <span>🔧 Dev Controls:</span>
            <button onClick={() => changeDate(-1)} style={{ cursor: 'pointer', padding: '0.25rem 0.5rem' }}>
                ← Prev Day
            </button>
            <span style={{ fontWeight: 'bold' }}>{simulatedDate}</span>
            <button onClick={() => changeDate(1)} style={{ cursor: 'pointer', padding: '0.25rem 0.5rem' }}>
                Next Day →
            </button>
            <button onClick={() => setSimulatedDate(new Date().toISOString().split('T')[0])} style={{ cursor: 'pointer', padding: '0.25rem 0.5rem', marginLeft: '0.5rem' }}>
                Reset to Today
            </button>
        </div>
    );
};
