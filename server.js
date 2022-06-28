const express = require("express");
const mongoose = require("mongoose");
const Msg = require("./models/message");
const app = express();
const http = require("http").createServer(app);

// Connect to Mongodb
const mongoDB =
  "mongodb+srv://sameer:ckmobile@cluster0.emwvvhs.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connection is stablish");
  })
  .catch((e) => {
    console.log("connection is falied");
  });

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

http.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

// Socket

const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("Connected....");
  socket.on("message", (msg) => {
    const messages = new Msg(msg);
    messages.save().then(() => {
      socket.broadcast.emit("message", msg);
      console.log(msg);
    });
  });
});
