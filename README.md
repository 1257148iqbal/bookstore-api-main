# Bookstore API

This is a simple API for managing a bookstore, including CRUD operations for books and authors, pagination, search functionality, and the ability to fetch books by specific authors. The project is built using TypeScript, Node.js, Express, and MySQL with Knex as the query builder.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)

## Features

- CRUD operations for books and authors
- Pagination for listing books and authors
- Search functionality for filtering books by title and authors by name
- Fetch books by a specific author
- View author details along with their books
- View book details with author information

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [Yarn](https://yarnpkg.com/) (or npm)
- [MySQL](https://www.mysql.com/) (or any MySQL-compatible database)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/iqbal-lyxa/bookstore-api.git
   cd bookstore-api

2. Install the project dependencies:
    -yarn install

## Database Setup
    Create Knex migration files: 
        npx knex init
        npx knex migrate:make create_authors_and_books
    Update Mygration files
        exports.up = function (knex) {
            return knex.schema
                .createTable('authors', (table) => {
                table.increments('id').primary();
                table.string('name').notNullable();
                table.text('bio');
                table.date('birthdate').notNullable();
                })
                .createTable('books', (table) => {
                table.increments('id').primary();
                table.string('title').notNullable();
                table.text('description');
                table.date('published_date').notNullable();
                table
                    .integer('author_id')
                    .unsigned()
                    .notNullable()
                    .references('id')
                    .inTable('authors')
                    .onDelete('CASCADE');
                });
            };

        exports.down = function (knex) {
            return knex.schema.dropTableIfExists('books').dropTableIfExists('authors');
        };

1. Create a MySQL database:

        CREATE DATABASE bookstore;

2. Configure the database connection:
    Rename .env.example to .env and update the database connection details:

            DB_HOST=localhost
            DB_USER=root
            DB_PASSWORD=yourpassword
            DB_NAME=bookstore_db

3. Run the database migrations to create the necessary tables:

        npx knex migrate:latest

    * Configure Knex to Use MySQL
       npm install mysql2 --save

## Running the Project

1. Run Project
        yarn start


## API Endpoints
    Link: https://docs.google.com/document/d/18IlzgyOO239Jgfw6ntUbPdH6921Q1a9DTKIZaynavPo/edit?usp=sharing