function csvPopulationEUA() {
    const axios = require('axios')

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://datausa.io/api/data?drilldowns=Nation&measures=Population',
        headers: {}
    }

    axios.request(config)
        .then((response) => {
            // console.log(response.data)
            const data = response.data.data;  // Access the 'data' array from the response

            // Find the record for the year 2018
            const population2018 = data.find(record => record.Year === '2018');

            if (population2018) {
                // console.log('USA Population in 2018:', population2018.Population);
            } else {
                console.log('Population data for 2018 not found.');
            }

        })
        .catch((error) => {
            console.log(error);
        });
        
        
        axios.request(config)
        .then((response) => {
            // console.log(response.data)
            const dado = response.data.data;
            const ano = dado.map(year => year.Year)
            const pop = dado.map(populacao => populacao.Population)
            let obj = [];
            for(let i=0; i< ano.length ; i++){
                let n_obj = {Ano: ano[i], Pop: pop[i]}
                obj.push(n_obj)
            }
            console.log(obj)
        })
        .catch((error) => {
            console.log(error);
        });

}

csvPopulationEUA()