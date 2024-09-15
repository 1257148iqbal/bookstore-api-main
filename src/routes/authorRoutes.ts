// src/routes/authorRoutes.ts
import { Router } from 'express';
import * as AuthorController from '../controllers/authorController';

const router = Router();

// Route to get all authors
router.get('/', AuthorController.getAuthors);

// Route to get a specific author by ID
router.get('/:id', AuthorController.getAuthorById);

// Route to create a new author
router.post('/', AuthorController.createAuthor);

// Route to update an existing author by ID
router.put('/:id', AuthorController.updateAuthor);

// Route to delete an author by ID
router.delete('/:id', AuthorController.deleteAuthor);

// Route to get author details
router.get('/author/:authorId', AuthorController.getAuthorDetails)

// Route to get authors with associated books
router.get('/authors-with-books', AuthorController.getAuthorsWithBooks);

export default router;
