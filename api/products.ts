import { db } from '@vercel/postgres';

export default async function handler(request: any, response: any) {
  try {
    const client = await db.connect();
    const result = await client.sql`SELECT * FROM products ORDER BY name ASC`;
    return response.status(200).json(result.rows);
  } catch (error: any) {
    return response.status(500).json({ error: error.message });
  }
}
