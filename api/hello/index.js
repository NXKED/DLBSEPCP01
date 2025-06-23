const { MongoClient } = require("mongodb");

module.exports = async function (context, req) {
  try {
    context.log("Starting function...");

    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) throw new Error("MongoDB env variable not set");

    context.log("Using connection string:", mongoUrl);

    const client = new MongoClient(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: { version: "1" },
    });

    await client.connect();
    context.log("COnnected to Mdb");

    const database = client.db("webappdb");

    const items = await database.collection("items").find().toArray();

    context.log(`Fetched ${items.length} items`);

    await client.close();
    context.log("Connection closed");

    context.res = {
      status: 200,
      body: items,
    };
  } catch (err) {
    context.log.error("Error caught", err);
    context.res = {
      status: 500,
      body: {
        message: "Function error",
        error: error.message,
        stack: error.stack,
      },
      headers: { "Content-Type": "application/json" },
    };
  } finally {
    await client.close();
  }
};
