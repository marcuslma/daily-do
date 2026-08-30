# Daily Do — base de autenticação e infraestrutura

**Data:** 2026-08-29
**Status:** aprovado para planejamento

## Objetivo

Estabelecer a fundação de um aplicativo de tarefas objetivo: PostgreSQL local,
autenticação por e-mail e senha, e-mails transacionais e uma navegação que
separa de forma segura visitantes de usuários autenticados.

Esta etapa não cria o CRUD de tarefas. O dashboard será somente a base
autenticada para essa próxima funcionalidade.

## Decisões e restrições

- Next.js 16 com App Router e TypeScript.
- PostgreSQL executado localmente por Docker Compose.
- `pg` é o driver e fornece um `Pool` compartilhado ao Better Auth.
- Better Auth oferece cadastro, login, sessão, confirmação de e-mail e
  redefinição de senha.
- Resend envia e-mails transacionais de confirmação e de redefinição.
- Toda interação da aplicação usa Server Functions. Não haverá endpoints de
  API próprios.
- A única rota sob `app/api` é o handler obrigatório do Better Auth, necessário
  para consumir links assinados de confirmação e redefinição.
- Toda a estilização visual usa classes Tailwind. Não serão criadas regras de
  CSS próprias; `app/globals.css` conterá apenas a importação do Tailwind.

## Infraestrutura e configuração

`docker-compose.yml` iniciará um serviço PostgreSQL com:

- banco `daily_do`;
- usuário e senha exclusivos do ambiente local;
- porta `5432` exposta para o host;
- volume nomeado para persistir os dados entre reinicializações.

`.env.example` documentará, sem valores secretos:

```text
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
RESEND_API_KEY=
RESEND_FROM=
```

O segredo do Better Auth será gerado localmente e nunca versionado. O domínio
remetente configurado em `RESEND_FROM` deverá estar verificado no Resend para
entregas fora da caixa de teste.

O esquema gerenciado pelo Better Auth será criado por sua CLI de migração após
o PostgreSQL e as variáveis de ambiente estarem disponíveis. Esta etapa cria
somente as tabelas de autenticação; não haverá tabela de tarefas ainda.

## Componentes do servidor

```text
lib/db.ts       Pool PostgreSQL reutilizável
lib/mail.ts     Cliente Resend e funções para e-mails transacionais
lib/auth.ts     Instância Better Auth e configurações de e-mail/sessão
app/actions/    Server Functions de autenticação e validação de FormData
app/api/auth/[...all]/route.ts
                Handler técnico do Better Auth para links de e-mail
```

`lib/auth.ts` habilitará e-mail e senha e usará o plugin `nextCookies`, para
que os cookies enviados pelo Better Auth em Server Functions sejam aplicados à
resposta do Next.js. O driver PostgreSQL será uma instância de `Pool` do `pg`.

As escolhas de autenticação são:

- cadastro cria uma sessão automaticamente (`autoSignIn: true`);
- e-mail de confirmação é enviado a cada cadastro (`sendOnSignUp: true`);
- confirmação não bloqueia a sessão inicial nem o login, pois o requisito
  exige que o cadastro logue e leve diretamente ao dashboard;
- links de confirmação e redefinição expiram em uma hora;
- confirmar um e-mail pode restabelecer uma sessão válida;
- uma redefinição de senha invalida as demais sessões ativas.

As funções de envio recebem URLs assinadas do Better Auth e delegam o envio ao
Resend. E-mails usam versão HTML e texto simples, remetente configurado por
ambiente e uma cópia acessível do conteúdo. Falhas de transporte serão
registradas no servidor, sem expor credenciais ou tokens ao cliente.

## Rotas e controle de acesso

| Rota | Usuário sem sessão | Usuário com sessão |
| --- | --- | --- |
| `/` | Página inicial pública | Redireciona para `/dashboard` |
| `/sign-up` | Formulário de cadastro | Redireciona para `/dashboard` |
| `/sign-in` | Formulário de login | Redireciona para `/dashboard` |
| `/forgot-password` | Solicita e-mail de redefinição | Redireciona para `/dashboard` |
| `/reset-password` | Define nova senha a partir do token | Redireciona para `/dashboard` |
| `/dashboard` | Redireciona para `/sign-in` | Dashboard autenticado |

Cada página obtém a sessão no servidor por uma função compartilhada que passa
os cabeçalhos da requisição ao Better Auth. O dashboard valida a sessão real,
não apenas a presença de um cookie. Esse controle por página evita exibir
conteúdo protegido durante uma navegação e também funciona sem JavaScript.

## Server Functions e fluxos

| Função | Entrada | Sucesso | Falha segura |
| --- | --- | --- | --- |
| `signUp` | nome, e-mail, senha | cria conta e sessão; redireciona para `/dashboard` | mostra erro de validação ou de conta existente |
| `signIn` | e-mail, senha | cria sessão; redireciona para `/dashboard` | mostra credenciais inválidas de forma genérica |
| `signOut` | nenhuma | encerra sessão; redireciona para `/sign-in` | não vaza estado de sessão |
| `requestPasswordReset` | e-mail | solicita envio; mostra confirmação neutra | mesma confirmação para e-mail inexistente |
| `resetPassword` | token, nova senha | redefine senha e leva ao login | informa token inválido/expirado sem detalhes sensíveis |

Todas as funções ficam em módulo com `'use server'`, validam `FormData` no
servidor e passam os cabeçalhos atuais ao Better Auth. Redirecionamentos usam
`redirect()` após o trabalho que pode falhar, para não capturar a exceção de
controle de fluxo do Next.js.

Os formulários podem ter componentes clientes mínimos para estado pendente e
mensagens retornadas pelas Server Functions, mas não chamam `fetch`, cliente
Better Auth ou rotas de API diretamente.

## Interface

- A página inicial explica sucintamente o produto e oferece chamadas para
  entrar ou criar conta.
- As páginas de autenticação compartilham uma composição simples, responsiva e
  acessível, com rótulos, descrições de erro e estados de envio.
- O dashboard exibe o nome do usuário, uma indicação de que a lista de tarefas
  será construída na próxima etapa e uma ação de sair.
- Todo layout, espaçamento, tipografia, cores, estados e responsividade usam
  utilitários Tailwind. Não haverá arquivos ou blocos de CSS autorais.

`AGENTS.md` ganhará uma regra explícita para impedir CSS customizado em
alterações futuras.

## Tratamento de erros e segurança

- Dados de formulário são não confiáveis e são validados antes de chamar o
  provedor de autenticação.
- Senhas não são registradas, retornadas ao cliente nem manipuladas por SQL da
  aplicação; o Better Auth aplica seu mecanismo de hash.
- Sessão e autorização são confirmadas no servidor onde o conteúdo protegido
  é renderizado e em toda futura mutação autenticada.
- URLs de retorno são rotas internas definidas pela aplicação, evitando
  redirecionamentos abertos.
- E-mails de reset não revelam se uma conta existe.
- Nenhum segredo, URL com token ou resposta bruta de provedor entra em logs do
  navegador ou no controle de versão.

## Verificação

Antes da entrega, a implementação deve comprovar:

1. o lint, a verificação de tipos e o build do Next.js passam;
2. testes de Server Functions cobrem validação, mapeamento de erros e destinos
   de redirecionamento, com o Better Auth e Resend isolados por mocks;
3. o fluxo local documentado sobe o banco e executa a migração de esquema;
4. revisão manual confirma redirecionamentos de sessão, cadastro com login
   automático, login, logout e estados de formulário;
5. inspeção garante que estilos sejam somente utilitários Tailwind e que
   `.env` não seja rastreado.

## Fora de escopo

- CRUD, persistência ou filtros de tarefas;
- login social, MFA, organizações e perfis editáveis;
- envio de e-mails de produto que não sejam confirmação e redefinição;
- implantação, domínio de produção e configuração de DNS do Resend.
