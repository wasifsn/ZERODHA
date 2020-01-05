const express = require("express"),
  app = express(),
  cors = require("cors");

app.use(cors());

// handle production

if (process.env.NODE_ENV === "production") {
  // static folder
  app.use(express.static(__dirname + "/public/"));

  // SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + "/public/index.html"));
}
const port = process.env.port || 5000;
const search = require("./routes/api/search");
app.use("/api", search);

app.listen(port, function() {
  console.log(`the  server has started on ${port}`);
});
