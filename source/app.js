require("dotenv").config();
require("./utils/utils").default;
const express = require("express");
const exphbs = require("express-handlebars");
const { getAuthToken } = require("./utils/utils");
const app = express();
const port = process.env.PORT || 3000;

app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", __dirname + "/views");

app.get("/", async (req, res) => {
  let token = await getAuthToken(
    process.env.SPOTIFY_ID,
    process.env.SPOTIFY_SECRET
  );
  res.render("index", { layout: "main" });
});
app.listen(port, () => {
  console.log(`Example app listening @ http://localhost:${port}`);
});

module.exports = {
  app,
};
