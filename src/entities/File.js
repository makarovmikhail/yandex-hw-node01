const path = require('path');

const { svgFolder } = require('../config');
const { writeFile, removeFile } = require('../utils/fs');
const { generateId } = require('../utils/generateId');

module.exports = class File {
  constructor(id, createdAt, size, mimeType) {
    this.id = id || generateId();
    this.createdAt = createdAt || Date.now();
    this.size = size || 0;
    this.mimeType = mimeType;

    this.originalFilename = `${this.id}_original.jpeg`;
  }

  async saveOriginal(content) {
    await writeFile(path.resolve(svgFolder, this.originalFilename), content);
  }

  async removeOriginal() {
    await removeFile(path.resolve(svgFolder, this.originalFilename));
  }

  toPublicJSON() {
    return {
      id: this.id,
      originalUrl: `/files/${this.id}_original.svg`,
      createdAt: this.createdAt,
    };
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
    };
  }
};
