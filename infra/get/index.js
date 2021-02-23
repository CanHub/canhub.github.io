const { MongoClient } = require("mongodb");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const client = new SecretManagerServiceClient();
let collection = null;

const { MONGO_SECRET, DB, COLLECTION } = process.env;

const connectDb = async () => {
  const [version] = await client.accessSecretVersion({ name: MONGO_SECRET });

  const mongoUrl = version.payload.data.toString("utf-8");

  const connection = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  collection = connection.db(DB).collection(COLLECTION);
};

exports.handler = async (req, res) => {
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

  let daily = await collection
    .aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          },
          week: { $last: "$week" },
          month: { $last: "$month" },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray();

  let weekly = await collection
    .aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            week: { $week: "$date" },
          },
          week: { $last: "$week" },
          month: { $last: "$month" },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray();

  let monthly = await collection
    .aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          week: { $last: "$week" },
          month: { $last: "$month" },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray();

  res.status(200).json({ daily, weekly, monthly });
};
