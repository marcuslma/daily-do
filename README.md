# Daily Do

> Uma lista de tarefas pessoal, direta e sem ruído: registre o que importa, conclua e siga em frente.

O Daily Do é uma aplicação de to-do list com autenticação por e-mail e senha. Cada pessoa acessa apenas as próprias tarefas, pode criar e editar itens sem sair do dashboard e acompanha quando cada tarefa foi criada, atualizada e concluída.

## O que já existe

- Cadastro, login, logout e recuperação de senha com Better Auth.
- Login automático após o cadastro e redirecionamentos entre áreas públicas e protegidas.
- Tarefas com descrição, data de inclusão, data de atualização e data de conclusão.
- Criação e edição em modal, com rotas paralelas, interceptadas e fallback para acesso direto por URL.
- Conclusão rápida por checkbox, com texto tachado e data de conclusão visível.
- Tema claro, escuro ou do sistema — o sistema é o padrão.
- Operações de escrita feitas por Server Functions; não há endpoints de API próprios para as tarefas.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Aplicação | Next.js 16, React 19 e TypeScript |
| Interface | Tailwind CSS 4 e Lucide Icons |
| Autenticação | Better Auth com e-mail e senha |
| Dados | PostgreSQL 17, `pg` e Zod |
| E-mails | Resend |
| Qualidade | Vitest, Testing Library, ESLint e TypeScript |
| Ambiente local | Docker Compose |

## Pré-requisitos

- Node.js 20.9 ou mais recente.
- npm.
- Docker e Docker Compose em execução.
- Uma conta Resend, uma chave de API e um remetente verificado para os e-mails transacionais.

## Rodando localmente

1. Instale as dependências.

   ```bash
   npm install
   ```

2. Crie seu arquivo de ambiente e preencha os segredos.

   ```bash
   cp .env.example .env.local
   openssl rand -base64 32
   ```

   Use a saída do segundo comando em `BETTER_AUTH_SECRET`. O arquivo final deve conter valores válidos para todas estas variáveis:

   | Variável | Finalidade |
   | --- | --- |
   | `DATABASE_URL` | Conexão com o PostgreSQL local. O valor do `.env.example` funciona com o Compose do projeto. |
   | `BETTER_AUTH_SECRET` | Segredo criptográfico do Better Auth; gere um valor único. |
   | `BETTER_AUTH_URL` | URL pública da aplicação; localmente, `http://localhost:3000`. |
   | `RESEND_API_KEY` | Chave da API do Resend. |
   | `RESEND_FROM` | Remetente aprovado no Resend, por exemplo `Daily Do <ola@seu-dominio.com>`. |

3. Inicie o PostgreSQL e crie a estrutura do banco.

   ```bash
   npm run db:up
   npm run db:setup
   ```

4. Inicie a aplicação.

   ```bash
   npm run dev
   ```

   Abra [http://localhost:3000](http://localhost:3000), crie uma conta e comece a organizar o dia.

## Banco de dados: um schema único

Como o projeto ainda não está em produção, ele não usa migrations. O arquivo [db/schema.sql](db/schema.sql) é a fonte única para preparar um banco local novo: ele cria as tabelas do Better Auth (`user`, `account`, `session` e `verification`) e a tabela `todo`, incluindo índices, restrições e relacionamentos.

O comando `npm run db:setup` executa esse arquivo contra o contêiner local. Ele pode ser repetido com segurança em uma base já inicializada, mas não substitui uma estratégia de evolução de schema para produção.

## Comandos úteis

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Inicia o ambiente de desenvolvimento. |
| `npm run build` | Gera a versão de produção para validação. |
| `npm run start` | Inicia a versão compilada. |
| `npm test` | Executa toda a suíte de testes. |
| `npm run test:watch` | Mantém os testes em modo observação. |
| `npm run typecheck` | Verifica os tipos sem gerar arquivos. |
| `npm run lint` | Executa as verificações de lint. |
| `npm run db:up` | Sobe apenas o PostgreSQL via Docker Compose. |
| `npm run db:setup` | Cria todas as tabelas a partir de `db/schema.sql`. |
| `npm run db:down` | Para o banco mantendo o volume e os dados locais. |

## Como a aplicação se organiza

- `app/` reúne as páginas, Server Functions e as rotas paralelas do dashboard.
- `components/` concentra os componentes de interface, incluindo o modal acessível de tarefas.
- `lib/` contém autenticação, conexão PostgreSQL, validações e acesso proprietário às tarefas.
- `db/schema.sql` define todo o banco de dados local em um único lugar.
- `tests/` cobre ações de servidor, componentes e comportamentos principais da interface.

As tarefas são sempre consultadas e alteradas com o identificador da pessoa autenticada. Assim, uma URL manipulada ou uma ação disparada fora da interface não permite acessar a lista de outra conta.

## Antes de enviar uma alteração

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Se for usar e-mails reais, confirme também que `RESEND_FROM` pertence a um domínio ou endereço verificado no Resend; caso contrário, os e-mails de confirmação e redefinição de senha não serão entregues.
