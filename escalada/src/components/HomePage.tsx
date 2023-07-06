import React from 'react';
import ZoneCards from './ZoneCards';
import ZoneGallery from './ZoneGallery';

const HomePage: React.FC = () => {
  return (
      <div className="flex hero bg-base-200">
        <div className="hero-content text-center mt-10">
          <div className="mx-auto">
            <h1 className="text-2xl md:text-center font-bold mt-10 mb-10">Zonas destacadas</h1>
            <ZoneCards />
            <div className="mx-auto">
              <h1 className="text-2xl md:text-center font-bold mt-10 mb-10">Zonas populares</h1>
              <ZoneGallery />
            </div>
          </div>
        </div>
      </div>
  )
}

export default HomePage