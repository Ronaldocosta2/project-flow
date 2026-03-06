import { Task } from '@/data/mockData';

/**
 * Calculates the difference in days between two dates.
 */
const diffDays = (d1: Date, d2: Date) => {
    return Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * Adds days to a date.
 */
const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

/**
 * Recalculates the schedule for a list of tasks.
 * Applies predictive analysis and recalculates based on dependencies.
 */
export const recalculateSchedule = (tasks: Task[]): Task[] => {
    // Create a deep copy to avoid mutating the original array directly
    const updatedTasks = tasks.map(t => ({ ...t }));

    const taskMap = new Map(updatedTasks.map(t => [t.id, t]));
    const today = new Date(); // In a real app, might want to pass this or use a consistent today

    // 1. Predictive Analysis for in-progress tasks
    updatedTasks.forEach(task => {
        if (task.status === 'in_progress' || (task.progress > 0 && task.progress < 100)) {
            const start = new Date(task.startDate);
            const originalEnd = new Date(task.originalEndDate || task.endDate);
            const plannedDuration = Math.max(1, diffDays(start, originalEnd));
            const daysElapsed = diffDays(start, today);

            if (daysElapsed > 0) {
                // Calculate velocity (% per day)
                const velocity = task.progress / daysElapsed;

                if (velocity > 0) {
                    // Predict total days needed
                    const predictedTotalDays = Math.ceil(100 / velocity);

                    if (predictedTotalDays > plannedDuration) {
                        const predictedEnd = addDays(start, predictedTotalDays);
                        task.predictedEndDate = predictedEnd.toISOString().split('T')[0];
                        // Realistically, the end date is now the predicted one
                        task.endDate = task.predictedEndDate;
                    }
                } else if (daysElapsed >= plannedDuration) {
                    // no progress but time elapsed, delay by at least 1 day past today
                    const predictedEnd = addDays(today, plannedDuration);
                    task.predictedEndDate = predictedEnd.toISOString().split('T')[0];
                    task.endDate = task.predictedEndDate;
                }
            }
        }
    });

    // 2. Dependency Recalculation
    // Need to process tasks in order of their dependencies.
    // A simple topological sort or iterative resolution.
    let changed = true;
    let iterations = 0;
    const maxIterations = updatedTasks.length * 2; // Safeguard against circular dependencies

    while (changed && iterations < maxIterations) {
        changed = false;
        iterations++;

        updatedTasks.forEach(task => {
            if (task.dependencies && task.dependencies.length > 0) {
                let maxDependencyEnd = new Date(task.startDate); // At least the current start date or initial
                let depFound = false;

                task.dependencies.forEach(depId => {
                    const depTask = taskMap.get(depId);
                    if (depTask) {
                        const depEnd = new Date(depTask.endDate);
                        if (depEnd > maxDependencyEnd) {
                            maxDependencyEnd = depEnd;
                            depFound = true;
                        }
                    }
                });

                if (depFound) {
                    const currentStart = new Date(task.startDate);
                    // If dependencies force a later start date
                    if (maxDependencyEnd > currentStart) {
                        const duration = Math.max(1, diffDays(currentStart, new Date(task.endDate)));

                        // Pad 1 day after dependency ends
                        const newStart = addDays(maxDependencyEnd, 1);
                        const newEnd = addDays(newStart, duration);

                        task.startDate = newStart.toISOString().split('T')[0];
                        task.endDate = newEnd.toISOString().split('T')[0];

                        // If it pushes past original end date, set predicted end date to show the delay
                        if (!task.predictedEndDate) {
                            const originalEnd = new Date(task.originalEndDate || task.endDate);
                            if (newEnd > originalEnd) {
                                task.predictedEndDate = task.endDate;
                            }
                        } else {
                            task.predictedEndDate = task.endDate;
                        }

                        changed = true;
                    }
                }
            }
        });
    }

    return updatedTasks;
};
