const fs = require('fs');

function main() {
    console.log('>> Initializing cleaner bot');
    const tmp = fs.readdirSync('temp');
    tmp.forEach(e => fs.unlinkSync('temp/' + e));
    console.log('>>> Temp files cleaned');
}

module.exports = main;
