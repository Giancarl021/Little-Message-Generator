const bots = {
    phrase: require('./bots/phrase'),
    image: require('./bots/image'),
    music: require('./bots/music'),
    video: require('./bots/video'),
    cleaner: require('./bots/cleaner'),
    devTools: require('./bots/dev-tools')
};

async function main() {
    const data = {};
    bots.cleaner();
    data.phrases = await bots.phrase();
    data.image = await bots.image(data.phrases);
    data.music = await bots.music();
    await bots.video(data);
    bots.devTools.saveJSON('temp/data.json', data);
    console.log('>> Process successfully ended');
}

main().catch(console.log);
