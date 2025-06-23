const { MongoClient } = require("mongodb");
module.exports = async function (context, req) {
  context.log("MongoDB function triggered");

  const mongoUrl = process.env.MONGO_URL;

  if (!mongoUrl) {
    context.log.error("Missing Endpoint or Key");
    context.res = {
      status: 500,
      body: JSON.stringify({ error: "Missing CosmosDB configuration" }),
    };
    return;
  }

  const client = new MongoClient(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: { version: "1" },
  });

  try {
    await client.connect();
    const database = client.db("webappdb");
    const collection = database.collection("items");

    const items = await collection.find({}).toArray();

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: items,
    };
  } catch (err) {
    context.log.error("Database query failed", err);
    context.res = {
      status: 200,
      body: JSON.stringify({ error: err.message }),
    };
  } finally {
    await client.close();
  }
};
