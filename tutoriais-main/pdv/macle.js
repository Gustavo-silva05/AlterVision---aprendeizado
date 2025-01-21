const axios = require('axios');
const dayjs = require('dayjs');
const fs = require('fs');

const stores = {
    // 'cnpj': store_id
    '73535502000190': 863,
};

async function main() {
    try {
        const date = dayjs().subtract(1, 'day').format('DD/MM/YYYY');
        console.log(`Fetching sales for ${date}`);
        
        // Substituir pela URL e parâmetros corretos da API
        let res = await axios({
            method: 'GET',
            url: 'https://api.exemplo.com/sales', // Ajustar para a API real
            params: {
                date: date, // Passa a data como parâmetro
                storeCNPJ: Object.keys(stores)[0], // Primeiro CNPJ do objeto
            },
            headers: {
                'Authorization': 'Bearer YOUR_API_TOKEN', // Substituir pelo token correto
            },
        });

        const salesData = res.data; // Assumindo que a resposta contém os dados das vendas
        const sales = salesData.map(sale => ({
            store_id: stores[sale.storeCNPJ] || null, // Mapeia para o store_id
            timestamp: dayjs(sale.timestamp).format('YYYY-MM-DD HH:mm:ss Z'),
            total: sale.total,
            timezone: 'America/Sao_Paulo',
        }));

        console.log(`${sales.length} sales found`);
        fs.writeFileSync('macle1.json', JSON.stringify(sales, null, 2));
        console.log('Sales data saved to macle1.json');
    } catch (err) {
        console.error('Error fetching sales:', err.message);
    }
}

main();
