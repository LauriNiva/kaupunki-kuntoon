import { Container, Table, Text, Title, Tooltip } from '@mantine/core';
import { IconEye, IconEyeOff } from '@tabler/icons';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function OperatorAllReports() {
  const user = useSelector((state) => state.users);
  const reports = useSelector((state) => state.reports);
  console.log(reports);

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'user') navigate('/');
  }, [user, navigate]);

  const publicFilterStates = {
    1: <IconEye opacity={0.2} />,
    2: <IconEye />,
    3: <IconEyeOff />,
  };
  const [publicFilter, setPublicFilter] = useState(1);

  const togglePublicFilter = () => {
    if (publicFilter < 3) {
      setPublicFilter(publicFilter + 1);
    } else {
      setPublicFilter(1);
    }
  };

  const reportsToShow = reports.filter((report) => {
    if (publicFilter === 1) {
      return true;
    } else if (publicFilter === 2) {
      return report.public === true;
    } else {
      return report.public === false;
    }
  });

  const newReports = () => {
    return reportsToShow.map((report) => (
      <tr onClick={() => navigate(`/reports/${report.id}`)} key={report.id}>
        <td>
          <Tooltip label={new Date(report.created_at).toLocaleTimeString()}>
            <Text>
              {new Date(report.created_at).toLocaleDateString('fi-Fi')}
            </Text>
          </Tooltip>
          {/* options jos halutaan kellonaika {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'} */}
        </td>
        <td className="table-description-cell">{report.description}</td>
        <td>{report.status}</td>
        <td>{report.department}</td>
        <td>{report.public ? <IconEye /> : <IconEyeOff />}</td>
      </tr>
    ));
  };

  return (
    <Container>
      <Title align="center" order={2}>
        Kaikki raportit
      </Title>
      <Table sx={{ tableLayout: 'fixed' }} mt={'md'} highlightOnHover>
        <thead>
          <tr>
            <th style={{ width: '4rem' }}>Luotu</th>
            <th style={{ width: '100%' }}>Raportti</th>
            <th style={{ width: '3.5rem' }}>status</th>
            <th style={{ width: '5rem' }}>department</th>
            <th
              style={{ width: '1.5rem' }}
              onClick={() => togglePublicFilter()}
            >
              {publicFilterStates[publicFilter]}
            </th>
          </tr>
        </thead>
        <tbody>{newReports()}</tbody>
      </Table>
    </Container>
  );
}

export default OperatorAllReports;
