import { useState } from 'react'
import style from './App.module.css'
import Input from './componentes/Input'
import Button from './componentes/Button'
import axios from 'axios'
const base_url = `https://nominatim.openstreetmap.org/search?format=json&q=`;


type Client = {
    _id: number;
    client: string;
    weight: string;
    address: {
        street: string;
        number: number;
        neighborhood: string;
        city: string;
        state: string;
        country: string;
        geo: {
            lat: string;
            long: string;
        }
    }
}

function App() {
    const [client, setClient] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [street, setStreet] = useState<string>("");
    const [number, setNumber] = useState<number>();

    const [neighborhood, setNeighborhood] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [state, setState] = useState<string>("");
    const [country, setCountry] = useState<string>("");
    const [lat, setLat] = useState<string>("");
    const [long, setLong] = useState<string>("");

    async function verificar_end(address: string) {
        if (!address) return false;

        const s = address.replace(/[0-9]/g, '');
        const n = Number(address.replace(/[^0-9]/g, ''));

        const url = base_url + `${encodeURIComponent(address)}&addressdetails=1`;
        const res = await axios.get(url);

        if (res.data.length === 0) {
            console.log("Endereço não encontrado");
            return false;
        }

        const result = res.data[0];
        const addr = result.address;

        const bairro = addr.suburb || addr.neighbourhood || '';
        const cidade = addr.city || addr.town || addr.village || '';
        const estado = addr.state || '';
        const pais = addr.country || '';
        const latitude = result.lat;
        const longitude = result.lon;

        // Atualiza estados
        setStreet(s);
        setNumber(n);
        setNeighborhood(bairro);
        setCity(cidade);
        setState(estado);
        setCountry(pais);
        setLat(latitude);
        setLong(longitude);

        // Retorna true se achou tudo que precisa
        return (latitude && longitude && s && n && bairro && cidade && estado && pais);
    }

    async function SaveOnSubmit() {
        const enderecoOk = await verificar_end(address);
        if (!enderecoOk) {
            console.log("Endereço inválido");
            return;
        }

        const data = (await axios.get("http://localhost:3003/alldata")).data;
        console.log(data);
        const n_client: Client = {
            _id: data.length + 1,
            client: client,
            weight: weight,
            address: {
                street: street,
                number: number ?? 0,
                neighborhood: neighborhood,
                city: city,
                state: state,
                country: country,
                geo: {
                    lat: lat,
                    long: long
                }
            }
        };
        console.log(n_client);
        // await axios.post("http://localhost:3003/push", n_client);
    }

    return (
        <>
            <div className={style.body}>
                <div className={style.title}>
                    <h1>Delivery App</h1>
                </div>
                <div className={style.container}>
                    <Input label="Nome Cliente:" aoAlterar={(value: string) => setClient(value)} />
                    <Input label="Peso da Entrega:" aoAlterar={(value: string) => setWeight(value)} />
                    <Input label="Endereço Clinte:" aoAlterar={(value: string) => setAddress(value)} />
                    <Button label="Cadastrar Cliente" color='blue' onClick={SaveOnSubmit} />
                    <Button label='Resetar Cadastro' color='red' />

                </div>
            </div>
        </>
    )
}

export default App
