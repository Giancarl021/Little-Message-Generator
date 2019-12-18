const bots = {
    browser: require('./bots/phrase')
};

async function main() {
    const phrases = await bots.browser();
    console.log(phrases, phrases.length);
}

main();
