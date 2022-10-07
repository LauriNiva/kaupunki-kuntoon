import {
  AppShell,
  Box,
  Button,
  Container,
  Group,
  Header,
  Modal,
  PasswordInput,
  TextInput,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import Mapview from './components/Mapview';
import NewReportForm from './components/NewReportForm';
import {
  signInWithEmailAndPassword,
  signInWithMagiclink,
  signOut,
  signUpNewUser,
} from './services/auth.service';
import { supabase } from './supabaseClient';

function App() {

  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const user = session?.user;
  console.log('---user---:', user);

  const [formModalOpen, setFormModalOpen] = useState(false);


  const getSession = async () => {
    const sessiondata = await supabase.auth.getSession();
    if (sessiondata) {
      console.log('---session---: ', sessiondata.data.session);
      setSession(sessiondata.data.session);
    }
  };

  useEffect(() => {
    getSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

  }, []);

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

    if(session) navigate('/')

    return (
      <Container>
        <form
          onSubmit={ async (e) => {
            e.preventDefault();

            console.log(e.target.email.value);
            if (!e.target.password.value) {
              await signInWithMagiclink(e.target.email.value);
            } else {
              await signInWithEmailAndPassword(
                e.target.email.value,
                e.target.password.value
              );
            }
          }}
        >
          <TextInput label="Sähköposti" name="email"></TextInput>
          <PasswordInput label="Salasana" name="password" />

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
            console.log(e.target.username.value);
            console.log(e.target.password.value);

            signUpNewUser(
              e.target.email.value,
              e.target.username.value,
              e.target.password.value
            );
          }}
        >
          <TextInput label="Sähköposti" name="email" />
          <TextInput label="Käyttäjänimi" name="username" />
          <PasswordInput label="Salasana" name="password" />
          <PasswordInput label="Salasana uudelleen" name="password-check" />

          <Button type="submit">Luo käyttäjä</Button>
        </form>
      </Container>
    );
  };

  const LoginButton = () => {

    const handleSignout = async () => {
      try {
        await signOut();
      } catch (error) {
        console.log(error)
      }
    }

    return !user ? (
      <Link to="/login">
        <Button>Login</Button>
      </Link>
    ) : (
      <Button onClick={handleSignout}>Logout</Button>
    );
  };
  const MainHeader = () => {
    return (
      <Header sx={{ backgroundColor: '#364FC7' }} height={50} p="0">
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Title color="teal.4" order={1}>
            Kaupunki kuntoon
          </Title>
          <Group>
            <Link to="/own">
              <Button color="teal.5">Omat</Button>
            </Link>
            <Link to="/new">
              <Button color="teal.5">Uusi</Button>
            </Link>
            <Link to="/">
              <Button color="teal.5">Kartta</Button>
            </Link>
            <LoginButton />
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
          <Route path="/new" element={<NewReportForm />} />
          <Route path="/" element={<Mapview />} />
        </Routes>
      </AppShell>
    </div>
  );
}

export default App;
