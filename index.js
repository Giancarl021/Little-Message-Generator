const bots = {
    phrase: require('./bots/phrase'),
    image: require('./bots/image'),
    music: require('./bots/music'),
    cleaner: require('./bots/cleaner')
};

async function main() {
    bots.cleaner();
    // await bots.music();
    // process.exit(0);
    const phrases = await bots.phrase();
    await bots.image(phrases);
    await bots.music();
    console.log('>> Process successfully ended');
}

main().catch(console.log);
