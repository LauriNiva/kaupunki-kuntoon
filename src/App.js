import {
  AppShell,
  Box,
  Button,
  Container,
  Group,
  Header,
  Modal,
  Navbar,
  PasswordInput,
  TextInput,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Mapview from './components/Mapview';
import NewReportForm from './components/NewReportForm';
import { signInWithEmail } from './services/auth.service';

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
          fullScreen
          centered
          size="xl"
          opened={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          title="Lisää ilmoitus"
        >
          <Box>
            <NewReportForm />
          </Box>
        </Modal>
      </>
    );
  };

  const Login = () => {
    return (
      <Container>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            console.log(e.target.email.value);
            signInWithEmail(e.target.email.value);
          }}
        >
          <TextInput label="Sähköposti" name="email"></TextInput>

          <Button type="submit">Kirjaudu</Button>
        </form>
        <Link to="/signup">
          <Button mt={'lg'}>Luo käyttäjä</Button>
        </Link>
      </Container>
    );
  };

  const Signup = () => {
    return (
      <Container>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            console.log(e.target.email.value);
            signInWithEmail(e.target.email.value);
          }}
        >
          <TextInput label="Sähköposti" name="email" />
          <TextInput label="Käyttäjänimi" name="username" />
          <PasswordInput label="Salasana" name="password" />

          <Button type="submit">Kirjaudu</Button>
        </form>
      </Container>
    );
  };

  const MainHeader = () => {
    return (
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
            <Link to="/own">
              <Button color="teal.5">Omat</Button>
            </Link>
            <Link to="/">
              <Button color="teal.5">Kartta</Button>
            </Link>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          </Group>
        </Container>
      </Header>
    );
  };
  return (
    <div>
      <AppShell padding="0" header={<MainHeader />}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/own" element={<FormView />} />
          <Route path="/" element={<Mapview />} />
        </Routes>
      </AppShell>
    </div>
  );
}

export default App;
