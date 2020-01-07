const axios = require('axios');
const cheerio = require('cheerio');
const configs = require('./../data/config');
const {phraseCount} = configs.phrase;
const phraseSrc = configs.src.phrase;

async function main() {
    console.log('>> Initializing phrase bot');
    let consecutiveMiss = 0, skip;
    const phrases = [];
    console.log('>>> Fetching phrases');
    while (phrases.length < phraseCount) {
        skip = false;
        if (consecutiveMiss === 15) {
            throw new Error('Connection Failed');
        }
        const {url, pages} = phraseSrc;
        const phrase = await getPhrase(url + pages.prefix + getRandomIndex(pages.min, pages.max) + pages.sufix);
        if (!phrase) {
            console.log('>>> Miss load');
            consecutiveMiss++;
            continue;
        }
        if (phrase.message.length > 240) {
            console.log('>>> Skipping long phrase');
            continue;
        }

        if(phrase.message.length < 5) {
            console.log('>>> Skipping short phrase');
            continue;
        }

        if(phrase.author.length === 0) {
            phrase.author = 'Desconhecido';
        }

        for (const p of phrases) {
            if (phrase.message === p.message) {
                console.log(`>>> Skipping equal phrase: ${phrase.origin} | ${p.origin}`);
                skip = true;
                break;
            }
        }
        if (!skip) {
            phrases.push(phrase);
        }
    }
    return phrases;
}

async function getPhrase(url) {
    const $ = await getHtml(url);
    const {parentElement, messageElement, authorElement} = phraseSrc.elements;
    const thoughts = $(parentElement);
    const index = Math.floor(Math.random() * thoughts.length);
    const thought = $(thoughts[index]);
    return {
        message: sanitizeText($(thought).find(messageElement).first().text()),
        author: sanitizeText($(thought).find(authorElement).first().text()),
        origin: `${url}[${index}]`
    };

    async function getHtml(url) {
        const response = await axios.get(url);
        if (response.status === 200) {
            return cheerio.load(response.data);
        } else {
            return null;
        }
    }
}

function sanitizeText(text) {
    return text
        .replace(/\n/gm, ' ')
        .replace(/,/gm, ', ')
        .replace(/\./gm, '. ')
        .replace(/\s\s+/gm, ' ')
        .trim();
}

function getRandomIndex(min, max) {
    return Math.floor(Math.random() * max) + min;
}

module.exports = main;
