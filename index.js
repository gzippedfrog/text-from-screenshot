const express = require("express");
const { screenshotAndSend } = require("./utils");

const app = express();
const host = "127.0.0.1";
const port = 7000;

app.use(express.static("public"));

app.get("/screenshot", (req, res) => {
  res.status(200);
  screenshotAndSend();
  res.redirect("/");
});

app.use((req, res, next) => {
  res.status(200);
  res.redirect("/");
});

app.listen(port, host, function () {
  console.log(`Server listens http://${host}:${port}`);
});
