import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signOut } from '../firebase/FirebaseConfig';

const SettingsPage = () => {
  const navigate = useNavigate();

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/home');
        alert('Has cerrado sesión correctamente');
        console.log('User logged out successfully');
      })
      .catch((error) => {
        console.log('Error: Unable to log out', error);
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 mt-10">Configuración de la App</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Preferencias de escalada</h2>
        <div>
          <span className="text-gray-700">Tipos de escalada preferidos:</span>
          <label className="block mt-1">
            <input type="checkbox" className="mr-2" />
            Clásica
          </label>
          <label className="block mt-1">
            <input type="checkbox" className="mr-2" />
            Deportiva
          </label>
          <label className="block mt-1">
            <input type="checkbox" className="mr-2" />
            Boulder
          </label>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Notificaciones</h2>
        <label className="block">
          <input type="checkbox" className="mr-2" />
          Recibir notificaciones
        </label>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Privacidad</h2>
        <label className="block">
          <input type="checkbox" className="mr-2" />
          Mostrar mi perfil a otros usuarios
        </label>
        <label className="block">
          <input type="checkbox" className="mr-2" />
          Permitir que otros usuarios me envíen mensajes
        </label>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Idioma</h2>
        <label className="block">
          <span className="text-gray-700">Idioma preferido:</span>
          <select className="form-select mt-1">
            <option>Catalán</option>
            <option>Español</option>
            <option>Inglés</option>
          </select>
        </label>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Ayuda y soporte</h2>
        <a href="#" className="text-blue-500">
          Centro de ayuda
        </a>
        <a href="#" className="text-blue-500 ml-4">
          Enviar comentarios
        </a>
      </div>

      <div className="mb-10">
        <button
          onClick={handleLogout}
          className="btn btn-primary text-white px-4 py-2 mt-4 mb-10 rounded"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
