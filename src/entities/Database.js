const {EventEmitter} = require("events");
const {existsSync} = require("fs");
const {dbDumpFile} = require("../config");
const {writeFile} = require("../utils/fs");
const {prettifyJsonToString} = require("../utils/prettifyJsonToString");
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

      for (let image of dump.images) {
        this.images.push(new File(image.id, image.createdAt));
      }
    }
  }

  async insert(file, originalContent) {
    await svg.saveOriginal(originalContent);

    this.images.push(file);
  }

  async remove(imageId) {
    const fileRaw = this.idToSvg[svgId];

    const svg = new Svg(svgRaw.id, svgRaw.createdAt);

    await svg.removeOriginal();

    delete this.idToSvg[svgId];
    delete this.likedIds[svgId];

    this.emit('changed');

    return svgId;
  }

  findOne(svgId) {
    const svgRaw = this.idToSvg[svgId];

    if (!svgRaw) {
      return null;
    }

    const svg = new Svg(svgRaw.id, svgRaw.createdAt);

    return svg;
  }

  find(isLiked = false) {
    let allSvgs = Object.values(this.idToSvg);

    if (isLiked === true) {
      allSvgs = allSvgs.filter((svg) => this.likedIds[svg.id]);
    }

    allSvgs.sort((svgA, svgB) => svgB.createdAt - svgA.createdAt);

    return allSvgs;
  }

  toJSON() {
    return {
      idToSvg: this.idToSvg,
      likedIds: this.likedIds
    };
  }
}

const db = new Database();

db.initFromDump();

module.exports = db;
