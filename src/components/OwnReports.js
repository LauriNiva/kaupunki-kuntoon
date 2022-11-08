import {
  Checkbox,
  Container,
  Divider,
  Grid,
  Paper,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconEdit } from '@tabler/icons';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function OwnReports() {
  const reports = useSelector((state) => state.reports.own);
  const departments = useSelector((state) => state.departments);

  const navigate = useNavigate();

  const reportStatus = {
    1: 'Luotu',
    2: 'Ohjattu',
    3: 'Työn alla',
    4: 'Valmis',
  };

  const [selectedReportStatus, setSelectedReportStatus] = useState([
    '1',
    '2',
    '3',
    '4',
  ]);

  const reportsToShow = () => {
    let reportsToReturn = [...reports].filter((report) =>
      selectedReportStatus.includes(report.status.toString())
    );

    return reportsToReturn;
  };

  const SingleReport = ({ report }) => {
    return (
      <Paper
        sx={{
          '&:hover': {
            backgroundColor: '#00c8ff16',
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
      <Paper radius={'md'} shadow={'xl'} my={'xl'} p={'lg'}>
        <Grid gutter={'xl'}>
          <Grid.Col xs={6} sm={4}>
            {/* <NativeSelect
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.currentTarget.value)}
              label="Järjestys"
              data={sorts}
            /> */}
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

  return (
    <Container>
      <Title order={2} align="center" my={'xl'}>
        Omat Raportit
      </Title>
      <FilterHeader />
      {reportsToShow().map((report) => (
        <SingleReport key={report.id} report={report} />
      ))}
    </Container>
  );
}

export default OwnReports;
