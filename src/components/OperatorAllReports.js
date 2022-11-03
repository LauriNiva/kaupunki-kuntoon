import {
  Container,
  Divider,
  Grid,
  NativeSelect,
  Paper,
  Table,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconEye, IconEyeOff } from '@tabler/icons';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function OperatorAllReports() {
  const user = useSelector((state) => state.users);
  const reports = useSelector((state) => state.reports);
  const departments = useSelector((state) => state.departments);

  const [selectedSort, setSelectedSort] = useState('created_new');

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role !== 'operator') navigate('/');
    }
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

  const reportsToShow = () => {
    let reportsToReturn = [...reports?.all];
      // TEHOKKAAMPAA TEHDÄ new Date raportteja hakiessa tai jopa palvelimella???
    if (selectedSort === 'created_new') {
      console.log('uusin')
      reportsToReturn.sort((a, b) => new Date(b.created_at) - new Date(a.created_at) )
    } else if (selectedSort === 'created_old') {
      console.log('vanhin')
      reportsToReturn.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    } else if (selectedSort === 'updated_new') {
      reportsToReturn.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );
    } else if (selectedSort === 'updated_old') {
       reportsToReturn.sort(
         (a, b) => new Date(a.updated_at) - new Date(b.updated_at)
       );
    }
    console.log(reportsToReturn);

    return reportsToReturn;
  };

  const SingleReport = ({ report }) => {
    return (
      <Paper withBorder shadow={'md'} mb={'md'} p={'md'}>
        <Grid gutter={'xs'}>
          <Grid.Col span={6}>
            <Text>
              {new Date(report.created_at).toLocaleDateString('fi-Fi')}
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text align="right">
              {new Date(report.updated_at).toLocaleDateString('fi-Fi')}
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text>{departments[report.department]}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text align="right">{report.status}</Text>
          </Grid.Col>
          <Grid.Col span={12}>
            <Divider />
            <Text>{report.description}</Text>
          </Grid.Col>
        </Grid>
      </Paper>
    );
  };

  const FilterHeader = () => {
    const sorts = [
      { value: 'created_new', label: 'Uusin' },
      { value: 'created_old', label: 'Vanhin' },
      { value: 'updated_new', label: 'Viimeksi muokattu' },
      { value: 'updated_old', label: 'Vanhin muokattu' },
    ];
    return (
      <Paper withBorder shadow={'md'} my={'md'} p={'md'}>
        <NativeSelect
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.currentTarget.value)}
          label="Järjestys"
          data={sorts}
        />
      </Paper>
    );
  };

  const newReports = () => {
    return reportsToShow().map((report) => (
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
        <td>{departments[report.department]}</td>
        <td>{report.public ? <IconEye /> : <IconEyeOff />}</td>
      </tr>
    ));
  };

  return (
    <Container>
      <Title align="center" order={2}>
        Kaikki raportit
      </Title>
      <FilterHeader />
      <Container>
        {reportsToShow().map((report) => (
          <SingleReport report={report} key={report.id} />
        ))}
      </Container>
      {/* <Table sx={{ tableLayout: 'fixed' }} mt={'md'} highlightOnHover>
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
        <tbody>{reports.all && newReports()}</tbody>
      </Table> */}
    </Container>
  );
}

export default OperatorAllReports;
