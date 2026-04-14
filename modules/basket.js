import * as mongodb from '../mongo.js';

const DB = process.env.BASKET_DB || 'SEN300'
const BOOK_COLLECTION = process.env.BOOK_COLLECTION || 'Books'
const BASKET_COLLECTION = process.env.BASKET_COLLECTION || 'Baskets'

export async function addToBasket(id, data) {
    const [status, response] = await mongodb.exists(DB, BOOK_COLLECTION, data);

    if (status == 200) {
        const data = {
            id,
            uuid: response
        }

        return mongodb.createOrIncrementDoc(DB, BASKET_COLLECTION, data);
    }
    return [status, response];
}

export async function getBasket(id) {
    return await mongodb.queryCollection(DB, BASKET_COLLECTION, BOOK_COLLECTION, id);
}

export async function updateBasketItem(id, uuid, data) {
    if (data.quantity > 0) {
        const [status, response] = await mongodb.exists(DB, BASKET_COLLECTION, { id, uuid });

        if (status == 200) {
            const format = {
                uuid,
                id,
                quantity: data.quantity
            }
            return mongodb.updateDoc(DB, BASKET_COLLECTION, format, true)
        }
        return [status, response];
    }
    return [400, 'Invalid Input']
}

export async function removeFromBasket(id, uuid) {
    return await mongodb.deleteDoc(DB, BASKET_COLLECTION, { id, uuid })
}

export async function clearBasket(id) {
    return await mongodb.deleteDoc(DB, BASKET_COLLECTION, { id })
}