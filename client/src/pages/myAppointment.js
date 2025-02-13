import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admin/admin.css'; // Import the CSS file for Admin Dashboard

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the JWT token from localStorage or context
    const token = localStorage.getItem("token");

    // Fetch appointments for the logged-in user
    axios.get('http://localhost:8800/appointments', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setAppointments(response.data);
        setLoadingAppointments(false);
      })
      .catch(err => {
        setError("Failed to fetch appointments.");
        setLoadingAppointments(false);
      });

    // Fetch slots for the admin dashboard
    axios.get('http://localhost:8800/slots', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setSlots(response.data);
        setLoadingSlots(false);
      })
      .catch(err => {
        setError("Failed to fetch slots.");
        setLoadingSlots(false);
      });
  }, []);

  if (loadingAppointments || loadingSlots) return <div className="loading">Loading data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      
      <section className="appointments-section">
        <h3>Appointments</h3>
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr key={appointment.id}>
                <td>{appointment.title}</td>
                <td>{appointment.description}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="slots-section">
        <h3>Available Slots</h3>
        <table className="slots-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {slots.map(slot => (
              <tr key={slot.id}>
                <td>{slot.date}</td>
                <td>{slot.timeslot}</td>
                <td>{slot.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default AdminDashboard;
