import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, createUserWithEmailAndPassword, signInWithGoogle, signOut } from '../firebase/FirebaseConfig';
import { Link } from 'react-router-dom';
import { User } from '../types/types';

interface CreateAcountProps {
  onRegister: (user: User) => void;
}

// Declaración de constantes globales
const CreateAcount: React.FC<CreateAcountProps> = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Verificar si el usuario ha iniciado sesión al cargar la página
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoggedIn(!!user); 
    });

    return () => unsubscribe();
  }, []);

  // Actualizar el estado del nombre de usuario
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value); 
  };

  // Actualizar el estado de la contraseña
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value); 
  };

  // Función de creación de cuenta tradicional
  const handleCreateAccount = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, username, password);
      const user = {
        id: userCredential.user?.uid || '',
        name: userCredential.user?.displayName || '',
        profileImage: userCredential.user?.photoURL || '',
      };
      onRegister(user);
      setLoggedIn(true); 
      navigate('/profile'); 
      alert('Tu cuenta ha sido creada correctamente');
      console.log('Cuenta creada correctamente');
    } catch (error) {
      console.log('No se ha podido crear la cuenta', error);
    }
  };

  //Función de creación de cuenta con google
  const handleRegisterWithGoogle = async () => {
    try {
      const userCredential = await signInWithGoogle();
      const user = {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName || '',
        profileImage: userCredential.user.photoURL || '',
      };
      onRegister(user);
      setLoggedIn(true);
      navigate('/profile');
      alert('Tu cuenta con Google ha sido creada correctamente');
      console.log('Cuenta con Google creada correctamente');
    } catch (error) {
      console.log('Error al crear la cuenta con Google:', error);
    }
  };

  // Función de cierre de sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLoggedIn(false);
      setUsername('');
      setPassword('');
      navigate('/home');
      alert('Has cerrado sesión correctamente');
      console.log('Cuenta cerrada correctamente');
    } catch (error) {
      console.log('Error al cerrar la cuenta', error);
    }
  };

  // Función de renderizado para el contenido cuando el usuario está logueado
  const renderLoggedInContent = () => (
    <div className="card-body">
      <div className="form-control">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Ya tienes una cuenta</h1>
          <p className="py-6">Puedes ir a tu perfil o cerrar sesión para crear una nueva cuenta</p>
        </div>
        <div className="form-control self-center">
          <Link to="/profile">
            <button className="btn btn-primary mt-10">Ir al perfil</button>
          </Link>
        </div>
        <div className="divider">O</div>
        <div className="form-control">
          <button className="btn btn-primary mb-10" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </div>
    </div>
  );

  // Función de renderizado para el contenido cuando el usuario no está logueado
  const renderLoggedOutContent = () => (
    <div className="card-body">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input value={username} onChange={handleUsernameChange} type="text" placeholder="Email" className="input input-bordered w-full max-w-xs" />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Contraseña</span>
        </label>
        <input value={password} onChange={handlePasswordChange} type="password" placeholder="Contraseña" className="input input-bordered w-full max-w-xs" />
      </div>
      <div className="form-control mt-6">
        <button onClick={handleCreateAccount} className="btn btn-primary">Registrarse con Email</button>
      </div>
      <div className="divider">O</div>
      <div className="form-control">
        <button onClick={handleRegisterWithGoogle} className="btn btn-primary">Registrarse con Google</button>
      </div>
    </div>
  );

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        {!loggedIn && (
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Crea una cuenta</h1>
            <p className="py-6">Conéctate con la pasión de la escalada en ClimbConnect: ¡Eleva tu experiencia a nuevas alturas!</p>
          </div>
        )}
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          {loggedIn ? renderLoggedInContent() : renderLoggedOutContent()}
        </div>
      </div>
    </div>
  );
};

export default CreateAcount;

