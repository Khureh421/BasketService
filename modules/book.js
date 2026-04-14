import * as mongodb from '../mongo.js';

const DB = process.env.BASKET_DB || 'SEN300'
const COLLECTION = process.env.BOOK_COLLECTION || 'Books'

function checkMissing(requiredFields, body) {
    return requiredFields.filter(field => !body[field]);
}

export async function addBook(data) {
    const requiredFields = ['title', 'author', 'price', 'description'];

    const missing = checkMissing(requiredFields, data);
    if (missing.length > 0) {
        return res.status(400).json({
            error: 'Missing required fields',
            missing
        });
    }

    return await mongodb.createDoc(DB, COLLECTION, data);
}

export async function getBook(data) {
    return await mongodb.getDoc(DB, COLLECTION, data);
}

export async function updateBook(data) {
    const requiredFields = ['title', 'author', 'price', 'description'];

    const missing = checkMissing(requiredFields, data);
    if (missing.length > 0) {
        return res.status(400).json({
            error: 'Missing required fields',
            missing
        });
    }

    return await mongodb.updateDoc(DB, COLLECTION, data);
}

export async function deleteBook(data) {
    return await mongodb.deleteDoc(DB, COLLECTION, data)
}