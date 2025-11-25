import React, { useState } from 'react';
import styles from '../styles/HabitDashboard.module.css';
import { Habit, useHabitStore, calculateStreak } from '../lib/store';

interface HabitCardProps {
    habit: Habit;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
    const checkIn = useHabitStore((state) => state.checkIn);
    const removeHabit = useHabitStore((state) => state.removeHabit);
    const simulatedDate = useHabitStore((state) => state.simulatedDate);

    const [isCheckInOpen, setIsCheckInOpen] = useState(false);
    const [checkInValue, setCheckInValue] = useState('');

    const isCheckedIn = habit.history.some(h => h.date === simulatedDate);
    const currentStreak = calculateStreak(habit.history, simulatedDate, habit.frequencyDays || 1);

    // Frequency enforcement logic
    const canCheckIn = () => {
        if (isCheckedIn) return false;
        if (!habit.lastCheckedIn) return true;

        const lastDate = new Date(habit.lastCheckedIn);
        const currentDate = new Date(simulatedDate);
        const diffTime = currentDate.getTime() - lastDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // If frequency is 1 (daily), we can check in if diffDays >= 1 (i.e. it's a new day)
        // If frequency is 3, we can check in if diffDays >= 3.
        return diffDays >= (habit.frequencyDays || 1);
    };

    const isCheckInAllowed = canCheckIn();
    const daysUntilCheckIn = habit.lastCheckedIn
        ? (habit.frequencyDays || 1) - Math.ceil((new Date(simulatedDate).getTime() - new Date(habit.lastCheckedIn).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    const handleCheckInSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const value = parseFloat(checkInValue);
        if (isNaN(value)) return;

        checkIn(habit.id, value);
        setIsCheckInOpen(false);
        setCheckInValue('');
    };

    const handleBooleanCheckIn = () => {
        checkIn(habit.id, 1); // 1 represents "true" or "done"
    };

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

            <div className={styles.habitDetails}>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Goal:</span> {habit.goal}
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Frequency:</span> {habit.frequency}
                </div>
            </div>

            <div className={styles.habitStats}>
                <div className={styles.streak}>
                    🔥 {currentStreak}x Streak
                </div>
            </div>

            <div className={styles.whySection}>
                "{habit.why}"
            </div>

            <div style={{ marginTop: 'auto' }}>
                {habit.trackingType === 'metric' ? (
                    isCheckInOpen ? (
                        <form onSubmit={handleCheckInSubmit} className={styles.checkInForm}>
                            <input
                                type="number"
                                value={checkInValue}
                                onChange={(e) => setCheckInValue(e.target.value)}
                                placeholder="Enter value..."
                                className={styles.checkInInput}
                                autoFocus
                                required
                            />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button type="submit" className={styles.checkInSubmitBtn}>✓</button>
                                <button
                                    type="button"
                                    onClick={() => setIsCheckInOpen(false)}
                                    className={styles.checkInCancelBtn}
                                >
                                    ✕
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            className={styles.checkInBtn}
                            onClick={() => setIsCheckInOpen(true)}
                            disabled={!isCheckInAllowed}
                            style={{ width: '100%', opacity: !isCheckInAllowed ? 0.5 : 1, cursor: !isCheckInAllowed ? 'not-allowed' : 'pointer' }}
                            title={!isCheckInAllowed && isCheckedIn ? "Already checked in" : !isCheckInAllowed ? `Next check-in in ${daysUntilCheckIn} day(s)` : ""}
                        >
                            {isCheckedIn ? 'Checked In! ✅' : !isCheckInAllowed ? `Wait ${daysUntilCheckIn}d` : 'Check In'}
                        </button>
                    )
                ) : (
                    <button
                        className={styles.checkInBtn}
                        onClick={handleBooleanCheckIn}
                        disabled={!isCheckInAllowed}
                        style={{ width: '100%', opacity: !isCheckInAllowed ? 0.5 : 1, cursor: !isCheckInAllowed ? 'not-allowed' : 'pointer' }}
                        title={!isCheckInAllowed && isCheckedIn ? "Already checked in" : !isCheckInAllowed ? `Next check-in in ${daysUntilCheckIn} day(s)` : ""}
                    >
                        {isCheckedIn ? 'Checked In! ✅' : !isCheckInAllowed ? `Wait ${daysUntilCheckIn}d` : 'Check In'}
                    </button>
                )}
            </div>
        </div>
    );
};
