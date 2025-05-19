import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import { element } from 'prop-types';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const Register = Loadable(lazy(() => import('views/pages/authentication/authentication3/Registration')));

const AuthForgot = Loadable(lazy(() => import('views/pages/authentication/authentication3/forgot')));
const AuthForgotMessage = Loadable(lazy(() => import('views/pages/authentication/authentication3/forgotmessage')));
const AuthForgot_reset = Loadable(lazy(() => import('views/pages/authentication/authentication3/forgot_reset')));
const AuthForgot_expired = Loadable(lazy(() => import('views/pages/authentication/authentication3/forgot_expired')));
const Auth_verify_identity = Loadable(lazy(() => import('views/pages/authentication/authentication3/verify_identity')));

const Homepage = Loadable(lazy(() => import('views/pages/authentication/auth-forms/new_info/newinfo')));
// ==============================|| AUTHENTICATION ROUTING ||============================== //
//Auth_verify_identity
const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/',
      element: <Homepage />
    },
    {
      path: '/Login',
      element: <AuthLogin3 />
    },
    {
      path: 'verify_identity/:id',
      element: <Auth_verify_identity />
    },
    {
      path: '/register',
      element: <Register />
    },
    {
      path: '/forgot',
      element: <AuthForgot />
    },
    {
      path: '/forgot/message',
      element: <AuthForgotMessage />
    },
    {
      path: '/forgot/reset',
      element: <AuthForgot_reset />
    },
    {
      path: '/forgot/expired',
      element: <AuthForgot_expired />
    }
  ]
};

export default AuthenticationRoutes;
