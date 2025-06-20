# Restaurante-Lo-De-Miguel

Una API de un restaurante que permite la reserva de mesas y ordenar comida. Ademas, permite la administracion de dicho sistema a traves de una cuenta con acceso elevado.

Diseño del sistema:

- Api Rest
- Autenticación usando JWT
- Hasheo de contraseñas
- Prisma ORM
- Documentacion OpenAPI + ReDoc
- Colección de Postman
- TypeScript

## Setup Rapido

### 1. Clonar el repositorio

`git clone https://github.com/gazoil2/restaurante-lo-miguel.git
cd restaurante-lo-miguel`

### 2. Instalar dependencias

`npm install`

### 3. Crear un archivo .env

Copiar la siguiente línea en el archivo:
`DATABASE_URL=file:./../bd/data.db`

### 4. Generar el cliente Prisma

`npx prisma generate`

### 5. Aplicar los cambios del esquema a la base de datos

`npx prisma migrate dev --name init`

### 6. Inicializar el servidor

`npm run dev`

### Comandos Utiles

`npx prisma migrate reset`
Borra toda la informacion de la base de datos.

## Información sobre la API

/tables (GET)

/dishes (GET) (POST (Solo Admin))

/orders (GET) (POST) (Solo Admin)

/users (GET) (Solo Admin)

## Integrantes

- Juan Ignacio Dragan
- Benicio Verdun

## Contenido

- [Restaurante-Lo-De-Miguel](#restaurante-lo-de-miguel)
  - [Setup Rapido](#setup-rapido)
    - [1. Clonar el repositorio](#1-clonar-el-repositorio)
    - [2. Instalar dependencias](#2-instalar-dependencias)
    - [3. Crear un archivo .env](#3-crear-un-archivo-env)
    - [4. Generar el cliente Prisma](#4-generar-el-cliente-prisma)
    - [5. Aplicar los cambios del esquema a la base de datos](#5-aplicar-los-cambios-del-esquema-a-la-base-de-datos)
    - [6. Inicializar el servidor](#6-inicializar-el-servidor)
    - [Comandos Utiles](#comandos-utiles)
  - [Información sobre la API](#información-sobre-la-api)
  - [Integrantes](#integrantes)
  - [Contenido](#contenido)
