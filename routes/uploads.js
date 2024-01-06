var express = require('express');
var router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({storage: storage});

router.post('/', upload.single('file'), (req, res) => {
  res.json({file: req.file});
});

module.exports = router;