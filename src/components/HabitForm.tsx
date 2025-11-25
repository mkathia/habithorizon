import React, { useState } from 'react';
import styles from '../styles/HabitForm.module.css';
import { useHabitStore, HabitType, TrackingType } from '../lib/store';

export const HabitForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const addHabit = useHabitStore((state) => state.addHabit);

    const [name, setName] = useState('');
    const [type, setType] = useState<HabitType>('build');
    const [trackingType, setTrackingType] = useState<TrackingType>('boolean');
    const [goal, setGoal] = useState('');
    const [frequency, setFrequency] = useState('');
    const [why, setWhy] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !goal || !frequency || !why) return;

        addHabit({
            name,
            type,
            trackingType,
            goal,
            frequency,
            why,
        });

        // Reset form
        setName('');
        setGoal('');
        setFrequency('');
        setWhy('');
        onClose();
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Add New Habit</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="name">Habit Name</label>
                    <input
                        id="name"
                        className={styles.input}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Morning Jog"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="type">Habit Type</label>
                    <select
                        id="type"
                        className={styles.select}
                        value={type}
                        onChange={(e) => setType(e.target.value as HabitType)}
                    >
                        <option value="build">Build (Start doing)</option>
                        <option value="break">Break (Stop doing)</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Tracking Method</label>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="trackingType"
                                value="boolean"
                                checked={trackingType === 'boolean'}
                                onChange={() => setTrackingType('boolean')}
                            />
                            Simple Check-in (Yes/No)
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="trackingType"
                                value="metric"
                                checked={trackingType === 'metric'}
                                onChange={() => setTrackingType('metric')}
                            />
                            Value Tracking (e.g. Count)
                        </label>
                    </div>
                    <small style={{ color: 'var(--secondary)', display: 'block', marginTop: '0.25rem' }}>
                        {trackingType === 'boolean'
                            ? "Just a simple button to mark as done."
                            : "Enter a number value each time you check in."}
                    </small>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="goal">Goal</label>
                    <input
                        id="goal"
                        className={styles.input}
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder={type === 'build' ? "e.g. Run 5km" : "e.g. 0 cigarettes"}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="frequency">Frequency</label>
                    <input
                        id="frequency"
                        className={styles.input}
                        type="text"
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        placeholder={type === 'build' ? "e.g. Daily at 7am" : "e.g. Reduce by 1 per week"}
                        required
                    />
                    <small style={{ color: 'var(--secondary)', display: 'block', marginTop: '0.25rem' }}>
                        {type === 'build'
                            ? "How often do you want to do this?"
                            : "How will you scale down from your current habit?"}
                    </small>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="why">Your "Why" (Inspiration)</label>
                    <textarea
                        id="why"
                        className={styles.textarea}
                        value={why}
                        onChange={(e) => setWhy(e.target.value)}
                        placeholder="Remind yourself why this is important..."
                        required
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="button" onClick={onClose} style={{ flex: 1, padding: '1rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '0.5rem', cursor: 'pointer' }}>
                        Cancel
                    </button>
                    <button type="submit" className={styles.submitBtn} style={{ flex: 2 }}>
                        Create Habit
                    </button>
                </div>
            </form>
        </div>
    );
};
