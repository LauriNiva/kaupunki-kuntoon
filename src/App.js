import {
  AppShell,
  Button,
  Container,
  Group,
  Header,
  Loader,
  Menu,
  PasswordInput,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import Mapview from './components/Mapview';
import NewReportForm from './components/NewReportForm';
import { signOut, signUpNewUser } from './services/auth.service';
import { loginUser, setSession } from './reducers/sessionReducer';
import { supabase } from './supabaseClient';
import { setInitialReports } from './reducers/reportReducer';
import { setInitialPublicReports } from './reducers/publicReportReducer';
import Userprofile from './components/Userprofile';
import { setUser } from './reducers/userReducer';
import Avatar from 'boring-avatars';
import { IconLogout, IconUserCircle } from '@tabler/icons';

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const username = useSelector((state) => state.users);
  const session = useSelector((state) => state.sessions);

  const loggedinUser = session?.user;

  useEffect(() => {
    const getSession = async () => {
      const sessiondata = await supabase.auth.getSession();
      if (sessiondata) {
        console.log('---session---: ', sessiondata.data.session);
        dispatch(setSession(sessiondata.data.session));
      }
    };
    getSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session));
    });
  }, [dispatch]);

  useEffect(() => {
    const checkUsername = async () => {
      try {
        const userid = session?.user.id;
        console.log('userid', userid);
        if (userid) {
          const { data, error, status } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', userid)
            .single();
          if (data) {
            console.log('data with username', data);
            dispatch(setUser(data.username));
          } else {
            navigate('/userprofile');
          }
        }
      } catch (error) {
        console.log('error while checking username', error);
      }
    };

    checkUsername();
  }, [session, dispatch, navigate]);

  useEffect(() => {
    dispatch(setInitialPublicReports());
    dispatch(setInitialReports(session?.user.id));
  }, [session, dispatch]);

  const OwnReports = () => {
    return (
      <>
        <Title order={2}>Omat raportit</Title>
      </>
    );
  };

  const Login = () => {
    if (session) navigate('/');

    return (
      <Container>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            dispatch(loginUser(email, password));
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
    if (session) navigate('/');

    return (
      <Container>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signUpNewUser(e.target.email.value, e.target.password.value);
          }}
        >
          <TextInput label="Sähköposti" name="email" />
          <PasswordInput label="Salasana" name="password" />
          {/* TODO salasana vaatimukset ja uudelleen tarkistus toimimaan */}
          <PasswordInput label="Salasana uudelleen" name="password-check" />

          <Button type="submit">Luo käyttäjä</Button>
        </form>
      </Container>
    );
  };

  const MenuButton = () => {
    const handleSignout = async () => {
      try {
        await signOut();
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <Menu className="top-menu">
        <Menu.Target>
          <UnstyledButton>
            {username ? <Avatar variant='ring' name={username}/>: <Loader />}
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>{username}</Menu.Label>
          <Link className="top-menu-link" to="/userprofile">
            <Menu.Item icon={<IconUserCircle />}>Profiili</Menu.Item>
          </Link>
          <Menu.Item icon={<IconLogout />} onClick={handleSignout}>
            Kirjaudu Ulos
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
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
            <Link to="/">
              <Button color="teal.5">Kartta</Button>
            </Link>
            {loggedinUser ? (
              <>
                <Link to="/new">
                  <Button color="teal.5">Uusi</Button>
                </Link>
                <Link to="/own">
                  <Button color="teal.5">Omat</Button>
                </Link>
                <MenuButton />
              </>
            ) : (
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            )}
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
          <Route path="/userprofile" element={<Userprofile />} />
          <Route path="/own" element={<OwnReports />} />
          <Route path="/new" element={<NewReportForm />} />
          <Route path="/" element={<Mapview />} />
        </Routes>
      </AppShell>
    </div>
  );
}

export default App;
