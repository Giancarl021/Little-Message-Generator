const fs = require('fs');
const imageHandler = require('text2png');
const gm = require('gm').subClass({imageMagick: true});
const {font, fontColor, textAlign, wordWrapCharCount, strokeColor, strokeWidth} = require('./../data').image;
const msgBackgroundPath = './data/msg-bg.png';


async function main(phrases) {
    console.log('>> Initializing image bot');
    const paths = generateImages(phrases);
    await mergeImages(paths);
    await downloadRandomBackgrounds();
}

function generateImages(phrases) {
    console.log('>>> Generating base images');
    let i = 0;
    const paths = [];
    for (const phrase of phrases) {
        const partialPath = `temp/raw-phrases/${i++}`;
        textToImage(wrapText(phrase.message), font.phrase, `${partialPath}-msg.png`);
        textToImage(wrapText(phrase.author), font.author, `${partialPath}-auth.png`);
        paths.push({
            author: `${partialPath}-auth.png`,
            message: `${partialPath}-msg.png`
        });
    }

    return paths;

    function textToImage(text, font, output) {
        fs.writeFileSync(output, imageHandler(text, {
            color: fontColor,
            font: font,
            textAlign: textAlign,
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
    console.log('>>> Merging images');
    let i = 0;
    for (const path of paths) {
        await mergeImage(path.author, path.message, `temp/sanitized-phrases/${i++}.png`);
    }

    async function mergeImage(authorPath, messagePath, output) {

        return new Promise((resolve, reject) => {
            gm()
                .in(msgBackgroundPath)
                .in(messagePath)
                .out('(')
                .in(authorPath)
                .out(')')
                .gravity('Center')
                .out('-composite')
                .write(output, err => {
                    if (err) return reject(err);
                    return resolve();
                });
        });
    }
}

module.exports = main;
