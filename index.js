const bots = {
    phrase: require('./bots/phrase')
};

async function main() {
    const phrases = await bots.phrase();
    phrases.forEach(e => console.log('>> ' + e.message));
}

main().then().catch(console.log);
