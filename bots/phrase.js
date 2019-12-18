const axios = require('axios');
const cheerio = require('cheerio');
const phrasesQnt = 10;

async function main() {
  let consecutiveMiss = 0;
  const phrases = [];
  while(phrases.length < phrasesQnt) {
    if(consecutiveMiss === 15) {
      throw new Error('Connection Failed');
      process.exit(0);
    }
    const phrase = await getPhrase(`https://www.pensador.com/trabalho/${getRandomIndex(1, 599)}`);
    if(!phrase) {
      consecutiveMiss++;
      continue;
    }
    for(const p of phrases) {
      if(phrase.message === p.message) continue;
    }
    phrases.push(phrase);
  }
  return phrases;
}

async function getPhrase(url) {
  const $ = await getHtml(url); 
  const thoughts = $('.thought-card');
  const index = Math.floor(Math.random() * thoughts.length);
  const thought = $(thoughts[index]);
  const data = {
    phrase: sanitizeText($(thought).find('p.frase').first().text()),
    author: sanitizeText($(thought).find('span.autor').first().text())
  };
  return data;

  async function getHtml(url) {
    const response = await axios.get(url);
    if (response.status === 200) {
      return cheerio.load(response.data);
    } else {
      return null;
    }
  }

  function sanitizeText(text) {
    return text
      .replace(/\s\s+/gm, '')
      .replace(/\\n/gm, '<#>') // Not working
      .replace(/\\/gm, '')
      .trim();
  }
}

function getRandomIndex(min, max) {
  return Math.floor(Math.random() * max) + min;
}

module.exports = main;
