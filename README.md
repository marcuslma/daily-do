# Daily Do

> Um gestor diário de tarefas, direto e sem ruído: registre o que importa, conclua e siga em frente.

O Daily Do é uma aplicação de tarefas diárias com autenticação por e-mail e senha. Cada pessoa acessa apenas as próprias tarefas, acompanha o dia atual e o histórico e preserva a veracidade de dias já encerrados.

## O que já existe

- Cadastro, login, logout e recuperação de senha com Better Auth.
- Login automático após o cadastro e redirecionamentos entre áreas públicas e protegidas.
- Ocorrências diárias com data original de criação e contador cumulativo de adiamentos.
- Criação e edição em modal, com rotas paralelas, interceptadas e fallback para acesso direto por URL.
- Criação, edição, conclusão e exclusão rápida no dia atual; dias anteriores são estritamente somente leitura.
- Histórico diário navegável: começa hoje + dois dias anteriores e carrega mais três a cada ação.
- Adiamento automático e idempotente de pendências pelo Trigger.dev à meia-noite no fuso configurado.
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
| Automação | Trigger.dev 4 |
| Observabilidade | Vercel Web Analytics e Speed Insights |
| Qualidade | Vitest, Testing Library, ESLint e TypeScript |
| Ambiente local | Docker Compose |

## Pré-requisitos

- Node.js 20.9 ou mais recente.
- npm.
- Docker e Docker Compose em execução.
- Uma conta Resend, uma chave de API e um remetente verificado para os e-mails transacionais.
- Um projeto Trigger.dev para ativar o cron de adiamento fora do ambiente local.

## Rodando localmente

1. Instale as dependências.

   ```bash
   npm install
   ```

2. Crie seu arquivo de ambiente e preencha os segredos.

   ```bash
   cp .env.example .env
   openssl rand -base64 32
   ```

   Use a saída do segundo comando em `BETTER_AUTH_SECRET`. O arquivo final deve conter valores válidos para todas estas variáveis:

   | Variável | Finalidade |
   | --- | --- |
   | `DATABASE_URL` | Conexão com o PostgreSQL local. O valor do `.env.example` funciona com o Compose do projeto. |
   | `DAILY_DO_TZ` | Fuso IANA usado pela aplicação e pelo cron; use `America/Sao_Paulo`. É obrigatório na Vercel e no Trigger.dev. |
   | `TZ` | Fuso do PostgreSQL no Docker local e fallback da aplicação fora da Vercel; use o mesmo valor de `DAILY_DO_TZ`. |
   | `TRIGGER_PROJECT_REF` | Referência do projeto Trigger.dev usado para descobrir e publicar as tarefas agendadas. |
   | `TRIGGER_SECRET_KEY` | Chave de autenticação do Trigger.dev para a CLI e o SDK; nunca versione um valor real. |
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

## Tarefas diárias e histórico

Cada linha de `todo` representa uma ocorrência de um único dia definido por `DAILY_DO_TZ` — ou por `TZ` como fallback local. Quando uma tarefa permanece aberta, ela é copiada — nunca movida — para o próximo dia. A cópia preserva a data da primeira criação e incrementa o contador exibido como, por exemplo, `Adiada 2× · Criada em 28 de ago. de 2026`.

No dia atual, uma tarefa pode ser criada, editada, concluída ou excluída. A exclusão remove somente a ocorrência do dia corrente; não altera o histórico. Os dias passados são somente leitura na interface, nas Server Functions e nas consultas SQL de atualização. O dashboard sempre mostra o dia corrente e os dois anteriores; o botão de histórico acrescenta três dias anteriores por vez, incluindo datas sem tarefas.

### Vercel

A Vercel reserva a variável `TZ` para o runtime e pode defini-la como `:UTC`, que não é um fuso IANA válido para a aplicação. Não tente sobrescrevê-la. Em cada ambiente da Vercel, configure `DAILY_DO_TZ=America/Sao_Paulo` e faça um novo deploy. Mantenha `TZ=America/Sao_Paulo` apenas no `.env` local para o Docker/PostgreSQL.

### Trigger.dev

O cron declarativo `rollover-open-todos` executa às `00:00` de `DAILY_DO_TZ` nos ambientes de staging e produção. Em desenvolvimento, não há cron automático: use testes manuais para evitar que o banco local seja alterado durante a madrugada.

1. Crie ou selecione um projeto Trigger.dev e coloque sua referência em `TRIGGER_PROJECT_REF`.
2. Defina `TRIGGER_SECRET_KEY` localmente e no ambiente Trigger.dev relevante.
3. Defina `DATABASE_URL` e `DAILY_DO_TZ` em cada ambiente Trigger.dev.
4. Execute `npm run trigger:dev` para testar tarefas manualmente no ambiente local.
5. Execute `npm run trigger:deploy` somente depois de verificar a tarefa.

Não execute os comandos do Trigger.dev sem as credenciais adequadas. O índice único da ocorrência anterior e a transação do cron tornam retries e execuções repetidas seguros.

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
| `npm run trigger:dev` | Inicia o ambiente local do Trigger.dev para testes manuais. |
| `npm run trigger:deploy` | Publica as tarefas do Trigger.dev após validação. |

## Como a aplicação se organiza

- `app/` reúne as páginas, Server Functions e as rotas paralelas do dashboard.
- `components/` concentra os componentes de interface, incluindo o modal acessível de tarefas.
- `lib/` contém autenticação, conexão PostgreSQL, timezone, validações e acesso proprietário às tarefas.
- `db/schema.sql` define todo o banco de dados local em um único lugar.
- `trigger/` contém a tarefa declarativa de adiamento diário.
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
