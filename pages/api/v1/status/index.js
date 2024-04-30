import database from "infra/database.js";

async function status(request, response) {
  const updateAt = new Date().toISOString();
  const databaseCurrentVersionResult = await database.query(
    "SELECT current_setting('server_version');",
  );
  const databaseCurrentVersionValue =
    databaseCurrentVersionResult.rows[0].current_setting;

  const databaseMaxConnectionsResult = await database.query(
    "SELECT current_setting('max_connections');",
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].current_setting;

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updateAt,
    dependencies: {
      database: {
        version: databaseCurrentVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        current_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
