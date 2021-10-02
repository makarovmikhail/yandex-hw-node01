const http = require("http");
const express = require("express");
const multer = require("multer");
const path = require("path");
const {generateId} = require("./src/utils/generateId");
const File = require("./src/entities/File");
const db = require("./src/entities/Database");
const backrem = require("backrem");
const fs = require("fs");

const app = express();

const MyCustomStorage = require("./src/utils/multerStorage");
const storage = new MyCustomStorage({
  destination: function (req, file, cb) {
    const imageId = generateId();
    file.imageId = imageId;
    cb(
      null,
      path.join(__dirname, "./images", new File(imageId).getOriginalFileName())
    );
  }
});
const upload = multer({storage});

const {PORT} = require("./src/config");
const {removeFile} = require("./src/utils/fs");

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({id: req.file.imageId});
});

app.get("/list", (req, res) => {
  res.json(db.images);
});

const getImageMiddleware = (req, res, next) => {
  res.setHeader("Content-Type", "image/*");
  next();
};

app.get("/image/:id", getImageMiddleware, (req, res) => {
  const image = db.findOne(req.params.id);

  if (!image) {
    res.json({status: "ERROR"});
  } else {
    let readStream = fs.createReadStream(
      path.join(__dirname, "images/", image.getOriginalFileName())
    );

    readStream.pipe(res);
  }
});

app.delete("/image/:id", (req, res) => {
  const imageId = req.params.id;
  const image = db.findOne(imageId);
  if (!image) {
    res.json({stutus: "error"});
  } else {
    removeFile(
      path.join(__dirname, "./images", image.getOriginalFileName())
    ).then(
      (result) => {
        db.remove(imageId);
        res.json({status: "ok"});
      },
      (err) => {
        res.json({stutus: "error"});
      }
    );
  }
});

app.get("/merge", (req, res) => {
  const front = req.query.front;
  const back = req.query.back;
  const color = JSON.parse(req.query.color);
  const threshold = Number(req.query.threshold);

  const frontImage = db.findOne(front);
  const backImage = db.findOne(back);

  const frontImageFile = fs.createReadStream(
    path.join(__dirname, "./target/cat.jpeg")
  );

  const backImageFile = fs.createReadStream(
    path.join(__dirname, "./target/space.jpeg")
  );

  backrem
    .replaceBackground(frontImageFile, backImageFile, color, threshold)
    .then(async (readableStream) => {
      const writableStream = fs.createWriteStream(
        path.resolve(__dirname, "./images/result.jpg")
      );
      readableStream
        .pipe(writableStream)
        .on("error", (err) => {
          console.log(err);
          res.json({status: err});
        })
        .on("finish", () => {
          res.json({status: "OK"});
        });
    });
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
