import dotenv from 'dotenv';
dotenv.config();

import { MongoClient, ObjectId } from 'mongodb';
import { authenticateLogin } from './middleware/auth.js';
import { bcrypt } from 'bcrypt';
import { crypto } from 'crypto';

const client = new MongoClient(process.env.MONGO_URI);

const getHash = async (password) => {
    return bcrypt.hash(password, 10);
}

const getNextSequence = async (name, db) => {
    const result = await db.collection("counters").findOneAndUpdate(
        { _id: name },
        { $inc: { seq: 1 } },
        { returnDocument: "after", upsert: true }
    );
    return result.seq;
};

export async function createLogin(DB, COLLECTION, data) {
    try {
        await client.connect();

        const db = client.db(process.env.MONGO_DB);
        const collection = db.collection(process.env.USERS_COLLECTION);

        if (await collection.findOne({ username: data.username })) {
            return [409, 'Already Exist'];
        }

        const id = crypto.randomUUID();

        const doc = {
            userId: id,
            username: data.username,
            password: getHash(data.password)
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
            const password = getHash(password);
            if (doc.password == password) {

                const token = authenticateLogin(doc.userId, doc.username);
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

        if (await collection.findOne({ title: data.title })) {
            return [409, 'Already Exist'];
        }

        data = { id: await getNextSequence('id', db), ...data };

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

        const query = Object.fromEntries(
            Object.entries(data).map(([key, value]) => {
                if (key === 'id') return [key, new ObjectId(value)];
                return [key, { $regex: value, $options: 'i' }];
            }).filter(Boolean)
        );

        const books = await collection.find(query).toArray();
        return [200, books];
    } catch (error) {
        console.error(error);
        return [500, error];
    } finally {
        await client.close();
    }
}

export async function updateDoc(DB, COLLECTION, data) {
    try {
        await client.connect();

        const db = client.db(DB);
        const collection = db.collection(COLLECTION);

        const doc = await collection.findOne({ id: Number(data.id) })
        if (!doc) return [409, 'Not found']

        const { id, ...updateFields } = data;

        await collection.updateOne(
            { _id: new ObjectId(doc._id) },
            { $set: updateFields } 
        )
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

        const doc = await collection.findOne({ id: Number(data.id) })
        if (!doc) return [409, 'Not found']

        await collection.deleteOne({ id: data.id });
        return [200, 'Deleted'];
    } catch (error) {
        console.error(error);
        return [500, error];
    } finally {
        await client.close();
    }
}