const express = require('express')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const cors = require('cors');
const app = express()

const port = 5000

//They are middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r5j5a.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/', (req, res) => {
  res.send('Hello World!')
})
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emajhon").collection("products");
  const ordersCollection = client.db("emajhon").collection("orders");
  // console.log(process.env.DB_USER,process.env.DB_PASS);

  app.post('/addProduct',(req,res)=>{
    const products = req.body;
    // console.log('products',product);
    productsCollection.insertOne(products)
    .then(result =>{
      // console.log(result)
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/products', (req, res,)=>{
    productsCollection.find({})
    .toArray((err, document) => {
      res.send(document);
  })
  })

  // update single product
  app.get('/product/:key', (req, res,)=>{
    productsCollection.find({key:req.params.key})
    .toArray((err, document) => {
      res.send(document[0]);
  })
  })


  //find many products
  app.post('/productsByKeys',(req, res)=>{
    const productKeys = req.body;
    productsCollection.find({key:{$in:productKeys}})
    .toArray((err,document)=>{
      res.send(document);
    })
  })

  app.post('/addOrder',(req,res)=>{
    const order = req.body;
    // console.log('products',product);
    ordersCollection.insertOne(order)
    .then(result =>{
      // console.log(result)
      res.send(result.insertedCount > 0)
    })
  })


});

app.listen(process.env.PORT||port)