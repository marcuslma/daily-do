import { useState } from "react";
import { useLocalStorage } from "./use-local-storage";

interface ManualSortState {
  enabled: boolean;
  order: string[]; // Array of todo IDs in custom order
}

export function useManualSort() {
  const [sortState, setSortState] = useLocalStorage<ManualSortState>(
    "manual-sort",
    {
      enabled: true,
      order: [],
    }
  );

  const [isDragging, setIsDragging] = useState(false);

  const enableManualSort = () => {
    setSortState((prev) => ({ ...prev, enabled: true }));
  };

  const disableManualSort = () => {
    setSortState((prev) => ({ ...prev, enabled: false }));
  };

  const toggleManualSort = () => {
    setSortState((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  const updateOrder = (newOrder: string[]) => {
    setSortState((prev) => ({ ...prev, order: newOrder }));
  };

  const setOrder = (todoIds: string[]) => {
    setSortState((prev) => ({ ...prev, order: todoIds }));
  };

  const prependToOrder = (todoId: string) => {
    setSortState((prev) => ({
      ...prev,
      order: [todoId, ...prev.order],
    }));
  };

  const removeFromOrder = (todoId: string) => {
    setSortState((prev) => ({
      ...prev,
      order: prev.order.filter((id) => id !== todoId),
    }));
  };

  return {
    enabled: sortState.enabled,
    order: sortState.order,
    isDragging,
    setIsDragging,
    enableManualSort,
    disableManualSort,
    toggleManualSort,
    updateOrder,
    setOrder,
    prependToOrder,
    removeFromOrder,
  };
}
