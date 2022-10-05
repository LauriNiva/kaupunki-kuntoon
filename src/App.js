import {
  AppShell,
  Button,
  Container,
  Group,
  Header,
  Modal,
  Navbar,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import Mapview from './components/Mapview';
import NewReportForm from './components/NewReportForm';

function App() {
  const [appView, setAppView] = useState('map');

  const [formModalOpen, setFormModalOpen] = useState(false);

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
      </Navbar>
    );
  };
  return (
    <div>
      <AppShell
        padding="0"
        header={
          <Header height={50} p="0">
            <Container
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '100%',
                backgroundColor: '#364FC7',
              }}
            >
              <Title color="teal.4" order={1}>
                Kaupunki kuntoon
              </Title>
              <Group>
                <Button color="teal.5" onClick={() => setAppView('own')}>
                  Omat
                </Button>
                <Button color="teal.5" onClick={() => setAppView('map')}>
                  Kartta
                </Button>
              </Group>
            </Container>
          </Header>
        }
      >
        {/* Appshell content */}
        {appView === 'own' && <FormView />}
        {appView === 'map' && <Mapview />}
      </AppShell>
    </div>
  );
}

export default App;
