import AppRouter from './router/AppRouter.jsx'
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import {useEffect} from 'react';


function App() {
  return (
    <UserProvider>
      <Router>
        <AppRouter />
      </Router>
    </UserProvider>
  )
}

export default App
