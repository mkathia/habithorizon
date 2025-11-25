import React, { useState, useEffect } from 'react';
import styles from '../styles/HabitDashboard.module.css';
import { useHabitStore } from '../lib/store';
import { HabitCard } from './HabitCard';
import { HabitForm } from './HabitForm';

export const HabitDashboard: React.FC = () => {
    const habits = useHabitStore((state) => state.habits);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Hydration fix for zustand persist
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.header}>
                <h1 className={styles.title}>Habit Horizon</h1>
                <p className={styles.subtitle}>Build the life you dream of, one small step at a time.</p>
            </header>

            {isFormOpen ? (
                <HabitForm onClose={() => setIsFormOpen(false)} />
            ) : (
                <button
                    className={styles.checkInBtn}
                    onClick={() => setIsFormOpen(true)}
                    style={{ marginBottom: '2rem', width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                >
                    + Add New Habit
                </button>
            )}

            <div className={styles.habitList}>
                {habits.length === 0 && !isFormOpen ? (
                    <div className={styles.emptyState}>
                        <h3>No habits tracked yet</h3>
                        <p>Start your journey by adding a new habit above.</p>
                    </div>
                ) : (
                    habits.map((habit) => (
                        <HabitCard key={habit.id} habit={habit} />
                    ))
                )}
            </div>
        </div>
    );
};
