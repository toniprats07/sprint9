import React, { useState, useEffect } from 'react';
import { Link, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import CreateAcount from './components/CreateAcount';
import SearchPage from './components/SearchPage';
import LoginPage from './components/LoginPage';
import SettingsPage from './components/SettingsPage';
import UserProfilePage from './components/UserProfilePage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import { User } from './types/types';

interface Zone {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  details: string;
  degrees: string;
  climbingType: string;
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [savedZones, setSavedZones] = useState<Zone[]>([]);
  const [mostrarBienvenida, setMostrarBienvenida] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  // Comprobar si el usuario ha iniciado sesión al cargar la aplicación
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      setLoggedIn(true);
      setMostrarBienvenida(false);
    }
  }, []);

  // Función del registro de usuario
  const handleRegister = (user: User) => {
    setCurrentUser(user);
  };

  // Función del inicio de sesión
  const handleLogin = () => {
    setLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  // Entrar a la aplicación y ocultar el mensaje de bienvenida
  const entrarApp = () => {
    setMostrarBienvenida(false);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const pageContent = mostrarBienvenida && !loggedIn ? (
    <div className="hero min-h-screen" >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">ClimbConnect</h1>
          <p className="mb-5">¡Bienvenido a ClimbConnect, el lugar donde los amantes de la escalada se unen para conquistar nuevos desafíos y alcanzar la cima juntos!</p>
          <div className='flex flex-col'>
          <Link className="self-center" to="/home">
            <button className="btn btn-primary mb-5" onClick={entrarApp}>Empezar como invitado</button>
          </Link>
          <Link className='self-center' to="/loginpage">
            <button className="btn btn-primary mb-5" onClick={entrarApp}>Empezar con tu cuenta</button>
          </Link>
          </div>
          <Link className="self-center" to="/createacount">
            <button className='mb-5' onClick={entrarApp}>Crear cuenta</button>
          </Link>
          <p>¿Has olvidado tu contraseña? <Link onClick={entrarApp} to="/forgotpassword">Click aquí</Link></p>
          
        </div>
      </div>
    </div>
  ) : (
    <div>
        <Routes>
          <Route path='/home' element={<HomePage />} />
          <Route path="/createacount" element={<CreateAcount onRegister={handleRegister} />}/>
          <Route path="/loginpage" element={<LoginPage onLogin={handleLogin} />} />
          <Route path='/explore' element={<SearchPage />} />
          <Route path='/profile' element={<UserProfilePage />} />
          <Route path='/settings' element={<SettingsPage />} />
          <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        </Routes>
    </div>
  );

  return (
    <Router>
      <div>
        <div>
          <Header />
        </div>
        {pageContent}
        <div>
          <Footer />
        </div>
      </div>
    </Router>
  )
}

export default App