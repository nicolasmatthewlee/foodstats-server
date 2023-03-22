import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import https from "https";
import path, { resolve } from "path";
dotenv.config();

const app = express();
app.use(cors({ credentials: true, origin: "http://127.0.0.1" }));

// client repository must be adjacent to server repository
const clientPath = "../foodstats-client/build";
if (!fs.existsSync(clientPath))
  throw Error("Client build directory does not exist");
app.use(express.static(clientPath));

app.get("/api/foods/search", async (req, res, next) => {
  if (req.query.query === undefined) req.query.query = "";
  try {
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.KEY}&query=${req.query.query}`
    );
    const json = await response.json();
    return res.json(json);
  } catch (e) {
    return next(e);
  }
});

app.get("/api/foods/:id", async (req, res, next) => {
  try {
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/food/${req.params.id}?api_key=${process.env.KEY}`
    );
    if (response.status === 404) return res.json({ error: "not found" });
    const json = await response.json();
    return res.json(json);
  } catch (e) {
    return next(e);
  }
});

app.get("*", (req: Request, res: Response, next: NextFunction) => {
  res.sendFile(path.join(resolve(clientPath), "index.html"));
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    console.log(err.stack);
    res.status(500).json({ error: "an unknown error occurred" });
  }
});

if (process.env.DIST) {
  https
    .createServer(
      {
        key: fs.readFileSync("/etc/letsencrypt/live/foodstats.net/privkey.pem"),
        cert: fs.readFileSync("/etc/letsencrypt/live/foodstats.net/cert.pem"),
        ca: fs.readFileSync("/etc/letsencrypt/live/foodstats.net/chain.pem"),
      },
      app
    )
    .listen(process.env.PORT || 443); // must be 443
} else
  app.listen(process.env.PORT || 80, () =>
    console.log(`listening at port ${process.env.PORT || 80}...`)
  );
