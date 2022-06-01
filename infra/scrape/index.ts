import axios from "axios";
import { MongoClient, Collection } from "mongodb";
import { Request, Response } from "express";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const client = new SecretManagerServiceClient();
let collection: Collection;

const { MONGO_SECRET, DB, COLLECTION, SCRAPE_LINK } = process.env;

const connectDb = async () => {
  if (!MONGO_SECRET || !DB || !COLLECTION || !SCRAPE_LINK) {
    throw Error("Incomplete environment variables");
  }

  const [version] = await client.accessSecretVersion({ name: MONGO_SECRET });

  const mongoUrl = version?.payload?.data?.toString();

  if (!mongoUrl) {
    throw Error("No mongo url found");
  }

  const connection = await MongoClient.connect(mongoUrl);

  collection = connection.db(DB).collection(COLLECTION);
};

exports.handler = async (_req: Request, res: Response) => {
  if (!collection) {
    await connectDb();
  }

  let { data } = await axios.get(SCRAPE_LINK);

  const obj = { ...data, date: new Date() };

  await collection.insertOne(obj);

  res.status(200).end();
};
