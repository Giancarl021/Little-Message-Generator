const fs = require('fs');
const imageSize = require('image-size');
const videoshow = require('videoshow');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const videoOptions = require('./../data/config').video;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

async function main(data) {
    console.log('>> Video bot initialing');
    console.log('>>> Parsing images');

    const images = data.image.map(e => {
        return {
            path: e
        }
    });

    if (videoOptions.openingImage && fs.existsSync(videoOptions.openingImage) && fs.lstatSync(videoOptions.openingImage).isFile()) {
        let dim;
        try {
            dim = imageSize(videoOptions.openingImage);
        } catch(e) {
            console.log('>>> Opening image file is not a image');
            dim = false;
        }
        if(!dim || dim.width !== 1920 || dim.height !== 1080) {
            if(dim) console.log('>>> Opening image with wrong resolution, resize the image to 1920x1080px');
        } else {
            images.unshift({
                path: videoOptions.openingImage,
                loop: (typeof videoOptions.time.openingDuration === 'number' && videoOptions.time.openingDuration > 0 ? calculateBpmDuration(data, videoOptions.time.openingDuration) : calculateBpmDuration(5))
            });
        }
    }

    if (videoOptions.endingImage && fs.existsSync(videoOptions.endingImage) && fs.lstatSync(videoOptions.endingImage).isFile()) {
        let dim;
        try {
            dim = imageSize(videoOptions.endingImage);
        } catch(e) {
            console.log('>>> Ending image file is not a image');
            dim = false;
        }
        if(!dim || dim.width !== 1920 || dim.height !== 1080) {
            if(dim) console.log('>>> Ending image with wrong resolution, resize the image to 1920x1080px');
        } else {
            images.push({
                path: videoOptions.endingImage,
                loop: (typeof videoOptions.time.endingDuration === 'number' && videoOptions.time.endingDuration > 0 ? calculateBpmDuration(data, videoOptions.time.endingDuration) : calculateBpmDuration(5))
            });
        }
    }

    const options = {
        fps: 25,
        loop: calculateBpmDuration(data, videoOptions.time.slideDuration),
        transition: true,
        transitionDuration: .7,
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
        videoshow(images, options)
            .audio(data.music.path)
            .save(`${videoOptions.outputPath}/${Date.now()}.mp4`)
            .on('error', reject)
            .on('end', () => {
                console.log('>>> Video successfully rendered');
                resolve();
            });
    });
}

function calculateBpmDuration(data, seconds) {
    return (data.music.bpm / 60) * Math.round(seconds);
}

module.exports = main;
