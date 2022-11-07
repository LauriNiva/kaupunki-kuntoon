import {
  Checkbox,
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
import { IconEdit, IconEye, IconEyeOff } from '@tabler/icons';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function OperatorAllReports() {
  const user = useSelector((state) => state.users);
  const reports = useSelector((state) => state.reports);
  const departments = useSelector((state) => state.departments);
  const reportStatus = {
    1: 'Luotu',
    2: 'Ohjattu',
    3: 'Työn alla',
    4: 'Valmis',
  };

  const [selectedSort, setSelectedSort] = useState('created_new');
  const [selectedReportStatus, setSelectedReportStatus] = useState([
    '1',
    '2',
    '3',
    '4',
  ]);

  console.log('----', selectedReportStatus);

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
    let reportsToReturn = [...reports?.all].filter((report) =>
      selectedReportStatus.includes(report.status.toString())
    );

    // TEHOKKAAMPAA TEHDÄ new Date raportteja hakiessa tai jopa palvelimella???
    if (selectedSort === 'created_new') {
      console.log('uusin');
      reportsToReturn.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (selectedSort === 'created_old') {
      console.log('vanhin');
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
      <Paper
        sx={{
          '&:hover': {
            backgroundColor: '#eee',
          },
        }}
        onClick={() => navigate(`/reports/${report.id}`)}
        withBorder
        shadow={'md'}
        mb={'md'}
        p={'md'}
      >
        <Grid gutter={'xs'}>
          <Grid.Col span={6}>
            <Tooltip label="Luotu" withArrow position="top-start">
              <Text>
                {new Date(report.created_at).toLocaleDateString('fi-Fi')}
              </Text>
            </Tooltip>
          </Grid.Col>
          <Grid.Col span={6}>
            <Tooltip label="Muokattu" withArrow position="top-end">
              <Text align="right">
                {new Date(report.updated_at).toLocaleDateString('fi-Fi')}
                <IconEdit />
              </Text>
            </Tooltip>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text>{departments[report.department]}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text align="right">{reportStatus[report.status]}</Text>
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
      <Paper  radius={'md'} shadow={'xl'} my={'xl'} p={'lg'}>
        <Grid gutter={'xl'}>
          <Grid.Col xs={6} sm={4}>
            <NativeSelect
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.currentTarget.value)}
              label="Järjestys"
              data={sorts}
            />
          </Grid.Col>
          <Grid.Col xs={6} sm={8}>
            <Checkbox.Group
              value={selectedReportStatus}
              onChange={setSelectedReportStatus}
              label="Tila"
            >
              <Checkbox value={'1'} label="Luotu" />
              <Checkbox value={'2'} label="Ohjattu" />
              <Checkbox value={'3'} label="Työn alla" />
              <Checkbox value={'4'} label="Valmis" />
            </Checkbox.Group>
          </Grid.Col>
        </Grid>
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
      <Container p={0}>
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
