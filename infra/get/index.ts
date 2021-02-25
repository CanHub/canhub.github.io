import { Collection, MongoClient } from "mongodb";
import { Request, Response } from "express";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const client = new SecretManagerServiceClient();
let collection: Collection;

const { MONGO_SECRET, DB, COLLECTION } = process.env;

const connectDb = async () => {
  if (!MONGO_SECRET || !DB || !COLLECTION) {
    throw Error("Incomplete environment variables");
  }

  const [version] = await client.accessSecretVersion({ name: MONGO_SECRET });

  const mongoUrl = version?.payload?.data?.toString();

  if (!mongoUrl) {
    throw Error("No mongo url found");
  }

  const connection = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  collection = connection.db(DB).collection(COLLECTION);
};

exports.handler = async (req: Request, res: Response) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");

    return res.status(204).send("");
  }

  if (!collection) {
    await connectDb();
  }

  let daily = await getAggregatedData({ day: { $dayOfMonth: "$date" } });
  let weekly = await getAggregatedData({ week: { $week: "$date" } });
  let monthly = await getAggregatedData({});

  res.status(200).json({ daily, weekly, monthly });
};

const getAggregatedData = (options: Record<string, object>) =>
  collection
    .aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            ...options,
          },
          week: { $last: "$week" },
          month: { $last: "$month" },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray();
