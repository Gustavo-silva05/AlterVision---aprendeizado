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

        // Obter informações detalhadas de cada Pokémon
        let pokemonArray = await individualPokemonInfo(pokemons);

        // Gerar CSV
        csvGenerator(pokemonArray);
    } catch (error) {
        console.log(error);
    }
}

async function individualPokemonInfo(pokemons) {
    try {
        // Mapear cada Pokémon para sua respectiva chamada à API detalhada
        let pokemonPromises = pokemons.map(async (pokemon) => {
            try {
                let response = await axios.get(pokemon.url);
                let { name, height, weight, base_experience, abilities } = response.data;

                // Mapear habilidades para uma string
                let skills = abilities.map(ability => ability.ability.name).join(', ');

                return {
                    name,
                    height,
                    weight,
                    Exp: base_experience,
                    Skill: skills
                };
            } catch (error) {
                console.error(`Erro ao buscar detalhes de ${pokemon.name}:`, error);
                return null; // Retorna null em caso de erro para evitar interrupções
            }
        });

        // Aguarda a resolução de todas as Promises
        let pokemonArray = await Promise.all(pokemonPromises);

        // Filtra valores nulos (erros nas requisições)
        return pokemonArray.filter(pokemon => pokemon !== null);
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
            console.log('Arquivo Pokemons.csv gerado com sucesso!');
        });
}

// Executa a função principal
pokemon();
