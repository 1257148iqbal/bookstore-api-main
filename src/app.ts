import express from 'express';
import authorRoutes from './routes/authorRoutes';
import bookRoutes from './routes/bookRoutes';

const app = express();

app.use(express.json());

// Routes
app.use('/authors', authorRoutes);

app.use('/books', bookRoutes);

export default app;
