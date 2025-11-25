import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type HabitType = 'build' | 'break';
export type TrackingType = 'boolean' | 'metric';

export interface CheckInRecord {
    date: string; // ISO date string YYYY-MM-DD
    value: number;
}

export interface Habit {
    id: string;
    name: string;
    type: HabitType;
    trackingType: TrackingType;
    goal: string;
    frequencyDays: number; // Interval in days (1 = daily, 2 = every other day, etc.)
    frequency: string; // Display string
    why: string;
    streak: number;
    lastCheckedIn: string | null;
    history: CheckInRecord[];
}

interface HabitState {
    habits: Habit[];
    simulatedDate: string; // ISO date string YYYY-MM-DD
    setSimulatedDate: (date: string) => void;
    addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'lastCheckedIn' | 'history'>) => void;
    checkIn: (id: string, value: number) => void;
    removeHabit: (id: string) => void;
}

// Helper to calculate streak
export const calculateStreak = (history: CheckInRecord[], currentDate: string, frequencyDays: number): number => {
    if (history.length === 0) return 0;

    // Sort history by date descending
    const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Filter out future check-ins relative to currentDate
    const validHistory = sortedHistory.filter(h => h.date <= currentDate);
    if (validHistory.length === 0) return 0;

    const mostRecent = validHistory[0];
    const mostRecentDate = new Date(mostRecent.date);
    const current = new Date(currentDate);

    // Calculate days since last check-in
    const diffTime = Math.abs(current.getTime() - mostRecentDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // If we haven't checked in within the frequency window, streak is broken.
    // Note: diffDays = 0 means we checked in today.
    // If frequency is 1 (daily), and diffDays is 1 (yesterday), streak is kept.
    // If frequency is 1, and diffDays is 2 (missed a day), streak is broken.
    // So if diffDays > frequencyDays, streak is broken.
    if (diffDays > frequencyDays) return 0;

    let streak = 1;
    let previousDate = mostRecentDate;

    for (let i = 1; i < validHistory.length; i++) {
        const entryDate = new Date(validHistory[i].date);
        const gapTime = Math.abs(previousDate.getTime() - entryDate.getTime());
        const gapDays = Math.ceil(gapTime / (1000 * 60 * 60 * 24));

        // The gap between check-ins must be <= frequencyDays to maintain streak
        if (gapDays <= frequencyDays) {
            streak++;
            previousDate = entryDate;
        } else {
            break;
        }
    }

    return streak;
};

export const useHabitStore = create<HabitState>()(
    persist(
        (set, get) => ({
            habits: [],
            simulatedDate: new Date().toISOString().split('T')[0],
            setSimulatedDate: (date) => set({ simulatedDate: date }),
            addHabit: (habitData) =>
                set((state) => ({
                    habits: [
                        ...state.habits,
                        {
                            ...habitData,
                            id: crypto.randomUUID(),
                            streak: 0,
                            lastCheckedIn: null,
                            history: [],
                        },
                    ],
                })),
            checkIn: (id, value) =>
                set((state) => ({
                    habits: state.habits.map((habit) => {
                        if (habit.id !== id) return habit;

                        const currentDate = state.simulatedDate;
                        const alreadyCheckedIn = habit.history.some(h => h.date === currentDate);

                        let newHistory = habit.history;
                        if (alreadyCheckedIn) {
                            newHistory = habit.history.map(h => h.date === currentDate ? { ...h, value } : h);
                        } else {
                            newHistory = [...habit.history, { date: currentDate, value }];
                        }

                        // Use the habit's frequencyDays (default to 1 if undefined for migration safety)
                        const freq = habit.frequencyDays || 1;
                        const newStreak = calculateStreak(newHistory, currentDate, freq);

                        return {
                            ...habit,
                            streak: newStreak,
                            lastCheckedIn: currentDate,
                            history: newHistory,
                        };
                    }),
                })),
            removeHabit: (id) =>
                set((state) => ({
                    habits: state.habits.filter((h) => h.id !== id),
                })),
        }),
        {
            name: 'habit-storage',
        }
    )
);
