const axios = require("axios");
const { MongoClient } = require("mongodb");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const client = new SecretManagerServiceClient();
let collection = null;

const { MONGO_SECRET, DB, COLLECTION, SCRAPE_LINK } = process.env;

const connectDb = async () => {
  const [version] = await client.accessSecretVersion({ name: MONGO_SECRET });

  const mongoUrl = version.payload.data.toString("utf-8");

  const connection = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  collection = connection.db(DB).collection(COLLECTION);
};

exports.handler = async (_req, res) => {
  if (!collection) {
    await connectDb();
  }

  let { data } = await axios.get(SCRAPE_LINK);

  const obj = { ...data, date: new Date() };

  await collection.insertOne(obj);

  res.status(200).end();
};
