import express from 'express';
import { publishOrder } from '../modules/publishOrder.js';

const router = express.Router();

const DB = process.env.BASKET_DB || 'SEN300';
const COLLECTION = process.env.ORDERS_COLLECTION || 'Orders';

import * as mongodb from '../mongo.js';

function checkMissing(requiredFields, body) {
    return requiredFields.filter(field => !body[field]);
}

router.post('/', async (req, res) => {
    const requiredFields = ['userId', 'itemList', 'totalPrice'];
    const missing = checkMissing(requiredFields, req.body);

    if (missing.length > 0) {
        return res.status(400).json({
            error: 'Missing required fields',
            missing
        });
    }

    const [status, message] = await mongodb.createDoc(DB, COLLECTION, req.body, 'orderId');

    if (status == 201) {
        await publishOrder(req.body);
    }

    return res.status(status).json(message == 'Created' ? 'Order created' : 'Order error');
})

router.get('/', async (req,res) => {
    const [status, result] = await mongodb.getDoc(DB, COLLECTION, req.body);

    return res.status(status).json(result);
})

router.get('/:order_id', async (req, res) => {
    const [status, result] = await mongodb.getDoc(DB, COLLECTION, { orderId: Number(req.params.order_id) })

    return res.status(status).json(result);
})

router.put('/:order_id', async (req, res) => {
    const [status, result] = await mongodb.updateDoc(DB, COLLECTION, { orderId: Number(req.params.order_id), ...req.body })

    return res.status(status).json(result);
})

router.delete('/:order_id', async (req, res) => {
    const [status, message] = await mongodb.deleteDoc(DB, COLLECTION, { orderId: Number(req.params.order_id) })

    return res.status(status).json(message);
})

export default router;