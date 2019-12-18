const axios = require('axios');
const cheerio = require('cheerio');

axios
    .get('https://motivaai.nandomoreira.me/')
    .then(response => {
        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const data = {
                phrase: $('p').first().text(),
                author: $('small').first().text()
            };
            console.log(data);
        } else {
            console.log('err');
        }
    })
    .catch(console.log);

module.exports = main;
