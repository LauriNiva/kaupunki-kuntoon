import { Image } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { getMarkers } from '../services/report.service';

function Mapview() {
  const [map, setMap] = useState(null);

  const [locations, setLocations] = useState([]);
  const [centerLocations, setCenterLocations] = useState([]);

  console.log(locations);

  useEffect(() => {
    getMarkers().then((data) => {
      setLocations(data);
    });
  }, []);

  return (
    <MapContainer
      center={[64.07391245239761, 24.53362472782081]}
      zoom={20}
      scrollWheelZoom={false}
      className="mapview-map"
      ref={setMap}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <span className="crosshair">+</span>

      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.long]}
          eventHandlers={{
            click: (e) => {
              map.setView([e.latlng.lat, e.latlng.lng]);
            },
          }}
        >
          <Popup autoPan={false} className="report-popup">
            {location.description}
            {!location.images ? (
              <Image
                src={
                  'https://yeopeoovpnhcjzmqilyz.supabase.co/storage/v1/object/public/kaupunki-images/default.jpg'
                }
              />
            ) : (
              <Image
                src={
                  `https://yeopeoovpnhcjzmqilyz.supabase.co/storage/v1/object/public/kaupunki-images/${location.images}`
                }
              />
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Mapview;
