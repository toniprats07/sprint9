import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, setDoc, getFirestore } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../firebase/FirebaseConfig';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface Zone {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  details: string[];
  degrees: string[];
  climbingType: string;
}

const ZoneCards: React.FC = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener las zonas destacadas desde Firestore
    const fetchZones = async () => {
      const db = getFirestore();
      const zonesCollection = collection(db, 'zonasDestacadas');
      const zonesSnapshot = await getDocs(zonesCollection);
      const zonesData = zonesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Zone[];
      setZones(zonesData);
    };

    fetchZones();
  }, []);

  const handleModalOpen = (zone: Zone) => {
    setSelectedZone(zone);
  };

  const handleModalClose = () => {
    setSelectedZone(null);
  };

  const handleSaveZone = async (zone: Zone) => {
    const user = auth.currentUser;

    if (user) {
      try {
        const userZonesRef = collection(firestore, 'users', user.uid, 'zones');
        const zoneSnapshot = await getDoc(doc(userZonesRef, zone.id));

        if (zoneSnapshot.exists()) {
          // La zona ya está guardada
          alert ('Ya tienes esta zona guardada, ve a tu perfil y gestiona las zonas guardadas');
          console.log('La zona ya está guardada');
        } else {
          await setDoc(doc(userZonesRef, zone.id), zone);
          alert ('Zona guardada correctamente');
          console.log('Zona guardada correctamente');
        }
      } catch (error) {
        alert ('Error al guardar la zona');
        console.log('Error al guardar la zona', error);
      }
    }
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-72 mb-20'>
      {zones.map((zone) => (
        <div className="card h-auto bg-base-100 shadow sm:max-w-lg md:w-64 lg:max-w-xl" key={zone.id}>
          <figure><img className='h-52 sm:h-72 w-full object-cover' src={zone.imageUrl} alt={zone.title} /></figure>

          <div className="flex justify-between items-center ml-2">
            <button onClick={() => handleSaveZone(zone)}>
              <label className="swap swap-rotate mt-1">
                <input type="checkbox" />
                <img
                  className="swap-on fill-current w-8 h-8"
                  width="30"
                  height="30"
                  src="https://img.icons8.com/fluency-systems-filled/30/like.png"
                  alt="like"
                />
                <img
                  className="swap-off fill-current w-8 h-8"
                  width="30"
                  height="30"
                  src="https://img.icons8.com/fluency-systems-regular/30/like--v1.png"
                  alt="like--v1"
                />
              </label>
            </button>
          </div>

          <div className="card-body items-center">
            <h2 className="card-title">
              {zone.title}
              <div className="badge badge-secondary">{zone.climbingType}</div>
            </h2>
            <p>{zone.description}</p>
            <button onClick={() => handleModalOpen(zone)} className="btn">
              + info
            </button>
          </div>
        </div>
      ))}

      {/* Modal */}
      {selectedZone && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="space-y-5 mt-5">
              <div className="flex flex-col md:flex-row">
                <div className="flex w-28 md:w-2/3 min-h-[60px]">
                  {/* Mostrar los grados de la zona */}
                  {selectedZone.degrees.map((degree, index) => (
                    <span
                      key={index}
                      className={`rounded text-center px-1.5 mx-1 bg-orange-200 text-black`}
                    >
                      {degree}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <ul className="py-4 mt-5">
              {/* Mostrar los detalles de la zona */}
              {selectedZone.details.map((detail, index) => (
                <li className='mb-3' key={index}>
                  {detail}
                  <button className="btn btn-xs ml-2">
                    + info
                  </button>
                </li>
              ))}
            </ul>

            <div className="modal-action">
              <button onClick={handleModalClose} className="btn">
                X
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoneCards;
