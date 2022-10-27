import {
  ActionIcon,
  Button,
  Container,
  Group,
  Modal,
  NativeSelect,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { IconSearch, IconTrashX } from '@tabler/icons';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);

  const fetchDepartments = async () => {
    const { data, error } = await supabase
      .from('departments')
      .select('*, users:profiles(id, username, user_emails(email))');

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

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    const setInitialEmployees = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, user_emails(email), departments(id)')
        .not('role', 'in', '(user)');

      if (error) console.log(error);

      if (data) {
        data.forEach((user) => {
          user.email = user.user_emails[0].email;
          user.departmentIds = [];
          user.departments.forEach((dep) => user.departmentIds.push(dep.id));
        });

        setEmployees(data);
      }
    };
    setInitialEmployees();
  }, []);

  const updateDepartment = async () => {
    console.log('updateDepartment', departments[selectedDepartment]);
    setSelectedDepartment(null);
  };

  const addUserToDepartment = async (userid) => {
    const { data, error } = await supabase
      .from('department_members')
      .insert({ department: departments[selectedDepartment].id, user: userid })
      .select();

    if (error) {
      console.log(error);
    }

    if (data) {
      console.log(data);
      setAddMemberModalOpen(false);
      fetchDepartments();
    }
  };

  const removeUserFromDepartment = async (user) => {
    if (
      window.confirm(
        `Poistetaanko käyttäjä ${user.username} - ${user.email} osastosta?`
      )
    ) {
      const { error, status } = await supabase
        .from('department_members')
        .delete()
        .eq('department', departments[selectedDepartment].id)
        .eq('user', user.id);

      if (error) {
        console.log(error);
      }

      if (status === 204) {
        fetchDepartments();
      }
    }
  };

  const SelectedDepartmentModal = () => {
    return (
      <Modal
        opened={selectedDepartment !== null}
        onClose={() => setSelectedDepartment(null)}
        withCloseButton={true}
        closeOnClickOutside={false}
        closeOnEscape={false}
        size={'xl'}
      >
        <Container>
          <Title mb={'xl'} order={2} align="center">
            {departments[selectedDepartment]?.name}
          </Title>
          <Button
            fullWidth
            mb={'md'}
            onClick={() => setAddMemberModalOpen(true)}
          >
            Lisää jäsen
          </Button>
          <Table>
            <thead>
              <tr>
                <th>Käyttäjänimi</th>
                <th>Sähköposti</th>
                <th>Poista</th>
              </tr>
            </thead>
            <tbody>
              {departments[selectedDepartment]?.users.map((user) => {
                return (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <ActionIcon
                        variant="filled"
                        color="red"
                        onClick={() => removeUserFromDepartment(user)}
                      >
                        <IconTrashX />
                      </ActionIcon>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Container>
        {/* <Group mt={'xl'} position="apart">
          <Button onClick={() => setSelectedDepartment(null)}>Peruuta</Button>
          <Button onClick={() => updateDepartment()}>Tallenna</Button>
        </Group> */}
      </Modal>
    );
  };

  const AddMemberModal = () => {
    let userToAdd;

    return (
      <Modal
        opened={addMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
        withCloseButton={true}
        closeOnClickOutside={false}
        closeOnEscape={false}
        size={'lg'}
      >
        <Text align="center">Lisää jäsen osastoon:</Text>
        <Text align="center">{departments[selectedDepartment]?.name}</Text>

        <NativeSelect
          my={'xl'}
          label="Hae käyttäjä"
          placeholder={'Käyttäjänimi - sähköposti'}
          icon={<IconSearch />}
          searchable
          onChange={(value) => (userToAdd = value)}
          data={employees.map((employee) => ({
            value: employee.id,
            label: `${employee.username} - ${employee.email}`,
            disabled: employee.departmentIds.includes(
              departments[selectedDepartment]?.id
            ),
          }))}
        />
        <Button onClick={() => addUserToDepartment(userToAdd)} fullWidth>
          Lisää
        </Button>
      </Modal>
    );
  };

  return (
    <Container>
      <Table verticalSpacing={'md'} highlightOnHover>
        <thead>
          <tr>
            <th>Osasto</th>
            <th>Työntekijöitä</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((department, index) => {
            return (
              <tr
                onClick={() => {
                  setSelectedDepartment(index);
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
      <SelectedDepartmentModal />
      <AddMemberModal />
    </Container>
  );
}

export default DepartmentManagement;
