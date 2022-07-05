var express = require("express");
var cors = require("cors");
var app = express();
var jwt = require("jsonwebtoken");
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

// verify jwt token
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    await client.connect();
    const serviceCollection = client
      .db("Doctors-portals")
      .collection("Services");
    const appointmentCollection = client
      .db("Doctors-portals")
      .collection("appointment");
    const userCollection = client.db("Doctors-portals").collection("users");

    //  login to save user info and generate access-token
    app.put("/login/:email", async (req, res) => {
      const email = req.params.email;

      let user = "";
      if (req.body.email === process.env.ADMIN) {
        user = { ...req.body, role: "admin" };
      } else {
        user = req.body;
      }

      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      var token = jwt.sign(user, process.env.SECRET_KEY);
      res.send({ result, token });
    });
    // check admin
    app.get("/isAdmin/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email });
      if (user.role === "admin") {
        return res.status(200).send({ isAdmin: true });
      }
      return res.status(401).send({ isAdmin: false });
    });
    //  get all users info for admin board
    app.get("/users/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const isAdmin = await userCollection.findOne({ email });
      if (isAdmin.role === "admin") {
        const cursor = await userCollection.find({}).toArray();
        return res.status(200).send(cursor);
      }
      return res.status(401).send({ message: "forbidden access" });
    });
    // change appointment status for admin
    app.put("/appointment", async (req, res) => {
      const email = req.query.email;
      const id = req.query.id;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          stage: req.body.stage,
        },
      };
      const result = await appointmentCollection.updateOne(
        filter,
        updateDoc,
        option
      );
      res.send(result);
    });
    // get  appointment invoice by id [get]
    app.get("/invoice/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const invoice = await appointmentCollection.findOne(query);
      res.send(invoice);
    });

    // book appointment [post]
    app.post("/appointment", async (req, res) => {
      const appointment = await appointmentCollection.insertOne(req.body);
      res.send(appointment);
    });
    // get appointment for authorized user [get]
    app.get("/my_appointment/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const token = req.headers.authorization;
      if (
        req.decoded.email === process.env.ADMIN &&
        req.decoded.email === email
      ) {
        const cursor = appointmentCollection.find({});
        const myAppointment = await cursor.toArray();

        return res.send(myAppointment);
      }
      if (req.decoded.email === email) {
        const cursor = appointmentCollection.find({ email });
        const myAppointment = await cursor.toArray();

        return res.send(myAppointment);
      }

      return res.status(401).send({ message: "forbidden access" });
    });
    // get all services [get]
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // get selected services by id [get]
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("welcome to doctor portals");
});
app.listen(port, () => {
  console.log("doctor portals is running on port", port);
});
