const path = require('path');

const dbFolder = path.resolve(__dirname, '../../db/');
const dbDumpFile = path.resolve(dbFolder, 'dump.json');
const svgFolder = path.resolve(dbFolder, 'svg');

module.exports = {
  PORT: 8080,

  dbFolder,
  svgFolder,
  dbDumpFile,
};