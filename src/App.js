import { AppShell, Center, Loader, Title } from '@mantine/core';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Mapview from './components/Mapview';
import NewReportForm from './components/NewReportForm';
import { setSession } from './reducers/sessionReducer';
import { supabase } from './supabaseClient';
import { setInitialReports } from './reducers/reportReducer';
import Userprofile from './components/Userprofile';
import { setUser } from './reducers/userReducer';
import Login from './components/Login';
import Signup from './components/Signup';
import MainHeader from './components/MainHeader';
import Report from './components/Report';
import WorkMain from './components/WorkMain';
import OperatorAllReports from './components/OperatorAllReports';
import Management from './components/Management/Management';
import UserManagement from './components/Management/UserManagement';
import DepartmentManagement from './components/Management/DepartmentManagement';
import { setInitialDepartments } from './reducers/departmentReducer';
import OwnReports from './components/OwnReports';

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const session = useSelector((state) => state.sessions);
  const user = useSelector((state) => state.users);
  const reportsLoaded = useSelector((state) => state.reports.public);

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
    dispatch(setInitialDepartments());
  }, [dispatch]);

  useEffect(() => {
    const checkUsername = async () => {
      const userid = session?.user.id;
      if (userid) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*, department_members(department)')
          .eq('id', userid)
          .single();
        if (error) console.log('error fetching the user', error);
        if (data) {
          if (data.department_members)
            data.departments = data.department_members.map(
              (dep) => dep.department
            );
          dispatch(setUser(data));
          if (!data.username) {
            navigate('/userprofile');
          }
        }
      } else {
        dispatch(setUser(null));
      }
    };

    checkUsername();
  }, [session, dispatch, navigate]);

  useEffect(() => {
    dispatch(setInitialReports(user));
  }, [user, dispatch]);

  return (
    <div>
      {reportsLoaded ? (
        <AppShell padding="0" header={<MainHeader />}>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/userprofile" element={<Userprofile />} />
            <Route path="/own" element={<OwnReports />} />
            <Route path="/new" element={<NewReportForm />} />
            <Route path="/reports/:id" element={<Report />} />
            <Route path="/work" element={<WorkMain />} />
            <Route path="/operator" element={<OperatorAllReports />} />

            <Route path="/hallinta" element={<Management />} />
            <Route path="/hallinta/kayttajat" element={<UserManagement />} />
            <Route
              path="/hallinta/osastot"
              element={<DepartmentManagement />}
            />
            <Route path="/" element={<Mapview />} />
          </Routes>
        </AppShell>
      ) : (
        <Center mt={'40vh'}>
          <Loader color="teal.5" size="xl" />
        </Center>
      )}
    </div>
  );
}

export default App;
