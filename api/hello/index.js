const { MongoClient } = require("mongodb");

module.exports = async function (context, req) {
  let client;

  try {
    context.log("Starting function...");

    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) throw new Error("MongoDB env variable not set");

    context.log("Using connection string:", mongoUrl);

    client = new MongoClient(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    context.log("COnnected to Mdb");

    const database = client.db("webappdb");

    const items = await database.collection("items").find().toArray();

    context.log(`Fetched ${items.length} items`);

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
        error: err.message,
        stack: err.stack,
      },
      headers: { "Content-Type": "application/json" },
    };
  } finally {
    if (client) {
      try {
        await client.close();
        context.log("MongoDB connection closed");
      } catch (closeErr) {
        context.log.error("Error closing connection", closeErr);
      }
    }
  }
};
