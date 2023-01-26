require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const user_action_router = require("./router/UserActionRouter");
const router = require("./router/UserRouter");
const data_creation_router = require("./router/UserDataCreationRouter");
const user_data_load_router = require("./router/UserDataLoadRouter");
const user_data_change_router = require("./router/UserDataChangeRouter");
const vidoe_stats_router = require("./router/VideoStatsRouter");
const data_load_router = require("./router/DataLoadRouter");
const video_data_creation_router = require("./router/VideoDataCreationRouter");
const video_data_load_router = require("./router/VideoDataLoaderRouter");
const search_router = require("./router/searchRouter");
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
app.use("/users-data-load", user_data_load_router);
app.use("/users-data-creation", data_creation_router);
app.use("/user-action", user_action_router);
app.use("/video-stats", vidoe_stats_router);
app.use("/data-load", data_load_router);
app.use("/video-data-creation", video_data_creation_router);
app.use("/video-data-load", video_data_load_router);
app.use("/user-data-change", user_data_change_router);
app.use("/search", search_router);

const start = async () => {
  try {
    await mongoose.connect(url);
    app.listen(PORT, () => console.log("STARTED ON PORT " + PORT));
  } catch (e) {
    console.log(e);
  }
};

start();
