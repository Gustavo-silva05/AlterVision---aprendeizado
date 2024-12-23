const axios = require('axios');

async function pokemon() {
    try {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0',
            headers: {}
        };
        let response = await axios.request(config)
        let pokemons = response.data.results
        let pokemonArray = await individualPokemonInfo(pokemons)
        //Ordem Alfabética
        csvGenerator(pokemonArray)
    } catch (error) {
        console.log(error)
    }
}

async function individualPokemonInfo(pokemons) {
    try {
        let pokemonPromises = pokemons.map(async pokemon => {
            //TODO
        });

        let pokemonArray = await Promise.all(pokemonPromises);
        return pokemonArray

    } catch (error) {
        console.log(error)
    }
}

function csvGenerator(pokemonArray) {
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;

    const csvWriter = createCsvWriter({
        path: 'Pokemons.csv',
        header: [
            { id: 'name', title: 'Name' },
            { id: 'height', title: 'Height' },
            { id: 'weight', title: 'Weight' },
            //Adicionar Exp base e Habilidades
        ]
    });

    csvWriter.writeRecords(pokemonArray)
        .then(() => {
            console.log('Finished');
        });
}

pokemon()