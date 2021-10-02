const path = require("path");

const {jpegFolder} = require("../config");
const {writeFile, removeFile} = require("../utils/fs");
const {generateId} = require("../utils/generateId");

module.exports = class File {
  constructor(id, size, uploadedAt, mimeType) {
    this.id = id || generateId();
    this.size = size || 0;
    this.uploadedAt = uploadedAt || Date.now();
    this.mimeType = mimeType || "";
  }

  getOriginalFileName() {
    return `${this.id}_original.jpeg`;
  }

  async saveOriginalFile(file) {
    await writeFile(path.resolve(jpegFolder, this.getOriginalFileName()), file);
  }

  async removeOriginalFile() {
    await removeFile(path.resolve(jpegFolder, this.getOriginalFileName()));
  }

  toJSON() {
    return {
      id: this.id,
      size: this.size,
      uploadedAt: this.uploadedAt,
      mimeType: this.mimeType
    };
  }
};
