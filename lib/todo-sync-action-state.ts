export type TodoSyncActionState = {
  message?: string;
  status?: "error" | "success";
};

export const initialTodoSyncActionState: TodoSyncActionState = {};
