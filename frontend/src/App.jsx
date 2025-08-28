import AppRouter from './router/AppRouter.jsx'
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { NotificationProvider } from './context/NotificationContext';
import {useEffect} from 'react';


function App() {
  return (
    <UserProvider>
      <NotificationProvider>
        <Router>
          <AppRouter />
        </Router>
      </NotificationProvider>
    </UserProvider>
  )
}

export default App
