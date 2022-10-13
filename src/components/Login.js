import {
  Button,
  Container,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Space,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../reducers/sessionReducer';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const session = useSelector((state) => state.sessions);

  if (session) navigate('/');

  return (
    <Container mt="lg" size={500}>
      <Title align="center" order={2}>
        Tervetuloa takaisin!
      </Title>
      <Link to="/signup">
        <Text color={'pink.5'} mr={'xs'} align="right">
          Luo käyttäjä
        </Text>
      </Link>
      <Paper shadow="sm" withBorder p={'xl'}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            dispatch(loginUser(email, password));
          }}
        >
          <TextInput required label="Sähköposti" name="email"></TextInput>
          <PasswordInput required mt={'sm'} label="Salasana" name="password" />
          <Link to="/signup">
            <Text color={'pink.5'} mt={'xs'} mr={'xs'} align="right">
              Salasana unohtunut?
            </Text>
          </Link>
          <Button fullWidth mt={'md'} type="submit">
            Kirjaudu
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Login;
