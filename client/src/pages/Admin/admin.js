import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Admin/admin.css'; // Import the CSS file

function MyAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch appointments.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading appointments...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="appointments-container">
      <h2>My Appointments</h2>
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
    </div>
  );
}

export default MyAppointment;
