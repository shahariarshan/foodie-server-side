const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000


// middleware 
app.use(cors())
app.use(express.json())


// connecting MongoDB 

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hoyasjp.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    const menuCollections =client.db('Foodie-DB').collection('menus')
    const cartsCollection =client.db('Foodie-DB').collection('cartItem')


    // all menu item operations 

    app.get ('/menu',async(req,res)=>{
        const result = await menuCollections.find().toArray()
        res.send(result)
    })


    // posting cart on db 
    app.post('/carts',async(req,res)=>{
        const cartItem =req.body
        const result =await cartsCollection.insertOne(cartItem)
        res.send(result)
    })
    // get cart by email 
    app.get ('/carts',async(req,res)=>{
        const email = req.query.email
        const filter ={email:email}
        const result = await cartsCollection.find(filter).toArray()
        res.send(result)
    })

    // get specific id of carts 
    app.get('/carts/:id',async(req,res)=>{
        const id = req.params.id
        const filter = {_id: new ObjectId(id)}
        const result = await cartsCollection.findOne(filter)
        res.send(result)
    })

    // cart delete from cart 
    app.delete('/carts/:id',async(req,res)=>{
        const id = req.params.id
        const filter ={_id: new ObjectId(id)}
        const result =await cartsCollection.deleteOne(filter)
        res.send(result)
    })
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('I am Hungry!')
  })
  
  app.listen(port, () => {
    console.log(`Foodie server running on port ${port}`)
  })