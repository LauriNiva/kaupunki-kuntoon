import {
  Button,
  Container,
  Group,
  Header,
  Loader,
  Menu,
  Title,
  UnstyledButton,
  MediaQuery,
} from '@mantine/core';
import { IconLogout, IconMap2, IconUserCircle } from '@tabler/icons';
import Avatar from 'boring-avatars';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { signOut } from '../services/auth.service';

function MainHeader() {
  const session = useSelector((state) => state.sessions);
  const username = useSelector((state) => state.users);

  const loggedinUser = session?.user;

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
            {username ? <Avatar variant="ring" name={username} /> : <Loader />}
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>{username}</Menu.Label>
          <Link className="top-menu-link" to="/own">
            <Menu.Item icon={<IconUserCircle />}>Omat</Menu.Item>
          </Link>
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
        <Group>
          <MediaQuery smallerThan="xs" styles={{ fontSize: '1.2rem' }}>
            <Link to='/'>
            <Title color="teal.4" order={1}>
              Kaupunki kuntoon
            </Title>
            </Link>
          </MediaQuery>
        </Group>
        <Group>
          <Link to="/">
            <Button color="teal.5">
              <IconMap2 />
            </Button>
          </Link>
          {loggedinUser ? (
            <>
              {/* <Link to="/new">
                <Button color="teal.5"><IconCirclePlus /></Button>
              </Link> */}
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
}

export default MainHeader;
