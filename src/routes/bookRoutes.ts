import { Router } from 'express';
import * as BookController from '../controllers/bookController';

const router = Router();

// Route to get all books
router.get('/', BookController.getBooks);

// Route to get a specific book by ID
router.get('/:id', BookController.getBookById);

// Route to create a new book
router.post('/', BookController.createBook);

// Route to update an existing book by ID
router.put('/:id', BookController.updateBook);

// Route to delete a book by ID
router.delete('/:id', BookController.deleteBook);

// Route to get all books by author ID
router.get('/author/:id', BookController.getBooksByAuthor);

// Route to get book details
router.get('/book/:bookId', BookController.getBookDetails);


export default router;
