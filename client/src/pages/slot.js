import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/slot.css'; // Importing the CSS file

function Slot() {
  const navigate = useNavigate();

  // Hardcoded slot data for demonstration
  const initialSlots = [
    { id: 1, date: '2025-02-15', timeslot: '10:00 AM - 11:00 AM', location: 'Room A', booked: false },
    { id: 2, date: '2025-02-15', timeslot: '11:00 AM - 12:00 PM', location: 'Room B', booked: false },
    { id: 3, date: '2025-02-16', timeslot: '01:00 PM - 02:00 PM', location: 'Room C', booked: false },
  ];

  const [slots, setSlots] = useState(initialSlots);

  const handleBook = (slotId) => {
    setSlots((prevSlots) =>
      prevSlots.map((slot) =>
        slot.id === slotId ? { ...slot, booked: true } : slot
      )
    );
  };

  return (
    <div>
      <br /><br /><br /><br />
      <h2>Available Slots</h2>
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
              onClick={() => handleBook(slot.id)}
              disabled={slot.booked}
            >
              {slot.booked ? "Booked" : "Book"}
            </button>
          </li>
        ))}
      </ul>

      {/* View My Appointments Button */}
      <button className="book-button" onClick={() => navigate('/my')}>
        View My Appointments
      </button>
    </div>
  );
}

export default Slot;
