# GoBarber Backend

API em NodeJS para cadastro, alteração, atualização e consulta de apontamentos e usuários de barbearia.

## Começando

Estas instruções te darão uma cópia do projeto pronta para rodar na sua máquina local para propósitos de testes.

### Pré-requisitos

Para a instalação do projeto, é necessário que o Docker e Docker Compose esteja instalado na máquina.

[Docker](https://docs.docker.com/get-docker/)
[Docker Compose](https://docs.docker.com/compose/install/)

### Instalando

Depois de clonar e baixar o projeto, excute o comando:

```
cp .env.example .env
```

Então, execute:

```
docker-compose up --build -d
```

Após o término, para verificar se os containers foram construidos com sucesso, executar o comando:

```
docker ps
```

Os seguintes dados devem aparecer:

```
CONTAINER ID        IMAGE                   COMMAND                  CREATED             STATUS              PORTS                      NAMES
xxxxxxxxxxxx        gobarber-api_gobarber   "docker-entrypoint.s…"   8 minutes ago       Up 8 minutes        0.0.0.0:80->80/tcp         gobarber.api
yyyyyyyyyyyy        mongo                   "docker-entrypoint.s…"   8 minutes ago       Up 8 minutes        0.0.0.0:27017->27017/tcp   gobarber.mongo
zzzzzzzzzzzz        postgres:13-alpine      "docker-entrypoint.s…"   8 minutes ago       Up 8 minutes        0.0.0.0:5432->5432/tcp     gobarber.postgres
wwwwwwwwwwww        redis:6-alpine          "docker-entrypoint.s…"   8 minutes ago       Up 8 minutes        0.0.0.0:6379->6379/tcp     gobarber.redis
```

Feito isso, para a instalação das migrations, executar:

```
./container
```

e em seguida:

```
yarn typeorm migration:run
```

### Rotas da aplicação

#### Usuários

* POST /users

    Cadastra um usuário.

    Exemplo:

    ```
    /users
    ```
    
    ```
    {
      "name": "João",
      "email": "joão@teste.com",
      "password": "123789"
    }
    ```
    
Parâmetro | Tipo | Descrição
------------- | ------------- | -------------
name | string | Nome do usuário (obrigatório)
email | string | Email do usuário (obrigatório)
password | string | Senha do usuário (obrigatório)


* POST /sessions

    Autentica um usuário e gera um token JWT a ser passado no header das requisições que nessecitam de autenticação.

    Exemplo:

    ```
    /sessions
    ```
    
    ```
    {
      "email": "joão@teste.com",
      "password": "123789"
    }
    ```
    
Parâmetro | Tipo | Descrição
------------- | ------------- | -------------
email | string | Email do usuário (obrigatório)
password | string | Senha do usuário (obrigatório)


* PATCH users/avatar

    Faz upload do avatar do usuário. Rota Necessita de token de autenticação.

    Exemplo:

    ```
    users/avatar
    ```

Parâmetro | Tipo | Descrição
------------- | ------------- | -------------
avatar | file | Avatar do usuário (obrigatório)


* PUT /profile

    Atualiza as informações de cadastro do usuário. Rota necessita de autenticação.

    Exemplo:

    ```
    /profile
    ```
    
    ```
    {
      "name": "João da Silva",
      "email": "joão@teste.com",
      "password":"123456",
      "password_confirmation":"789123",
      "old_password":"789123"
    }
    ```
    
Parâmetro | Tipo | Descrição
------------- | ------------- | -------------
name | string | Nome do usuário (obrigatório)
email | string | Email do usuário (obrigatório)
old_password | string | Senha antiga do usuário
password | string | Nova senha do usuário
password_confirmation | string | Confirmação da nova senha do usuário

* GET /profile

    Retorna informações do cadastro do usuário. Rota necessita de autenticação.

    Exemplo:

    ```
    /profile
    ```

#### Provedores de serviço

* GET /providers

    Retorna todos os provedores de serviço cadastrados. Rota necessita de autenticação.

    Exemplo:

    ```
    /providers
    ```


* GET /providers/{provider_id}/day-availability

    Retorna a disponibilidade de horário de um provedor em um dia especifico. Rota necessita de autenticação.

    Exemplo:

    ```
    /providers/b54618f5-704f-42f1-8862-47e637594d3e/day-availability?year=XXXX&month=Y&day=ZZ
    ```
    
Parâmetro | Tipo | Descrição
------------- | ------------- | -------------
provider_id | uuid | ID de identificação do provedor (obrigatório)
year | number | Ano da data da pesquisa (obrigatório)
month | number | Mês da data da pesquisa (obrigatório)
day | number | Dia da data da pesquisa (obrigatório)


* GET /providers/{provider_id}/month-availability

    Retorna a disponibilidade de dias de um provedor em um mês especifico. Rota necessita de autenticação.

    Exemplo:

    ```
    /providers/b54618f5-704f-42f1-8862-47e637594d3e/month-availability?year=XXXX&month=Y
    ```
    
Parâmetro | Tipo | Descrição
------------- | ------------- | -------------
provider_id | uuid | ID de identificação do provedor (obrigatório)
year | number | Ano da data da pesquisa (obrigatório)
month | number | Mês da data da pesquisa (obrigatório)


#### Apontamentos

* GET /appointments/me

    Retorna os apontamentos do provedor logado em um dia especifico. Rota necessita de autenticação.

    Exemplo:

    ```
    /appointments/me?year=XXXX&month=Y&day=ZZ
    ```
    
Parâmetro | Tipo | Descrição
------------- | ------------- | -------------
year | number | Ano da data da pesquisa (obrigatório)
month | number | Mês da data da pesquisa (obrigatório)
day | number | Dia da data da pesquisa (obrigatório)

    
* GET /appointments/user

    Retorna os apontamentos marcados pelo usuário logado. Rota necessita de autenticação.

    Exemplo:

    ```
    /appointments/me
    ```

* POST /appointments

    Cria um apontamento. Rota necessita de autenticação.

    Exemplo:

    ```
    /appointments
    ```
    
    ```
    {
      "date": "2021-03-10T17:00:00.000Z",
      "provider_id": "b54618f5-704f-42f1-8862-47e637594d3e"
    }
    ```
    
Parâmetro | Tipo | Descrição
------------- | ------------- | -------------
date | Date | Data do apontamento (obrigatório)
provider_id | uuid | ID do provedor do apontamento (obrigatório)


* PUT /appointments

    Atualiza um apontamento. Rota necessita de autenticação.

    Exemplo:

    ```
    /appointments
    ```
    
    ```
    {
      "appointment_id": "5d1928e3-342d-4e5b-b5fe-8e408b86be03",
      "date": "2021-03-10T17:00:00.000Z",
      "provider_id": "b54618f5-704f-42f1-8862-47e637594d3e"
    }
    ```
    
Parâmetro | Tipo | Descrição
------------- | ------------- | -------------
appointment_id | uuid | ID do apontamento (obrigatório)
date | Date | Data do apontamento (obrigatório)
provider_id | uuid | ID do provedor do apontamento (obrigatório)


* DELETE /appointments

    Deleta um apontamento. Rota necessita de autenticação.

    Exemplo:

    ```
    /appointments?appointment_id=5fc6194f-19d1-4783-b3a5-cad4207ef045
    ```
    
Parâmetro | Tipo | Descrição
------------- | ------------- | -------------
appointment_id | uuid | ID do apontamento (obrigatório)
    

* GET /appointments

    Retorna os dados de um apontamento. Rota necessita de autenticação.

    Exemplo:

    ```
    /appointments?appointment_id=5fc6194f-19d1-4783-b3a5-cad4207ef045
    ```
    
    
Parâmetro | Tipo | Descrição
------------- | ------------- | -------------
appointment_id | uuid | ID do apontamento (obrigatório)


## Executando testes

Para executar os testes automatizados da aplicação, na pasta raiz da aplicação, executar:

```
yarn test
```

## Autores

* **Igor Pimentel** - *Trabalho inicial* - [igorpimentel23](https://github.com/igorpimentel23)


## Licença

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
