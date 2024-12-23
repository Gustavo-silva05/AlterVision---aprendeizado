function vetorInverso() {
    let numero;
    let vetor = [];

    //TODO
    //Encher o vetor
    for (let i = 0; i < 10; i++) {
        vetor.push(i+1)
    }

    //Imprimir o vetor ao contrário
    for (let i = vetor.length-1; i >= 0; i--) {
        console.log(vetor[i])
    }
}

vetorInverso()