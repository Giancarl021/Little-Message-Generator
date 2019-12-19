const fs = require('fs');
const imageHandler = require('text2png');
const {font, fontColor, textAlign, wordWrapCharCount} = require('./../data').image;

/**
 * @params images : string[]
 * */

function main(phrases) {
    console.log('>> Initializing image bot');
    let i = 0;
    for (const phrase of phrases) {
        textToImage(wrapText(phrase.message), font.phrase,`temp/${i}-msg.png`);
        textToImage(wrapText(phrase.author), font.author,`temp/${i}-auth.png`);
        i++;
    }

    /**
     * @params image : string
     * */
    function textToImage(text, font, output) {
        fs.writeFileSync(output, imageHandler(text, {
            color: fontColor,
            font: font,
            textAlign: textAlign
        }));
    }
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

module.exports = main;

