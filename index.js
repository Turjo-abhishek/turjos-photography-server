const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uhdrgdr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("turjos-pg").collection("services");
    const reviewCollection = client.db("turjos-pg").collection("reviews");

    // app.get("/allservices", async (req, res) => {
    //     console.log(req.query);
    //     // const limit = parseInt(req.query.limit);
    //   const query = {};
    //   const cursor = serviceCollection.find(query);
    //   const services = await cursor.toArray();
    //   res.send(services);
    // });
    
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query).sort({_id: -1});
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });
    

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    app.post("/services", async(req, res) => {
        const service = req.body;
        const result = await serviceCollection.insertOne(service);
        res.send(result);
    })

    app.post("/reviews", async(req, res) => {
        const review = req.body;
        const result = await reviewCollection.insertOne(review);
        res.send(result);
    })

    app.get("/reviews" , async(req, res) => {
        let query = {};
        if(req.query.service){
            query = {
                service: req.query.service
            }
        }
        const cursor = reviewCollection.find(query);
        const reviews = await cursor.toArray();
        res.send(reviews);
    })

    app.delete("/reviews/:id", async(req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await reviewCollection.deleteOne(query);
        res.send(result);
    })

  } finally {
  }
}
run().catch((error) => console.error(error));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
