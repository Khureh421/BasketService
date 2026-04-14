import express from 'express';
const router = express.Router();

import * as Basket from '../modules/basket.js';

router.post('/:userId', async (req, res) => {
    const [status, message] = await Basket.addToBasket(req.params.userId, req.body);
    return res.status(status).json(message);
})

router.get('/:userId', async (req, res) => {
    const [status, message] = await Basket.getBasket(req.params.userId);
    console.log(message);
    return res.status(status).json(message);
});

router.put('/:userId/:bookId', async (req, res) => {
    console.log('hit')
    const [status, message] = await Basket.updateBasketItem(req.params.userId, req.params.bookId, req.body);
    return res.status(status).json(message);
});

router.delete('/:userId/:bookId', async (req, res) => {
    const [status, message] = await Basket.removeFromBasket(req.params.userId, req.params.bookId);
    return res.status(status).json(message);
});

router.delete('/:userId', async (req, res) => {
    const [status, message] = await Basket.clearBasket(req.params.userId);
    return res.status(status).json(message);
});

export default router;