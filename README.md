# Bookify - Appointment Booking System

## Objective
Bookify is a simple **Appointment Booking System** that allows users to efficiently book, manage, and cancel appointments. Built using **React.js**, **Node.js**, and **MySQL**, this system ensures a smooth user experience with essential validation and authentication.

## Features

### Core Features
1. **View Available Time Slots**
   - Users can see all available time slots for booking.
   - The list is dynamically updated.

2. **Book an Appointment**
   - Users can select an available time slot and book an appointment.
   - Prevents double booking of a time slot.

3. **View Booked Appointments**
   - Users can see a list of all their booked appointments.
   - Provides a clean and organized view.

4. **Cancel an Appointment**
   - Users can cancel their booked appointments.
   - The time slot becomes available again for others.

### Backend - Node.js Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/slots` | Retrieve available time slots. |
| **POST** | `/appointments` | Book an appointment. |
| **GET** | `/appointments` | Retrieve booked appointments for a user. |
| **DELETE** | `/appointments/:id` | Cancel an appointment. |

### Data Validation
- **No Double Booking**: Ensures that a time slot cannot be booked more than once.
- **Valid User Details**: Checks for required user input fields before processing an appointment.

### Additional Features (Optional but Encouraged)
1. **Authentication System**
   - Users can **sign up** and **log in** securely using JWT or session-based authentication.
   - Restricts booking and viewing appointments to logged-in users only.

## Technologies Used
- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: MySQL
- **Authentication**: JWT

## Installation and Setup
### Prerequisites
- Node.js and npm installed
- MySQL database set up

### Steps to Run the Project
1. Clone the repository:

2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up the MySQL database:
   - Create a database (e.g., `bookify`).
   - Run the provided SQL scripts to create necessary tables.
4. Configure environment variables:
   - Create a `.env` file and add database connection details.
5. Start the backend server:
   ```sh
   npm start
   ```
6. Start the frontend:
   ```sh
   cd client
   npm start
   ```

## Future Enhancements
- Email notifications for appointment confirmations.
- Admin panel for managing appointments.
- Advanced filtering options for users.



