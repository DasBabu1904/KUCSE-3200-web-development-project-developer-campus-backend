const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
// const bodyParser = require('body-parser');
const port = 5000;

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
    //add user ot db
    app.post('/register', async (req, res) => {
      const customerProfile = await client.db("dev-campus").collection("customer-profile");
      const user = req.body;
      const result = await customerProfile.insertOne(user);
      res.send(result)
    })

    //add company to db
    const companyList = await client.db("dev-campus-company-list").collection("company-details");
    app.post('/add-company-to-db', async (req, res) => {
      const company = req.body;
      const result = await companyList.insertOne(company)
      res.send(result)
    })


    //get compnay details
    app.get('/get-company-list', async (req, res) => {
      console.log(req.body)
      let query = {};
      const cursor = companyList.find(query);
      const COMPANYlist = await cursor.toArray();
      // console.log(COMPANYlist)
      res.send(COMPANYlist);
    })

    //add product
    app.post('/add-product', async (req, res) => {
      const ProductList = await client.db("dev-campus").collection("Product-list");
      const user = req.body;
      const result = await ProductList.insertOne(user);
      res.send(result)
    })

    //get product
    app.get('/get-get-product', async (req, res) => {
      console.log(req.body)
      let query = {};
      const cursor = companyList.find(query);
      const COMPANYlist = await cursor.toArray();
      // console.log(COMPANYlist)
      res.send(COMPANYlist);
    })

    app.get('/get-admin-profile', async (req, res) => {
      console.log("profile accress request ", req.query);
      const customerProfile = await client.db("dev-campus").collection("customer-profile");
      const cursor = customerProfile.find(req.query);
      const AdminProfile = await cursor.toArray();
      console.log(AdminProfile)
      res.send(AdminProfile);
    })
    
    //update company from bd
    app.put('/update-company-details', async (req, res) => {
      const email = req.body.email;
      const updatedDocument = req.body;
      console.log(email)
      console.log(updatedDocument)
      try {
        const result = await companyList.updateOne({ email: email }, { $set: updatedDocument });
        res.json(result);
      } catch (error) {
        console.error("Error updating document:", error);
        res.status(500).send("Internal Server Error");
      }
    })

    //delete from company
    app.delete("/delete-company", async (req, res) => {
      const email = req.body.email;
      try {
        const result = await companyList.deleteOne({ email: email });
        res.json(result);
      } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).send("Internal Server Error");
      }
    })

  } finally {
    //  jodi connencted rakhte chai taile close kora jabe na
    //  onek bishal error khaisi eitar karone. 
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