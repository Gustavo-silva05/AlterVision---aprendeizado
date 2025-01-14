const axios = require('axios');

async function pokemon() {
    try {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0',
            headers: {}
        };
        let response = await axios.request(config);
        let pokemons = response.data.results;
        let pokemonArray = await individualPokemonInfo(pokemons);
        // Ordena os Pokémon em ordem alfabética pelo nome
        pokemonArray.sort((a, b) => a.name.localeCompare(b.name));
        csvGenerator(pokemonArray);
    } catch (error) {
        console.log(error);
    }
}

async function individualPokemonInfo(pokemons) {
    try {
        let pokemonPromises = pokemons.map(async pokemon => {
            try {
                let response = await axios.get(pokemon.url);
                return {
                    name: response.data.name,
                    height: response.data.height,
                    weight: response.data.weight,
                    Exp: response.data.base_experience,
                    Skill: response.data.abilities.map(ability => ability.ability.name).join(', ')
                };
            } catch (error) {
                console.log(`Error fetching data for ${pokemon.name}:`, error.message);
                return null; // Retorna nulo em caso de erro para evitar falha na Promise.all
            }
        });

        let pokemonArray = await Promise.all(pokemonPromises);
        return pokemonArray.filter(pokemon => pokemon !== null); // Remove entradas nulas
    } catch (error) {
        console.log(error);
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
            { id: 'Exp', title: 'Exp' },
            { id: 'Skill', title: 'Skill' }
        ]
    });

    csvWriter.writeRecords(pokemonArray)
        .then(() => {
            console.log('Finished');
        })
        .catch(err => {
            console.error('Error writing CSV:', err);
        });
}

pokemon();
