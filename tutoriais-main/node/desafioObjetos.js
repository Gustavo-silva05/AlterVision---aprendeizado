const dayjs = require('dayjs')

function encontraPessoa() {
    let pessoas = arrayGenerator()
    // let pessoas = []
    //TODO 
    //Percorrer o vetor
    if (pessoas.length!=0){let mais_novo = pessoas[0];} 
    else throw new Error("Array pessoas vazio")
    
    let mais_novo = pessoas[0]
    for(let i=1; i< pessoas.length; i++){
        if(pessoas[i].data_nascimento === "2024-12-23"){return pessoas[i]}
        if(pessoas[i].data_nascimento > mais_novo.data_nascimento ){mais_novo = pessoas[i]}
    }
    console.log("Pessoa mais nova: ")
    return mais_novo

}

function arrayGenerator() {
    let names = ['João', 'Carolina', 'Matheus', 'Sofia',
        'Pedro', 'Gustavo', 'Tiago', 'Walter', 'Lavínia', 'Amanda']

    let surnames = ['Silva', 'Morandi', 'Costa', 'Souza', 'Fernandes',
        'Winter', 'Smith', 'Snow', 'Stark', 'Lannister', 'White']

    let arr = []

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let randomDate = new Date(Math.floor(Math.random() * 50) + 1970,
                Math.floor(Math.random() * 11) + 1,
                Math.floor(Math.random() * 29) + 1)
            let pessoa = {
                nome: names[i] + ' ' + surnames[j],
                data_nascimento: dayjs(randomDate).format("YYYY-MM-DD")
            }
            arr.push(pessoa)
            console.log(pessoa)
        }
    }
    return arr
}

console.log(encontraPessoa())