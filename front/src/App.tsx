import { Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import RegisterSuccessPage from './pages/RegisterSuccessPage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/Navbar';

import './styles/main.scss';


function App() {

  return (
    <div className='wrapper'>
      <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register-success" element={<RegisterSuccessPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
    </div>
  )
    
}

export default App
