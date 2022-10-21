import { Container, Table, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const setInitialUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, user_emails(email)');
      
      if (error) console.log(error);

      if (data) {
        data.forEach(user => user.email = user.user_emails[0].email)
        setUsers(data);
      }
    };
    setInitialUsers();
  }, []);

  const usersToShow = users.filter(
    (user) =>
      user.email.includes(filter.toLowerCase()) ||
      user.username.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Container>
      <TextInput
        label="Hae käyttäjä"
        placeholder="Käyttäjänimi tai sähköposti"
        icon={<IconSearch size={14} />}
        my={'lg'}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      ></TextInput>
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {usersToShow.map((user) => {
            return (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}

export default UserManagement;
