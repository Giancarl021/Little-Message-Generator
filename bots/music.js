const axios = require('axios');
const cheerio = require('cheerio');
const AudioContext = require('web-audio-api').AudioContext;
const MusicTempo = require('music-tempo');
const fs = require('fs');

async function main() {
    console.log('>> Music bot initializing');
    const musicPath = await fetchMusic();
    console.log(await getMusicData(musicPath));
}

async function fetchMusic() {
    console.log('>>> Searching music');
    const $ = await getHtml(`https://www.freemusicarchive.org/genre/Soundtrack?sort=track_date_published&d=1&page=${getRandomIndex(1, 421)}`);
    const musics = $('.play-item');
    const index = Math.floor(Math.random() * musics.length);
    const music = $(musics[index]);
    const url = $(music).find('.playicn > a').attr('href');
    const destination = 'temp/music/song.mp3';
    console.log('>>> Downloading music');
    await fetchData(url, destination);
    return destination;

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

async function getMusicData(path) {
    console.log('>>> Getting audio data');
    const audioContext = new AudioContext();
    const audioData = fs.readFileSync(path);
    return audioContext.decodeAudioData(audioData, getBeats); // Problema aqui <<<<<<<<<<<<<<<<<<

    function getBeats(buffer) {
        console.log('<AQUI>');
        let audioData;
        if (buffer.numberOfChannels === 2) {
            audioData = [];
            const channelsData = [
                buffer.getChannelData(0),
                buffer.getChannelData(1)
            ];
            const length = channelsData[0].length;
            for (let i = 0; i < length; i++) {
                audioData[i] = (channelsData[0][i] + channelsData[1][i]) / 2;
            }
        } else {
            audioData = buffer.getChannelData(0);
        }
        console.log('AAA');
        const musicTempo = new MusicTempo(audioData);
        console.log(musicTempo);
        return musicTempo;
    }
}

module.exports = main;
