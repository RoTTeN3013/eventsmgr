import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Welcome from './pages/Welcome.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/App.css'
import axios from 'axios'

function App() {

  //Felhasználó adatok lekérdezése
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/get-user-data')
      .then(res => setUser(res.data));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome user={user} />} />
      </Routes>
    </Router>
  )
}

export default App
