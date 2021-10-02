const {EventEmitter} = require("events");
const {existsSync} = require("fs");
const fs = require("fs");
const {imagesFolder} = require("../config");
const {dbDumpFile} = require("../config");
const path = require("path");
// const {writeFile} = require("../utils/fs");
// const {prettifyJsonToString} = require("../utils/prettifyJsonToString");
const File = require("./File");

class Database extends EventEmitter {
  constructor() {
    super();

    this.images = [];
  }

  async initFromDump() {
    

    if (existsSync(dbDumpFile) === false) {
      return;
    }

    const dump = require(dbDumpFile);

    if (typeof dump.images === "object") {
      this.images = [];

      for (let id of dump.images) {
        const image = dump.images[id];

        this.images.push(new File(image.id, image.size, image.uploadedAt));
      }
    }
  }

  insert(image) {
    this.images.push(image);
  }

  remove(imageId) {
    const updatedImages = this.images.filter((img) => img.id !== imageId);
    this.images = updatedImages;
  }

  findOne(imageId) {
    for (let image of this.images) {
      if (image.id === imageId) return image;
    }
    return null;
  }

  toJSON() {
    return [this.images];
  }
}

const db = new Database();

db.initFromDump();

module.exports = db;
