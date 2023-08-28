const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
// const bodyParser = require('body-parser');
const port =  5000;

//middle ware
app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());

/**
sourav200217
pYjFYAC6fBzXZYej

 * 
 */


const uri = "mongodb+srv://sourav200217:suvro12345678@cluster0.0omak70.mongodb.net/?retryWrites=true&w=majority";


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
    r=await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!\n ",r);
    const customerProfile = await client.db("dev-campus").collection("customer-profile");
    // console.log(customerProfile)
    app.post('/register', async (req, res) => {
      console.log("register is called")
      const user = req.body;
      console.log("requested to insert= \n", user);
      const result = await customerProfile.insertOne(user);
      res.send(result)
    })
    
   
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/home', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})