import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as dotenv from "dotenv";
import * as schema from "./schema";
dotenv.config();
const client = new Client({
  connectionString: process.env.DATABASE_URL as string,
});


await client.connect();
export const db = drizzle(client, { schema, logger: true });