import express from 'express';
const router = express.Router();

import * as mongodb from '../mongo.js';

const DB = process.env.BASKET_DB || 'SEN300'
const COLLECTION = process.env.USERS_COLLECTION || 'Users'

function checkMissing(requiredFields, body) {
    return requiredFields.filter(field => !body[field]);
}

router.post('/register', async (req, res) => {
    const requiredFields = ['username', 'password', 'first_name', 'last_name'];
    const missing = checkMissing(requiredFields, req.body);

    if (missing.length > 0) {
        return res.status(400).json({
            error: 'Missing required fields',
            missing
        });
    }

    const [status, message] = await mongodb.createLogin(DB, COLLECTION, req.body);
    return res.status(status).send(message);
});

router.post('/login', async (req, res) => {
    const requiredFields = ['username', 'password'];
    const missing = checkMissing(requiredFields, req.body);

    if (missing.length > 0) {
        return res.status(400).json({
            error: 'Missing required fields',
            missing
        });
    }

    const [status, token] = await mongodb.login(DB, COLLECTION, req.body);
    return res.status(status).json({ Bearer: token });
})

router.get('/', async (req, res) => {
    const [status, users] = await mongodb.getDoc(DB, COLLECTION)
    return res.status(status).json(users)
})

router.get('/:id', async (req, res) => {
    const [status, user] = await mongodb.getDoc(DB, COLLECTION, { user_id: Number(req.params.id) });
    return res.status(status).json(user);
})

router.put('/:id', async(req,res) => {
    const [status, message] = await mongodb.updateDoc(DB, COLLECTION, { user_id: Number(req.params.id), ...req.body });
    return res.status(status).json(message);
})

router.delete('/:id', async (req, res) => {
    const [status, message] = await mongodb.deleteDoc(DB, COLLECTION, { user_id: Number(req.params.id) });
    return res.status(status).json(message);
})

export default router;