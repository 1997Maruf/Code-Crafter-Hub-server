const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a87xhva.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    app.post("/assignment", async (req, res) => {
      const newAssignment = req.body;
      console.log(newAssignment);
      const result = await assignmentCollection.insertOne(newAssignment);
      res.send(result);
    });

    //submit Assignment
    app.post("/submitAssignment", async(req, res) => {
        const submit = req.body;
        console.log(submit);
        const result = await submitAssignmentCollection.insertOne(submit);
        res.send(result);
    })

    const assignmentCollection = client
      .db("codeCrafterHub")
      .collection("assignment");
    const submitAssignmentCollection = client
      .db("codeCrafterHub")
      .collection("submitAssignment");
    // await submitAssignmentCollection.insertMany([{ namr: "test" }]);
    // //
    // panding
    app.get("/submitAssignment", async (req, res) => {
       
      const cursor = submitAssignmentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/assignment", async (req, res) => {
      const cursor = assignmentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    


    app.get("/assignment/:id", async(req, res) =>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id)};
        // const options = {
        //     projection: {title:1, marks: 1 },
        // }
        const result = await assignmentCollection.findOne(query);
        res.send(result);
    })



    // Update Assignment
    app.get("/assignment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assignmentCollection.findOne(query);
      res.send(result);
    });
    //delete Assignment
    app.delete("/assignment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assignmentCollection.deleteOne(query);
      res.send(result);
    });

    //Update Assignment
    app.put("/assignment/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateAssignment = req.body;
      const assignment = {
        $set: {
          title: updateAssignment.title,
          marks: updateAssignment.marks,
          difficulty: updateAssignment.difficulty,
          thumbnailImageUrl: updateAssignment.thumbnailImageUrl,
          description: updateAssignment.description,
        },
      };

      const result = await assignmentCollection.updateOne(
        filter,
        assignment,
        options
      );
      res.send(result);
    });
   

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Code Crafter Hub is running");
});

app.listen(port, () => {
  console.log(`Code Crafter Hub is running on port ${port}`);
});
