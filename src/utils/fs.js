const {rejects} = require("assert");
const fs = require("fs");
const {resolve} = require("path");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);
const unlinkFileAsync = util.promisify(fs.unlink);
const existsFileAsync = util.promisify(fs.exists);

module.exports = {
  writeFile: async (path, content) => {
    await writeFileAsync(path, content, {encoding: "utf-8"});
  },

  removeFile: async (path) => {
    try {
      await unlinkFileAsync(path);
      resolve("OK");
    } catch (err) {
      console.log(`removeFile error: file ${path} doesn't exist...`);
      reject(err);
    }
  },

  exists: async (path) => {
    return await existsFileAsync(path);
  }
};
