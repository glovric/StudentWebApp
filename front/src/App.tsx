import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import RegisterSuccessPage from './pages/RegisterSuccessPage';
import Navbar from './components/Navbar';

import { Routes, Route } from 'react-router-dom';

import './styles/main.scss';

function App() {

  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-success" element={<RegisterSuccessPage />} />
      </Routes>
    </>
  )
    
}

export default App
