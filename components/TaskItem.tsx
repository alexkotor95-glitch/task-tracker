"use client";

import { useState, useRef, useEffect } from "react";
import { Task, Priority } from "./TaskTracker";
import { getDueDateInfo, Category } from "@/lib/taskUtils";

interface TaskItemProps {
  task: Task;
  categories: Category[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPriorityChange: (id: string, priority: Priority) => void;
  onDueDateChange: (id: string, dueDate: string | undefined) => void;
  onCategoryChange: (id: string, categoryId: string | undefined) => void;
}

const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; dotClass: string; badgeClass: string; borderClass: string }
> = {
  high: {
    label: "Высокий",
    dotClass: "bg-red-400",
    badgeClass: "bg-red-50 text-red-500 border-red-200 hover:bg-red-100",
    borderClass: "border-l-red-400",
  },
  medium: {
    label: "Средний",
    dotClass: "bg-amber-400",
    badgeClass: "bg-amber-50 text-amber-500 border-amber-200 hover:bg-amber-100",
    borderClass: "border-l-amber-400",
  },
  low: {
    label: "Низкий",
    dotClass: "bg-blue-400",
    badgeClass: "bg-blue-50 text-blue-500 border-blue-200 hover:bg-blue-100",
    borderClass: "border-l-transparent",
  },
};

const PRIORITIES: Priority[] = ["high", "medium", "low"];

export default function TaskItem({
  task,
  categories,
  onToggle,
  onDelete,
  onPriorityChange,
  onDueDateChange,
  onCategoryChange,
}: TaskItemProps) {
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [editingDate, setEditingDate] = useState(false);
  const priorityMenuRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const cfg = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG["medium"];
  const due = getDueDateInfo(task.dueDate);

  // Close priority dropdown on outside click
  useEffect(() => {
    if (!showPriorityMenu) return;
    const handler = (e: MouseEvent) => {
      if (priorityMenuRef.current && !priorityMenuRef.current.contains(e.target as Node))
        setShowPriorityMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPriorityMenu]);

  // Focus date input when editing starts
  useEffect(() => {
    if (editingDate) dateInputRef.current?.showPicker?.();
  }, [editingDate]);

  return (
    <div
      className={`
        group relative flex items-center gap-3 pl-3 pr-4 py-3.5 rounded-xl border border-l-4
        transition-all duration-200 task-enter
        ${cfg.borderClass}
        ${task.completed
          ? "bg-gray-50 border-gray-100"
          : "bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300"
        }
      `}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? "Отметить как невыполненное" : "Отметить как выполненное"}
        className={`
          flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1
          ${task.completed
            ? "bg-emerald-500 border-emerald-500 focus:ring-emerald-400"
            : "border-gray-300 hover:border-emerald-400 focus:ring-emerald-400"
          }
        `}
      >
        {task.completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Task text */}
      <span
        className={`
          flex-1 text-sm leading-relaxed transition-all duration-200
          ${task.completed ? "text-gray-400 line-through" : "text-gray-700"}
        `}
      >
        {task.text}
      </span>

      {/* Category badge */}
      {(() => {
        const cat = categories.find((c) => c.id === task.categoryId);
        if (!cat) return null;
        return (
          <span
            className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border"
            style={{
              backgroundColor: `${cat.color}15`,
              borderColor: `${cat.color}40`,
              color: cat.color,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
            {cat.name}
          </span>
        );
      })()}

      {/* Due date badge / editor */}
      {!task.completed && (
        <div className="flex-shrink-0 relative">
          {editingDate ? (
            <input
              ref={dateInputRef}
              type="date"
              defaultValue={task.dueDate ?? ""}
              min={new Date().toISOString().split("T")[0]}
              autoFocus
              onBlur={(e) => {
                const val = e.target.value;
                onDueDateChange(task.id, val || undefined);
                setEditingDate(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setEditingDate(false);
                if (e.key === "Enter") {
                  onDueDateChange(task.id, (e.target as HTMLInputElement).value || undefined);
                  setEditingDate(false);
                }
              }}
              className="text-xs border border-blue-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200 w-32"
            />
          ) : (
            <button
              onClick={() => setEditingDate(true)}
              aria-label={task.dueDate ? `Срок: ${due.label}` : "Установить срок"}
              className={`
                flex items-center gap-1 px-2 py-1 rounded-md border text-xs transition-all duration-150
                ${due.label
                  ? `${due.badgeClass} font-medium`
                  : "border-dashed border-gray-200 text-gray-300 hover:border-gray-300 hover:text-gray-400 opacity-0 group-hover:opacity-100"
                }
              `}
            >
              <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 12 12">
                <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M4 1v2M8 1v2M1 5h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              {due.label || "Срок"}
            </button>
          )}

          {/* Clear due date */}
          {task.dueDate && !editingDate && (
            <button
              onClick={() => onDueDateChange(task.id, undefined)}
              aria-label="Убрать срок"
              className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-gray-200 hover:bg-red-400 text-gray-500 hover:text-white rounded-full items-center justify-center hidden group-hover:flex transition-all duration-150"
            >
              <svg className="w-2 h-2" fill="none" viewBox="0 0 8 8">
                <path d="M2 2l4 4M6 2L2 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Priority badge + dropdown */}
      <div className="relative flex-shrink-0" ref={priorityMenuRef}>
        <button
          onClick={() => !task.completed && setShowPriorityMenu((v) => !v)}
          disabled={task.completed}
          aria-label={`Приоритет: ${cfg.label}`}
          className={`
            flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium
            transition-all duration-150
            ${task.completed
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-default"
              : `${cfg.badgeClass} cursor-pointer`
            }
          `}
        >
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${task.completed ? "bg-gray-300" : cfg.dotClass}`} />
          {cfg.label}
        </button>

        {showPriorityMenu && (
          <div className="absolute right-0 top-full mt-1 z-10 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[130px]">
            {PRIORITIES.map((p) => {
              const c = PRIORITY_CONFIG[p];
              return (
                <button
                  key={p}
                  onClick={() => { onPriorityChange(task.id, p); setShowPriorityMenu(false); }}
                  className={`
                    w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors duration-100
                    ${task.priority === p ? "bg-gray-50 text-gray-700 font-medium" : "text-gray-600 hover:bg-gray-50"}
                  `}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dotClass}`} />
                  {c.label}
                  {task.priority === p && (
                    <svg className="w-3 h-3 ml-auto text-gray-400" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(task.id)}
        aria-label="Удалить задачу"
        className="
          flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center
          text-gray-300 hover:text-red-400 hover:bg-red-50
          opacity-0 group-hover:opacity-100 transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-red-300 focus:opacity-100
        "
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
