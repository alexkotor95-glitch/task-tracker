"use client";

import { useState, useEffect, useRef } from "react";
import TaskItem from "./TaskItem";
import EisenhowerMatrix from "./EisenhowerMatrix";
import CategoryStrip from "./CategoryStrip";
import { Category, DEFAULT_CATEGORIES, CATEGORY_COLORS } from "@/lib/taskUtils";

export type Priority = "high" | "medium" | "low";
export type ViewMode = "list" | "matrix";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;     // "YYYY-MM-DD"
  categoryId?: string;
  createdAt: number;
}

type Filter = "all" | "active" | "completed";

const STORAGE_KEY = "task-tracker-tasks";
const CATEGORIES_KEY = "task-tracker-categories";
const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const pd = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (pd !== 0) return pd;
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });
}

const TODAY = new Date().toISOString().split("T")[0];

// ─── Category dropdown in form ───────────────────────────────────────────────

interface CategoryDropdownProps {
  categories: Category[];
  value: string | undefined;
  onChange: (id: string | undefined) => void;
}

function CategoryDropdown({ categories, value, onChange }: CategoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = categories.find((c) => c.id === value);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all duration-150 ${
          selected
            ? "border-transparent text-white"
            : "border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300"
        }`}
        style={selected ? { backgroundColor: selected.color } : {}}
      >
        {selected ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            {selected.name}
          </>
        ) : (
          <>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
              <path d="M2 3h8M2 6h5M2 9h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Категория
          </>
        )}
        <svg className="w-2.5 h-2.5 opacity-60" fill="none" viewBox="0 0 10 10">
          <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[150px]">
          <button
            onClick={() => { onChange(undefined); setOpen(false); }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors ${
              !value ? "bg-gray-50 text-gray-700 font-medium" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-gray-300" />
            Без категории
            {!value && <svg className="w-3 h-3 ml-auto text-gray-400" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </button>

          {categories.length > 0 && <div className="my-1 border-t border-gray-100" />}

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { onChange(cat.id); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors ${
                value === cat.id ? "bg-gray-50 text-gray-700 font-medium" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
              {cat.name}
              {value === cat.id && <svg className="w-3 h-3 ml-auto text-gray-400" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TaskTracker() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [input, setInput] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [newCategoryId, setNewCategoryId] = useState<string | undefined>();
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        const parsed: Task[] = JSON.parse(storedTasks);
        setTasks(parsed.map((t) => ({ ...t, priority: (t.priority ?? "medium") as Priority })));
      }

      const storedCats = localStorage.getItem(CATEGORIES_KEY);
      setCategories(storedCats ? JSON.parse(storedCats) : DEFAULT_CATEGORIES);
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, mounted]);

  useEffect(() => {
    if (mounted) localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories, mounted]);

  // ── Task CRUD ──
  const addTask = () => {
    const text = input.trim();
    if (!text) return;
    setTasks((prev) => [
      { id: crypto.randomUUID(), text, completed: false, priority: newPriority, dueDate: newDueDate || undefined, categoryId: newCategoryId, createdAt: Date.now() },
      ...prev,
    ]);
    setInput("");
    setNewDueDate("");
    inputRef.current?.focus();
  };

  const toggleTask = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const deleteTask = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const changePriority = (id: string, priority: Priority) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, priority } : t)));

  const changeDueDate = (id: string, dueDate: string | undefined) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, dueDate } : t)));

  const changeCategory = (id: string, categoryId: string | undefined) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, categoryId } : t)));

  const clearCompleted = () => setTasks((prev) => prev.filter((t) => !t.completed));

  // ── Category CRUD ──
  const addCategory = (name: string, color: string) => {
    const next = CATEGORY_COLORS[(categories.length) % CATEGORY_COLORS.length];
    setCategories((prev) => [...prev, { id: crypto.randomUUID(), name, color: color || next }]);
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setTasks((prev) => prev.map((t) => (t.categoryId === id ? { ...t, categoryId: undefined } : t)));
    if (selectedCategoryId === id) setSelectedCategoryId(null);
  };

  // ── Derived state ──
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = totalCount - completedCount;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const activeTasks = tasks.filter((t) => !t.completed);

  // Task counts per category (active only)
  const taskCounts: Record<string, number> = {};
  for (const cat of categories) {
    taskCounts[cat.id] = activeTasks.filter((t) => t.categoryId === cat.id).length;
  }

  const filteredTasks = sortTasks(
    tasks.filter((t) => {
      const matchesStatus = filter === "all" ? true : filter === "active" ? !t.completed : t.completed;
      const matchesCategory = selectedCategoryId == null || t.categoryId === selectedCategoryId;
      return matchesStatus && matchesCategory;
    })
  );

  const matrixTasks = activeTasks.filter(
    (t) => selectedCategoryId == null || t.categoryId === selectedCategoryId
  );

  const priorityOptions: { value: Priority; label: string; activeClass: string; dotClass: string }[] = [
    { value: "high",   label: "Высокий", activeClass: "bg-red-50 border-red-300 text-red-600",     dotClass: "bg-red-400"   },
    { value: "medium", label: "Средний", activeClass: "bg-amber-50 border-amber-300 text-amber-600", dotClass: "bg-amber-400" },
    { value: "low",    label: "Низкий",  activeClass: "bg-blue-50 border-blue-300 text-blue-500",   dotClass: "bg-blue-400"  },
  ];

  const filterButtons: { label: string; value: Filter; count: number }[] = [
    { label: "Все",        value: "all",       count: totalCount       },
    { label: "Активные",   value: "active",    count: activeCount      },
    { label: "Выполненные",value: "completed", count: completedCount   },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col items-center px-4 py-12">
      <div className={`w-full transition-all duration-300 ${viewMode === "matrix" ? "max-w-2xl" : "max-w-lg"}`}>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-gray-800 tracking-tight mb-1">Мои задачи</h1>
          <p className="text-sm text-gray-400">
            {totalCount === 0 ? "Добавьте первую задачу" : `Выполнено ${completedCount} из ${totalCount}`}
          </p>
        </div>

        {/* Progress bar */}
        {totalCount > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>{Math.round(progress)}% выполнено</span>
              <span>{activeCount} осталось</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Input form */}
        <div className="mb-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex gap-2 p-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="Новая задача..."
              className="flex-1 px-3 py-2.5 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none"
            />
            <button
              onClick={addTask}
              disabled={!input.trim()}
              className="px-4 py-2.5 rounded-xl bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-150 flex items-center gap-1.5 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="hidden sm:inline">Добавить</span>
            </button>
          </div>

          {/* Date + Priority + Category */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 pb-3">
            {/* Date */}
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 14 14">
                <rect x="1" y="2.5" width="12" height="10.5" rx="2" stroke="currentColor" strokeWidth="1.2" />
                <path d="M5 1v3M9 1v3M1 6h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                min={TODAY}
                className="text-xs text-gray-500 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-150 cursor-pointer"
              />
              {newDueDate && (
                <button onClick={() => setNewDueDate("")} className="text-gray-300 hover:text-gray-500 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
                    <path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>

            <div className="w-px h-4 bg-gray-200" />

            {/* Priority */}
            <div className="flex gap-1.5">
              {priorityOptions.map(({ value, label, activeClass, dotClass }) => (
                <button
                  key={value}
                  onClick={() => setNewPriority(value)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all duration-150 ${
                    newPriority === value ? activeClass : "border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${newPriority === value ? dotClass : "bg-gray-300"}`} />
                  {label}
                </button>
              ))}
            </div>

            {categories.length > 0 && <div className="w-px h-4 bg-gray-200" />}

            {/* Category */}
            {categories.length > 0 && (
              <CategoryDropdown
                categories={categories}
                value={newCategoryId}
                onChange={setNewCategoryId}
              />
            )}
          </div>
        </div>

        {/* View toggle + Filters */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl flex-shrink-0">
            <button
              onClick={() => setViewMode("list")}
              aria-label="Режим списка"
              title="Список"
              className={`p-1.5 rounded-lg transition-all duration-150 ${viewMode === "list" ? "bg-white shadow-sm text-gray-800" : "text-gray-400 hover:text-gray-600"}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("matrix")}
              aria-label="Матрица Эйзенхауэра"
              title="Матрица Эйзенхауэра"
              className={`p-1.5 rounded-lg transition-all duration-150 ${viewMode === "matrix" ? "bg-white shadow-sm text-gray-800" : "text-gray-400 hover:text-gray-600"}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="9" y="9" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>

          {viewMode === "list" ? (
            <div className="flex-1 flex gap-1 p-1 bg-gray-100 rounded-xl">
              {filterButtons.map(({ label, value, count }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center justify-center gap-1.5 ${
                    filter === value ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {label}
                  {count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === value ? "bg-gray-100 text-gray-600" : "bg-gray-200 text-gray-500"}`}>
                      {count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-xl">
              <span className="text-sm font-medium text-gray-600">Матрица Эйзенхауэра</span>
              <span className="text-xs text-gray-400">· только активные</span>
            </div>
          )}
        </div>

        {/* Category strip */}
        <CategoryStrip
          categories={categories}
          selectedId={selectedCategoryId}
          taskCounts={taskCounts}
          onSelect={setSelectedCategoryId}
          onAdd={addCategory}
          onDelete={deleteCategory}
        />

        {/* Content */}
        {viewMode === "list" ? (
          <div className="flex flex-col gap-2">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-3">
                  {filter === "completed" ? "🎉" : filter === "active" ? "✓" : "📋"}
                </div>
                <p className="text-sm">
                  {filter === "completed" ? "Нет выполненных задач" : filter === "active" ? "Все задачи выполнены!" : "Список задач пуст"}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  categories={categories}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onPriorityChange={changePriority}
                  onDueDateChange={changeDueDate}
                  onCategoryChange={changeCategory}
                />
              ))
            )}
          </div>
        ) : (
          <EisenhowerMatrix
            tasks={matrixTasks}
            categories={categories}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onPriorityChange={changePriority}
            onDueDateChange={changeDueDate}
          />
        )}

        {/* Footer */}
        {completedCount > 0 && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearCompleted}
              className="text-xs text-gray-400 hover:text-red-400 transition-colors duration-150 py-1 px-2 rounded-lg hover:bg-red-50"
            >
              Очистить выполненные ({completedCount})
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="text-center text-[10px] text-gray-300 mt-4">v1.0 · Task Tracker</p>
    </div>
  );
}
