import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import HomePage from './pages/home';
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
      </Routes>
    </>
  )
    
}

export default App
