import React, { useState, useEffect } from 'react';
import './CSS/slot.css'; // Importing the CSS file

function Slot() {
  const [slots, setSlots] = useState([]); // State to store fetched slots
  const [loading, setLoading] = useState(true); // State for loading status

  useEffect(() => {
    // Fetch the slots data from the backend API
    const fetchSlots = async () => {
      try {
        const response = await fetch('http://localhost:8800/slots');
        const data = await response.json();
        setSlots(data); // Store the fetched slots in state
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        console.error("Error fetching slots:", err);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchSlots(); // Call the function to fetch slots when the component mounts
  }, []); // Empty dependency array to run only once when the component mounts

  const handleBook = async (slot) => {
    const token = localStorage.getItem("token"); // Retrieve the token from storage
    const userEmail = JSON.parse(localStorage.getItem("user"))?.email; // Get the email of the logged-in user

    if (!token) {
      alert("Please log in to book a slot.");
      return;
    }

    if (!userEmail) {
      alert("Unable to fetch your email. Please ensure you're logged in.");
      return;
    }

    try {
      const appointmentDetails = {
        title: `Appointment for ${slot.timeslot}`,
        description: `Slot booked for ${slot.timeslot} on ${slot.date}`,
        name: slot.username, // Adjust as needed
        date: slot.date,
        time: slot.timeslot,
        appointmentscol: slot.location,
        appointmentscol1: "Additional Info",
        slotId: slot.id,
        email: userEmail, // Include the email of the logged-in user
      };

      const response = await fetch('http://localhost:8800/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Add the token to the headers
        },
        body: JSON.stringify(appointmentDetails),
      });

      const result = await response.json();

      if (response.ok) {
        // Successfully booked the appointment
        setSlots((prevSlots) =>
          prevSlots.map((s) =>
            s.id === slot.id ? { ...s, booked: true } : s
          )
        );
        alert(result.message); // Inform the user of the successful booking
      } else {
        alert(result.error); // Show error message
      }
    } catch (err) {
      console.error("Error booking slot:", err);
      alert("Error booking slot.");
    }
  };

  return (

        <div>
          <br /><br /><br /><br />
          <h2>Available Slots</h2>
          {loading ? (
            <p>Loading...</p>  // Display a loading message or spinner
          ) : (
            <ul className="slot-list">
              {slots.map((slot) => (
                <li key={slot.id} className="slot-item">
                  <div>
                    <h3>{slot.date}</h3>
                    <p>{slot.timeslot}</p>
                    <span>{slot.location}</span>
                  </div>
                  <button
                    className="book-button"
                    onClick={() => handleBook(slot)}
                    disabled={slot.booked}
                  >
                    {slot.booked ? "Booked" : "Book"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
      
}

export default Slot;
