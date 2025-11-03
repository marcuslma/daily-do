# Daily Do

A modern, efficient daily task management application built with React, TypeScript, and Tailwind CSS.

## Overview

Daily Do is a simple yet powerful task organizer designed to help you manage your daily tasks efficiently. With features like priority levels, due dates, tags, sub-tasks, and notifications, it provides everything you need to stay productive.

## Features

### Core Functionality
- ✅ **Task Management**: Create, edit, complete, and delete tasks
- 📋 **Sub-tasks**: Break down complex tasks into smaller, manageable steps
- 🎯 **Priority Levels**: Organize tasks by low, medium, or high priority
- 📅 **Due Dates**: Set deadlines and track overdue tasks
- 🏷️ **Tags**: Categorize tasks with custom tags
- 😊 **Emojis**: Add visual flair to your tasks with emoji support

### Advanced Features
- 🔔 **Notifications**: Browser notifications for upcoming tasks
- 🔍 **Search & Filter**: Quickly find tasks by text, priority, or completion status
- ↕️ **Sorting**: Sort by creation date, due date, or priority
- 📊 **Statistics**: Track your productivity with completion stats
- 💾 **Import/Export**: Backup and restore your tasks as JSON
- ⌨️ **Keyboard Shortcuts**: Navigate and manage tasks efficiently
- 🎨 **Theme Support**: Switch between light and dark modes
- 💾 **Local Storage**: All data persists in your browser

### Keyboard Shortcuts
- `Ctrl+N`: Create new task
- `/`: Focus search bar
- `Shift+?`: Show keyboard shortcuts help

## Tech Stack

- **React 19** with TypeScript for type-safe component development
- **Vite** for lightning-fast development and build times
- **Tailwind CSS v4** for modern, utility-first styling
- **Radix UI** for accessible, unstyled component primitives
- **shadcn/ui** for beautiful, customizable UI components
- **Lucide React** for consistent iconography
- **date-fns** for date manipulation
- **Sonner** for elegant toast notifications
- **Ultracite** (Biome preset) for code quality and formatting

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/daily-do.git
cd daily-do
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality with Ultracite
- `npm run lint:fix` - Auto-fix code quality issues

## Code Quality

This project uses **Ultracite**, a zero-config Biome preset that enforces strict code quality standards. See [CLAUDE.md](.claude/CLAUDE.md) for detailed coding standards and best practices.

## Project Structure

```
src/
├── components/
│   ├── settings/       # Settings dialogs (notifications, shortcuts)
│   ├── theme/          # Theme provider and switcher
│   ├── todo/           # Todo components (list, item, dialogs, filters)
│   └── ui/             # Reusable UI components (shadcn/ui)
├── hooks/              # Custom React hooks
│   ├── use-todos.ts           # Todo state management
│   ├── use-notifications.ts   # Browser notifications
│   ├── use-keyboard-shortcuts.ts
│   └── use-local-storage.ts
├── types/              # TypeScript type definitions
├── lib/                # Utility functions
├── app.tsx             # Main application component
└── main.tsx            # Application entry point
```

## Data Persistence

All tasks are automatically saved to your browser's local storage. Your data persists between sessions and is never sent to any server - everything stays on your device.

## Browser Compatibility

Daily Do works best on modern browsers that support:
- Local Storage API
- Notification API (optional, for task reminders)
- ES2020+ JavaScript features

Tested on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [React](https://react.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
