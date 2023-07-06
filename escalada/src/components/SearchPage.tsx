import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

interface Zone {
  id: string;
  title: string;
  location: string;
  description: string;
  imageUrl: string;
  details: string;
  degrees: string;
  climbingType: string;
}

const SearchPage: React.FC = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [allZones, setAllZones] = useState<Zone[]>([]);

  useEffect(() => {
    // Obtener las zonas destacadas y populares de Firestore
    const fetchZones = async () => {
      const db = getFirestore();
      
      // Obtener las zonas destacadas
      const zonesDestacadasSnapshot = collection(db, 'zonasDestacadas');
      const zonesDestacadas = await getDocs(zonesDestacadasSnapshot);
      const destacadas = zonesDestacadas.docs.map((doc) => doc.data() as Zone);

      // Obtener las zonas populares
      const zonasPopularesSnapshot = collection(db, 'zonasPopulares');
      const zonasPopulares = await getDocs(zonasPopularesSnapshot);
      const populares = zonasPopulares.docs.map((doc) => doc.data() as Zone);

      // Combinar las zonas destacadas y populares
      const allZones = [...destacadas, ...populares];
      setZones(allZones);
      setAllZones(allZones); // Guardar una copia de todas las zonas sin filtrar
    };

    fetchZones();
  }, []);

  const handleSearch = () => {
    // Filtrar las zonas por el término de búsqueda
    const searchResults = zones.filter((zone) =>
      zone.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setZones(searchResults);
  };

  const handleFilter = () => {
    // Filtrar las zonas por tipo y ubicación
    const filteredZones = zones.filter((zone) => {
      const typeMatch =
        filterType === '' || filterType.toLowerCase() === zone.climbingType.toLowerCase();
      const locationMatch =
        filterLocation === '' || filterLocation.toLowerCase() === zone.location.toLowerCase();
      return typeMatch && locationMatch;
    });
    setZones(filteredZones);
  };

  const handleReset = () => {
    // Restablecer los filtros y mostrar todas las zonas sin filtrar
    setSearchQuery('');
    setFilterType('');
    setFilterLocation('');
    setZones(allZones);
  };

  return (
    <div className="hero min-h-screen bg-base-200 text-center mb-20">
      <div className="flex-col lg:flex-row-reverse mt-10 mb-10">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl font-bold mt-10 mb-5">Buscar zona de escalada</h1>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="mb-5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre"
              className="border border-gray-300 px-4 py-2 rounded-md mr-2"
            />
            <button onClick={handleSearch} className="btn btn-sm btn-primary text-white px-4 py-2 rounded-md mt-5">
              Buscar
            </button>
          </div>
          <div className="items-center mb-4">
            <div className="flex items-center">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-md mr-1 ml-3"
              >
                <option value="">Tipos de escalada</option>
                <option value="Deportiva">Deportiva</option>
                <option value="Clásica">Clásica</option>
                <option value="Boulder">Boulder</option>
                {/* Agregar más opciones para tipos */}
              </select>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-md"
              >
                <option value="">Ubicaciones</option>
                <option value="Tarragona">Tarragona</option>
                <option value="Barcelona">Barcelona</option>
                <option value="Lleida">Lleida</option>
                <option value="Girona">Girona</option>
              </select>
            </div>
            <div className="button-container mt-5">
              <button onClick={handleFilter} className="btn btn-sm btn-primary text-white px-4 py-2 rounded-md mr-2">
                Filtrar
              </button>
              <button onClick={handleReset} className="btn btn-sm btn-primary text-white px-4 py-2 rounded-md mr-2">
                Limpiar
              </button>
            </div>
          </div>
          <div className="zone-list">
            {zones.map((zone) => (
              <div className="bg-white rounded-lg shadow-md p-4 mb-4" key={zone.id}>
                <h3 className="text-lg font-semibold mb-2">{zone.title}</h3>
                <div className="">
                  <p className=" mb-2">{zone.description}</p>
                  <p className="text-gray-600 mb-2">{zone.climbingType}</p>
                  <img className="w-full h-40 object-cover mb-2 rounded" src={zone.imageUrl} alt={zone.title} />
                  <Link to={`/zone/${zone.id}`}>
                    <button className="btn btn-sm btn-primary text-white px-4 py-2 rounded">Ver Detalles</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
