require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const port = process.env.PORT || 3000;

app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", __dirname + "/views");

app.get("/", (req, res) => {
  res.render("index", { layout: "main" });
});
app.listen(port, () => {
  console.log(`Example app listening @ http://localhost:${port}`);
});

module.exports = {
  app,
};
