import { Task } from "@/components/TaskTracker";

export interface Category {
  id: string;
  name: string;
  color: string; // hex, e.g. "#3b82f6"
}

export const CATEGORY_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#14b8a6", // teal
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#6b7280", // slate
];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "personal", name: "Личные",  color: "#8b5cf6" },
  { id: "work",     name: "Рабочие", color: "#3b82f6" },
  { id: "family",   name: "Семья",   color: "#22c55e" },
];

export interface DueDateInfo {
  label: string;
  badgeClass: string;
  isUrgent: boolean;
}

export function getDueDateInfo(dueDate?: string): DueDateInfo {
  if (!dueDate) return { label: "", badgeClass: "", isUrgent: false };

  const due = new Date(dueDate + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0)
    return {
      label: `Просрочено ${Math.abs(diffDays)} дн`,
      badgeClass: "text-red-600 bg-red-50 border-red-200",
      isUrgent: true,
    };
  if (diffDays === 0)
    return {
      label: "Сегодня",
      badgeClass: "text-orange-600 bg-orange-50 border-orange-200",
      isUrgent: true,
    };
  if (diffDays === 1)
    return {
      label: "Завтра",
      badgeClass: "text-amber-600 bg-amber-50 border-amber-200",
      isUrgent: true,
    };
  if (diffDays <= 3)
    return {
      label: `Через ${diffDays} дн`,
      badgeClass: "text-amber-600 bg-amber-50 border-amber-200",
      isUrgent: true,
    };

  return {
    label: due.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }),
    badgeClass: "text-gray-400 bg-gray-50 border-gray-200",
    isUrgent: false,
  };
}

// A task is "urgent" when its due date is within 3 days (including overdue).
// Tasks without a due date are never considered urgent in the Eisenhower sense —
// urgency is strictly time-based, not importance-based.
export function isTaskUrgent(task: Task): boolean {
  if (!task.dueDate) return false;
  const due = new Date(task.dueDate + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= 3;
}
