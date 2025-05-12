import { useState } from 'react'
import style from './App.module.css'
import Input from './componentes/Input'
import Button from './componentes/Button'
import axios from 'axios'
const base_url = `https://nominatim.openstreetmap.org/search?format=json&q=`;


type Client = {
    _id: number;
    name: string;
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
    const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);


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



    async function buscarSugestoes(endereco: string) {
        if (!endereco || endereco.length < 3) {
            setAddressSuggestions([]);
            return;
        }

        const url = base_url + `${encodeURIComponent(endereco)}&addressdetails=1&limit=5`;
        const res = await axios.get(url);

        if (res.data.length === 0) {
            setAddressSuggestions([]);
            return;
        }

        const sugestoes = res.data.map((item: any) => item.display_name);
        setAddressSuggestions(sugestoes);
    }

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
            name: client,
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
        try{

            const post = (await axios.post("http://localhost:3003/push", n_client)).data;
            console.log(post);
            alert('Client saved successfully!');
        }
        catch(error){
            alert('Error saving client.');
            console.log(error)
        }
    }

    async function Reset (){
        const confirm =window.confirm('Are you sure you want to delete all database?');
        if (!confirm) return;
        try{
            
            setClient("");
            setWeight("");
            setAddress("");
            setStreet("");
            setNumber(0);
            setNeighborhood("");
            setCity("");
            setState("");
            setCountry("");
            setLat("");
            setLong("");
            const res = await axios.delete("http://localhost:3003/clear");
            console.log(res);
            alert('All database have been deleted!');
        }catch(error){
            console.error('Failed to reset database:', error);
            alert('Error deleting database.');
        }
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
                    <Input label="Endereço Clinte:" aoAlterar={(value: string) => {
                        setAddress(value);
                        buscarSugestoes(value);
                    }} />
                    {addressSuggestions.length > 0 && (
                        <ul style={{ border: '1px solid #ccc', padding: '5px', maxHeight: '150px', overflowY: 'auto', backgroundColor: 'white' }}>
                            {addressSuggestions.map((sugestao, idx) => (
                                <li
                                    key={idx}
                                    style={{ padding: '5px', cursor: 'pointer' }}
                                    onClick={() => {
                                        setAddress(sugestao);
                                        setAddressSuggestions([]);
                                    }}
                                >
                                    {sugestao}
                                </li>
                            ))}
                        </ul>
                    )}

                    <Button label="Cadastrar Cliente" color='blue' onClick={SaveOnSubmit} />
                    <Button label='Resetar Cadastro' color='red' onClick={Reset} />

                </div>
            </div>
        </>
    )
}

export default App
