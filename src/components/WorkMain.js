import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function WorkMain() {
  const user = useSelector((state) => state.users);

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'user') navigate('/');
  },[user, navigate])


  return <div>WorkMain</div>;
}

export default WorkMain;
