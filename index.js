const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
// const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());

/**

KU-cse-3200-dev-campus
Sra5QGoawM29VivM
 * 
 */


const uri = "mongodb+srv://KU-cse-3200-dev-campus:Sra5QGoawM29VivM@cluster0.0omak70.mongodb.net/?retryWrites=true&w=majority";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})