import { Request, Response } from 'express';
import * as BookModel from '../models/bookModel';
import * as AuthorModel from '../models/authorModel';
import { Book } from '../types/Book';
import { validateBook } from '../validators/bookValidator';
import {
  handleNotFoundError,
  handleValidationError,
  handleDatabaseConnectionError,
  handleServerError,
} from '../utils/errorHandlers';

/**
 * Controller to get all books.
 * @param req - Express request object.
 * @param res - Express response object.
 */
export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const page = parseInt(req.query.page as string, 10) || 1;
    const offset = (page - 1) * limit;
    const search = req.query.search as string || '';

    const [books, totalBooks] = await Promise.all([
      BookModel.getBooks(limit, offset, search),
      BookModel.getBooksCount(search),
    ]);

    res.status(200).json({
      data: books,
      pagination: {
        total: totalBooks,
        page,
        limit,
        totalPages: Math.ceil(totalBooks / limit),
      },
    });
  } catch (error: any) {
    if (error.message.includes('connect')) {
      handleDatabaseConnectionError(res, error);
    } else {
      handleServerError(res, error, 'Failed to fetch books');
    }
  }
};

/**
 * Controller to get a single book by ID.
 * @param req - Express request object, containing the book ID in params.
 * @param res - Express response object.
 */
export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const book = await BookModel.getBookById(parseInt(id, 10));
    if (book) {
      res.status(200).json(book);
    } else {
      handleNotFoundError(res, 'Book not found');
    }
  } catch (error: any) {
    if (error.message.includes('connect')) {
      handleDatabaseConnectionError(res, error);
    } else {
      handleServerError(res, error, 'Failed to fetch book');
    }
  }
};

/**
 * Controller to create a new book.
 * @param req - Express request object, containing the new book data in body.
 * @param res - Express response object.
 */
export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validateBook(req.body);
    if (errors) {
      return handleValidationError(res, errors);
    }

    const newBook = req.body;

    // Check if author_id exists in the authors table
    const authorExists = await AuthorModel.getAuthorById(newBook.author_id);
    if (!authorExists) {
      return handleNotFoundError(res, 'Author does not exist');
    }

    await BookModel.createBook(newBook);
    res.status(201).json({ message: 'Book created successfully' });

  } catch (error: any) {
    if (error.message.includes('connect')) {
      handleDatabaseConnectionError(res, error);
    } else {
      handleServerError(res, error, 'Failed to create book');
    }
  }
};

/**
 * Controller to update an existing book.
 * @param req - Express request object, containing the book ID in params and update data in body.
 * @param res - Express response object.
 */
export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validateBook(req.body);
    if (errors) {
      return handleValidationError(res, errors);
    }

    const { id } = req.params;
    const bookUpdates: Partial<Book> = req.body;

    const authorExists = await AuthorModel.getAuthorById(bookUpdates.author_id!);
    if (!authorExists) {
      return handleNotFoundError(res, 'Author does not exist');
    }

    const updated = await BookModel.updateBook(parseInt(id, 10), bookUpdates);
    if (updated) {
      res.status(200).json({ message: 'Book updated successfully' });
    } else {
      handleNotFoundError(res, 'Book not found');
    }
  } catch (error: any) {
    if (error.message.includes('connect')) {
      handleDatabaseConnectionError(res, error);
    } else {
      handleServerError(res, error, 'Failed to update book');
    }
  }
};

/**
 * Controller to delete a book by ID.
 * @param req - Express request object, containing the book ID in params.
 * @param res - Express response object.
 */
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await BookModel.deleteBook(parseInt(id, 10));
    if (deleted) {
      res.status(200).json({ message: 'Book deleted successfully' });
    } else {
      handleNotFoundError(res, 'Book not found');
    }
  } catch (error: any) {
    if (error.message.includes('connect')) {
      handleDatabaseConnectionError(res, error);
    } else {
      handleServerError(res, error, 'Failed to delete book');
    }
  }
};

/**
 * Controller to get all books by author ID.
 * @param req - Express request object, containing the author ID in params.
 * @param res - Express response object.
 */
export const getBooksByAuthor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const authorId = parseInt(id, 10);
    if (!authorId) {
      handleNotFoundError(res, 'Author ID is required');
      return;
    }
    const books = await BookModel.getBooksByAuthor(authorId);
    res.status(200).json(books);
  } catch (error: any) {
    if (error.message.includes('connect')) {
      handleDatabaseConnectionError(res, error);
    } else {
      handleServerError(res, error, 'Failed to fetch author books');
    }
  }
};

/**
 * Controller to get book details.
 * @param req - Express request object, containing the book ID in params.
 * @param res - Express response object.
 */

export const getBookDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookId = parseInt(req.params.bookId, 10);

    const book = await BookModel.getBookById(bookId);
    if (!book) {
      handleNotFoundError(res, 'Book not found');
      return;
    }

    const author = await AuthorModel.getAuthorById(book.author_id);
    res.status(200).json({ ...book, author });
  } catch (error: any) {
    handleServerError(res, error, 'Failed to fetch book details');
  }
};