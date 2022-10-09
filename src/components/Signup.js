import { Button, Container, PasswordInput, TextInput } from '@mantine/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signUpNewUser } from '../services/auth.service';

function Signup() {
  const navigate = useNavigate();
  const session = useSelector((state) => state.sessions);

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
}

export default Signup;
