import { useCallback } from "react";
import type { Category } from "@/types/todo";
import { useLocalStorage } from "./use-local-storage";

const DEFAULT_CATEGORIES: Category[] = [
  { id: "work", name: "Trabalho", color: "#3b82f6", icon: "💼" },
  { id: "personal", name: "Pessoal", color: "#10b981", icon: "🏠" },
  { id: "study", name: "Estudos", color: "#8b5cf6", icon: "📚" },
  { id: "health", name: "Saúde", color: "#ef4444", icon: "❤️" },
  { id: "shopping", name: "Compras", color: "#f59e0b", icon: "🛒" },
];

export function useCategories() {
  const [categories, setCategories] = useLocalStorage<Category[]>(
    "daily-do-categories",
    DEFAULT_CATEGORIES
  );

  const addCategory = useCallback(
    (name: string, color: string, icon?: string) => {
      const newCategory: Category = {
        id: crypto.randomUUID(),
        name,
        color,
        icon,
      };
      setCategories([...categories, newCategory]);
      return newCategory;
    },
    [categories, setCategories]
  );

  const updateCategory = useCallback(
    (id: string, updates: Partial<Omit<Category, "id">>) => {
      setCategories(
        categories.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
      );
    },
    [categories, setCategories]
  );

  const deleteCategory = useCallback(
    (id: string) => {
      setCategories(categories.filter((cat) => cat.id !== id));
    },
    [categories, setCategories]
  );

  const getCategoryById = useCallback(
    (id: string) => categories.find((cat) => cat.id === id),
    [categories]
  );

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
  };
}
