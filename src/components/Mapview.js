import { Image } from '@mantine/core';
import React, { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useSelector } from 'react-redux';
import * as L from 'leaflet';

function Mapview() {
  const [map, setMap] = useState(null);

  const session = useSelector((state) => state.sessions);
  const user = session?.user;

  const reports = useSelector((state) => state.reports);
  const publicReports = useSelector((state) => state.publicReports);

  const reportsToShow = () => {
    if (user) {
      return reports.concat(
        publicReports.filter((report) => report.user_id !== user.id)
      );
    } else {
      return publicReports;
    }
  };

  const generateCustomMarker = (myCustomColour) => {
    const markerHtmlStyles = `
  background-color: ${myCustomColour};
  width: 2rem;
  height: 2rem;
  display: block;
  left: -1rem;
  top: -1rem;
  position: relative;
  border-radius: 2rem 2rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF`;

    return L.divIcon({
      className: 'my-custom-pin',
      iconAnchor: [0, 24],
      labelAnchor: [-6, 0],
      popupAnchor: [0, -36],
      html: `<span style="${markerHtmlStyles}" />`,
    });
  };

  const generateMarkers = () => {
    return reportsToShow().map((location) => {
      const icon =
        location.user_id === user?.id
          ? generateCustomMarker('#FFF')
          : generateCustomMarker('#583470');
      return (
        <Marker
          icon={icon}
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
                src={`https://yeopeoovpnhcjzmqilyz.supabase.co/storage/v1/object/public/kaupunki-images/${location.images}`}
              />
            )}
          </Popup>
        </Marker>
      );
    });
  };

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
      {generateMarkers()}
    </MapContainer>
  );
}

export default Mapview;
