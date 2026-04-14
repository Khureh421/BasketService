import express from 'express';

import * as Book from '../modules/book.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const [status, books] = await Book.getBook(req.body);
    return res.status(status).json(books);
});

router.get('/:id', async (req, res) => {
    const [status, books] = await Book.getBook({ id: req.params.id });
    return res.status(status).json(books);
});

router.post('/', async (req, res) => {
    const [status, message] = await Book.addBook(req.body);
    return res.status(status).json(message);
})

router.put('/:id', async (req, res) => {
    const data = { uuid: req.params.id, ...req.body };

    const [status, message] = await Book.updateBook(data);
    return res.status(status).json(message);
});

router.delete('/:id', async (req, res) => {
    const [status, message] = await Book.deleteBook({ id: req.params.id });
    return res.status(status).json(message);
});

export default router;