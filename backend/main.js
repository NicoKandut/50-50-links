const express = require("express"),
  mongoose = require("mongoose"),
  documents = require("./schemas/documents.js"),
  bodyParser = require("body-parser"),
  app = express();

// env
const PORT = process.env.PORT || 3000,
  USER = process.env.DB_USER || "db_admin_xdsc13",
  PASSWORD = process.env.DB_PASS || "ns83-bf0!-bsd0-32x3-e2ec",
  ADDRESS = process.env.DB_ADDRESS || "ds245512.mlab.com:45512/50-50-links";

// use
app.use(express.static("frontend"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// mongoose
mongoose.connect(`mongodb://${USER}:${PASSWORD}@${ADDRESS}`);

// Routing
app.get("/", (req, res) => res.redirect("/index.html"));
app.get("/all", getAll);
app.get("/link/:linkName", access);
app.post("/new", create);

// helpers
function access(req, res) {
  documents.findOne(
    {
      name: req.params.linkName,
    },
    (err, doc) => {
      if (err) return res.status(500).json(err);
      if (!doc || !doc.urls) return res.status(404).send("Link not found.");

      let idx = Math.round(Math.abs(Math.random() * doc.urls.length - 1));
      res.status(301).redirect(doc.urls[idx]);
    }
  );
}

function getAll(req, res) {
  documents.find({}, (err, docs) => {
    if (err) return res.status(500).json(err);

    res.json(docs);
  });
}

function create(req, res) {
  let name = req.body.name,
    urls = req.body.urls;

  // check
  if (!name || name === "") return res.status(400).send("Name is required.");
  if (!urls || urls.length < 2)
    return res.status(400).send("At least two urls are required.");

  let link = documents({
    name: name,
    urls: urls,
  });

  // save
  link.save((err) => {
    if (err) return res.status(409).send("Name already taken.");

    res.sendStatus(201);
  });
}

// start
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));
