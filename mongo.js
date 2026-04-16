import dotenv from 'dotenv';
dotenv.config();

import { MongoClient, ObjectId } from 'mongodb';
import { authenticateLogin } from './middleware/auth.js';
import getUUID from 'uuid-by-string';

import bcrypt from 'bcrypt';
import crypto from 'crypto';

const client = new MongoClient(process.env.MONGO_URI);

const getNextSequence = async (name, db) => {
    const result = await db.collection("counters").findOneAndUpdate(
        { _id: name },
        { $inc: { seq: 1 } },
        { returnDocument: "after", upsert: true }
    );
    return result.seq;
};

export async function exists(DB, COLLECTION, data) {
    try {
        await client.connect();

        const db = client.db(DB);
        const collection = db.collection(COLLECTION);

        const doc = await collection.findOne(data);

        return !!doc ? [200, doc.uuid] : [404, 'Not found'];
    } catch (error) {
        console.error(error);
        return [500, error];
    } finally {
        await client.close();
    }
}

export async function createLogin(DB, COLLECTION, data) {
    try {
        await client.connect();

        const db = client.db(DB);
        const collection = db.collection(COLLECTION);

        if (await collection.findOne({ username: data.username })) {
            return [409, 'Already Exist'];
        }

        const doc = {
            user_id: await getNextSequence('userId', db),
            username: data.username,
            first_name: data.first_name,
            last_name: data.last_name,
            hashed_password: await bcrypt.hash(data.password, 10)
        }

        await collection.insertOne(doc);
        return [201, 'Created'];
    } catch (error) {
        console.error(error);
        return [500, error];
    } finally {
        await client.close();
    }
}

export async function login(DB, COLLECTION, data) {
    try {
        await client.connect();

        const db = client.db(DB);
        const collection = db.collection(COLLECTION);

        const doc = await collection.findOne({ username: data.username });

        if (doc) {
            if (await bcrypt.compare(data.password, doc.hashed_password)) {

                const token = authenticateLogin(doc.user_id, doc.username, doc.first_name, doc.last_name);
                return [200, token];
            }
            return [401, 'Unauthorized'];
        }
        return [404, 'Not Found'];
    } catch (error) {
        console.error(error);
        return [500, error];
    } finally {
        await client.close();
    }
}

export async function createDoc(DB, COLLECTION, data) {
    try {
        await client.connect();

        const db = client.db(DB);
        const collection = db.collection(COLLECTION);

        const key = Object.keys(data)[0];

        if (await collection.findOne({ [key]: data[key] })) {
            return [409, 'Already Exist'];
        }

        data = { uuid: getUUID(Object.values(data)[0]), ...data };

        await collection.insertOne(data);
        return [201, 'Created'];
    } catch (error) {
        console.error(error);
        return [500, error];
    } finally {
        await client.close();
    }
}

export async function getDoc(DB, COLLECTION, data) {
    try {
        await client.connect();

        data = data ?? {};

        const db = client.db(DB);
        const collection = db.collection(COLLECTION);

        // const query = Object.fromEntries(
        //     Object.entries(data).map(([key, value]) => {
        //         if (key === 'id') return [key, new ObjectId(value)];
        //         return [key, { $regex: value, $options: 'i' }];
        //     }).filter(Boolean)
        // );

        const docs = await collection.find(data).toArray();
        return [200, docs];
    } catch (error) {
        console.error(error);
        return [500, error];
    } finally {
        await client.close();
    }
}

export async function updateDoc(DB, COLLECTION, data, compare = false) {
    try {
        await client.connect();

        const db = client.db(DB);
        const collection = db.collection(COLLECTION);

        if (compare) {
            const { quantity, ...query } = data;

            const doc = await collection.findOne(query);

            if (!doc) return [404, 'Not found']

            await collection.updateOne(
                { _id: new ObjectId(doc._id) },
                { $set: data }
            )
        } else {
            const query =
                data.uuid
                    ? { uuid: String(data.uuid) }
                    : data.user_id
                        ? { user_id: data.user_id }
                        : Object.fromEntries(Object.entries(data).slice(0, 1));

            if (!Object.keys(query).length) {
                throw new Error("No valid search criteria provided");
            }

            const doc = await collection.findOne(query);

            if (!doc) return [404, 'Not found']

            const { uuid, ...updateFields } = data;

            await collection.updateOne(
                { _id: new ObjectId(doc._id) },
                { $set: updateFields }
            )
        }
        return [200, 'Updated'];
    } catch (error) {
        console.error(error);
        return [500, error];
    } finally {
        await client.close();
    }
}

export async function deleteDoc(DB, COLLECTION, data) {
    try {
        await client.connect();

        const db = client.db(DB);
        const collection = db.collection(COLLECTION);

        await collection.deleteMany(data);
        return [200, 'Deleted'];
    } catch (error) {
        console.error(error);
        return [500, error];
    } finally {
        await client.close();
    }
}

export async function createOrIncrementDoc(DB, COLLECTION, data) {
    try {
        await client.connect();

        const db = client.db(DB);
        const collection = db.collection(COLLECTION);

        const doc = await collection.findOne(data);

        if (doc) {
            await collection.updateOne(data,
                {
                    $inc: { quantity: 1 }
                }
            )
        } else {
            await collection.insertOne({
                ...data,
                quantity: 1
            });
        }
        return [200, 'Added to basket']
    } catch (error) {
        console.error(error);
        return [500, error];
    } finally {
        await client.close();
    }
}

export async function queryCollection(DB, COLLECTION_A, COLLECTION_B, id) {
    try {
        await client.connect();

        const db = client.db(DB);
        const collection_a = db.collection(COLLECTION_A);
        const collection_b = db.collection(COLLECTION_B);

        const docs = await collection_a.find({ id }).toArray();

        if (!docs.length) {
            return [404, "Not found"];
        }

        const uuidToQuantity = {};

        const uuids = docs.map(doc => {
            uuidToQuantity[doc.uuid] = doc.quantity;
            return doc.uuid;
        });

        const results = await collection_b
            .find({ uuid: { $in: uuids } })
            .toArray();

        const enriched = results.map(item => ({
            ...item,
            quantity: uuidToQuantity[item.uuid] ?? 0
        }));

        return [200, enriched];
    } catch (error) {
        console.error(error);
        return [500, error];
    } finally {
        await client.close();
    }
}