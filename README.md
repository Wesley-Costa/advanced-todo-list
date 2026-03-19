# Advanced Todo List

Aplicação de gerenciamento de tarefas com autenticação completa, construída com **Meteor**, **React** e **Material UI**.

## Tecnologias

- [Meteor](https://www.meteor.com/) — framework fullstack (backend + realtime)
- [React](https://react.dev/) — biblioteca de UI
- [Material UI (MUI)](https://mui.com/) — componentes de interface
- [React Router DOM](https://reactrouter.com/) — roteamento
- [MongoDB](https://www.mongodb.com/) — banco de dados (embutido no Meteor)

## Funcionalidades

- **Autenticação completa**
  - Cadastro de usuário
  - Login e logout
  - Recuperação de senha por email
  - Reset de senha via token
- **Gerenciamento de tarefas**
  - Cadastro de tarefas com nome, descrição e data/hora
  - Listagem de tarefas do usuário logado
  - Isolamento por usuário (cada usuário vê apenas suas próprias tarefas)
- **Rotas protegidas** — páginas autenticadas só acessíveis com login ativo

## ⚙️ Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [Meteor](https://www.meteor.com/install) instalado globalmente

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Wesley-Costa/advanced-todo-list.git
cd advanced-todo-list

# Instale as dependências
npm install
```

### Variáveis de ambiente

Copie o arquivo de exemplo e preencha as variáveis necessárias:

```bash
cp .env.example .env
```

### Rodando em desenvolvimento

```bash
meteor run
```

A aplicação estará disponível em `http://localhost:3000`.

## Variáveis de Ambiente

Veja o arquivo `.env.example` para as variáveis necessárias (como configurações de email para recuperação de senha).

## Licença

Este projeto está sob a licença MIT.