import './App.css';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Appointments from './pages/appointment';
import Add from './pages/addAppiontment';
import Update from './pages/updateAppointment';
import Nav from './pages/nav';
import MyAppointment from './pages/myAppointment';
import Admin from './pages/Admin/admin';
import Slot from './pages/slot';

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch("http://localhost:8800/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
      setToken(data.token);
      localStorage.setItem('token', data.token); // Store token
      navigate("/my"); // Navigate to MyAppointment after login
    } else {
      alert(data.error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken); // Load token from localStorage
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Appointments />} />
          <Route path="/add" element={<Add />} />
          <Route path="/update" element={<Update />} />
          <Route path="/my" element={<MyAppointment />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/slots" element={<Slot />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
