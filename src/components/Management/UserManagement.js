import {
  Button,
  Container,
  Group,
  Modal,
  Select,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserRole, setSelectedUserRole] = useState(null);

  const updateRole = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: selectedUserRole })
      .eq('id', selectedUser.id)
      .select()
      .single();

      if (error) console.log(error);

      if (data) {
        console.log(data);
        setUsers(users.map(user => user.id !== selectedUser.id ? user : {...user, role: data.role}))
        setSelectedUser(null);
      }


  }

  useEffect(() => {
    const setInitialUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, user_emails(email)');

      if (error) console.log(error);

      if (data) {
        data.forEach((user) => (user.email = user.user_emails[0].email));
        setUsers(data);
      }
    };
    setInitialUsers();
  }, []);

  const usersToShow = users.filter(
    (user) =>
      user.email.includes(filter.toLowerCase().trim()) ||
      user.username.toLowerCase().includes(filter.toLowerCase().trim())
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
              <tr
                onClick={() => {
                  setSelectedUser(user);
                  setSelectedUserRole(user.role);
                }}
                key={user.id}
              >
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Modal
        opened={selectedUser}
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
      >
        <Container>
          <Text>{selectedUser?.username}</Text>
          <Text>{selectedUser?.email}</Text>
          {/* <Text>{selectedUser?.role}</Text> */}
          <Select
            mt={'md'}
            label="Käyttäjän rooli"
            value={selectedUserRole}
            onChange={setSelectedUserRole}
            data={[
              { value: 'user', label: 'Käyttäjä' },
              { value: 'employee', label: 'Työntekijä' },
              { value: 'operator', label: 'Ohjaaja' },
            ]}
          />
        </Container>
        <Group mt={'xl'} position="apart">
          <Button onClick={() => setSelectedUser(null)}>Peruuta</Button>
          <Button onClick={() => updateRole()}>Tallenna</Button>
        </Group>
      </Modal>
    </Container>
  );
}

export default UserManagement;
