const { readFileSync} = require("fs");
const pg = require("pg");
require("@tensorflow/tfjs");
const use = require("@tensorflow-models/universal-sentence-encoder");
import Anime from "@/anime";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

const caCertPath = path.resolve('./certificates/ca.pem');

const config = {
  user: process.env.PG_NAME,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: "defaultdb",
  ssl: {
    rejectUnauthorized: true,
    ca: readFileSync(caCertPath).toString(),
  },
};

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Anime[]>
) {
  const model = await use.load();
  const embeddings = await model.embed(req.query.search);
  const embeddingArray = embeddings.arraySync()[0];

  const client = new pg.Client(config);
  await client.connect();

  try {
    const pgResponse = await client.query(
      `SELECT * FROM anime_plots ORDER BY embedding <-> '${JSON.stringify(
        embeddingArray
      )}' LIMIT 20;`
    );
    res.status(200).json(pgResponse.rows);
  } catch (err) {
    console.log(err);
  } finally {
    await client.end();
  }
}
