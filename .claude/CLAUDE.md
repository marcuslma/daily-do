# Daily Do - AI Assistant Guide

This document provides comprehensive guidance for AI assistants working on the Daily Do codebase. It covers the project structure, conventions, architecture patterns, and development workflows.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Codebase Structure](#codebase-structure)
4. [State Management](#state-management)
5. [Key Architectural Patterns](#key-architectural-patterns)
6. [Development Workflow](#development-workflow)
7. [Component Guidelines](#component-guidelines)
8. [Data Persistence](#data-persistence)
9. [Important Conventions](#important-conventions)
10. [Code Quality Standards](#code-quality-standards)

---

## Project Overview

**Daily Do** is a modern, efficient daily task management application built with React, TypeScript, and Tailwind CSS. It's a client-side application that stores all data locally in the browser using localStorage - no backend or external APIs are involved.

### Core Features

- ✅ Task management with CRUD operations
- 📋 Sub-tasks for breaking down complex tasks
- 🎯 Priority levels (low, medium, high)
- 📅 Due dates with time intervals (start/end times)
- 🏷️ Tags and categories for organization
- 🔔 Browser notifications for upcoming tasks
- 🔍 Advanced search with special syntax (priority:high, tag:work, due:today)
- ↕️ Sorting and manual drag-and-drop reordering
- 📊 Comprehensive statistics dashboard
- 📆 Calendar view with drag-and-drop
- 🔄 Recurring tasks (daily, weekly, monthly)
- 💾 Import/Export as JSON
- ⌨️ Keyboard shortcuts
- 🎨 Theme support (light/dark mode)
- 🎉 Confetti celebration on task completion

### Application Language

The user interface is in **Portuguese (pt-BR)**, but all code, comments, and documentation should be in **English**.

---

## Tech Stack

### Core Technologies

- **React 19.2.0** - UI framework with modern hooks
- **TypeScript 5.9.3** - Type-safe development
- **Vite 7.2.2** - Build tool and dev server
- **Tailwind CSS 4.1.17** - Utility-first CSS framework

### Key Libraries

- **Radix UI** - Accessible, unstyled component primitives
- **shadcn/ui** - Pre-built, customizable UI components
- **Lucide React** - Icon library
- **date-fns** - Date manipulation (with pt-BR locale)
- **Jotai** - Minimal state management (used sparingly)
- **@dnd-kit** - Drag-and-drop functionality
- **Sonner** - Toast notifications
- **canvas-confetti** - Celebration effects
- **emoji-picker-react** - Emoji selection
- **react-day-picker** - Calendar component

### Code Quality

- **Ultracite 6.3.3** - Zero-config Biome preset
- **@biomejs/biome 2.3.5** - Fast Rust-based linting and formatting

---

## Codebase Structure

```
daily-do/
├── .claude/
│   └── CLAUDE.md           # This file - AI assistant documentation
├── .github/                # GitHub workflows and configurations
├── public/                 # Static assets (favicon, etc.)
├── src/
│   ├── components/
│   │   ├── settings/       # Notification and keyboard shortcut settings
│   │   │   ├── notification-settings.tsx
│   │   │   └── keyboard-shortcuts-help.tsx
│   │   ├── theme/          # Theme provider and switcher
│   │   │   └── theme-switcher.tsx
│   │   ├── todo/           # Todo-specific components
│   │   │   ├── todo-list.tsx           # Main list with drag-and-drop
│   │   │   ├── todo-item.tsx           # Individual todo item
│   │   │   ├── todo-create-dialog.tsx  # Create new todo modal
│   │   │   ├── todo-edit-dialog.tsx    # Edit todo modal
│   │   │   ├── todo-filters.tsx        # Filter buttons and search
│   │   │   ├── todo-sort.tsx           # Sort controls
│   │   │   ├── todo-stats.tsx          # Statistics component
│   │   │   ├── todo-stats-improved.tsx # Enhanced statistics
│   │   │   └── todo-import-export.tsx  # JSON import/export
│   │   ├── ui/             # Reusable shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── calendar.tsx
│   │   │   └── ...         # 30+ UI primitives
│   │   ├── calendar-view.tsx           # Calendar visualization
│   │   └── calendar-view-draggable.tsx # Calendar with drag-and-drop
│   ├── hooks/              # Custom React hooks
│   │   ├── use-todos.ts              # Main todo state management
│   │   ├── use-local-storage.ts      # localStorage abstraction
│   │   ├── use-notifications.ts      # Browser notifications
│   │   ├── use-categories.ts         # Category management
│   │   ├── use-keyboard-shortcuts.ts # Global keyboard shortcuts
│   │   ├── use-manual-sort.ts        # Manual reordering state
│   │   └── use-confetti.ts           # Confetti effects
│   ├── lib/                # Utility functions
│   │   └── utils.ts        # cn() helper for className merging
│   ├── types/              # TypeScript type definitions
│   │   └── todo.ts         # All todo-related types
│   ├── app.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles and Tailwind imports
├── biome.jsonc             # Biome/Ultracite configuration
├── components.json         # shadcn/ui configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── README.md               # User-facing documentation
```

### Directory Responsibilities

- **`src/components/todo/`** - All todo-specific UI components
- **`src/components/ui/`** - Generic, reusable UI components (shadcn/ui)
- **`src/components/settings/`** - Application settings components
- **`src/hooks/`** - Custom React hooks for state and side effects
- **`src/types/`** - TypeScript type definitions and interfaces
- **`src/lib/`** - Utility functions and helpers

---

## State Management

### Primary State Management Pattern

This project uses **custom hooks with localStorage** as the primary state management pattern. State is NOT managed with Redux, Zustand, or global context providers. Instead, it uses:

1. **Local component state** (`useState`) for UI state
2. **Custom hooks** for shared business logic
3. **localStorage** for persistence
4. **Jotai** (sparingly) for specific global state needs

### Core Hook: `use-todos.ts`

The `useTodos` hook is the **single source of truth** for all todo data and operations. It provides:

#### State Access
```typescript
const { todos, stats } = useTodos();
```

#### CRUD Operations
```typescript
addTodo(text, priority, tags, dueDate, subTasks, emoji, description, categoryId, recurrence, customId, startTime, endTime)
updateTodo(id, updates)
deleteTodo(id)
toggleTodo(id) // Complete/uncomplete
clearCompleted()
```

#### Sub-task Operations
```typescript
addSubTask(todoId, text)
updateSubTask(todoId, subTaskId, text)
toggleSubTask(todoId, subTaskId)
deleteSubTask(todoId, subTaskId)
```

#### Filtering and Sorting
```typescript
filterTodos(filter, searchQuery) // Returns filtered array
sortTodos(todos, sortBy, direction) // Returns sorted array
```

#### Data Import/Export
```typescript
importTodos(importedTodos) // Replace all todos
```

### Statistics

The `stats` object is computed via `useMemo` and provides comprehensive metrics:

```typescript
interface TodoStats {
  // Overview
  total: number;
  completed: number;
  active: number;
  overdue: number;
  completionRate: number;
  byPriority: { high: number; medium: number; low: number };

  // Productivity over time
  productivity: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    streak: number; // Consecutive days with completed tasks
  };

  // Time management (based on startTime/endTime)
  timeManagement: {
    totalEstimatedMinutes: number;
    completedMinutes: number;
    pendingMinutes: number;
    byPriority: { high: number; medium: number; low: number };
  };

  // Categories and tags
  categoriesAndTags: {
    topCategories: Array<{ categoryId: string; count: number; completionRate: number }>;
    uncategorized: number;
    topTags: Array<{ tag: string; count: number }>;
  };

  // Deadlines and punctuality
  deadlines: {
    dueToday: number;
    dueTomorrow: number;
    dueThisWeek: number;
    onTimeRate: number;
    averageDelayDays: number;
  };

  // Subtasks
  subtasks: {
    total: number;
    completed: number;
    completionRate: number;
    tasksWithIncompleteSubtasks: number;
  };
}
```

### Other Important Hooks

- **`useLocalStorage(key, initialValue)`** - Syncs state with localStorage
- **`useCategories()`** - Manages task categories
- **`useNotifications(todos)`** - Handles browser notifications for upcoming tasks
- **`useManualSort()`** - Manages manual drag-and-drop ordering state
- **`useKeyboardShortcuts(callback)`** - Global keyboard shortcut handling
- **`useConfetti()`** - Triggers confetti celebration effects

---

## Key Architectural Patterns

### 1. Single Responsibility Components

Each component has a clear, focused responsibility:

- **`todo-list.tsx`** - Renders list of todos with drag-and-drop
- **`todo-item.tsx`** - Individual todo item display and interactions
- **`todo-filters.tsx`** - Filter buttons and search input
- **`todo-sort.tsx`** - Sort dropdown and direction toggle
- **`todo-create-dialog.tsx`** - Modal for creating new todos
- **`todo-edit-dialog.tsx`** - Modal for editing existing todos

### 2. Composition over Props Drilling

Components use composition and context where appropriate, but prefer explicit prop passing for clarity.

### 3. Custom Hooks for Logic Reuse

Business logic is extracted into custom hooks that can be tested and reused:

```typescript
// Good: Extract complex logic into a hook
const { todos, addTodo, deleteTodo } = useTodos();

// Bad: Inline complex logic in components
const [todos, setTodos] = useState([]);
const addTodo = (text) => { /* complex logic */ };
```

### 4. Type-First Development

All data structures are defined in `src/types/todo.ts` first, then implemented:

```typescript
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: Priority;
  tags: string[];
  dueDate?: Date;
  startTime?: Date;
  endTime?: Date;
  subTasks: SubTask[];
  emoji?: string;
  description?: string;
  categoryId?: string;
  recurrence?: RecurrenceConfig;
}
```

### 5. Advanced Search Syntax

The search functionality supports special syntax for power users:

- `priority:high` - Filter by priority
- `tag:work` - Filter by tag
- `overdue:true` - Show overdue tasks
- `due:today` - Due today
- `due:tomorrow` - Due tomorrow
- `due:week` - Due this week

Multiple filters can be combined with text search.

### 6. Recurring Tasks

When a recurring task is marked complete:
1. The current task is marked as completed
2. A new task is created with the next due date
3. Sub-tasks are duplicated (as incomplete)
4. The recurrence config is preserved with updated `lastCreated` timestamp

### 7. Manual Sorting with Drag-and-Drop

Users can enable "manual sort mode" which:
1. Disables automatic sorting
2. Enables drag-and-drop reordering
3. Persists custom order in localStorage
4. New tasks are prepended to the top

---

## Development Workflow

### Starting Development

```bash
npm run dev          # Start Vite dev server on http://localhost:5173
```

### Building for Production

```bash
npm run build        # TypeScript check + Vite build
npm run preview      # Preview production build
```

### Code Quality

```bash
npm run lint         # Check code with Ultracite (Biome)
npm run lint:fix     # Auto-fix code quality issues
```

**IMPORTANT:** Always run `npm run lint:fix` before committing changes. The CI pipeline enforces these standards.

### Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Run `npm run lint:fix` to ensure code quality
4. Run `npm run build` to ensure it compiles
5. Commit with descriptive messages
6. Push and create a pull request

### Path Aliases

TypeScript and Vite are configured with path aliases:

```typescript
// Use this
import { Button } from "@/components/ui/button";
import { useTodos } from "@/hooks/use-todos";
import type { Todo } from "@/types/todo";

// Instead of this
import { Button } from "../../components/ui/button";
```

---

## Component Guidelines

### shadcn/ui Components

The `src/components/ui/` directory contains shadcn/ui components. These are:

- **NOT installed via npm** - They're copied into the codebase
- **Customizable** - You can modify them directly
- **Styled with Tailwind** - Use Tailwind classes for styling
- **Based on Radix UI** - Accessible by default
- **Linting disabled** - See `biome.jsonc` overrides

When adding new shadcn/ui components:

```bash
npx shadcn@latest add <component-name>
```

This will download the component into `src/components/ui/`.

### Creating New Components

Follow this pattern:

```typescript
import type { FC } from "react";

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export const MyComponent: FC<MyComponentProps> = ({ title, onAction }) => {
  return (
    <div className="space-y-4">
      <h2>{title}</h2>
      <button onClick={onAction}>Click me</button>
    </div>
  );
};
```

**Key principles:**
- Use named exports (not default exports) for components
- Define props interface explicitly
- Use `FC<Props>` type for function components (React 19 supports this)
- Use semantic HTML elements
- Apply Tailwind classes for styling

### Styling Conventions

This project uses Tailwind CSS 4 with the following conventions:

1. **Use Tailwind utility classes** - Avoid custom CSS when possible
2. **Use the `cn()` helper** for conditional classes:
   ```typescript
   import { cn } from "@/lib/utils";

   <div className={cn("base-class", condition && "conditional-class")} />
   ```
3. **Follow Tailwind order** - Positioning, layout, spacing, sizing, appearance
4. **Use Tailwind colors** - Don't use arbitrary color values
5. **Responsive design** - Use `sm:`, `md:`, `lg:` breakpoints

### Accessibility

All components must be accessible:

- Use semantic HTML (`<button>`, `<nav>`, `<main>`, etc.)
- Provide `aria-label` for icon-only buttons
- Ensure keyboard navigation works
- Use Radix UI primitives which handle accessibility automatically
- Test with keyboard-only navigation

---

## Data Persistence

### localStorage Strategy

All data is stored in localStorage with the following keys:

- `daily-do-todos` - Array of Todo objects
- `daily-do-categories` - Array of Category objects
- `daily-do-manual-sort-enabled` - Boolean
- `daily-do-manual-sort-order` - Array of todo IDs
- `daily-do-notifications-settings` - Notification preferences
- `daily-do-theme` - Current theme (light/dark)

### Data Serialization

The `useLocalStorage` hook handles serialization automatically:

```typescript
const [todos, setTodos] = useLocalStorage<Todo[]>("daily-do-todos", []);
```

**Important:** Date objects are serialized as ISO strings and must be re-parsed:

```typescript
// When reading
const todo = todos.find(t => t.id === id);
const dueDate = todo.dueDate ? new Date(todo.dueDate) : undefined;

// When writing
updateTodo(id, { dueDate: new Date() }); // Handled automatically by hook
```

### Import/Export

Users can export all todos as JSON and import them later. The export includes:

- All todo data (text, priority, tags, dates, sub-tasks, etc.)
- Categories are NOT included in export (managed separately)
- Export format is the raw array of Todo objects

---

## Important Conventions

### Naming Conventions

- **Components:** PascalCase (`TodoList`, `ThemeSwitcher`)
- **Files:** kebab-case (`todo-list.tsx`, `use-todos.ts`)
- **Hooks:** Start with `use` (`useTodos`, `useLocalStorage`)
- **Types/Interfaces:** PascalCase (`Todo`, `Priority`, `TodoStats`)
- **Functions:** camelCase (`addTodo`, `filterTodos`)
- **Constants:** SCREAMING_SNAKE_CASE (`PRIORITY_REGEX`, `TAG_REGEX`)

### File Organization

- One component per file (except small, related components)
- Co-locate types with their usage when they're specific
- Put shared types in `src/types/`
- Export types with `export type` or `export interface`
- Group imports: React → external libraries → internal modules → types

```typescript
// Good import order
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useTodos } from "@/hooks/use-todos";
import type { Todo } from "@/types/todo";
```

### Date Handling

Always use `date-fns` for date operations:

```typescript
import { format, isToday, isPast, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

// Format for display
format(date, "PP", { locale: ptBR }); // "24 de nov. de 2025"
format(date, "PPPP", { locale: ptBR }); // "domingo, 24 de novembro de 2025"

// Date comparisons
if (isToday(dueDate)) { /* ... */ }
if (isPast(dueDate) && !isToday(dueDate)) { /* overdue */ }
```

### User Feedback

All actions should provide feedback via Sonner toasts:

```typescript
import { toast } from "sonner";

// Success
toast.success("Tarefa adicionada!", { description: text });

// Error
toast.error("Erro ao salvar", { description: "Tente novamente" });

// Info
toast.info("Dica", { description: "Use Ctrl+N para criar tarefas" });
```

### Error Handling

- Validate user input at form level
- Handle edge cases (empty arrays, missing dates)
- Provide fallback values
- Log errors to console in development

```typescript
// Good: Safe access with fallback
const dueDate = todo.dueDate ? new Date(todo.dueDate) : undefined;

// Bad: Assuming data exists
const dueDate = new Date(todo.dueDate); // Might throw if undefined
```

---

## Code Quality Standards

This project uses **Ultracite**, a zero-config Biome preset that enforces strict code quality standards through automated formatting and linting.

### Quick Reference

- **Format code**: `npx ultracite fix`
- **Check for issues**: `npx ultracite check`
- **Diagnose setup**: `npx ultracite doctor`

Biome (the underlying engine) provides extremely fast Rust-based linting and formatting. Most issues are automatically fixable.

### Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

#### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

#### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

#### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

#### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

#### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

#### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

#### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

#### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use `useMemo` and `useCallback` for expensive computations and stable references

### Testing

While this project doesn't currently have automated tests, when writing tests:

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

### When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

## Additional Notes for AI Assistants

### When Adding Features

1. **Check existing patterns** - Look at similar features first
2. **Update types first** - Add to `src/types/todo.ts` if needed
3. **Extend hooks** - Add methods to `useTodos` for data operations
4. **Create components** - Build UI components that use the hooks
5. **Test in browser** - Verify localStorage persistence works
6. **Run linter** - `npm run lint:fix` before committing

### When Fixing Bugs

1. **Reproduce the issue** - Understand the problem first
2. **Check localStorage** - Many bugs relate to data serialization
3. **Verify date handling** - Dates must be re-parsed from localStorage
4. **Test edge cases** - Empty arrays, missing properties, etc.
5. **Provide user feedback** - Add appropriate toast messages

### When Refactoring

1. **Run linter first** - `npm run lint:fix` to establish baseline
2. **Make small changes** - Refactor incrementally
3. **Test after each change** - Ensure app still works
4. **Update types** - Keep TypeScript definitions in sync
5. **Run build** - `npm run build` to catch type errors

### Common Pitfalls

- **Date serialization** - Always re-parse dates from localStorage
- **Optional properties** - Check for undefined before accessing
- **Array mutations** - Use immutable patterns (map, filter, spread)
- **Hook dependencies** - Include all dependencies in useEffect/useMemo arrays
- **LocalStorage limits** - Browser storage has size limits (typically 5-10MB)

---

Most formatting and common issues are automatically fixed by Biome. Run `npx ultracite fix` before committing to ensure compliance.
