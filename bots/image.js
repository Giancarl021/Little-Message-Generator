const fs = require('fs');
const imageHandler = require('text2png');
const gm = require('gm').subClass({imageMagick: true});
const imgDownloader = require('image-downloader');
const data = require('../data/config');
const {font, fontColor, backgroundColor, textAlign, wordWrapCharCount} = data.image;
const {phraseCount} = data.phrase;


async function main(phrases) {
    console.log('>> Initializing image bot');
    const paths = generateImages(phrases);
    await downloadRandomBackgrounds(phraseCount);
    await mergeImages(paths);
}

function generateImages(phrases) {
    console.log('>>> Generating base images');
    let i = 0;
    const paths = [];
    for (const phrase of phrases) {
        const path = `temp/foreground/${i}.png`;
        textToImage(`${wrapText(phrase.message)}\n\n--- ${wrapText(phrase.author)} ---`, font.phrase, path);
        // textToImage(wrapText(phrase.author), font.author, `${partialPath}-auth.png`);
        paths.push({
            text: path,
            background: `temp/background/${i}.jpg`
        });
        i++;
    }

    return paths;

    function textToImage(text, font, output) {
        fs.writeFileSync(output, imageHandler(text, {
            color: fontColor,
            backgroundColor: backgroundColor,
            borderWidth: 7,
            borderColor: fontColor,
            padding: 35,
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
        await mergeImage(path.background, path.text, `temp/slide/${i++}.png`);
    }

    async function mergeImage(background, foreground, output) {

        return new Promise((resolve, reject) => {
            gm()
                .in(background)
                .in(foreground)
                .gravity('Center')
                .out('-composite')
                .write(output, err => {
                    if (err) return reject(err);
                    return resolve();
                });
        });
    }
}

async function downloadRandomBackgrounds(n) {
    console.log('>>> Downloading backgrounds');
    const destinationPath = 'temp/background';
    const imageSize = {
        width: 1920,
        height: 1080
    };

    for(let i = 0; i < n; i++) {
        await downloadImage(`https://picsum.photos/${imageSize.width}/${imageSize.height}?random=${i}.jpg`, `${destinationPath}/${i}.jpg`);
    }

    async function downloadImage(url, destination) {
        await imgDownloader.image({
            url: url,
            dest: destination
        });
    }
}

module.exports = main;
