const { readFileSync } = require("fs");
const pg = require("pg");
import * as tf from '@tensorflow/tfjs';
const use = require("@tensorflow-models/universal-sentence-encoder");
import Movie from "@/movie";
import type { NextApiRequest, NextApiResponse } from "next";

const config = {
  user: process.env.PG_NAME,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: "defaultdb",
  ssl: {
    rejectUnauthorized: true,
    ca: readFileSync("./certificates/ca.pem").toString(),
  },
};



type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Movie[]>
) {
  const model = await use.load();
  const embeddings = await model.embed(req.body.search);
  const embeddingArray = embeddings.arraySync()[0];

  const client = new pg.Client(config);
  await client.connect();

  try {
    const pgResponse = await client.query(
      `SELECT * FROM movie_plots ORDER BY embedding <-> '${JSON.stringify(
        embeddingArray
      )}' LIMIT 5;`
    );
    res.status(200).json(pgResponse.rows);
  } catch (err) {
    console.log(err);
  } finally {
    await client.end();
  }
}
