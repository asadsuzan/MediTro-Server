var express = require("express");
var cors = require("cors");
var app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middle-ware
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rrsh6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const serviceCollection = client
      .db("Doctors-portals")
      .collection("Services");
    const appointmentCollection = client
      .db("Doctors-portals")
      .collection("appointment");

    // post order
    app.post("/appointment", async (req, res) => {
      const appointment = await appointmentCollection.insertOne(req.body);
      res.send({ message: "appointment booked" });
    });

    // get all services
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // get  services by id
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });
  } finally {
  }
}
run();

app.get("/", async (req, res) => {
  res.send("welcome to doctor portals");
});
app.listen(port, () => {
  console.log("doctor portals is running on port", port);
});
