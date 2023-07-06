import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc, } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, } from 'firebase/storage';
import { auth, firestore, signOut } from '../firebase/FirebaseConfig';

interface Zone {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  details: string[];
  degrees: string[];
  climbingType: string;
}

const ProfilePage = () => {
  const [user] = useAuthState(auth);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const [savedZones, setSavedZones] = useState<Zone[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener la URL de descarga de la foto de perfil del usuario
    const fetchDownloadURL = async () => {
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const photoURL = userData?.photoURL;

          if (photoURL) {
            setDownloadURL(photoURL);
          }
        }
      }
    };

    fetchDownloadURL();
  }, [user]);

  useEffect(() => {
    // Obtener las zonas guardadas del usuario
    const fetchSavedZones = async () => {
      if (user) {
        const userZonesRef = collection(firestore, 'users', user.uid, 'zones');
        const querySnapshot = await getDocs(userZonesRef);
        const savedZonesData = querySnapshot.docs.map((doc) => doc.data() as Zone);
        setSavedZones(savedZonesData);
      }
    };

    fetchSavedZones();
  }, [user]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `profilePictures/${user?.uid}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Manejar los eventos de progreso de carga aquí si es necesario
          },
          (error) => {
            alert ('Error al subir la foto de perfil');
            console.log('Error al subir la foto de perfil', error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Guardar la URL de descarga en el documento del usuario
            const userDocRef = doc(firestore, 'users', user?.uid || '');
            await setDoc(userDocRef, { photoURL: downloadURL }, { merge: true });
            alert ('Foto de perfil subida correctamente');
            console.log('Foto de perfil subida correctamente');
          }
        );
      } catch (error) {
        console.log('Error al subir la foto de perfil', error);
      }
    }
  };

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

  const handleDeleteZone = async (zone: Zone) => {
    if (user) {
      try {
        const userZonesRef = collection(firestore, 'users', user.uid, 'zones');
        const zoneDocRef = doc(userZonesRef, zone.id);
        await deleteDoc(zoneDocRef);
        alert ('Zona eliminada correctamente');
        console.log('Zona eliminada correctamente');
        // Actualizar la lista de zonas guardadas
        setSavedZones(savedZones.filter((savedZone) => savedZone.id !== zone.id));
      } catch (error) {
        alert ('Error al eliminar la zona');
        console.log('Error al eliminar la zona', error);
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4 mt-10 text-center">Perfil de Usuario</h1>
        {user && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="avatar mt-3 mb-3">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 mb-5">
                {downloadURL && (
                  <img
                    src={downloadURL}
                    alt="Foto de perfil"
                    className="w-24 h-24 rounded-full mb-4"
                  />
                )}
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-2 text-center">
              Hola, {user.displayName || user.email}
            </h3>
            <input
              type="file"
              onChange={handleFileUpload}
              className="form-input mt-1 mb-10"
            />

            <h2 className="text-xl font-semibold mb-4 mt-10 text-center">Zonas Guardadas</h2>
            <ul className="space-y-4">
              {savedZones.map((zone) => (
                <li key={zone.id} className="border rounded-md p-4 flex items-center justify-between">
                  <h3>{zone.title}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDeleteZone(zone)}
                      className="btn btn-secondary text-white px-4 py-2 rounded"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="text-center mt-10">
              <button
                onClick={handleLogout}
                className="btn btn-primary text-white px-4 py-2 mt-4 mb-10 rounded"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
