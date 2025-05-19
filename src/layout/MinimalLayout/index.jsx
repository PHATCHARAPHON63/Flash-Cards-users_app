import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const MinimalLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // path ที่ไม่ต้องตรวจ token
    const excludedPaths = [
      /^\/$/, // Homepage
      /^\/Login$/, // Login
      /^\/verify_identity\/[^/]+$/, // verify_identity/:id
      /^\/register$/, // register
      /^\/forgot$/, // forgot
      /^\/forgot\/message$/, // forgot/message
      /^\/forgot\/reset$/, // forgot/reset
      /^\/forgot\/expired$/, // forgot/expired
      /^\/News$/, // News
      /^\/News\/[^/]+$/ // News/:id
    ];

    const isExcluded = excludedPaths.some((pattern) => pattern.test(location.pathname));

    if (isExcluded) {
      // ถ้า path นี้ไม่ต้องตรวจ token ก็ข้ามได้เลย
      return;
    }

    const verifyUserToken = () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/Login', { replace: true });
        return;
      }

      try {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          console.error('Invalid token format');
          localStorage.removeItem('token');
          navigate('/Login', { replace: true });
          return;
        }

        const payload = JSON.parse(atob(tokenParts[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        if (payload.exp && payload.exp > currentTime) {
          return;
        } else {
          console.log('Token expired');
          localStorage.removeItem('token');
          navigate('/Login', { replace: true });
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        localStorage.removeItem('token');
        navigate('/Login', { replace: true });
      }
    };

    verifyUserToken();
  }, [navigate, location]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default MinimalLayout;
