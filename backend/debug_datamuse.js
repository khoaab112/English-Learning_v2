const axios = require('axios');

async function test() {
    try {
        const url = 'https://api.datamuse.com/words?ml=apple&max=5&md=dp&ipa=1';
        console.log("Fetching:", url);
        const { data } = await axios.get(url);
        console.log("Response Item 0:", JSON.stringify(data[0], null, 2));

        // Check tags
        if (data[0].tags) {
            const ipaTag = data[0].tags.find(t => t.startsWith('ipa_phon:'));
            console.log("Extracted IPA Tag:", ipaTag);
        }
    } catch (e) {
        console.error(e);
    }
}

test();
