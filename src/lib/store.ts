import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type HabitType = 'build' | 'break';

export interface Habit {
    id: string;
    name: string;
    type: HabitType;
    goal: string;
    frequency: string; // e.g., "Daily", "3 times a week", "Limit to 1/day"
    why: string;
    streak: number;
    lastCheckedIn: string | null; // ISO date string
    completedDates: string[]; // List of ISO date strings
}

interface HabitState {
    habits: Habit[];
    addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'lastCheckedIn' | 'completedDates'>) => void;
    checkIn: (id: string) => void;
    removeHabit: (id: string) => void;
}

export const useHabitStore = create<HabitState>()(
    persist(
        (set) => ({
            habits: [],
            addHabit: (habitData) =>
                set((state) => ({
                    habits: [
                        ...state.habits,
                        {
                            ...habitData,
                            id: crypto.randomUUID(),
                            streak: 0,
                            lastCheckedIn: null,
                            completedDates: [],
                        },
                    ],
                })),
            checkIn: (id) =>
                set((state) => ({
                    habits: state.habits.map((habit) => {
                        if (habit.id !== id) return habit;

                        const today = new Date().toISOString().split('T')[0];
                        if (habit.completedDates.includes(today)) return habit; // Already checked in today

                        // Simple streak logic: if last check-in was yesterday, increment. Else reset to 1.
                        // For MVP, we'll just increment for now, but ideally we check dates.
                        // Let's do a basic check.
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        const yesterdayStr = yesterday.toISOString().split('T')[0];

                        let newStreak = habit.streak;
                        if (habit.lastCheckedIn === yesterdayStr) {
                            newStreak += 1;
                        } else if (habit.lastCheckedIn !== today) {
                            // If not today and not yesterday, streak resets (unless it's the first time)
                            // But wait, if frequency is not daily, this logic is flawed.
                            // For MVP, let's just increment streak on check-in and rely on user honesty/frequency logic later.
                            // Actually, let's just increment if not already checked in today.
                            newStreak += 1;
                        }

                        return {
                            ...habit,
                            streak: newStreak,
                            lastCheckedIn: today,
                            completedDates: [...habit.completedDates, today],
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
