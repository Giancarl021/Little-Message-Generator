const videoshow = require('videoshow');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const videoOptions = require('./../data/config').video;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

async function main(data) {
    console.log('>> Video bot initialing');
    const options = {
        fps: 25,
        loop: (data.music.bpm / 60) * Math.round(videoOptions.time.slideDuration),
        transition: true,
        transitionDuration: 1, // seconds
        videoBitrate: 8000,
        size: '1920x1080',
        audioBitrate: '128k',
        audioChannels: 2,
        format: 'mp4',
        videoCodec: 'libx264',
        pixelFormat: 'yuv420p'
    };
    return new Promise((resolve, reject) => {
        console.log('>>> Rendering video');
        videoshow(data.image, options)
            .audio(data.music.path)
            .save(`${videoOptions.outputPath}/${Date.now()}.mp4`)
            .on('error', reject)
            .on('end', () => {
                console.log('>>> Video successfully rendered');
                resolve();
            });
    });
}

module.exports = main;
