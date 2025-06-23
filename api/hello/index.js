const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;

const client = new CosmosClient({ endpoint, key });

module.exports = async function (context, req) {
  context.log("Fetching items");

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
      body: items,
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (err) {
    context.log.error("Error querying CosmosDB", err);
    context.res = {
      status: 500,
      body: "Error querying DB" + err.message,
    };
  }
};
