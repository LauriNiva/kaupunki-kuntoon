import { Button, Container, PasswordInput, TextInput } from '@mantine/core';
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
}

export default Login;
