import * as mongodb from '../mongo.js';

const DB = process.env.MONGO_DB || 'Catalog'
const COLLECTION = process.env.COLLECTION || 'Collection'

function checkMissing(requiredFields, body) {
    return requiredFields.filter(field => !body[field]);
}

export async function addBook(data) {
    const requiredFields = ['title', 'author', 'price', 'description'];

    const missing = checkMissing(requiredFields, req.body);
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

    const missing = checkMissing(requiredFields, req.body);
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