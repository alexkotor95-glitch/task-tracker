"use client";

import { useState, useRef, useEffect } from "react";
import { Category, CATEGORY_COLORS } from "@/lib/taskUtils";

interface CategoryStripProps {
  categories: Category[];
  selectedId: string | null;
  taskCounts: Record<string, number>; // categoryId → active task count
  onSelect: (id: string | null) => void;
  onAdd: (name: string, color: string) => void;
  onDelete: (id: string) => void;
}

export default function CategoryStrip({
  categories,
  selectedId,
  taskCounts,
  onSelect,
  onAdd,
  onDelete,
}: CategoryStripProps) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(CATEGORY_COLORS[5]); // blue default
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (creating) nameInputRef.current?.focus();
  }, [creating]);

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    onAdd(name, newColor);
    setNewName("");
    setNewColor(CATEGORY_COLORS[5]);
    setCreating(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
    if (e.key === "Escape") {
      setCreating(false);
      setNewName("");
    }
  };

  return (
    <div className="mb-4">
      {/* Chips row */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* "All" chip */}
        <button
          onClick={() => onSelect(null)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border ${
            selectedId === null
              ? "bg-gray-800 text-white border-gray-800"
              : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          Все
          {selectedId === null && (
            <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {Object.values(taskCounts).reduce((s, c) => s + c, 0)}
            </span>
          )}
        </button>

        {/* Category chips */}
        {categories.map((cat) => {
          const isSelected = selectedId === cat.id;
          const count = taskCounts[cat.id] ?? 0;
          return (
            <div key={cat.id} className="group relative">
              <button
                onClick={() => onSelect(isSelected ? null : cat.id)}
                className={`flex items-center gap-1.5 pl-2.5 pr-2 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border ${
                  isSelected
                    ? "text-white border-transparent"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
                style={isSelected ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: isSelected ? "rgba(255,255,255,0.7)" : cat.color }}
                />
                {cat.name}
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>

              {/* Delete on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(cat.id);
                  if (selectedId === cat.id) onSelect(null);
                }}
                aria-label={`Удалить категорию ${cat.name}`}
                className="absolute -top-1 -right-1 w-4 h-4 bg-gray-400 hover:bg-red-400 text-white rounded-full items-center justify-center hidden group-hover:flex transition-colors duration-150 z-10"
              >
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 10 10">
                  <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          );
        })}

        {/* Add button */}
        <button
          onClick={() => setCreating((v) => !v)}
          aria-label="Добавить категорию"
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
            creating
              ? "bg-gray-800 text-white border-gray-800"
              : "bg-white text-gray-400 border-dashed border-gray-300 hover:text-gray-600 hover:border-gray-400"
          }`}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
            <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {!creating && <span>Добавить</span>}
        </button>
      </div>

      {/* Inline create form */}
      {creating && (
        <div className="mt-2 p-3 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col gap-2.5">
          <input
            ref={nameInputRef}
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Название категории..."
            maxLength={30}
            className="text-sm text-gray-700 placeholder-gray-300 focus:outline-none"
          />

          {/* Color picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Цвет:</span>
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORY_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewColor(color)}
                  className="w-5 h-5 rounded-full transition-transform duration-100 hover:scale-110 focus:outline-none"
                  style={{ backgroundColor: color }}
                  aria-label={color}
                >
                  {newColor === color && (
                    <svg className="w-full h-full text-white p-0.5" fill="none" viewBox="0 0 20 20">
                      <path d="M5 10l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="flex-1 py-1.5 rounded-lg bg-gray-800 text-white text-xs font-medium hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
            >
              Создать
            </button>
            <button
              onClick={() => { setCreating(false); setNewName(""); }}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 transition-all duration-150"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
