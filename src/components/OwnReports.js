import {
  Container,
  Divider,
  Grid,
  Paper,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconEdit } from '@tabler/icons';
import React from 'react';
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

  const SingleReport = ({ report }) => {
    return (
      <Paper
      sx={{
        '&:hover': {
          backgroundColor: '#eee',
        }}}
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

  return (
    <Container>
      <Title order={2} align="center" my={'xl'}>
        Omat Raportit
      </Title>
      {reports.map((report) => (
        <SingleReport key={report.id} report={report} />
      ))}
    </Container>
  );
}

export default OwnReports;
