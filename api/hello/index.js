const { MongoClient } = require("mongodb");

module.exports = async function (context, req) {
  const uri = process.env.MONGO_URL;

  context.log("Starting connection...");

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: { version: "1" },
  });

  try {
    await client.connect();
    context.log("Connected to DB");

    const database = client.db("webappdb");
    const collection = database.collection("items");
    context.log("Querying...");

    const results = await collection.find({}).toArray();
    context.log("Query successful", results);

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
    context.log("Connection closed");
  }
};
