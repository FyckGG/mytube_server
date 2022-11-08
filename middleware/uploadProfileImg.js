const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("V middle");
    console.log(req.body);
    const id = req.body.id;

    cb(null, __dirname + "/../usersData/" + id + "/avatar");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

module.exports = multer({ storage: storage });
