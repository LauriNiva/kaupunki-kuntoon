import {
  Button,
  Container,
  Group,
  Modal,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signUpNewUser } from '../services/auth.service';

function Signup() {
  const navigate = useNavigate();
  const session = useSelector((state) => state.sessions);

  const [showCheckEmailMessage, setShowCheckEmailMessage] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [passwordCheckError, setPasswordCheckError] = useState('');

  if (session) navigate('/');

  const clearErrors = () => {
    setPasswordError('');
    setPasswordCheckError('');
  };

  return (
    <Container mt="lg" size={500}>
      <Title align="center" mb={'xl'} order={2}>
        Luo käyttäjä
      </Title>
      <Paper shadow="sm" withBorder p={'xl'}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (e.target.password.value.length < 8) {
              setPasswordError('Salasanan oltava vähintään 8 merkkiä');
            } else if (
              e.target.password.value !== e.target.passwordcheck.value
            ) {
              setPasswordCheckError('Salasanat eivät täsmää');
            } else {
              const signUpConfirm = await signUpNewUser(
                e.target.email.value,
                e.target.password.value
              );
              setShowCheckEmailMessage(signUpConfirm);
            }
          }}
        >
          <TextInput label="Sähköposti" name="email" required />
          {/* TODO sähköposti validation */}

          <PasswordInput
            mt={'sm'}
            onChange={clearErrors}
            error={passwordError}
            label="Salasana"
            name="password"
            required
          />
          {/* TODO salasana vaatimukset */}
          <PasswordInput
            mt={'sm'}
            error={passwordCheckError}
            onChange={clearErrors}
            label="Salasana uudelleen"
            name="passwordcheck"
            required
          />
          <Group position="right">
            <Button mt={'md'} type="submit">
              Luo käyttäjä
            </Button>
          </Group>
        </form>
      </Paper>
      <Modal
        centered
        closeOnEscape={false}
        closeOnClickOutside={false}
        withCloseButton={false}
        opened={showCheckEmailMessage}
      >
        <Title align="center" order={2}>
          Käyttäjän luonti lähetetty
        </Title>
        <Text mb={'lg'} mt={'md'} align="center">Tarkista sähköpostisi</Text>
        <Link to='/'><Button fullWidth>Takaisin etusivulle</Button></Link>
      </Modal>
    </Container>
  );
}

export default Signup;
