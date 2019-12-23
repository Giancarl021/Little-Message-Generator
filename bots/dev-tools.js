const fs = require('fs');

function saveJSON(path, data) {
    fs.writeFileSync(path, JSON.stringify(data));
}

function loadJSON(path) {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
}

module.exports = {saveJSON, loadJSON};
