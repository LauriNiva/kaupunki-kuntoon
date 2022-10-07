import { useForm } from '@mantine/form';
import {
  Button,
  Container,
  FileInput,
  Group,
  Image,
  Modal,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { IconPhoto } from '@tabler/icons';
import { addReport, uploadImage } from '../services/report.service';

function NewReportForm() {
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [chosenLocation, setChosenLocation] = useState(null);
  const [formMap, setFormMap] = useState();
  const [smallFormMap, setSmallFormMap] = useState();
  const [imagePreview, setImagePreview] = useState(null);

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
    <Container>
      <form
        onSubmit={form.onSubmit(async (values) => {
          const uploadedImage = await uploadImage(imagePreview);
          if (uploadedImage) {
            const newReport = {
              lat: chosenLocation[0],
              long: chosenLocation[1],
              description: values.kuvaus,
              images: uploadedImage,
            };
            addReport(newReport);
          }
        })}
      >
        <Textarea
          required
          label="Kuvaus"
          placeholder="Kuvaa ongelma yms"
          minRows={3}
          maxRows={6}
          {...form.getInputProps('kuvaus')}
        />
        <Group mt={'sm'} noWrap align={'start'}>
          <FileInput
            {...form.getInputProps('kuva')}
            onChange={setImagePreview}
            value={imagePreview}
            accept="image/png,image/jpeg"
            label="Kuva"
            placeholder="Lisää kuva"
            icon={<IconPhoto size={26} />}
          />
          {imagePreview && (
            <Image height={'30vh'} m={'md'} src={URL.createObjectURL(imagePreview)} />
          )}
        </Group>

        <Group mt={'sm'}>
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
        </Group>
        <Group mt={'md'} position="right">
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
    </Container>
  );
}

export default NewReportForm;
