import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

const { PG_USER, PG_PASSWORD, PG_HOST, PG_PORT, PG_DATABASE } = process.env;

export async function initDB() {
  const adminClient = new Client({
    user: PG_USER,
    host: PG_HOST,
    database: "postgres", // default DB to run admin-level queries
    password: PG_PASSWORD,
    port: Number(PG_PORT),
  });

  try {
    await adminClient.connect();

    const res = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [PG_DATABASE]
    );

    if (res.rowCount === 0) {
      await adminClient.query(`CREATE DATABASE "${PG_DATABASE}"`);
      console.log(`✅ Database '${PG_DATABASE}' created.`);
    } else {
      console.log(`ℹ️ Database '${PG_DATABASE}' already exists.`);
    }
  } catch (err) {
    console.error("❌ Error creating database:", err);
  } finally {
    await adminClient.end();
  }

}

}

