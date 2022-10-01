import { AppShell, Button, Header, Modal, Navbar } from '@mantine/core';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import NewReportForm from './components/NewReportForm';
import { getMarkers } from './services/report.service';

function App() {
  const [formModalOpen, setFormModalOpen] = useState(false);

  const [map, setMap] = useState(null);

  const [centerLocations, setCenterLocations] = useState([]);

  useEffect(() => {
    getMarkers().then((data) => {
      setCenterLocations(data.map((report) => [report.lat, report.long]));
    });
  }, []);

  return (
    <div>
      <AppShell
        padding="10"
        navbar={
          <Navbar width={{ base: 100 }} p="xs">
            <Button size="md" onClick={() => setFormModalOpen(true)}>
              Uusi
            </Button>
            <Button
              size="md"
              onClick={() => {
                const center = map.getCenter();

                setCenterLocations(
                  centerLocations.concat([[center.lat, center.lng]])
                );
              }}
            >
              Center
            </Button>
          </Navbar>
        }
        header={
          <Header height={80} p="xs">
            <h1>Kaupunki</h1>
          </Header>
        }
      >
        {/* Appshell content */}
        <MapContainer
          center={[64.07391245239761, 24.53362472782081]}
          zoom={20}
          scrollWheelZoom={false}
          ref={setMap}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <span className="crosshair">+</span>

          {centerLocations.map((location) => (
            <Marker key={location[0]} position={location}>
              <Popup>
                New marker at <br />
                {location[0]}
                <br />
                {location[1]}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </AppShell>
      <Modal
        opened={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title="Lisää ilmoitus"
      >
        <NewReportForm />
      </Modal>
    </div>
  );
}

export default App;
