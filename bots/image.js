const fs = require('fs');
const imageHandler = require('text2png');
const gm = require('gm').subClass({imageMagick: true});
const {font, fontColor, textAlign, wordWrapCharCount} = require('./../data').image;

async function main(phrases) {
    console.log('>> Initializing image bot');
    const paths = generateImages(phrases);
    await mergeImages(paths);
}

function generateImages(phrases) {
    console.log('>> Generating base images');
    let i = 0;
    const paths = [];
    for (const phrase of phrases) {
        textToImage(wrapText(phrase.message), font.phrase, `temp/${i}-msg.png`);
        textToImage(wrapText(phrase.author), font.author, `temp/${i}-auth.png`);
        paths.push({
            author: `temp/${i}-auth.png`,
            message: `temp/${i}-msg.png`
        });
        i++;
    }

    return paths;

    function textToImage(text, font, output) {
        fs.writeFileSync(output, imageHandler(text, {
            color: fontColor,
            font: font,
            textAlign: textAlign
        }));
    }

    function wrapText(text) {
        if (text.length > wordWrapCharCount) {
            if (text.match(/\./g) && (text.indexOf('.') > 10 && text.indexOf('.') < text.length - 10)) {
                text = text.replace(/\./, '.\n');
            } else if (text.match(/,/g) && (text.indexOf(',') > 10 && text.indexOf(',') < text.length - 10)) {
                text = text.replace(/,/, ',\n');
            } else {
                const arr = text.split(' ');
                text = '';
                for (let i = 0; i < arr.length; i++) {
                    if (Math.floor(arr.length / 2) === i) {
                        text += `${arr[i]}\n`;
                    } else {
                        text += `${arr[i]} `;
                    }
                }
            }
            text = text.split('\n').map(e => {
                if (e.length > wordWrapCharCount) {
                    return wrapText(e);
                } else return e;
            }).join('\n');
        }
        return text;
    }
}

async function mergeImages(paths) {
    for (const path of paths) {
        await mergeImage(path.author, path.message);
    }

    async function mergeImage(authorPath, messagePath) {
        const output = '';

        return new Promise((resolve, reject) => {
            gm
                .in()
                .write(output, err => {
                    if(err) return reject(err);
                    return resolve();
                });
        });
    }
}

module.exports = main;
