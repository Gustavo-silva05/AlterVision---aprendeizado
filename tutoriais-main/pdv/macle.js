const axios = require('axios');
const dayjs = require('dayjs')
const fs = require('fs');

const stores = {
    // 'cnpj': store_id
    '73535502000190': 863,
}

async function main() {
    try {
        const date = dayjs().subtract(1,'day').format('DD/MM/YYYY');
        console.log(`Fetching sales for ${date}`);
        let res = await axios({
            // TODO
        });
        const sales = // TODO;

        console.log(sales.length + ' sales found');
        fs.writeFileSync('macle1.json', JSON.stringify(sales));

    } catch (err) {
        console.log(err);
    }
}

main();