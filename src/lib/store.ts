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
    frequency: string;
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
export const calculateStreak = (history: CheckInRecord[], currentDate: string): number => {
    if (history.length === 0) return 0;

    // Sort history by date descending
    const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Check if checked in today
    const todayRecord = sortedHistory.find(h => h.date === currentDate);
    let streak = todayRecord ? 1 : 0;

    // Start checking from yesterday (relative to currentDate)
    let checkDate = new Date(currentDate);
    checkDate.setDate(checkDate.getDate() - 1);

    while (true) {
        const checkDateStr = checkDate.toISOString().split('T')[0];
        const hasRecord = sortedHistory.some(h => h.date === checkDateStr);

        if (hasRecord) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
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

                        const newStreak = calculateStreak(newHistory, currentDate);

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
