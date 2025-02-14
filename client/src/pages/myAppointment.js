import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admin/admin.css'; // Import the CSS file for Admin Dashboard
import './CSS/appointment.css'

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized: No token found.");
      setLoading(false);
      return;
    }

    const fetchAppointments = axios.get('http://localhost:8800/appointments', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const fetchSlots = axios.get('http://localhost:8800/slots', {
      headers: { Authorization: `Bearer ${token}` },
    });

    Promise.all([fetchAppointments, fetchSlots])
      .then(([appointmentsResponse, slotsResponse]) => {
        setAppointments(appointmentsResponse.data); // Ensure all appointments are fetched
        setSlots(slotsResponse.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch data. " + err.message);
        setLoading(false);
      });
  }, []);

  // Function to handle appointment deletion 
  const handleDeleteAppointment = (id) => {
    // Filter out the appointment with the given ID (simulating deletion on frontend)
    const updatedAppointments = appointments.filter(appointment => appointment.id !== id);
    setAppointments(updatedAppointments); // Update the state to remove the deleted appointment
    alert("Appointment deleted successfully! ");
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      {/* All Appointments Section */}
      <section className="appointments-section">
        <h3>All Appointments</h3>
        <table className="appointments-table">
          <thead>
            <tr>
              {/* <th>Patient Name</th> */}
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Time</th>
              <th>Action</th> {/* New column for the delete button */}
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                 <tr key={appointment.id}> {/* Make sure each key is unique */}
                  {/* <td>{appointment.patientName}</td> */}
                  <td>{appointment.title}</td>
                  <td>{appointment.description}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.time}</td>
                  <td>
                    <button
                      className="book-button"
                      onClick={() => handleDeleteAppointment(appointment.id)} // Ensure correct ID is passed
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No appointments available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      
    </div> 
  );
}

export default AdminDashboard;
