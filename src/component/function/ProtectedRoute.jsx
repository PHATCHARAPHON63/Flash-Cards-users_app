import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  return Element ? (
    <Element>
      <Outlet />
    </Element>
  ) : (
    <Outlet />
  );
};

export default ProtectedRoute;
