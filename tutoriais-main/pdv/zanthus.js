const axios = require('axios');
const qs = require('qs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;


var dayjs = require('dayjs');
var utc = require('dayjs/plugin/utc');
var timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

const api = axios.create({
    baseURL: 'http://minipreco.zanthus.bluesoft.com.br',
    withCredentials: true,
});

async function login() {
    let data = qs.stringify({
        'USUARIO': 'altervision',
        'SENHA': '3026',
        'OK': 'Entrar'
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: '/manager/index.php5',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    const res = await api.request(config);
    cookies = res.headers['set-cookie'].join(';');
    return res.data;
}

async function processStore(date, store_id, loja, pdv, blackpdv) {
    const tableValues = await parsePage(date, loja, pdv);
    var tableValuesToRemove = [];
    if (blackpdv) {
        tableValuesToRemove = await parsePage(date, loja, blackpdv);
    }
    // subtract blackpdv PDV
    let sales = [];
    tableValues.forEach((row) => {
        let pdvToRemove = tableValuesToRemove.find((r) => r[0] === row[0]);
        let hour = row[0].split(':')[0];
        let timestamp = `${date} ${hour}:15:00 -03:00`;
        let num = parseInt(row[1]);
        let numToRemove = parseInt(pdvToRemove?.[1] ?? 0);
        let sum = parseFloat(row[2].replace('.', '').replace(',', '.'));
        let sumToRemove = parseFloat(pdvToRemove?.[2].replace('.', '').replace(',', '.') ?? 0);
        let total = (sum - sumToRemove) / (num - numToRemove);
        for (let i = 0; i < (num - numToRemove); i++) {
            sales.push({
                timestamp,
                total,
                timezone: 'America/Sao_Paulo',
                store_id
            });
        }
    });
    await postSales(sales);
}

var cookies;
async function main() {
    try {
        await login();
        const date = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
        console.log('Fetching sales for', date);

        // login
        cookies = // TODO

        res = api.get // TODO

        const dom = new JSDOM(res.data);
        const rows = dom.window.document.querySelectorAll('#TB_LISTA_QTD_2_TBODY tr');
        const tableValues = Array.from(rows, row => {
            const columns = row.querySelectorAll('td');
            return Array.from(columns, column => column.querySelector('div')?.textContent ?? column.textContent);
        });
        
        sales = tableValues.map(row => ({ //TODO

        }));

        fs.writeFileSync('zanthus1.json', JSON.stringify(sales));


    } catch (err) {
        console.log(err);
        sendMessageToSlack(`[integracao-minipreco] Error: ${err}`);
    }
}

module.exports = { main };
