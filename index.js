const bots = {
    phrase: require('./bots/phrase'),
    image: require('./bots/image'),
    cleaner: require('./bots/cleaner')
};

async function main() {
    bots.cleaner();
    const phrases = await bots.phrase();
    await bots.image(phrases);
    console.log('>> Process successfully ended');
}

main().catch(console.log);
