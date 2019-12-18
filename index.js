const bots = {
    browser: require('./bots/browser')
};

async function main() {
    await bots.browser();
}

main();
