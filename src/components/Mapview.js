import {
  Button,
  Checkbox,
  Container,
  Group,
  Image,
  Tooltip,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useSelector } from 'react-redux';
import L from 'leaflet';
import 'leaflet-easybutton';
import { Link } from 'react-router-dom';
import { IconCirclePlus, IconFocus2 } from '@tabler/icons';

function Mapview() {
  const [map, setMap] = useState(null);

  const session = useSelector((state) => state.sessions);
  const user = session?.user;

  const reports = useSelector((state) => state.reports);
  const publicReports = useSelector((state) => state.publicReports);
  const publicReportsToShow = publicReports.filter(
    (report) => report.user_id !== user.id
  );

  const [showOwnReports, setShowOwnReports] = useState(true);
  const [showPublicReports, setShowPublicReports] = useState(true);

  const ownMarkerColor = '#7950F2'; // violet.6
  const publicMarkerColor = '#D6336C'; // pink.7

  const reportsToShow = () => {
    let reportsToReturn = [];
    if (showOwnReports) reportsToReturn = reportsToReturn.concat(reports);
    if (showPublicReports)
      reportsToReturn = reportsToReturn.concat(publicReportsToShow);

    return reportsToReturn;
  };

  useEffect(() => {
    if (!map) return;

    L.easyButton(
      `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-focus-2" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <circle cx="12" cy="12" r=".5" fill="currentColor"></circle>
   <circle cx="12" cy="12" r="7"></circle>
   <line x1="12" y1="3" x2="12" y2="5"></line>
   <line x1="3" y1="12" x2="5" y2="12"></line>
   <line x1="12" y1="19" x2="12" y2="21"></line>
   <line x1="19" y1="12" x2="21" y2="12"></line>
</svg>`,
      function (btn, map) {
        map.locate().on('locationfound', function (e) {
          map.flyTo(e.latlng, map.getZoom());
        });
      }
    ).addTo(map);
  }, [map]);

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

  const ReportPopup = ({report}) => {
    return (
      <Container>
        {report.description}
        {!report.images ? (
          <Image
            src={
              'https://yeopeoovpnhcjzmqilyz.supabase.co/storage/v1/object/public/kaupunki-images/default.jpg'
            }
          />
        ) : (
          <Image
            src={`https://yeopeoovpnhcjzmqilyz.supabase.co/storage/v1/object/public/kaupunki-images/${report.images}`}
          />
        )}
      </Container>
    );
  }

  const generateMarkers = () => {
    return reportsToShow().map((report) => {
      const icon =
        report.user_id === user?.id
          ? generateCustomMarker(ownMarkerColor)
          : generateCustomMarker(publicMarkerColor);
      return (
        <Marker
          icon={icon}
          key={report.id}
          position={[report.lat, report.long]}
          eventHandlers={{
            click: (e) => {
              const bounds = map.getBounds();
              const mapheight = bounds._northEast.lat - bounds._southWest.lat;
              map.setView([e.latlng.lat + (mapheight / 3), e.latlng.lng]);
            },
          }}
        >
          <Popup autoPan={false} className="report-popup">
            <ReportPopup report={report} />
          </Popup>
        </Marker>
      );
    });
  };

  const FiltersPanel = () => {
    return (
      <Group position={'right'}>
        <Container className="map-filter-panel" p={'md'}>
          <Checkbox
            checked={showOwnReports}
            onChange={() => setShowOwnReports(!showOwnReports)}
            color={'violet.6'}
            label="Omat"
            mb={'xs'}
          />
          <Checkbox
            checked={showPublicReports}
            onChange={() => setShowPublicReports(!showPublicReports)}
            color={'pink.7'}
            label="Julkiset"
          />
        </Container>
      </Group>
    );
  };

  const BottomButtons = () => {
    return (
      <Group position="right" className="map-bottom-buttons">
        <Tooltip label="Paikanna">
          <Button
            onClick={() => {
              map.locate().on('locationfound', function (e) {
                map.flyTo(e.latlng, map.getZoom());
              });
            }}
          >
            <IconFocus2 />
          </Button>
        </Tooltip>
        <Link to="/new">
          <Tooltip label="Lisää uusi raportti">
            <Button color="teal.5">
              <IconCirclePlus />
            </Button>
          </Tooltip>
        </Link>
      </Group>
    );
  };

  return (
    <>
      <FiltersPanel />
      <BottomButtons />
      <MapContainer
        center={[64.07391245239761, 24.53362472782081]}
        zoom={20}
        scrollWheelZoom={false}
        className="mapview-map"
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* <span className="crosshair">+</span> */}
        {generateMarkers()}
      </MapContainer>
    </>
  );
}

export default Mapview;
