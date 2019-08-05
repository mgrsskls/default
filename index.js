const express = require("express");
const twig = require("twig");

const app = express();
const port = 3000;

function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

twig.cache(false);

app.use(express.static("./src/assets/"));
app.set("views", "./src/layouts");

app.get("/", (req, res) => {
  res.render("index.twig", requireUncached(`./src/data.json`));
});

app.listen(port, () =>
  console.log(`Server started at http://localhost:${port}!`)
);
