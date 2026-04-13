import express from 'express';
const router = express.Router();

router.post('/api/basket/:userId', (req, res) => {
    const [status, message] = Basket.addToBasket(req.params.userId, req.body);
    return res.status(status).json(message);
})

router.get('api/basket/:userId', (req, res) => {
    const [status, message] = Basket.getBasket(req.params.userId);
    return res.status(status).json(message);
});

router.put('/api/basket/:userId/:bookId', (req, res) => {
    const [status, message] = Basket.updateBasketItem(req.params.userId, req.params.bookId, req.body);
    return res.status(status).json(message);
});

router.delete('/api/basket/:userId/:bookId', (req, res) => {
    const [status, message] = Basket.removeFromBasket(req.params.userId, req.params.bookId);
    return res.status(status).json(message);
});

router.delete('/api/basket/:userId', (req, res) => {
    const [status, message] = Basket.clearBasket(req.params.userId);
    return res.status(status).json(message);
});

export default router;