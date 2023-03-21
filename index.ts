import express from "express";

const app = express();

app.get("/", (req, res, next) => {
  return res.send("/");
});

app.listen(443, () => console.log("listening at port 443..."));
