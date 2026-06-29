import { Task } from '../types';

/**
 * Calculates the Panic Index for a task.
 * Formula: Panic Index = (Estimated Effort / Time Remaining) * Energy Multiplier * 100
 * Ranges from 0 to 100. If overdue and not completed, returns 100.
 */
export function calculatePanicIndex(
  estimatedEffort: number, // in hours
  dueDateStr: string,
  energyLevel: 'low' | 'medium' | 'high'
): number {
  const now = new Date();
  const dueDate = new Date(dueDateStr);
  const diffMs = dueDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours <= 0) {
    return 100; // Overdue
  }

  // Energy Multiplier: If energy is low, tasks feel harder (higher panic).
  // If energy is high, tasks feel easier (lower panic).
  let energyMultiplier = 1.0;
  if (energyLevel === 'low') {
    energyMultiplier = 1.4;
  } else if (energyLevel === 'high') {
    energyMultiplier = 0.7;
  }

  const index = (estimatedEffort / diffHours) * energyMultiplier * 100;
  return Math.min(100, Math.max(0, Math.round(index)));
}

/**
 * Determines the urgency status and color class based on the Panic Index.
 */
export function getPanicStatus(panicIndex: number): {
  status: 'calm' | 'warning' | 'urgent' | 'critical';
  color: string;
  glowClass: string;
} {
  if (panicIndex >= 85) {
    return {
      status: 'critical',
      color: '#ef4444', // Crimson Red
      glowClass: 'glow-critical',
    };
  } else if (panicIndex >= 60) {
    return {
      status: 'urgent',
      color: '#f59e0b', // Amber Orange
      glowClass: 'glow-urgent',
    };
  } else if (panicIndex >= 30) {
    return {
      status: 'warning',
      color: '#eab308', // Yellow
      glowClass: 'glow-warning',
    };
  } else {
    return {
      status: 'calm',
      color: '#06b6d4', // Cyan Blue
      glowClass: 'glow-calm',
    };
  }
}
