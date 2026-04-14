import express from 'express';

import userRoute from './routes/userRoute.js';
import basketRoute from './routes/basketRoute.js';
import bookRoute from './routes/bookRoute.js';

const app = express();
const port = 3000;
const router = express.Router();

app.use(express.json());

app.get('/', async (req, res) => {
    return res.status(200).json();
});

app.use('/api/user', userRoute);
app.use('/api/baskets', basketRoute);
app.use('/api/books', bookRoute);

app.listen(port, () => {
    console.log(`Server running on http://localhost/${port}`);
});