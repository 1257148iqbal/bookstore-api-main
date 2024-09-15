import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
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
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('books')
    .dropTableIfExists('authors');
}
