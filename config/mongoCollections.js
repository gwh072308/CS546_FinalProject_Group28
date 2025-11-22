// config/mongoCollections.js
import { MongoClient } from "mongodb";
import { mongoConfig } from "./settings.js";

const { serverUrl, database, collections } = mongoConfig;

let _client;
let _db;

const getDb = async () => {
  if (!_client) {
    _client = new MongoClient(serverUrl);
    await _client.connect();
    _db = _client.db(database);
  }
  return _db;
};

const getCollection = async (collectionName) => {
  const db = await getDb();
  return db.collection(collectionName);
};


export const arrests = async () => getCollection(collections.arrests);
export const users = async () => getCollection(collections.users);
export const comments = async () => getCollection(collections.comments);
