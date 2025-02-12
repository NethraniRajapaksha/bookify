import express from "express"
import mysql from "mysql"

const app = express ()

const db = mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"Nethrani@2020",
    database:"bookify"
})

//I had Auth Problem
//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Nethrani@2020'


app.use(express.json());

app.get("/",(req,res) => {
    res.json("hello this is the backend !")
})

app.get("/appointments",(req,res) => {
    const q = "select * from appointments;"
    db.query(q,(err,data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post("/appointments", (req, res) => {
    const q = `
        INSERT INTO appointments (title, description, name, date, time)
        VALUES (?);
    `;
    const values = [
       req.body.title,
       req.body.description,
       req.body.name,
       req.body.date,
       req.body.time
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json("Bookings");
    });
});
app.listen(8800,() => {
    console.log("Connected to Backend!")
})