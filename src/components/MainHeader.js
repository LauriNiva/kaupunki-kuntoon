import { Button, Container, Group, Header, Loader, Menu, Title, UnstyledButton } from '@mantine/core';
import { IconLogout, IconUserCircle } from '@tabler/icons';
import Avatar from 'boring-avatars';
import React from 'react'
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
}

export default MainHeader