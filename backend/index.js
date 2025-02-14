import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Nethrani@2020",
    database: "bookify"
});

// Check Database Connection
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL Database!");
});

// Default Route
app.get("/", (req, res) => {
    res.json("Hello! This is the backend.");
});

// Fetch All Appointments
app.get("/appointments", (req, res) => {
    const q = "SELECT * FROM appointments;";
    db.query(q, (err, data) => {
        if (err) {
            console.error("Error fetching appointments:", err);
            return res.status(500).json({ error: "Database error" });
        }
        return res.json(data);
    });
});

//  Fetch All Slots
app.get("/slots", (req, res) => {
    const q = "SELECT * FROM slots;";
    db.query(q, (err, data) => {
        if (err) {
            console.error("Error fetching slots:", err);
            return res.status(500).json({ error: "Database error" });
        }
        return res.json(data);
    });
});

// Sign Up Route
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const q = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        const values = [username, email, hashedPassword];

        db.query(q, values, (err, data) => {
            if (err) {
                console.error("Error inserting user:", err);
                return res.status(500).json({ error: "Database error" });
            }
            return res.status(201).json({ message: "User created successfully!" });
        });
    } catch (err) {
        return res.status(500).json({ error: "Error during signup" });
    }
});

//  Login Route
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const q = "SELECT * FROM users WHERE email = ?";

    db.query(q, [email], async (err, data) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (data.length === 0) return res.status(400).json({ error: "User not found" });

        const user = data[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        // Check if the user is an admin
        const isAdmin = email === "admin@gmail.com" && password === "admin123";

        // Include email and isAdmin in the token payload
        const token = jwt.sign({ id: user.id, username: user.username, email: user.email, isAdmin }, 'your_secret_key', { expiresIn: '1h' });
        res.json({ message: "Login successful!", token, isAdmin });
    });
});
// Book Appointment
app.post("/bookings", (req, res) => {
    const { title, description, patientName, date, time, location, slotId } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(403).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        const email = decoded.email;

        const q = "INSERT INTO appointments (title, description, patientName, date, time, location, email) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const values = [title, description, patientName, date, time, location, email];

        db.query(q, values, (err, data) => {
            if (err) return res.status(500).json({ error: "Database error" });

            const updateSlotQuery = "UPDATE slots SET booked = true WHERE id = ?";
            db.query(updateSlotQuery, [slotId], (err) => {
                if (err) return res.status(500).json({ error: "Error updating slot status" });
                return res.status(201).json({ message: "Appointment booked successfully!" });
            });
        });
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
});

// Delete Appointment
app.delete("/appointments/:id", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    const appointmentId = req.params.id;
  
    if (!token) return res.status(403).json({ error: "No token provided" });
  
    try {
      const decoded = jwt.verify(token, 'your_secret_key');
  
      const q = "DELETE FROM appointments WHERE id = ?";
      db.query(q, [appointmentId], (err, data) => {
        if (err) return res.status(500).json({ error: "Database error" });
        return res.status(200).json({ message: "Appointment deleted successfully!" });
      });
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  });

// Start Server
app.listen(8800, () => {
    console.log("Server running on port 8800!");
});
