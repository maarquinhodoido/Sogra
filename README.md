# Luxe Nails Atelier

Plataforma completa para um salão de unhas/manicure/pedicure com frontend público, backend full-stack em Next.js, base de dados SQL Server via Prisma, sistema de marcações online e painel administrativo completo.

## Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- Backend: Route handlers e Server Actions no Next.js
- Base de dados: SQL Server com Prisma 6
- Autenticação admin: cookie seguro com JWT assinado
- Uploads: armazenamento local em `public/uploads`
- Email: Nodemailer com fallback para log quando SMTP não está configurado

## O que está incluído

- Site público completo com páginas:
	- `/`
	- `/sobre`
	- `/servicos`
	- `/galeria`
	- `/marcacoes`
	- `/contactos`
	- `/testemunhos`
	- `/faq`
	- `/privacidade`
	- `/termos`
- Sistema de marcações com:
	- seleção de serviço, profissional, data e hora
	- disponibilidade real com horários, pausas e bloqueios
	- prevenção de conflitos
	- estados de marcação
	- link para reagendamento/cancelamento pelo cliente
- Painel admin em `/admin` com módulos para:
	- conteúdo
	- serviços
	- galeria e media
	- marcações
	- clientes
	- equipa
	- disponibilidade
	- testemunhos
	- FAQ
	- configurações
	- utilizadores admin
	- contactos recebidos
- SEO base com metadata, sitemap, robots e manifest
- Seed com dados exemplo realistas
- Placeholders SVG locais, sem dependência de imagens externas

## Configuração local

1. Instale dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente com base em `.env.example`.

3. Para subir SQL Server local com Docker:

```bash
```
```docker compose up -d
```

4. Gere o Prisma Client:

```bash
npm run db:generate
```

5. Sincronize o schema com a base de dados:

```bash
npm run db:push
```

6. Carregue os dados demo e o utilizador inicial:

```bash
npm run db:seed
```

7. Arranque em desenvolvimento:

```bash
npm run dev
```

## Credenciais iniciais do admin

- Email: valor de `ADMIN_EMAIL`
- Password: valor de `ADMIN_PASSWORD`

Se não alterar o `.env`, os valores base são:

- `admin@luxenails.pt`
- `Admin123!`

## Scripts úteis

```bash
npm run dev
npm run lint
npm run build
npm run db:generate
npm run db:push
npm run db:seed
```

## Notas técnicas

- O build pode concluir sem `DATABASE_URL`, mas funcionalidades persistentes de admin, contactos e marcações exigem base de dados configurada em runtime.
- Os uploads são locais. Para produção com múltiplas instâncias, substitua por object storage.
- O middleware protege as rotas de admin e o layout valida a sessão no servidor.
- O painel foi desenhado para gestão operacional direta sem mexer em código.

## Deploy

### Opção 1: VPS ou Windows Server com Node.js

1. Configurar SQL Server acessível pela app.
2. Definir variáveis de ambiente em produção.
3. Executar:

```bash
npm install
npm run db:generate
npm run build
npm run start
```

### Opção 2: Docker / container app

- Criar imagem Node para a app.
- Ligar a um SQL Server externo ou container dedicado.
- Persistir `public/uploads` em volume.

### Opção 3: Azure App Service / similar

- Recomendado para stack Next.js + SQL Server.
- Configurar storage persistente para uploads ou migrar uploads para blob/object storage.

## Validação feita

- `npm run lint`
- `npm run build`
- task de desenvolvimento criada e executada no VS Code

