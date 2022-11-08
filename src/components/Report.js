import {
  Badge,
  Button,
  Center,
  CloseButton,
  Container,
  Group,
  Image,
  Loader,
  Modal,
  Paper,
  Select,
  Stepper,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getSingleReport } from '../services/report.service';
import { supabase } from '../supabaseClient';

function Report() {
  const { id } = useParams();
  const user = useSelector((state) => state.users);
  const loggedinUserId = user?.id;

  console.log('user', user);

  const [imageFullscreen, setImageFullscreen] = useState(false);
  const [departmentModalOpen, setDepartmentModalOpen] = useState(false);
  const [readyModalOpen, setReadyModalOpen] = useState(false);

  const [report, setReport] = useState(null);
  // const [reportStep, setReportStep] = useState(3);
  const reportStep = report?.status;

  const departments = useSelector((state) => state.departments);

  const fetchReport = async () => {
    const fetchedReport = await getSingleReport(id);
    setReport(fetchedReport);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const isOwner = loggedinUserId === report?.user_id;
  console.log('---report:', report);

  const imageSrc = !report?.images
    ? 'https://yeopeoovpnhcjzmqilyz.supabase.co/storage/v1/object/public/kaupunki-images/default.webp'
    : `https://yeopeoovpnhcjzmqilyz.supabase.co/storage/v1/object/public/kaupunki-images/${report?.images}`;

  const updateReportDepartment = async (departmentid) => {
    const { data, error } = await supabase
      .from('reports')
      .update({ department: departmentid, public: true, status: 2 })
      .eq('id', report.id)
      .select();

    if (error) {
      console.log(error);
    }
    if (data) {
      fetchReport();
      setDepartmentModalOpen(false);
    }
  };

  const handleWorkClick = async () => {
    const { data, error } = await supabase
      .from('reports')
      .update({ status: 3 })
      .eq('id', report.id)
      .select();

    if (error) {
      console.log(error);
    }
    if (data) {
      fetchReport();
    }
  };

  const setReportReady = async (comment) => {
    const { data, error } = await supabase
      .from('reports')
      .update({ status: 4, comment })
      .eq('id', report.id)
      .select();

    if (error) {
      console.log(error);
    }
    if (data) {
      setReadyModalOpen(false);
      fetchReport();
    }
  };

  const ReadyModal = () => {
    let comment = '';
    return (
      <Modal
        opened={readyModalOpen}
        onClose={() => setReadyModalOpen(false)}
        centered
        closeOnClickOutside={false}
      >
        <Text align="center">Kirjoita kommentti ja merkitse valmiiksi.</Text>
        <Text align="center">Kommentti näkyy kaikille käyttäjille!</Text>
        <Textarea
          onChange={(e) => (comment = e.currentTarget.value)}
          minRows={4}
          my={'md'}
        />
        <Group position="apart">
          <Button color={'pink'}>Peruuta</Button>
          <Button onClick={() => setReportReady(comment)} color={'teal.5'}>
            Valmis
          </Button>
        </Group>
      </Modal>
    );
  };

  const DepartmentModal = () => {
    let selectedDepartment;

    return (
      <Modal
        opened={departmentModalOpen}
        onClose={() => setDepartmentModalOpen(false)}
        centered
      >
        <Container>
          <Text align="center">Ohjaa raportti oikealle osastolle.</Text>
          <Text align="center">
            Osaton valinta muuttaa raportin julkiseksi.
          </Text>
          <Select
            my={'lg'}
            onChange={(value) => (selectedDepartment = value)}
            data={Object.entries(departments)?.map((d) => ({
              value: d[0],
              label: d[1],
            }))}
          />
          <Group position="apart">
            <Button>Peruuta</Button>
            <Button onClick={() => updateReportDepartment(selectedDepartment)}>
              Tallenna
            </Button>
          </Group>
        </Container>
      </Modal>
    );
  };

  const StatusButton = () => {
    if (report.status === 2) {
      return (
        <Button
          onClick={() => handleWorkClick()}
          color={'orange'}
          my={'xl'}
          fullWidth
        >
          Ota työn alle
        </Button>
      );
    } else if (report.status === 3) {
      return (
        <Button
          onClick={() => setReadyModalOpen(true)}
          color={'orange'}
          my={'xl'}
          fullWidth
        >
          Merkitse valmiiksi
        </Button>
      );
    }
  };

  return (
    <Center>
      {!report ? (
        <Loader size={'lg'} />
      ) : (
        <Container mt={'lg'} mb={'xl'}>
          <Modal
            withCloseButton={false}
            padding={0}
            opened={imageFullscreen}
            onClose={() => setImageFullscreen(false)}
          >
            <CloseButton
              size="lg"
              variant="filled"
              className="popup-close-button"
              onClick={() => setImageFullscreen(false)}
            />
            <Image src={imageSrc} radius="sm" />
          </Modal>

          <Image
            onClick={() => setImageFullscreen(true)}
            height={250}
            src={imageSrc}
            withPlaceholder
          />

          <Paper p="md" shadow="sm" withBorder mt="lg">
            <Group position="center">
              {isOwner && <Badge>Oma</Badge>}
              {report?.public && <Badge>Julkinen</Badge>}
              {report?.status === 4 && <Badge>Valmis</Badge>}
            </Group>
            <Text align="center" my={'md'}>
              {report.description}
            </Text>
          </Paper>

          <Paper p="md" shadow="sm" withBorder mt="lg">
            <Text align="center">
              {report.department
                ? departments[report.department]
                : 'Raporttia ei ole vielä ohjattu eteenpäin.'}
            </Text>
            {user?.role === 'operator' && (
              <Button
                onClick={() => setDepartmentModalOpen(true)}
                fullWidth
                color="cyan.4"
                my={'md'}
              >
                {!report.department ? 'Ohjaa' : 'Vaihda osastoa'}
              </Button>
            )}
            <DepartmentModal />
          </Paper>

          <Paper p="md" shadow="sm" withBorder mt="lg">
            <Title mb={'lg'} align="center" order={3}>
              Tila
            </Title>
            <Stepper active={reportStep} breakpoint="xs">
              <Stepper.Step label="Luotu" description="Luotu"></Stepper.Step>
              <Stepper.Step label="Luettu" description="Luettu">
                <Text align="center">
                  Raportti luotu ja lähetetty. Odottaa lukemista.
                </Text>
              </Stepper.Step>
              <Stepper.Step label="Työn alla" description="Työn alla">
                <Text align="center">
                  Raportti luettu ja ohjattu eteenpäin siitä vastaavalle
                  osastolle.
                </Text>
              </Stepper.Step>
              <Stepper.Step label="Valmis" description="Valmis">
                <Text align="center">Raportti on otettu työn alle.</Text>
              </Stepper.Step>
              <Stepper.Completed>
                <Text align="center">{report.comment}</Text>
              </Stepper.Completed>
            </Stepper>
            {user?.departments.includes(report.department) && <StatusButton />}
            <ReadyModal />
          </Paper>
        </Container>
      )}
    </Center>
  );
}

export default Report;
