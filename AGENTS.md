<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Styling

- Toda estilização visual deve usar exclusivamente classes utilitárias do Tailwind CSS.
- Não adicione CSS customizado, CSS Modules, `style` props, styled JSX ou folhas de estilo de terceiros.
- `app/globals.css` deve conter somente `@import "tailwindcss";`.

## Version control

- Nunca faça `commit` ou `push` sem solicitação explícita do usuário.
- Ao final de cada implementação, sempre sugira uma mensagem de commit em inglês que descreva a alteração.
