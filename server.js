require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const user_action_router = require("./router/UserActionRouter");
const router = require("./router/UserRouter");
const data_creation_router = require("./router/UserDataCreationRouter");
const data_load_router = require("./router/UserDataLoadRouter");
const cookieParser = require("cookie-parser");
const path = require("path");

const PORT = process.env.PORT || 5000;

const url = process.env.DB_URL;

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cookieParser());

app.use(cors(corsOptions));
app.use(express.static(__dirname));

app.use(express.urlencoded());
app.use(express.json({ extended: true }));
app.use(
  "/userProfileImgs",
  express.static(path.join(__dirname, "userProfileImgs"))
);
app.use("/users", router);
app.use("/users-data-load", data_load_router);
app.use("/users-data-creation", data_creation_router);
app.use("/user-action", user_action_router);

const start = async () => {
  try {
    await mongoose.connect(url);
    app.listen(PORT, () => console.log("STARTED ON PORT " + PORT));
  } catch (e) {
    console.log(e);
  }
};

start();
