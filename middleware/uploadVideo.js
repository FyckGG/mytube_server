const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const id = req.body.id;

    cb(null, __dirname + "/../usersData/" + id + "/videos");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + "-" + Date.now());
  },
});

module.exports = multer({ storage: storage });
