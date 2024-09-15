import knex from '../services/db';
import { Book } from '../types/Book';

export const getBooks = (limit: number, offset: number, search?: string) => {
    const query = knex<Book>('books')
      .select('*')
      .limit(limit)
      .offset(offset);
  
    if (search) {
      query.where('title', 'like', `%${search}%`);
    }
  
    return query;
  };
  export const getBooksCount = async (search?: string) => {
    const query = knex<Book>('books').count<{ count: number }[]>('* as count');
    
    if (search) {
      query.where('title', 'like', `%${search}%`);
    }
  
    const result = await query.first();
    return result ? result.count : 0;
  };

export const getBookById = (id: number) => knex<Book>('books').select('*').where({ id }).first();
export const createBook = (book: Book) => knex<Book>('books').insert(book);
export const updateBook = (id: number, book: Partial<Book>) => knex<Book>('books').where({ id }).update(book);
export const deleteBook = (id: number) => knex<Book>('books').where({ id }).del();
export const getBooksByAuthor = (authorId: number) => knex<Book>('books').select('*').where({ author_id: authorId });
