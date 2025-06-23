module.exports = async function (context, req) {
  const { CosmosClient } = require("@azure/cosmos");

  const endpoint = process.env.COSMOS_DB_ENDPOINT;
  const key = process.env.COSMOS_DB_KEY;

  if (!endpoint || !key) {
    context.log.error("Missing Endpoint or Key");
    context.res = {
      status: 500,
      body: JSON.stringify({ error: "Missing CosmosDB configuration" }),
    };
    return;
  }

  const client = new CosmosClient({ endpoint, key });

  try {
    const database = client.database("webappdb");
    const container = database.container("items");

    const querySpec = {
      query: "SELECT * FROM c",
    };

    const { resource: items } = await container.items
      .query(querySpec)
      .fetchAll();

    context.res = {
      status: 200,
      body: JSON.stringify(items),
      headers: {
        "Content-Type": "applications/json",
      },
    };
  } catch (err) {
    context.log.error("Database query failed", err);
    context.res = {
      status: 200,
      body: JSON.stringify({ error: err.message }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};
