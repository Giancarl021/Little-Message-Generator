const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const credentials = require('./../data/credentials');
const musicSrc = require('./../data/config').src.music;


async function main() {
    console.log('>> Music bot initializing');
    const musicData = await fetchMusic();
    musicData.bpm = await getMusicData(musicData.url);
    return musicData;
}

async function fetchMusic() {
    console.log('>>> Searching music');
    const {pages, elements} = musicSrc;
    const $ = await getHtml(musicSrc.url + pages.prefix + getRandomIndex(pages.min, pages.max) + pages.sufix);
    const musics = $(elements.parentElement);
    const index = Math.floor(Math.random() * musics.length);
    const music = $(musics[index]);
    const url = $(music).find(elements.musicElement).attr(elements.musicUrlAttribute);
    const destination = 'temp/music/song.mp3';
    console.log('>>> Downloading music');
    await fetchData(url, destination);
    return {url: url, path: destination};

    async function getHtml(url) {
        const response = await axios.get(url);
        if (response.status === 200) {
            return cheerio.load(response.data);
        } else {
            return null;
        }
    }

    async function fetchData(url, destination) {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        });
        return new Promise((resolve, reject) => {
            const fileWriter = fs.createWriteStream(destination);
            fileWriter.on('finish', () => {
                fileWriter.close();
                return resolve();
            });
            if (response.status === 200) {
                response.data.pipe(fileWriter);
            } else {
                return reject('Failed fetching music file');
            }
        });
    }
}

function getRandomIndex(min, max) {
    return Math.floor(Math.random() * max) + min;
}

async function getMusicData(url) {
    console.log('>>> Getting audio data');
    const response = await axios({
        "method": "POST",
        "url": "https://macgyverapi-song-tempo-detection-v1.p.rapidapi.com/",
        "headers": {
            "content-type": "application/json",
            "x-rapidapi-host": "macgyverapi-song-tempo-detection-v1.p.rapidapi.com",
            "x-rapidapi-key": credentials.rapidapi.songTempoDetection,
            "accept": "application/json"
        }, "data": {
            "id": "6t7s5d7t",
            "key": "free",
            "data": {
                "audio_file": url
            }
        }
    });
    if(response.status === 200) {
        return response.data.bpm;
    } else {
        return null;
    }
}

module.exports = main;
