import { Request, Response } from 'express';
import * as AuthorModel from '../models/authorModel';
import * as BookModel from '../models/bookModel';
import { Author } from '../types/Author';
import { validateAuthor } from '../validators/authorValidator';
import {
  handleNotFoundError,
  handleValidationError,
  handleDatabaseConnectionError,
  handleServerError,
} from '../utils/errorHandlers';

/**
 * Controller to get all authors.
 * 
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns - JSON response containing the list of authors or an error message.
 */
export const getAuthors = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const page = parseInt(req.query.page as string, 10) || 1;
    const offset = (page - 1) * limit;
    const search = req.query.search as string || '';

    const [authors, totalAuthors] = await Promise.all([
      AuthorModel.getAuthors(limit, offset, search),
      AuthorModel.getAuthorsCount(search),
    ]);

    res.status(200).json({
      data: authors,
      pagination: {
        total: totalAuthors,
        page,
        limit,
        totalPages: Math.ceil(totalAuthors / limit),
      },
    });
  } catch (error: any) {
    if (error.message.includes('connect')) {
      handleDatabaseConnectionError(res, error);
    } else {
      handleServerError(res, error, 'Failed to fetch authors');
    }
  }
};

/**
 * Controller to get a single author by ID.
 * 
 * @param req - Express request object, containing the author ID in params.
 * @param res - Express response object.
 * @returns - JSON response containing the author or an error message if not found.
 */
export const getAuthorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const author = await AuthorModel.getAuthorById(parseInt(id, 10));
    if (author) {
      res.status(200).json(author);
    } else {
      handleNotFoundError(res, 'Author not found');
    }
  } catch (error: any) {
    if (error.message.includes('connect')) {
      handleDatabaseConnectionError(res, error);
    } else {
      handleServerError(res, error, 'Failed to fetch author');
    }
  }
};

/**
 * Controller to create a new author.
 * 
 * @param req - Express request object, containing the new author data in body.
 * @param res - Express response object.
 * @returns - JSON response confirming creation or an error message.
 */
export const createAuthor = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validateAuthor(req.body);
    if (errors) {
      return handleValidationError(res, errors);
    }

    const newAuthor: Author = req.body;
    await AuthorModel.createAuthor(newAuthor);
    res.status(201).json({ message: 'Author created successfully' });
  } catch (error: any) {
    if (error.message.includes('connect')) {
      handleDatabaseConnectionError(res, error);
    } else {
      handleServerError(res, error, 'Failed to create author');
    }
  }
};

/**
 * Controller to update an existing author.
 * 
 * @param req - Express request object, containing the author ID in params and update data in body.
 * @param res - Express response object.
 * @returns - JSON response confirming update or an error message if author not found.
 */
export const updateAuthor = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validateAuthor(req.body);
    if (errors) {
      return handleValidationError(res, errors);
    }

    const { id } = req.params;
    const authorUpdates: Partial<Author> = req.body;
    const updated = await AuthorModel.updateAuthor(parseInt(id, 10), authorUpdates);
    if (updated) {
      res.status(200).json({ message: 'Author updated successfully' });
    } else {
      handleNotFoundError(res, 'Author not found');
    }
  } catch (error: any) {
    if (error.message.includes('connect')) {
      handleDatabaseConnectionError(res, error);
    } else {
      handleServerError(res, error, 'Failed to update author');
    }
  }
};

/**
 * Controller to delete an author by ID.
 * @param req - Express request object, containing the author ID in params.
 * @param res - Express response object.
 * @returns - JSON response confirming deletion or an error message if author not found.
 */
export const deleteAuthor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await AuthorModel.deleteAuthor(parseInt(id, 10));
    if (deleted) {
      res.status(200).json({ message: 'Author deleted successfully' });
    } else {
      handleNotFoundError(res, 'Author not found');
    }
  } catch (error: any) {
    if (error.message.includes('connect')) {
      handleDatabaseConnectionError(res, error);
    } else {
      handleServerError(res, error, 'Failed to delete author');
    }
  }
};

/**
 * Controller to get author details.
 * @param req - Express request object, containing the author ID in params.
 * @param res - Express response object.
 * @returns - JSON response containing the author and associated books or an error message if not found.
 * 
 */

export const getAuthorDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const authorId = parseInt(req.params.authorId, 10);

    const author = await AuthorModel.getAuthorById(authorId);
    if (!author) {
      handleNotFoundError(res, 'Author not found');
      return;
    }

    const books = await BookModel.getBooksByAuthor(authorId);

    res.status(200).json({ ...author, books });
  } catch (error: any) {
    handleServerError(res, error, 'Failed to fetch author details');
  }
};


/**
 * Controller to get all authors with associated books.
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns - JSON response containing the authors and associated books or an error message if not found.
 */
export const getAuthorsWithBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const authors = await AuthorModel.getAllAuthors();

    const authorsWithBooks = await Promise.all(
      authors.map(async (author) => {
        const books = await BookModel.getBooksByAuthor(author?.id!);
        return { ...author, books };
      })
    );

    res.status(200).json(authorsWithBooks);
  } catch (error: any) {
    handleServerError(res, error, 'Failed to fetch authors with books');
  }
};