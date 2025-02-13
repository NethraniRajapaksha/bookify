import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CSS/add.css"; // ✅ Import CSS file


function AddAppointment() {
  const [appointment, setAppointment] = useState({
    title: "",
    description: "",
    name: "",
    date: "",
    time: "",
  });

  const [appointments, setAppointments] = useState([]); // Store user appointments
  const token = localStorage.getItem("token"); // Get token from storage

  // ✅ Fetch Appointments of Logged-in User
  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:8800/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setAppointments(res.data))
        .catch((err) => console.error("Error fetching appointments:", err));
    }
  }, [token]);

  // ✅ Handle Form Input Changes
  const handleChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  // ✅ Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/appointments", appointment, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Appointment added successfully!");
      setAppointment({ title: "", description: "", name: "", date: "", time: "" });

      // Refresh appointment list
      const res = await axios.get("http://localhost:8800/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error("Error adding appointment:", err);
      alert("Failed to add appointment.");
    }
  };

  return (
    <div>
     
      <div className="appointment-container">
        <h2>Add Appointment</h2>
        <form onSubmit={handleSubmit} className="appointment-form">
          <input type="text" name="title" placeholder="Title" value={appointment.title} onChange={handleChange} required />
          <input type="text" name="description" placeholder="Description" value={appointment.description} onChange={handleChange} required />
          <input type="text" name="name" placeholder="Name" value={appointment.name} onChange={handleChange} required />
          <input type="date" name="date" value={appointment.date} onChange={handleChange} required />
          <input type="time" name="time" value={appointment.time} onChange={handleChange} required />
          <button type="submit">Add Appointment</button>
        </form>

        <h2>Your Appointments</h2>
        <ul className="appointment-list">
          {appointments.map((appt) => (
            <li key={appt.id}>
              <strong>{appt.title}</strong> - {appt.description} <br />
              <small>{appt.date} at {appt.time}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AddAppointment;
