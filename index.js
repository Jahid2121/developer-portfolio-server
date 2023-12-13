const express = require('express');
const app = express()
const cors = require('cors');
require('dotenv').config()
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAIL_GUN_API_KEY,
});


const port = process.env.PORT || 5000

// middlewares
app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pu45iww.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const projectCollection = client.db("portfoliodb").collection("projects")

        app.get('/projects', async (req, res) => {
            const cursor = projectCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/sendEmail',  (req, res) => {    
            const { name, email, message } = req.body;
            const response =  mg.messages
                .create(process.env.MAIL_SENDING_DOMAIN, {
                    from: `${email}`,
                    to: ["jahidsarkar2121@gmail.com"],
                    subject: "New contact form submission",
                    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
                })
                .then(msg => console.log(msg)) // logs response data
                .catch(err => console.log(err)); // logs any error`;

                console.log(response);
        })





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);








app.get('/', (req, res) => {
    res.send('Portfolio website is running')
})

app.listen(port, () => {
    console.log(`Portfolio website is running on ${port}`);
})