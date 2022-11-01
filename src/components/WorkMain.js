import { Container, Table, Text, Tooltip } from '@mantine/core';
import { IconEye, IconEyeOff } from '@tabler/icons';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function WorkMain() {
  const user = useSelector((state) => state.users);
  const reports = useSelector((state) => state.reports);
  const departments = useSelector((state) => state.departments);
  console.log(reports);

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'user') navigate('/');
  }, [user, navigate]);

  const newReports = () => {
    return reports.department.map((report) => (
      <tr onClick={() => navigate(`/reports/${report.id}`)} key={report.id}>
        <td>
          <Tooltip label={new Date(report.created_at).toLocaleTimeString()}>
            <Text>
              {new Date(report.created_at).toLocaleDateString('fi-Fi')}
            </Text>
          </Tooltip>
          {/* options jos halutaan kellonaika {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'} */}
        </td>
        <td className="table-description-cell">
          <Container m={0} p={0} size="20vw">
            {report.description}
          </Container>
        </td>
        <td>{report.status}</td>
        <td>{departments[report.department]}</td>
        <td>{report.public ? <IconEye /> : <IconEyeOff />}</td>
      </tr>
    ));
  };

  return (
    <Container>
      <Table sx={{}} mt={'md'} highlightOnHover>
        <thead>
          <tr>
            <th>Luotu</th>
            <th>Raportti</th>
            <th>Tila</th>
            <th>Osasto</th>
            <th>public</th>
          </tr>
        </thead>
        <tbody>{newReports()}</tbody>
      </Table>
    </Container>
  );
}

export default WorkMain;
