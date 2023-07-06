import React, { useState } from 'react';
import { resetPassword } from '../firebase/FirebaseConfig';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Manejar el cambio en el campo de correo electrónico
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  // Manejar el envío del formulario
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    resetPassword(email)
      .then(() => {
        setMessage(
          'Se ha enviado un correo electrónico para restablecer tu contraseña.'
        );
      })
      .catch((error) => {
        setMessage(`Error al enviar el correo electrónico: ${error.message}`);
      });
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Restablecer contraseña</h1>
        </div>
        <form className="form-control" onSubmit={handleSubmit}>
          <label className="label">
            Correo electrónico:
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </label>
          <button className="btn btn-primary mt-5" type="submit">
            Restablecer contraseña
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
