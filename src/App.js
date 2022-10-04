import { AppShell, Button, Header, Modal, Navbar } from '@mantine/core';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import NewReportForm from './components/NewReportForm';
import { getMarkers } from './services/report.service';

function App() {
  const [appView, setAppView] = useState('own');

  const [formModalOpen, setFormModalOpen] = useState(false);

  const [map, setMap] = useState(null);

  const [locations, setLocations] = useState([]);
  const [centerLocations, setCenterLocations] = useState([]);

  console.log(locations);

  useEffect(() => {
    getMarkers().then((data) => {
      setLocations(data);
    });
  }, []);

  const MapView = () => {
    return (
      <MapContainer
        center={[64.07391245239761, 24.53362472782081]}
        zoom={20}
        scrollWheelZoom={false}
        // ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <span className="crosshair">+</span>

        {locations.map((location) => (
          <Marker key={location.id} position={[location.lat, location.long]}>
            <Popup>
              {location.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  };

  const FormView = () => {
    return (
      <>
        <Button size="md" onClick={() => setFormModalOpen(true)}>
          Uusi
        </Button>
        <Modal
          centered
          size="lg"
          opened={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          title="Lisää ilmoitus"
        >
          <NewReportForm />
        </Modal>
      </>
    );
  };

  const SideBar = () => {
    return (
      <Navbar width={{ base: 100 }} p="xs">
        <Button onClick={() => setAppView('own')}>Omat</Button>
        <Button onClick={() => setAppView('map')}>Kartta</Button>
        <Button
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
    );
  };
  return (
    <div>
      <AppShell
        padding="10"
        navbar={<SideBar />}
        header={
          <Header height={80} p="xs">
            <h1>Kaupunki</h1>
          </Header>
        }
      >
        {/* Appshell content */}
        {appView === 'own' && <FormView />}
        {appView === 'map' && <MapView />}
      </AppShell>
    </div>
  );
}

export default App;
