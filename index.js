const express = require("express");
const ejs = require("ejs");
const nexmo = require("nexmo");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const Vonage = require("@vonage/server-sdk");
require("dotenv").config();

//iti app
const app = express();

//Template engine setup
app.set("view engine", "html");
app.engine("html", ejs.renderFile);
// app.set("view engine", "ejs");

//Public folder setup
app.use(express.static(__dirname + "/public"));

//Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const vonage = new Vonage({
  // apiKey: "fb54a602",
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET,
  // apiSecret: "uvfDQZPtAD0eNqXP",
});

//Index route
app.get("/", (req, res) => {
  res.render("index");
});

//Catch form submit
app.post("/", (req, res) => {
  const number = req.body.number;
  const text = req.body.text;

  vonage.message.sendSms(
    "18773276520",
    number,
    text,
    {
      type: "unicode",
    },
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
        // get data from response
        const data = {
          id: responseData.messages[0]["message-id"],
          number: responseData.messages[0]["to"],
        };

        //Emit to the client
        io.emit("smsStatus", data);

        if (responseData.messages[0]["status"] === "0") {
          console.log("Message sent successfully.");
        } else {
          console.log(
            `Message failed with error: ${responseData.messages[0]["error-text"]}`
          );
        }
      }
    }
  );
});

//Define port
const PORT = 3000;

//Start server
const server = app.listen(PORT, () => {
  console.log(`Server is listening on the port ${PORT}`);
});

// connect to socket.io
const io = socketio(server);
io.on("connection", (socket) => {
  console.log("connected");
  io.on("disconnect", () => {
    console.log("Disconnected");
  });
});
