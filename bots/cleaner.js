const fs = require('fs');

function main() {
    console.log('>> Initializing cleaner bot');
    const tmp = fs.readdirSync('temp');
    tmp.forEach(e => {
        clearDirectory(`temp/${e}`)
    });
    console.log('>>> Temp files cleaned');
}

function clearDirectory(path) {
    if (fs.lstatSync(path).isDirectory()) {
        const sub = fs.readdirSync(path);
        sub.forEach(e => {
            clearDirectory(`${path}/${e}`)
        });
    } else {
        fs.unlinkSync(path);
    }
}

module.exports = main;
