import { Container, Table } from '@mantine/core';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function WorkMain() {
  const user = useSelector((state) => state.users);
  const reports = useSelector((state) => state.reports);
  console.log(reports);

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'user') navigate('/');
  }, [user, navigate]);

  const newReports = () => {
    return reports.map((report) => (
      <tr key={report.id}>
        <td>{report.created_at}</td>
        <td>{report.description}</td>
        <td>{report.status}</td>
        <td>{report.department}</td>
        <td>{report.public ? 'TRUE' : 'false'}</td>
      </tr>
    ));
  };

  return (
    <Container>
      <Table>
        <thead>
          <tr>
            <th>created_at</th>
            <th>description</th>
            <th>status</th>
            <th>department</th>
            <th>public</th>
          </tr>
        </thead>
        <tbody>{newReports()}</tbody>
      </Table>
    </Container>
  );
}

export default WorkMain;
