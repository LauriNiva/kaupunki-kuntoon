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
  createStyles,
  Burger,
  Drawer,
  Stack,
} from '@mantine/core';
import { IconList, IconLogout, IconMap2, IconTableOptions, IconTools, IconUserCircle } from '@tabler/icons';
import Avatar from 'boring-avatars';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from '../services/auth.service';

const useStyles = createStyles((theme) => ({
  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },
  link: {
    textDecoration: 'none',
    fontWeight: 800,
    color: 'rgb(38, 225, 204)',
  },
  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },
  drawermenu: {
    backgroundColor: '#364FC7',
  },
}));

function MainHeader() {
  const { classes } = useStyles();
  const session = useSelector((state) => state.sessions);
  const user = useSelector((state) => state.users);
  const isEmployee = user?.role === 'employee';
  const isOperator = user?.role === 'operator';
  const username = user?.username;

  const navigate = useNavigate();

  const [burgerOpen, setBurgerOpen] = useState(false);

  const MenuButton = () => {
    const handleSignout = async () => {
      try {
        await signOut();
        navigate('/');
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <Menu className="top-menu">
        <Menu.Target>
          <UnstyledButton>
            {username ? (
              <Avatar variant="beam" name={username} />
            ) : (
              <Loader />
            )}
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>{username}</Menu.Label>
          <Link className="top-menu-link" to="/own">
            <Menu.Item icon={<IconList />}>Omat</Menu.Item>
          </Link>
          <Link className="top-menu-link" to="/userprofile">
            <Menu.Item icon={<IconUserCircle />}>Profiili</Menu.Item>
          </Link>
          {user?.manager === true && (
            <Link className="top-menu-link" to="/hallinta">
              <Menu.Item icon={<IconTableOptions />}>Hallinta</Menu.Item>
            </Link>
          )}
          <Menu.Item icon={<IconLogout />} onClick={handleSignout}>
            Kirjaudu Ulos
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  };

  const MenuDrawer = () => {
    return (
      <Drawer
        withinPortal={false}
        classNames={{ drawer: classes.drawermenu }}
        opened={burgerOpen}
        onClose={() => setBurgerOpen(false)}
        size={'xs'}
        position="right"
        transitionDuration={2000}
        transitionTimingFunction="ease"
      >
        <Stack p={'sm'}>
          <Link
            onClick={() => setBurgerOpen(false)}
            className={classes.link}
            to="/"
          >
            KARTTA
          </Link>
          {(isEmployee || isOperator) && (
            <Link
              onClick={() => setBurgerOpen(false)}
              className={classes.link}
              to="/work"
            >
              WORK
            </Link>
          )}
          {isOperator && (
            <Link
              onClick={() => setBurgerOpen(false)}
              className={classes.link}
              to="/operator"
            >
              OPERATOR
            </Link>
          )}
        </Stack>
      </Drawer>
    );
  };

  return (
    <Header sx={{ backgroundColor: '#364FC7' }} height={50} p="0">
      <MenuDrawer />

      <Container
        fluid
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Group>
          <Link to="/">
            <MediaQuery smallerThan="xs" styles={{ maxWidth: '40vw', fontSize: '1.2rem' }}>
              <Title color="teal.4" order={1}>
                Kaupunki kuntoon
              </Title>
            </MediaQuery>
          </Link>
        </Group>
        <Group>
          <Group className={classes.links}>
            {isOperator && (
              <Link className={classes.link} to="/operator">
                OPERATOR
                {/* <Button color="cyan.4">
                <IconTools />
              </Button> */}
              </Link>
            )}
            {(isEmployee || isOperator) && (
              <Link className={classes.link} to="/work">
                WORK
                {/* <Button color="orange.6">
                <IconTools />
              </Button> */}
              </Link>
            )}
            <Link className={classes.link} to="/">
              KARTTA
              {/* <Button color="teal.5">
              <IconMap2 />
            </Button> */}
            </Link>
          </Group>
          <Burger
            size={'md'}
            color="rgb(38, 225, 204)"
            opened={burgerOpen}
            className={classes.burger}
            onClick={() => setBurgerOpen(!burgerOpen)}
          />
          {session ? (
            <>
              {/* <Link to="/new">
                <Button color="teal.5"><IconCirclePlus /></Button>
              </Link> */}
              <MenuButton />
            </>
          ) : (
            <Link to="/login">
              <Button color={'pink'}>Login</Button>
            </Link>
          )}
        </Group>
      </Container>
    </Header>
  );
}

export default MainHeader;
