import React from 'react';
import styles from '../styles/HabitDashboard.module.css';
import { Habit, useHabitStore } from '../lib/store';

interface HabitCardProps {
    habit: Habit;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
    const checkIn = useHabitStore((state) => state.checkIn);
    const removeHabit = useHabitStore((state) => state.removeHabit);

    const today = new Date().toISOString().split('T')[0];
    const isCheckedIn = habit.completedDates.includes(today);

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div>
                    <h3 className={styles.habitName}>{habit.name}</h3>
                    <span className={`${styles.habitType} ${habit.type === 'build' ? styles.typeBuild : styles.typeBreak}`}>
                        {habit.type}
                    </span>
                </div>
                <button
                    className={styles.deleteBtn}
                    onClick={() => removeHabit(habit.id)}
                    aria-label="Delete habit"
                >
                    ✕
                </button>
            </div>

            <div className={styles.habitStats}>
                <div className={styles.streak}>
                    🔥 {habit.streak} Day Streak
                </div>
            </div>

            <div className={styles.whySection}>
                "{habit.why}"
            </div>

            <div style={{ marginTop: 'auto' }}>
                <button
                    className={styles.checkInBtn}
                    onClick={() => checkIn(habit.id)}
                    disabled={isCheckedIn}
                    style={{ width: '100%' }}
                >
                    {isCheckedIn ? 'Checked In! ✅' : 'Check In'}
                </button>
            </div>
        </div>
    );
};
