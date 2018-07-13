const fs = require('fs');

const sortJsonFile = function(filepath) {
    let json = fs.readFileSync(filepath, 'utf8');
    json = JSON.stringify(JSON.parse(json), sortedJSON, 2) + "\n";
    fs.writeFileSync(filepath, json, 'utf8');
}


const sortedJSON = function(key, value) {
    if (typeof value === 'object') {
        return Object.keys(value).sort().reduce((result, key) => {
            result[key] = value[key];
            return result;
        }, {});
    }

    return value;
}

module.exports = {
    sortJsonFile,
    sortedJSON
}