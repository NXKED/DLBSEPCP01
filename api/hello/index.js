const { MongoClient } = require("mongodb");

module.exports = async function (context, req) {
  const uri = process.env.MONGO_URL;

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: { version: "1" },
  });

  try {
    await client.connect();

    const database = client.db("webappdb");
    const collection = database.collection("items");

    const results = await collection.find({}).toArray();

    context.res = {
      status: 200,
      body: results,
    };
  } catch (err) {
    context.log("ERROR:", err);
    context.res = {
      status: 500,
      body: "Database query failed: " + err.message,
    };
  } finally {
    await client.close();
  }
};
