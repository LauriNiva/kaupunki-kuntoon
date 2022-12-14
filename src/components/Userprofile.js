import {
  Button,
  Center,
  Container,
  Divider,
  Group,
  List,
  Loader,
  Modal,
  Paper,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import Avatar from 'boring-avatars';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../reducers/userReducer';
import { supabase } from '../supabaseClient';

function Userprofile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users);
  const username = user?.username;
  // const [avatar, setAvatar] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (username) setIsLoading(false);
  }, [username]);

  const [usernameInput, setUsernameInput] = useState('');
  const [usernameInputError, setUsernameInputError] = useState(null);
  const session = useSelector((state) => state.sessions);
  const email = session?.user.email;

  const sendPasswordReset = async () => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if(error) console.log(error)
    if(data){
      showNotification({
        title: 'Sähköposti lähetetty!',
        message: `Salasanan vaihtolinkki lähetetty.`,
        autoClose: 5000,
      });
    }
  }

  const AddUsername = () => {
    const handleUsernameSubmit = async () => {
      const regexCheck = '^[a-zA-ZöÖäÄåÅÅ0-9]*$';
      if (!usernameInput.match(regexCheck)) {
        setUsernameInputError('Vain kirjaimia ja numeroita');
        return;
      }
      if (usernameInput.length > 15 || usernameInput.length < 3) {
        setUsernameInputError('Oltava 3-15 merkkiä pitkä');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({ username: usernameInput })
        .eq('id', user.id)
        .select();

      if (error) {
        console.log('error creating a profile', error);
        if (error.code === '23505') {
          setUsernameInputError('Käyttäjänimi on jo käytössä');
        }
      }

      if (data) {
        console.log(data);
        dispatch(setUser(data[0]));
        setIsLoading(false);
        showNotification({
          title: 'Käyttäjänimi luotu!',
          message: `Hei, ${data[0]?.username}!`,
          autoClose: 5000,
        });
      }
    };

    return (
      <Modal
        opened={!username}
        centered
        overlayOpacity={0.85}
        closeOnEscape={false}
        closeOnClickOutside={false}
        withCloseButton={false}
        title="Valitse käyttäjänimi"
      >
        <List withPadding mb={'lg'}>
          <List.Item>3-15 merkkiä pitkä</List.Item>
          <List.Item>Vain kirjaimia ja numeroita</List.Item>
          {/* <List.Item>Vaihdettavissa korkeintaan kuukauden välein</List.Item> */}
        </List>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUsernameSubmit();
          }}
        >
          <TextInput
            label="Käyttäjänimi"
            error={usernameInputError}
            value={usernameInput}
            onChange={(e) => {
              setUsernameInput(e.target.value);
              setUsernameInputError(null);
            }}
            pl={'md'}
            pr={'md'}
          />
          <Group mt={'lg'} position="right">
            <Button type="submit">OK</Button>
          </Group>
        </form>
      </Modal>
    );
  };

  return (
    <Container mt="lg" size={500}>
      <Title align="center" order={2}>
        Käyttäjätiedot
      </Title>
      <AddUsername />
      <Paper shadow="sm" withBorder p={'xl'}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Center>
              <Avatar variant="beam" size={160} name={username} />
            </Center>
            <Text mt={'xl'} align="center">{username}</Text>
            <Text mt={'xl'} align="center">{email}</Text>
            <Divider my={'xl'} />
            <Group position='center'>

            <Button color={'pink'} onClick={() => sendPasswordReset()}>Lähetä salasanan vaihtolinkki</Button>
            </Group>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default Userprofile;
