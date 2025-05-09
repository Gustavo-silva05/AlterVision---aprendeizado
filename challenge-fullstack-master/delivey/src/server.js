import MongoDB from "./data.js";
import express from "express";
import cors from "cors";

const uri = "mongodb+srv://admin:Gremio2005@cluster0.fvvjh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
const port = 3003;

app.use(express.json());
app.use(cors());

const db = new MongoDB();
db.init(uri, "training", "delivery");

app.get("/alldata", async (req, res) => {
    const data = await db.alldata();
    return data? res.status(200).send(data) : res.status(404).send({ message: "No data found" });
});

app.get("/data/:id", async (req, res) => {
    const data = await db.dataId(Number(req.params.id));
    return data? res.status(200).send(data) : res.status(404).send({ message: "No data found" });
});

app.post("/push", async (req, res) => {
    const id = Number(req.body._id);
    if (!id) {
        return res.status(400).send({ message: "Missing id" });
    }
    let data_id = await db.dataId(id);
    if (data_id) {
        return res.status(400).send({ message: "Id already exists" });
    }
    const [name, weight, address] = [req.body.client_name, req.body.weight, req.body.address];
    if (!name || !weight || !address) {
        return res.status(400).send({ message: "Missing name, weight or address" });
    }
    const [log, neighborhood, number, city, state, country, lat, long] = [address.log, address.neighborhood, address.number, address.city, address.state, address.country, address.geo.lat, address.geo.long];
    if (!log || !neighborhood || !number || !city || !state || !country || !lat || !long) {
        return res.status(400).send({ message: "Missing log, neighborhood, number, city, state, country, lat or long" });
    }
    const data = await db.push(req.body);
    return res.status(200).send({ message: data ? "Data inserted successfully" : "Data not inserted" });
});


app.delete("/pop/:id", async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).send({ message: "Missing id" });
    }
    const data = await db.pop(id);
    return res.status(200).send({ message: data ? "Data deleted successfully" : "Data id not found" });
})

app.delete("/clear", async (req, res) => {
    const data = await db.deleteall();
    return res.status(200).send({ message: data ? "Data deleted successfully" : "Data not deleted" });
})

process.on('SIGINT', async () => {
    await db.close();
    process.exit();
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});