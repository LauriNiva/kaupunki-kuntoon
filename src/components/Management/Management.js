import { Button, Container, Group, Title } from '@mantine/core'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'

function Management() {

  const user = useSelector((state) => state.users);

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.manager === false) navigate('/');
  }, [user, navigate]);

  return (
    <Container>
      <Title my={'lg'} order={2} align={'center'}>
        Hallinta
      </Title>
      <Group position='center' spacing={'xl'}>

      <Link to='/hallinta/kayttajat' > <Button>Käyttäjät</Button></Link>
      <Link to='/hallinta/osastot' > <Button>Osastot</Button></Link>
      </Group>
    </Container>
  )
}

export default Management