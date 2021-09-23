const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjecetId = require("mongodb").ObjectId;

const app = express();

app.use(express.json());

let db;
MongoClient.connect("mongodb://localhost:27017", (err, client) => {
    err ? console.log(err) : (db = client.db("todo"));
});

app.get("/todolist", (req, res) => {
    db.collection("todo")
        .find()
        .toArray((err, results) => {
            err
                ? res.send({ error: true, err: err })
                : res.send({ error: false, results: results });
        });
});

app.post("/newItem", (req, res) => {
    db.collection("todo").insertOne(req.body, (err, results) => {
        console.log(results);
        err
            ? res.send({ error: true, err: err })
            : res.send({ error: false, results: results });
    });
});

app.put("/completeTask", (req, res) => {
    const id = ObjecetId(req.body.id);
    db.collection("todo").updateOne(
        { _id: id },
        { $set: { done: req.body.done } },
        (err, results) => {
            err
                ? res.send({ error: true, err: err })
                : res.send({ error: false, results: results });
        }
    );
});

app.delete("/deleteTask", (req, res) => {
    const id = ObjecetId(req.body.id);
    db.collection("todo").deleteOne({ _id: id }, (err, results) => {
        err
            ? res.send({ error: true, err: err })
            : res.send({ error: false, results: results });
    });
});

app.listen(3001);
