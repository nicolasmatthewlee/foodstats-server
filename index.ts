import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.get("/api/foods/:id", async (req, res, next) => {
  try {
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/food/${req.params.id}?api_key=${process.env.KEY}`
    );

    if (response.status === 404) return res.json({ error: "not found" });
    const json = await response.json();

    return res.json(json);
  } catch (e) {
    return res.json({ error: "an unknown error occurred" });
  }
});

app.listen(443, () => console.log("listening at port 443..."));
