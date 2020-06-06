var express = require("express"),
  app = express(),
  port = 3000,
  server = require("http").createServer(app);

app.get("/", function (req, res) {
  return res.send("Hello, Welcome to my NodePI");
});

app.post("/test", function (req, res) {
  return res.send(req.body);
});

server.listen(port, function () {
  console.log("Listening on port %s...", server.address().port);
});
