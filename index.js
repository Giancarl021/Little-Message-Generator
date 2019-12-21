const bots = {
    phrase: require('./bots/phrase'),
    image: require('./bots/image')
};

async function main() {
    const phrases = await bots.phrase();
    await bots.image(phrases);
}

main().catch(console.log);
