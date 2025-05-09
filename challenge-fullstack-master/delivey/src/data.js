import { MongoClient, ServerApiVersion } from 'mongodb';


class MongoDB {
    constructor() {
        this.client = null;
        this.db = null;
    }

    async init(uri, database, collection) {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        try {
            await client.connect();
            await client.db("admin").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
            this.client = client;
            this.db = client.db(database).collection(collection);
        } catch (e) {
            console.error(e);
        }
    }

    async alldata() {
        const data = await this.db.find().toArray();
        return data;
    }

    async dataId(id) {
        const data = await this.db.findOne({ _id: id });
        return data;
    }

    async push(obj) {
        const data = await this.db.insertOne(obj);
        return data ? true : false;
    }

    async pop(id) {

        const data = await this.db.deleteOne({ _id: id });
        return data.deletedCount > 0 ? true : false;
    }

    async deleteall() {
        const data = await this.db.deleteMany({});
        return data ? true : false;
    }

    async close(){
        await this.client.close();
    }

}

export default MongoDB;