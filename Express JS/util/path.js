// This file is a helper function to get the path of our root directory.
const path = require('path');

module.exports = path.dirname(process.mainModule.filename);