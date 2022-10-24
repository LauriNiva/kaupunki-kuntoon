import { ActionIcon, Button, Container, Group, Modal, Table, Text } from '@mantine/core';
import { IconTrashX } from '@tabler/icons';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  console.log(departments);

  useEffect(() => {
    const setInitialUsers = async () => {
      const { data, error } = await supabase
        .from('departments')
        .select(
          '*, users:profiles(id, username, user_emails(email))'
        );

      if (error) console.log(error);

      if (data) {
        data.forEach((department) =>
          department.users.forEach(
            (user) => (user.email = user.user_emails[0].email)
          )
        );
        setDepartments(data);
      }
    };
    setInitialUsers();
  }, []);

  const updateDepartment = async () => {
    console.log('updateDepartment', selectedDepartment);
    setSelectedDepartment(null);
  };

  return (
    <Container>
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Osasto</th>
            <th>Työntekijöitä</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((department) => {
            return (
              <tr
                onClick={() => {
                  setSelectedDepartment(department);
                }}
                key={department.id}
              >
                <td>{department.name}</td>
                <td>{department.users.length}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Modal
        opened={selectedDepartment}
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
        size={'xl'}
      >
        <Container>
          <Text>{selectedDepartment?.name}</Text>
          {/* <Text>{selectedUser?.role}</Text> */}
          {/* <Select
            mt={'md'}
            label="Käyttäjän rooli"
            value={selectedUserRole}
            onChange={setSelectedUserRole}
            data={[
              { value: 'user', label: 'Käyttäjä' },
              { value: 'employee', label: 'Työntekijä' },
              { value: 'operator', label: 'Ohjaaja' },
            ]}
          /> */}
          <Table>
            <thead>
              <tr>
                <th>Käyttäjänimi</th>
                <th>Sähköposti</th>
                <th>Poista</th>
              </tr>
            </thead>
            <tbody>
              {selectedDepartment?.users.map((user) => {
                return (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <ActionIcon variant='filled' color="red" onClick={() => console.log(user)}>
                        <IconTrashX />
                      </ActionIcon>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Container>
        <Group mt={'xl'} position="apart">
          <Button onClick={() => setSelectedDepartment(null)}>Peruuta</Button>
          <Button onClick={() => updateDepartment()}>Tallenna</Button>
        </Group>
      </Modal>
    </Container>
  );
}

export default DepartmentManagement;
