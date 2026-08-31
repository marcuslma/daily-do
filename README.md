# Daily Do

> Um gestor diário de tarefas, direto e sem ruído: registre o que importa, conclua e siga em frente.

O Daily Do é uma aplicação de tarefas diárias com autenticação por e-mail e senha. Cada pessoa acessa apenas as próprias tarefas, acompanha o dia atual e o histórico e preserva a veracidade de dias já encerrados.

## O que já existe

- Cadastro, login, logout e recuperação de senha com Better Auth.
- Login automático após o cadastro e redirecionamentos entre áreas públicas e protegidas.
- Ocorrências diárias com data original de criação e contador cumulativo de adiamentos.
- Criação e edição em modal, com rotas paralelas, interceptadas e fallback para acesso direto por URL.
- Histórico diário navegável: começa hoje + dois dias anteriores e carrega mais três a cada ação.
- Agenda horizontal com apenas os dias atuais ou futuros que têm tarefas; a escolha entre Histórico e Agenda fica salva localmente no navegador.
- Datas de tarefas selecionáveis de hoje em diante: tarefas atuais podem ser concluídas, editadas ou excluídas; tarefas futuras podem ser editadas ou excluídas; dias anteriores são estritamente somente leitura.
- Sincronização manual e idempotente das pendências de ontem para hoje.
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
| Observabilidade | Vercel Web Analytics e Speed Insights |
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
   cp .env.example .env
   openssl rand -base64 32
   ```

   Use a saída do segundo comando em `BETTER_AUTH_SECRET`. O arquivo final deve conter valores válidos para todas estas variáveis:

   | Variável | Finalidade |
   | --- | --- |
   | `DATABASE_URL` | Conexão com o PostgreSQL local. O valor do `.env.example` funciona com o Compose do projeto. |
   | `DAILY_DO_TZ` | Fuso IANA usado pela aplicação; use `America/Sao_Paulo`. É obrigatório na Vercel. |
   | `TZ` | Fuso do PostgreSQL no Docker local e fallback da aplicação fora da Vercel; use o mesmo valor de `DAILY_DO_TZ`. |
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

Cada linha de `todo` representa uma ocorrência de um único dia definido por `DAILY_DO_TZ` — ou por `TZ` como fallback local. Ao clicar em **Sincronizar pendentes**, as tarefas não concluídas de ontem são copiadas — nunca movidas — para hoje. A cópia preserva a data da primeira criação e incrementa o contador exibido como, por exemplo, `Adiada 2× · Criada em 28 de ago. de 2026`.

Cada tarefa recebe uma data de hoje ou de um dia futuro. No dia atual, ela pode ser criada, editada, concluída ou excluída. Uma tarefa futura pode ser editada, remarcada para hoje ou outra data futura, ou excluída, mas só pode ser concluída no próprio dia. A exclusão remove apenas aquela ocorrência; não altera o histórico. Os dias passados são somente leitura na interface, nas Server Functions e nas consultas SQL de atualização.

O dashboard começa no **Histórico**, que mostra o dia atual e os dois anteriores; o botão de histórico acrescenta três dias anteriores por vez, incluindo datas sem tarefas. A **Agenda** mostra somente dias atuais ou futuros que já têm tarefas, em ordem cronológica, e permite navegar horizontalmente entre eles. A escolha entre Histórico e Agenda é salva somente no `localStorage` deste navegador, sem sincronização entre dispositivos. Nenhuma tarefa é copiada sem a ação manual de sincronização.

### Vercel

A Vercel reserva a variável `TZ` para o runtime e pode defini-la como `:UTC`, que não é um fuso IANA válido para a aplicação. Não tente sobrescrevê-la. Em cada ambiente da Vercel, configure `DAILY_DO_TZ=America/Sao_Paulo` e faça um novo deploy. Mantenha `TZ=America/Sao_Paulo` apenas no `.env` local para o Docker/PostgreSQL.

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
- `lib/` contém autenticação, conexão PostgreSQL, timezone, validações e acesso proprietário às tarefas.
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
