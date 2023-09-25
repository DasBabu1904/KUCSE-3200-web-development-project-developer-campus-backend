const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const bodyParser = require('body-parser');
const port = 5000;

//middle ware
app.use(cors());
app.use(express.json());



const SSLCommerzPayment = require('sslcommerz-lts')
const store_id = 'dassd650ea56590f5a'
const store_passwd = 'dassd650ea56590f5a@ssl'
const is_live = false
const httpProxy = require('http-proxy');
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


    //get compnay List
    app.get('/get-company-list', async (req, res) => {
      console.log(req.body)
      let query = {};
      const cursor = companyList.find(query);
      const COMPANYlist = await cursor.toArray();
      // console.log(COMPANYlist)
      res.send(COMPANYlist);
    })

    //get specific compnay details
    app.get('/get-one-company-details', async (req, res) => {
      let query = req.query;
      const cursor = companyList.find(query);
      const CompanyDetails = await cursor.toArray();
      // console.log(CompanyDetails)
      res.send(CompanyDetails);
    })


    //get user
    app.get('/get-user-list', async (req, res) => {
      console.log(req.body)
      const customerProfile = await client.db("dev-campus").collection("customer-profile");
      let query = {};
      const cursor = customerProfile.find(query);
      const CustomerList = await cursor.toArray();
      const filetered = CustomerList.filter(item => item.admin === 'false')
      //we are sending users who are not admin
      res.send(filetered);
    })

    //add product
    app.post('/add-product', async (req, res) => {
      const ProductList = await client.db("dev-campus").collection("Product-list");
      const user = req.body;
      const result = await ProductList.insertOne(user);
      res.send(result)
    })

    //get product
    app.get('/get-product-list', async (req, res) => {
      const ProductList = await client.db("dev-campus").collection("Product-list");
      let query = req.query;
      // console.log(query.productName.toLowerCase())
      const cursor = ProductList.find({});
      const Products = await cursor.toArray();
      //filtering accordin to search
      const FilteredProduct = Products.filter(product =>
        product.productName.toLowerCase() == query.productName.toLowerCase()
      )
      //console.log(FilteredProduct)
      res.send(FilteredProduct);
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

    //set order
    app.post('/place-order', async (req, res) => {
      const OrderList = await client.db("dev-campus").collection("OrderList");
      const order = req.body;
      order.approval = 'false'
      order.status = 'Incomplete'
      const result = await OrderList.insertOne(order)
      res.send(result)
    })

    //get orders for user
    app.get('/get-user-oder-list', async (req, res) => {
      const OrderList = await client.db("dev-campus").collection("OrderList");
      let query = req.query;
      // console.log(query.productName.toLowerCase())
      const cursor = OrderList.find(query);
      const Orders = await cursor.toArray();
      //console.log(Orders)
      res.send(Orders);
    })
    //get orders for user
    app.get('/get-admin-oder-list', async (req, res) => {
      const OrderList = await client.db("dev-campus").collection("OrderList");
      let query = req.query;
      // console.log(query.productName.toLowerCase())
      const cursor = OrderList.find({});
      const Orders = await cursor.toArray();
      // console.log(Orders)
      res.send(Orders);
    })

    //update Orders
    app.put('/update-order-approval', async (req, res) => {
      const OrderList = await client.db("dev-campus").collection("OrderList");
      const id = req.body._id;
      const objectId = new ObjectId(id);
      const updatedDocument = req.body;
      console.log(updatedDocument)
      const ap = { approval: 'true' }
      try {
        const result = await OrderList.updateOne({ _id: objectId }, { $set: ap });
        res.json(result);
      } catch (error) {
        console.error("Error updating document:", error);
        res.status(500).send("Internal Server Error");
      }
    })

    //----------------------------------------------------------------//
    //----------payment system---------------------------------------//
    app.post('/poreced-payment', async(req, res) => {
      const PaymedCollection = await client.db("dev-campus").collection("Payments");
      const query=(req.query)
      const transactionID = new ObjectId().toString();
      const data = {
        total_amount: query.price,
        currency: 'BDT',
        tran_id: transactionID, // use unique tran_id for each api call
        success_url: `http://localhost:5000/success-payment?transactionID=${transactionID}`,
        fail_url: `http://localhost:5000/fail?transactionID=${transactionID}`,
        cancel_url: `http://localhost:5000/cancel`,
        ipn_url: 'http://localhost:5000/ipn',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: 'Customer Name',
        cus_email: query.companyEmail,
        customerEmail:query.customerEmail
      };
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
      sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Expose-Headers', '');
        res.send({url:GatewayPageURL})
        console.log('Redirecting to: ', GatewayPageURL)
        PaymedCollection.insertOne(data)
        // console.log('Redirecting to: ', GatewayPageURL)
      });
    })
    app.post('/success-payment',(req,res)=>{
      // console.log(req.query)
      // query.success='True'
      // res.redirect(`localhost:3000/payment/success?${query}`)
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