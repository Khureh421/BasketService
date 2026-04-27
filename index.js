import 'dotenv/config';
import { startEureka } from './config/eureka.js';

import express from 'express';

import userRoute from './routes/userRoute.js';
import basketRoute from './routes/basketRoute.js';
import bookRoute from './routes/bookRoute.js';
import orderRoute from './routes/orderRoute.js';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', async (req, res) => {
    return res.status(200).json();
});

startEureka();

app.use('/api/users', userRoute);
app.use('/api/baskets', basketRoute);
app.use('/api/books', bookRoute);
app.use('/api/orders', orderRoute);

app.listen(port, () => {
    console.log(`Server running on http://localhost/${port}`);
});