import {
  Badge,
  Center,
  CloseButton,
  Container,
  Image,
  Loader,
  Modal,
  Paper,
  Stepper,
  Text,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getSingleReport } from '../services/report.service';

function Report() {
  const { id } = useParams();
  const loggedinUserId = useSelector((state) => state.sessions?.user.id);

  const [imageFullscreen, setImageFullscreen] = useState(false);

  const [report, setReport] = useState(null);
  const [reportStep, setReportStep] = useState(1);

  useEffect(() => {
    const fetchReport = async () => {
      const fetchedReport = await getSingleReport(id);
      setReport(fetchedReport);
    };
    fetchReport();
  }, [id]);

  const isOwner = loggedinUserId === report?.user_id;
  console.log(report);

  const imageSrc = !report?.images
    ? 'https://yeopeoovpnhcjzmqilyz.supabase.co/storage/v1/object/public/kaupunki-images/default.jpg'
    : `https://yeopeoovpnhcjzmqilyz.supabase.co/storage/v1/object/public/kaupunki-images/${report?.images}`;

  return (
    <Center>
      {!report ? (
        <Loader size={'lg'} />
      ) : (
        <Container>
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
          />

          <Paper p="md" shadow="sm" withBorder mt="lg">
            {isOwner && <Badge>Oma</Badge>}
            <Text> {report.description}</Text>
          </Paper>
          <Paper p="md" shadow="sm" withBorder mt="lg">
            <Stepper active={reportStep} breakpoint="xs">
              <Stepper.Step label="Luettu" description="Luettu">
                Raportti luotu ja lähetetty. Odottaa lukemista.
              </Stepper.Step>
              <Stepper.Step label="Työn alla" description="Työn alla">
                Ohjattu oikealle osastolle/henkilölle.
              </Stepper.Step>
              <Stepper.Step label="Valmis" description="Valmis">
                Valmis
              </Stepper.Step>
              <Stepper.Completed>Valmis.</Stepper.Completed>
            </Stepper>
          </Paper>
        </Container>
      )}
    </Center>
  );
}

export default Report;
