import { Center, Container, Image, Loader, Paper, Stepper, Text } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSingleReport } from '../services/report.service';

function Report() {
  const { id } = useParams();

  const [report, setReport] = useState(null);

  const [raportStep, setRaportStep] = useState(1);

  useEffect(() => {
    const fetchReport = async () => {
      const fetchedReport = await getSingleReport(id);
      setReport(fetchedReport);
    };
    fetchReport();
  }, [id]);

  console.log(report);


  return (
    <Center>
      {!report ? (
        <Loader size={'lg'} />
      ) : (
        <Container>
          {!report.images ? (
            <Image
              src={
                'https://yeopeoovpnhcjzmqilyz.supabase.co/storage/v1/object/public/kaupunki-images/default.jpg'
              }
            />
          ) : (
            <Image
              height={250}
              src={`https://yeopeoovpnhcjzmqilyz.supabase.co/storage/v1/object/public/kaupunki-images/${report.images}`}
            />
          )}
          <Text mt='lg'> {report.description}</Text>
          <Paper p='md' shadow='sm' withBorder mt='lg'>

          <Stepper active={raportStep} breakpoint="xs">
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
