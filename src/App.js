import { AppShell, Button, Header, Modal, Navbar } from '@mantine/core';
import { useState } from 'react';
import Mapview from './components/Mapview';
import NewReportForm from './components/NewReportForm';

function App() {
  const [appView, setAppView] = useState('own');

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
        {appView === 'map' && <Mapview />}
      </AppShell>
    </div>
  );
}

export default App;
