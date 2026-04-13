import express from 'express';

import * as Book from './book.js';
// import { authenticateToken } from './middleware/auth.js';

const app = express();
const port = 3000;
const router = express.Router();

app.use(express.json());

function checkMissing(requiredFields, body) {
    return requiredFields.filter(field => !body[field]);
}

router.get('/test', async (req, res) => {
    return res.status(200).json();
});

// GET /books - Retrieve all books with optional query parameters for filtering (e.g., title, author)
// GET /books/:id - Retrieve a specific book by ID
// POST /books - Create a new book
// PUT /books/:id - Update an existing book by ID
// DELETE /books/:id - Delete a book by ID

router.get('/', async (req, res) => {
    const [status, books] = await Book.getBook(req.body);
    return res.status(status).json(books);
});

router.get('/:id', async (req, res) => {
    const [status, books] = await Book.getBook({ id: req.params.id });
    return res.status(status).json(books);
});

router.post('/', async (req, res) => {
    const requiredFields = ['title', 'author', 'price', 'description'];

    const missing = checkMissing(requiredFields, req.body);
    if (missing.length > 0) {
        return res.status(400).json({
            error: 'Missing required fields',
            missing
        });
    }

    const [status, message] = await Book.addBook(req.body);

    return res.status(status).json(message);
})

router.put('/:id', async (req, res) => {
    const requiredFields = ['title', 'author', 'price', 'description'];

    const missing = checkMissing(requiredFields, req.body);
    if (missing.length > 0) {
        return res.status(400).json({
            error: 'Missing required fields',
            missing
        });
    }
    const data = { id: req.params.id, ...req.body };

    const [status, message] = await Book.updateBook(data);
    return res.status(status).json(message);
});

router.delete('/:id', async (req, res) => {
    const [status, message] = await Book.deleteBook({ id: req.params.id });
    return res.status(status).json(message);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost/${port}`);
});

app.use('/books', router);