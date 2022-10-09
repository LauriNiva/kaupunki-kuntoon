import {
  AppShell,
  Title,
} from '@mantine/core';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Mapview from './components/Mapview';
import NewReportForm from './components/NewReportForm';
import { setSession } from './reducers/sessionReducer';
import { supabase } from './supabaseClient';
import { setInitialReports } from './reducers/reportReducer';
import { setInitialPublicReports } from './reducers/publicReportReducer';
import Userprofile from './components/Userprofile';
import { setUser } from './reducers/userReducer';
import Login from './components/Login';
import Signup from './components/Signup';
import MainHeader from './components/MainHeader';

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const session = useSelector((state) => state.sessions);


  useEffect(() => {
    const getSession = async () => {
      const sessiondata = await supabase.auth.getSession();
      if (sessiondata) {
        dispatch(setSession(sessiondata.data.session));
      }
    };
    getSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session));
    });
  }, [dispatch]);

  useEffect(() => {
    const checkUsername = async () => {
      try {
        const userid = session?.user.id;
        console.log('userid', userid);
        if (userid) {
          const { data, error, status } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', userid)
            .single();
          if (data) {
            console.log('data with username', data);
            dispatch(setUser(data.username));
          } else {
            navigate('/userprofile');
          }
        }
      } catch (error) {
        console.log('error while checking username', error);
      }
    };

    checkUsername();
  }, [session, dispatch, navigate]);

  useEffect(() => {
    dispatch(setInitialPublicReports());
    dispatch(setInitialReports(session?.user.id));
  }, [session, dispatch]);

  const OwnReports = () => {
    return (
      <>
        <Title order={2}>Omat raportit</Title>
      </>
    );
  };

  return (
    <div>
      <AppShell padding="0" header={<MainHeader />}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/userprofile" element={<Userprofile />} />
          <Route path="/own" element={<OwnReports />} />
          <Route path="/new" element={<NewReportForm />} />
          <Route path="/" element={<Mapview />} />
        </Routes>
      </AppShell>
    </div>
  );
}

export default App;
