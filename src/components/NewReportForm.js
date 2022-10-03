import { useForm } from '@mantine/form';
import { Button, FileInput, Group, Modal, Textarea, TextInput } from '@mantine/core';
import { useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

function NewReportForm() {
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [chosenLocation, setChosenLocation] = useState(null);
  const [formMap, setFormMap] = useState();
  const [smallFormMap, setSmallFormMap] = useState();

  const form = useForm({
    initialValues: {
      kuvaus: '',
      kuva: null,
    },
  });

  const updateLocation = () => {
    const centerLocation = formMap.getCenter();
    setChosenLocation([centerLocation.lat, centerLocation.lng]);
    setMapModalOpen(false);
    smallFormMap.setView([centerLocation.lat, centerLocation.lng]);
  };

  return (
    <div>
      <form
        onSubmit={form.onSubmit((values) =>
          console.log({ ...values, chosenLocation })
        )}
      >
        <Textarea
          label="Kuvaus"
          placeholder="Kuvaa ongelma yms"
          minRows={3}
          maxRows={6}
          {...form.getInputProps('kuvaus')}
        />
        <FileInput
          label="Kuva"
          placeholder="Lisää kuva"
          {...form.getInputProps('kuva')}
        />

        <div>
          <MapContainer
            center={[64.07391245239761, 24.53362472782081]}
            zoom={20}
            scrollWheelZoom={false}
            className="form-map-small"
            ref={setSmallFormMap}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {chosenLocation && <Marker position={chosenLocation}></Marker>}
            <Button
              className="minimap-button"
              onClick={() => setMapModalOpen(true)}
            >
              {!chosenLocation ? 'Lisää sijainti' : 'Muuta sijaintia'}
            </Button>
          </MapContainer>
        </div>
        <Group position="right">
          <Button type="submit">Lisää</Button>
        </Group>
      </form>
      <Modal
        centered
        size="xl"
        opened={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        title="Lisää sijainti"
      >
        <MapContainer
          center={[64.07391245239761, 24.53362472782081]}
          zoom={20}
          scrollWheelZoom={false}
          className="form-map"
          ref={setFormMap}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <span className="crosshair">+</span>
        </MapContainer>
        <Group position="right">
          <Button onClick={updateLocation}>Lisää</Button>
        </Group>
      </Modal>
    </div>
  );
}

export default NewReportForm;
