# Sistema de Escolha de Bicicletas — API Server-Side & Banco de Dados (N3)

API REST desenvolvida em **Node.js** com **Express**, **Sequelize ORM** e **MariaDB** para o gerenciamento de bicicletas, cadastro de interessados, registro de escolhas baseadas na altura do usuário e painel web dinâmico para consulta. Projeto integrado das disciplinas de **Desenvolvimento Server-Side** e **Banco de Dados**.

---

## Estado Atual do Projeto

Todas as etapas previstas para a entrega estão implementadas e funcionais:

- [x] Estrutura do servidor Express com ES Modules (`"type": "module"`).
- [x] Conexão configurada com MariaDB / MySQL via Sequelize (`config/database.js`).
- [x] Modelagem das tabelas e relacionamentos 1:N e N:N (`Bicicleta`, `Interessado`, `escolha` e `Usuario`) em `models/`.
- [x] Criptografia de senhas com `bcryptjs` e autenticação via **JWT** (`jsonwebtoken`).
- [x] Middleware de proteção de rotas (`middlewares/authMiddleware.js`).
- [x] CRUD completo de Bicicletas e Interessados, além de registro e listagem de Escolhas com validação de compatibilidade entre altura e quadro.
- [x] Scripts SQL avançados (Views, Triggers e Stored Procedures) em `database/objetos_banco.sql`.
- [x] Painel web dinâmico em HTML, CSS e JavaScript (`public/`) servido diretamente pelo Express.

---

## Tecnologias Utilizadas

- **Runtime:** Node.js (v20+)
- **Framework Web:** Express v5
- **ORM:** Sequelize v6
- **Banco de Dados:** MariaDB / MySQL (`mysql2`)
- **Autenticação & Segurança:** `jsonwebtoken` (JWT), `bcryptjs` e `cors`
- **Variáveis de Ambiente:** `dotenv`
- **Front-end:** HTML5, CSS3 e JavaScript (Fetch API)

---

## Estrutura de Pastas

```text
n3-server-side/
├── config/
│   └── database.js              # Instância e configuração do Sequelize
├── controllers/
│   ├── authController.js        # Lógica de registro e login com JWT
│   ├── bicicletaController.js   # CRUD e filtro por quadro de bicicletas
│   ├── escolhaController.js     # Registro e consulta de escolhas com validação
│   └── interessadoController.js # CRUD de interessados e cálculo de quadro
├── database/
│   └── objetos_banco.sql        # Views, Triggers e Stored Procedures do MariaDB
├── middlewares/
│   └── authMiddleware.js        # Validação do cabeçalho Authorization: Bearer <token>
├── models/
│   ├── Bicicleta.js             # Model da tabela 'Bicicleta'
│   ├── Escolha.js               # Model da tabela associativa 'escolha'
│   ├── Interessado.js           # Model da tabela 'Interessado'
│   ├── Usuario.js               # Model da tabela 'Usuario'
│   └── index.js                 # Centraliza models e define associações (FKs)
├── public/
│   ├── index.html               # Interface web de consulta
│   └── app.js                   # Consumo dinâmico da API via Fetch
├── routers/
│   ├── authRouter.js            # Rotas de autenticação (/auth)
│   ├── bicicletaRouter.js       # Rotas de bicicletas (/bicicletas)
│   ├── escolhaRouter.js         # Rotas de escolhas (/escolhas)
│   └── interessadoRouter.js     # Rotas de interessados (/interessados)
├── .env                         # Variáveis locais (ignorado pelo Git)
├── .env.example                 # Modelo de variáveis de ambiente
├── package.json
└── server.js                    # Ponto de entrada da aplicação e arquivos estáticos
```

---

## Regra de Negócio (Altura x Quadro)

A definição do tamanho do quadro é validada tanto na camada de aplicação (`interessadoController.js` e `escolhaController.js`) quanto na camada de banco de dados (`sp_registrar_escolha`):

| Faixa de Altura | Quadro Permitido |
| :--- | :--- |
| 1,50m a 1,60m | 14 |
| 1,61m a 1,70m | 16 |
| Acima de 1,70m | 17 |

Alturas inferiores a 1,50m ou tentativas de vincular uma bicicleta com quadro diferente do recomendado para a altura do interessado são bloqueadas com status `422 Unprocessable Entity`.

---

## Como Inicializar o Projeto

### 1. Clonar o repositório e instalar as dependências

```bash
git clone <url-do-repositorio>
cd n3-server-side
npm install
```

### 2. Configurar o Banco de Dados (MariaDB / MySQL)

Acesse o console do banco de dados de acordo com o seu sistema operacional:

- **Linux / WSL:**
  ```bash
  sudo mariadb
  ```
- **Windows (PowerShell):**
  ```powershell
  mariadb -u root -p
  ```
  *(Caso utilize MySQL Server no Windows, substitua `mariadb` por `mysql`).*

Dentro do console SQL, crie o banco de dados `bicicletas` e o usuário dedicado da aplicação:

```sql
CREATE DATABASE IF NOT EXISTS bicicletas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'dev_n3'@'localhost' IDENTIFIED BY 'SenhaForte123!';

GRANT ALL PRIVILEGES ON bicicletas.* TO 'dev_n3'@'localhost';

FLUSH PRIVILEGES;

EXIT;
```

### 3. Configurar as Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto a partir do `.env.example` (funciona tanto no Linux/WSL quanto no Windows PowerShell):

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
DB_PASSWORD=sua_senha_aqui
JWT_SECRET=sua_chave_secreta_aqui
```

### 4. Iniciar o Servidor

```bash
npm start
```

Ao iniciar com sucesso, o Sequelize criará automaticamente as tabelas (`Bicicleta`, `Interessado`, `escolha` e `Usuario`) no banco `bicicletas` e exibirá:

```text
Conexão com o banco de dados estabelecida com sucesso.
Modelos sincronizados com o banco de dados.
Servidor rodando em http://localhost:3000
```

### 5. Executar os Objetos Avançados no Banco de Dados

Com as tabelas já sincronizadas pelo Sequelize, execute o arquivo `database/objetos_banco.sql` para criar as Views, Triggers e Stored Procedures conforme o seu terminal:

- **Linux / WSL (Bash ou Zsh):**
  ```bash
  mariadb -u dev_n3 -p bicicletas < database/objetos_banco.sql
  ```

- **Windows (PowerShell):**
  No PowerShell, o operador `<` é reservado pelo sistema. Utilize `Get-Content` com pipe (`|`):
  ```powershell
  Get-Content database/objetos_banco.sql | mariadb -u dev_n3 -p bicicletas
  ```
  *(Ou acesse o console com `mariadb -u dev_n3 -p bicicletas` e execute `SOURCE database/objetos_banco.sql;`).*

### 6. Acessar o Painel Web

Com o servidor em execução, abra no navegador:

```text
http://localhost:3000
```

---

## Endpoints Disponíveis

Para acessar rotas marcadas como **Protegida**, envie o token obtido no login através do cabeçalho HTTP:
`Authorization: Bearer <seu_token_jwt>`

### Painel Web
- **`GET /`** *(Pública)* — Carrega a interface web de consulta (`public/index.html`).

### Autenticação (`/auth`)
- **`POST /auth/registrar`** *(Pública)* — Cadastra um novo usuário operador no sistema (mínimo de 6 caracteres para a senha).
  ```json
  {
    "login": "admin",
    "senha": "123456"
  }
  ```

- **`POST /auth/login`** *(Pública)* — Autentica o usuário e retorna o token JWT (validade de 1 hora).
  ```json
  {
    "login": "admin",
    "senha": "123456"
  }
  ```

### Bicicletas (`/bicicletas`)
- **`GET /bicicletas`** *(Pública)* — Lista todas as bicicletas cadastradas. Aceita filtro por query string:
  - `GET /bicicletas?quadro=14`
  - `GET /bicicletas?quadro=16`
  - `GET /bicicletas?quadro=17`
- **`GET /bicicletas/:codigo`** *(Pública)* — Consulta uma bicicleta específica pelo seu ID.
- **`POST /bicicletas`** *(Protegida)* — Cadastra uma nova bicicleta (quadros aceitos: `14`, `16` ou `17`).
  ```json
  {
    "quadro_bicicleta": 16,
    "cor_bicicleta": "Preta"
  }
  ```
- **`PUT /bicicletas/:codigo`** *(Protegida)* — Atualiza quadro, cor ou disponibilidade da bicicleta.
  ```json
  {
    "cor_bicicleta": "Azul",
    "disponivel": true
  }
  ```
- **`DELETE /bicicletas/:codigo`** *(Protegida)* — Remove uma bicicleta (bloqueado caso exista escolha vinculada).

### Interessados (`/interessados`)
- **`GET /interessados`** *(Pública)* — Lista todos os interessados cadastrados.
- **`GET /interessados/:id`** *(Pública)* — Busca um interessado específico e traz as bicicletas vinculadas a ele.
- **`POST /interessados`** *(Pública)* — Cadastra um novo interessado e calcula automaticamente o `quadro_recomendado`.
  ```json
  {
    "nome_interessado": "Ana Silva",
    "fone_interessado": "47999999999",
    "email_interessado": "ana@email.com",
    "altura_interessado": 1.65
  }
  ```
- **`PUT /interessados/:id`** *(Protegida)* — Atualiza os dados do interessado e recalcula o quadro recomendado caso a altura seja alterada.
- **`DELETE /interessados/:id`** *(Protegida)* — Remove um interessado do sistema.

### Escolhas (`/escolhas`)
- **`GET /escolhas`** *(Pública)* — Lista todas as escolhas registradas trazendo os dados completos do interessado e da bicicleta associada.
- **`POST /escolhas`** *(Protegida)* — Registra a escolha de uma bicicleta para um interessado após validar disponibilidade e compatibilidade de quadro.
  ```json
  {
    "id_interessado": 1,
    "id_bicicleta": 1
  }
  ```

---

## Objetos de Banco de Dados (`database/objetos_banco.sql`)

### Views
- **`vw_escolhas_detalhadas`**: consolida os registros da tabela `escolha` com os dados de `Interessado` e `Bicicleta` via `INNER JOIN`.
- **`vw_estoque_por_quadro`**: exibe o total de bicicletas, quantidade disponível e quantidade escolhida agrupadas por tamanho de quadro.

```sql
SELECT * FROM vw_escolhas_detalhadas;
SELECT * FROM vw_estoque_por_quadro;
```

### Triggers
- **`trg_apos_inserir_escolha`**: executada após `INSERT` na tabela `escolha`, atualizando `disponivel = 0` na bicicleta escolhida.
- **`trg_apos_deletar_escolha`**: executada após `DELETE` na tabela `escolha`, restaurando `disponivel = 1` na bicicleta liberada.

### Stored Procedures
- **`sp_registrar_escolha(p_id_interessado, p_id_bicicleta)`**: valida existência do interessado e da bicicleta, disponibilidade e compatibilidade de altura antes de inserir o registro em `escolha`.
- **`sp_listar_escolhas_por_quadro(p_quadro)`**: consulta `vw_escolhas_detalhadas` filtrando pelo tamanho de quadro informado.

```sql
CALL sp_registrar_escolha(1, 2);
CALL sp_listar_escolhas_por_quadro('16');
```