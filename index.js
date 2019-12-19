const bots = {
    phrase: require('./bots/phrase'),
    image: require('./bots/image')
};

async function main() {
    const phrases = await bots.phrase();
    bots.image(phrases);
}

main().catch(console.log);
