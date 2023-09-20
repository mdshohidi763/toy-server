const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors');
const port = 4000;

app.use(cors())
app.use(express.json())




// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.auirjhu.mongodb.net/?retryWrites=true&w=majority`;

const uri = "mongodb+srv://toyserver:KgmVW6fGxoN9qTpK@cluster0.auirjhu.mongodb.net/?retryWrites=true&w=majority";
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

    const toyCollection = client.db("toyStore").collection("toys")
   
    app.get('/health', (req, res) => {
      res.send("All is well");
    })
    // inser a toy
    app.post('/allData', async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await toyCollection.insertOne(data);
      res.send(result);
    })

    // app.get('/get-toy/:id',async(req,res)=>{
    //   const id = req.params.id;
    //   const query = {_id:new ObjectId(id)}
    //   const result = await toyCollection.findOne(query);
    //   res.send(result); 
    // })

    // app.get('/getAllToys', async (req, res) => {
    //   let query = {};
    //   if(req.query?.email){
    //     query = {email: req.query.email}
    //   }
    //   cursor = toyCollection.find(query)
    //   const result = await cursor.toArray()
    //   res.send(result)
    // })
// GET.....
  app.get('/allData',async(req,res)=>{
    // console.log(req.query.sellerEmail);
    let query = {};
    if(req.query?.sellerEmail){ 
      query = {
        sellerEmail: req.query.sellerEmail
      }
 
    }
    const result = await toyCollection.find(query).toArray();
    res.send(result);
  })

  app.get('/allData',async(req,res)=>{
    
    let query = {};
    if(req.query?.category){ 
      query = {
        category: req.query.category
      }
 
    }
    const result = await toyCollection.find(query).toArray();
    res.send(result);
  })
  // SORTING...///
   app.get('/allData',async(req,res)=>{
    const sort = req.query.sort;
    const query = {};
    const options = {
      sort: {'price': sort === "ascend"? 1 :-1}
    }
    const result = await toyCollection.find(query,options).toArray();
      res.send(result)
  })

  // GET ALL DATA....///
  app.get('/allData',async(req,res)=>{
    const result = await toyCollection.find().toArray();
      res.send(result)
  })

// UPDATE.....///
   app.patch('/allData/:id',async(req,res)=>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const updatedData = req.body;
    const option = {upsert: true};
    const data = {
      $set: {
        price:updatedData.price,quantity:updatedData.quantity,description:updatedData.description
      }
    }
    const result = await toyCollection.updateOne(filter,data,option);
    res.send(result);
   })
  
  // Delete........///
   app.delete('/allData/:id',async(req,res)=>{
    const id = req.params.id;
    const filter ={_id: new ObjectId(id)}
    const result = await toyCollection.deleteOne(filter)
    res.send(result)
   })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log('Listening to port', port);
})