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

// Sign Up Route
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const q = `
            INSERT INTO users (username, email, password)
            VALUES (?, ?, ?);
        `;
        const values = [username, email, hashedPassword];

        db.query(q, values, (err, data) => {
            if (err) {
                console.error("Error inserting user:", err);
                return res.status(500).json({ error: "Database error" });
            }
            return res.status(201).json({ message: "User created successfully!" });
        });
    } catch (err) {
        console.error("Error in signup:", err);
        return res.status(500).json({ error: "Error during signup" });
    }
});

// Login Route
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const q = "SELECT * FROM users WHERE email = ?";

    db.query(q, [email], async (err, data) => {
        if (err) {
            console.error("Error checking credentials:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (data.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }

        const user = data[0];
        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Create JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, 'your_secret_key', { expiresIn: '1h' });

        res.json({ message: "Login successful!", token });
    });
});

// ✅ Fetch All Slots (For Admin)
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


// Import jwt for token verification


// Book Appointment Route (Insert into bookings table)
app.post("/bookings", (req, res) => {
    const { title, description, name, date, time, appointmentscol, appointmentscol1, slotId } = req.body;

    // Extract token from request headers
    const token = req.headers.authorization?.split(" ")[1];  // Bearer token
    
    if (!token) {
        return res.status(403).json({ error: "No token provided" });
    }

    try {
        // Decode the token to get user info (email is part of the JWT payload)
        const decoded = jwt.verify(token, 'your_secret_key');
        const email = decoded.email;  // Extract email from token

        const q = `
            INSERT INTO bookings (date, timeslot, location, email)
            VALUES (?, ?, ?, ?);
        `;
        const values = [date, time, appointmentscol, email];

        db.query(q, values, (err, data) => {
            if (err) {
                console.error("Error booking appointment:", err);
                return res.status(500).json({ error: "Database error" });
            }
            // Update the slot as booked in the slots table
            const updateSlotQuery = "UPDATE slots SET booked = true WHERE id = ?";
            db.query(updateSlotQuery, [slotId], (err, result) => {
                if (err) {
                    console.error("Error updating slot status:", err);
                    return res.status(500).json({ error: "Error updating slot status" });
                }
                return res.status(201).json({ message: "Slot booked successfully!" });
            });
        });
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
});



// Start Server
app.listen(8800, () => {
    console.log("Server running on port 8800!");
});
