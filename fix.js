/**
 * Sorts the JSON file.
 */
const path = require('path');
const { sortJsonFile } = require('./utils');

const filepath = path.resolve(path.relative(__dirname, "./locales/de.json"));
sortJsonFile(filepath)