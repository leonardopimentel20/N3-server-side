#  Sistema de Escolha de Bicicletas — API Server-Side & Banco de Dados (N3)

API REST desenvolvida em **Node.js** com **Sequelize ORM** e **MariaDB** para o gerenciamento de bicicletas, interessados e registro de escolhas baseadas na altura do usuário. Projeto integrado das disciplinas de **Desenvolvimento Server-Side** e **Banco de Dados**.

---

## Estado Atual do Projeto

Até o momento, a fundação da aplicação e a camada de segurança estão implementadas e funcionais:

- [x] Estrutura inicial do servidor Express com ES Modules (`"type": "module"`).
- [x] Conexão configurada com MariaDB via Sequelize (`config/database.js`).
- [x] Modelagem das tabelas e relacionamentos N:N (`Bicicleta`, `Interessado`, `Escolha`, `Usuario`) em `models/`.
- [x] Criptografia de senhas com `bcryptjs` e autenticação via **JWT** (`jsonwebtoken`).
- [x] Middleware de proteção de rotas (`middlewares/authMiddleware.js`).
- [ ] CRUDs de Bicicletas, Interessados e validação de altura nas Escolhas *(próxima etapa)*.
- [ ] Scripts SQL avançados (Consultas Complexas, Views, Triggers e Stored Procedures).
- [ ] Front-end React minimalista para consumo da API.

---

## 🛠️ Tecnologias Utilizadas

* **Runtime:** Node.js (v20+)
* **Framework Web:** Express v5
* **ORM:** Sequelize v6
* **Banco de Dados:** MariaDB / MySQL (`mysql2`)
* **Autenticação & Segurança:** `jsonwebtoken` (JWT), `bcryptjs` e `cors`
* **Variáveis de Ambiente:** `dotenv`

---

## Estrutura de Pastas Atual

```text
n3-server-side/
├── config/
│   └── database.js          # Instância e configuração do Sequelize
├── controllers/
│   └── authController.js    # Lógica de registro e login com JWT
├── middlewares/
│   └── authMiddleware.js    # Validação do cabeçalho Authorization: Bearer <token>
├── models/
│   ├── Bicicleta.js         # Model da tabela 'bicicleta'
│   ├── Escolha.js           # Model da tabela associativa 'escolha'
│   ├── Interessado.js       # Model da tabela 'interessado'
│   ├── Usuario.js           # Model da tabela 'usuario'
│   └── index.js             # Centraliza models e define chaves estrangeiras (FKs)
├── routers/
│   └── authRouter.js        # Rotas de autenticação (/auth)
├── .env                     # Variáveis locais (ignorado pelo Git)
├── .env.example             # Modelo de variáveis de ambiente
├── package.json
└── server.js                # Ponto de entrada da aplicação e sincronização do banco
```

---

## Como Inicializar o Projeto

### 1. Clonar o repositório e instalar as dependências

```bash
git clone <url-do-repositorio>
cd n3-server-side
npm install
```

### 2. Configurar o Banco de Dados (MariaDB / MySQL)

Acesse o console do MariaDB/MySQL no terminal:

```bash
sudo mariadb
```

Crie o banco de dados `bicicletas` e um usuário dedicado para a aplicação (evita bloqueios de autenticação TCP do `root` no Linux):

```sql
CREATE DATABASE IF NOT EXISTS bicicletas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'dev_n3'@'localhost' IDENTIFIED BY 'SenhaForte123!';

GRANT ALL PRIVILEGES ON bicicletas.* TO 'dev_n3'@'localhost';

FLUSH PRIVILEGES;

EXIT;
```

### 3. Configurar as Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto a partir do `.env.example`:

```bash
cp .env.example .env
```

Preencha o `.env` com os dados do seu ambiente:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bicicletas
DB_USER=dev_n3
DB_PASSWORD=SenhaForte123!
JWT_SECRET=sua_chave_secreta_jwt
```

### 4. Iniciar o Servidor

```bash
npm start
```

Ao iniciar com sucesso, o Sequelize criará automaticamente as tabelas (`bicicleta`, `interessado`, `escolha` e `usuario`) no banco `bicicletas` e exibirá:

```text
Conexão com o banco de dados estabelecida com sucesso.
Modelos sincronizados com o banco de dados.
Servidor rodando em http://localhost:3000
```

---

##  Endpoints Disponíveis (Fase Atual)

### Health Check
* **`GET /`** — Verifica se a API está online.

### Autenticação (`/auth`)
* **`POST /auth/registrar`** — Cadastra um novo usuário operador no sistema.
  ```json
  {
    "login": "admin",
    "senha": "123456"
  }
  ```

* **`POST /auth/login`** — Autentica o usuário e retorna o token JWT (validade de 2 horas).
  ```json
  {
    "login": "admin",
    "senha": "123456"
  }
  ```
  *Para acessar rotas protegidas nas próximas etapas, envie o token retornado no cabeçalho HTTP:*
  `Authorization: Bearer <seu_token_jwt>`