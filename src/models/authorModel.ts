// src/models/authorModel.ts
import knex from '../services/db';
import { Author } from '../types/Author';

export const getAllAuthors = () => knex<Author>('authors').select('*');
export const getAuthors = (limit: number, offset: number, search?: string) => {
    const query = knex<Author>('authors')
      .select('*')
      .limit(limit)
      .offset(offset);
  
    if (search) {
      query.where('name', 'like', `%${search}%`);
    }
  
    return query;
  };
  
  export const getAuthorsCount = async (search?: string) => {
    const query = knex<Author>('authors').count<{ count: number }[]>('* as count');
  
    if (search) {
      query.where('name', 'like', `%${search}%`);
    }
  
    const result = await query.first();
    return result ? result.count : 0;
  };
  
export const getAuthorById = (id: number) => knex<Author>('authors').select('*').where({ id }).first();
export const createAuthor = (author: Author) => knex<Author>('authors').insert(author);
export const updateAuthor = (id: number, author: Partial<Author>) => knex<Author>('authors').where({ id }).update(author);
export const deleteAuthor = (id: number) => knex<Author>('authors').where({ id }).del();

