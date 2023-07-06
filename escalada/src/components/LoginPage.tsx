import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword, signOut, signInWithGoogle } from '../firebase/FirebaseConfig';

interface LoginPageProps {
  onLogin: () => void;
}

// Declaración de constantes globales
const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario ha iniciado sesión al cargar la página
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Actualizar el estado del mail
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  // Actualizar el estado de la contraseña
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  // Función de creación de cuenta tradicional
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setLoggedIn(true);
        onLogin();
        navigate('/home');
        alert('Has iniciado sesión correctamente');
        console.log('Iniciar sesión con correo electrónico');
      })
      .catch((error) => {
        console.log('Error: No se pudo iniciar sesión con correo electrónico', error);
      });
  };

  //Función de creación de cuenta con google
  const handleLoginWithGoogle = async () => {
    try {
      await signInWithGoogle();
      setLoggedIn(true);
      onLogin();
      navigate('/home');
      console.log('Iniciar sesión con Google');
      alert('Has iniciado sesión con Google correctamente');
    } catch (error) {
      console.log('Error: No se pudo iniciar sesión con Google', error);
    }
  };

  // Función de cierre de sesión
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setLoggedIn(false);
        console.log('Cierre de sesión exitoso');
        navigate('/home');
        alert('Has cerrado sesión correctamente');
      })
      .catch((error) => {
        console.log('Error: No se pudo cerrar sesión', error);
      });
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        {!loggedIn && (
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Iniciar sesión</h1>
            <p className="py-6">Conéctate con la pasión de la escalada en ClimbConnect: ¡Eleva tu experiencia a nuevas alturas!</p>
          </div>
        )}
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          {loggedIn ? (
            // Usuario logueado
            <>
              <div className="card-body">
                <div className="form-control">
                  <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Sesión iniciada</h1>
                    <p className="py-6">Puedes ir a tu perfil o cerrar sesión</p>
                  </div>
                  <div className="form-control self-center">
                    <Link to="/profile">
                      <button className="btn btn-primary mt-10">Ir al perfil</button>
                    </Link>
                  </div>
                  <div className="divider">OR</div>
                  <div className="form-control">
                    <button className="btn btn-primary mb-10" onClick={handleLogout}>Cerrar sesión</button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Usuario no logueado
            <div className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input value={email} onChange={handleEmailChange} type="email" placeholder="email" className="input input-bordered w-full max-w-xs" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Contraseña</span>
                </label>
                <input value={password} onChange={handlePasswordChange} type="password" placeholder="password" className="input input-bordered w-full max-w-xs" />
                <label className="label">
                  <Link to='/forgotpassword'>
                    ¿Olvidaste tu contraseña?
                  </Link>
                </label>
              </div>
              {/* Botones de inicio de sesión y creación de cuenta */}
              <div className="form-control mt-6">
                <button onClick={handleLogin} className="btn btn-primary">
                  Iniciar sesión
                </button>
              </div>
              <div className="divider">OR</div>
              <div className="form-control">
                <button onClick={handleLoginWithGoogle} className="btn btn-primary">
                  Iniciar sesión con Google
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
