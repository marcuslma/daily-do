export type TodoActionState = {
  message?: string;
  fieldErrors?: {
    description?: string[];
  };
};

export const initialTodoActionState: TodoActionState = {};
