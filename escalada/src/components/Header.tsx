import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore, signOut } from '../firebase/FirebaseConfig';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const [user] = useAuthState(auth);

  // Obtener la URL de descarga de la foto de perfil del usuario
  useEffect(() => {
    const fetchDownloadURL = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const photoURL = userData?.photoURL;

          if (photoURL) {
            localStorage.setItem('profilePhotoURL', photoURL);
            setDownloadURL(photoURL);
          }
        }
      }
    };

    fetchDownloadURL();
  }, []);

  // Obtener la URL de descarga almacenada en el localStorage
  useEffect(() => {
    const storedDownloadURL = getStoredDownloadURL();
    if (storedDownloadURL && downloadURL !== storedDownloadURL) {
      setDownloadURL(storedDownloadURL);
    }
  }, [downloadURL]);

  // Obtener la URL de descarga almacenada en el localStorage
  const getStoredDownloadURL = (): string | null => {
    const storedDownloadURL = localStorage.getItem('profilePhotoURL');
    return storedDownloadURL ? storedDownloadURL : null;
  };

  // Manejar el cierre de sesión del usuario
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Restablecer el localStorage al cerrar sesión
        localStorage.removeItem('profilePhotoURL');
        console.log('User logged out successfully');
      })
      .catch((error) => {
        console.log('Error: Unable to log out', error);
      });
  };

  return (
    <div>
      <div className="navbar bg-base-100 fixed z-10">
        <div className="flex-none">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label htmlFor="my-drawer" className="btn btn-ghost drawer-button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
              <img src='./img/logo-app.png' className='mt-5 self-center h-40 w-40' />
              <p className='text-center mt-5'>ClimbConnect es una aplicación revolucionaria diseñada específicamente para los entusiastas de la escalada</p>
              <Link className="self-center" to="/createAcount">
                <button className='btn btn-outline mt-5'>Crear cuenta</button>
              </Link>
              <Link to="/loginpage" className='text-center mt-5'>
                Login
              </Link>
              {/*<li className='mt-5' ><a>Sidebar Item 1</a></li>
                  <li><a>Sidebar Item 2</a></li> */}
            </ul>
          </div>
        </div>
        <div className="flex-1">
          <img src="./img/logo-app.png" className='h-10 w-10' />
        </div>
        <div className="flex-none gap-2">
          <div className="form-control">
            <Link to="/explore" className="">
              <button className="btn btn-ghost btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </Link>
          </div>
          {user && (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  {downloadURL ? (
                    <img src={downloadURL} alt="Foto de perfil" className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="avatar placeholder">
                      <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                        <span className="text-3xl">{auth.currentUser?.displayName?.charAt(0)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </label>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li>
                  <Link to="/profile" className="justify-between">
                    Perfil
                    <span className="badge">New</span>
                  </Link>
                </li>
                <li>
                  <Link to={"/settings"}>
                    Ajustes
                  </Link>
                </li>
                <li><a onClick={handleLogout}>Logout</a></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header;
