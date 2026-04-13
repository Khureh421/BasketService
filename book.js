import * as mongodb from './mongo.js';

const DB = process.env.MONGO_DB || 'Catalog'
const COLLECTION = process.env.COLLECTION || 'Collection'

class Book {
    constructor(title, author, price, description) {
        Object.assign(sign, {id: crypto.randomUUID(), title, author, price, description });
    }
}

export async function addBook(data) {
    return await mongodb.createDoc(DB, COLLECTION, data);
}

export async function getBook(data) {
    return await mongodb.getDoc(DB, COLLECTION, data);
}

export async function updateBook(data) {
    return await mongodb.updateDoc(DB, COLLECTION, data);
}

export async function deleteBook(data) {
    return await mongodb.deleteDoc(DB, COLLECTION, data)
}