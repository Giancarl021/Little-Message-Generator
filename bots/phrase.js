const axios = require('axios');
const cheerio = require('cheerio');
const {phraseCount} = require('../data/config').phrase;

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
        const phrase = await getPhrase(`https://www.osvigaristas.com.br/frases/motivacao/pagina${getRandomIndex(1, 25)}.html`);
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
    const thoughts = $('.col-xs-12');
    const index = Math.floor(Math.random() * thoughts.length);
    const thought = $(thoughts[index]);
    return {
        message: sanitizeText($(thought).find('div.quote > q').first().text()),
        author: sanitizeText($(thought).find('footer strong').first().text()),
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
