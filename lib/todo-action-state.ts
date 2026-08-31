export type TodoActionState = {
  message?: string;
  fieldErrors?: {
    description?: string[];
    todoDate?: string[];
  };
};

export const initialTodoActionState: TodoActionState = {};
