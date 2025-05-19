import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery, CircularProgress } from '@mui/material';

// project imports
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import Header from './Header';
import Sidebar from './Sidebar';
import Customization from '../MainLayout/Customization/index';
import navigation from 'menu-items';
import { drawerWidth } from 'store/constant';
import { SET_MENU } from 'store/actions';
import AuthFooter from '../MainLayout/AuthFooter';

// assets
import { IconChevronRight } from '@tabler/icons-react';

import UTIF from 'utif';
import { color } from 'framer-motion';
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'theme' })(({ theme, open }) => ({
  ...theme.typography.mainContent,
  flexGrow: 1,
  padding: theme.spacing(2),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  backgroundColor: 'rgba(255, 255, 255, 0.0)',
  borderRadius: theme.shape.borderRadius,
  minHeight: 'auto',
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

// ==============================|| MAIN LAYOUT ||============================== //
const MainLayout = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  const dispatch = useDispatch();
  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
  };
  const [backgroundImage, setBackgroundImage] = useState('');
  const [isloading, setIsloading] = useState(true);
  useEffect(() => {
    fetch('/MainKV(3).png')
      .then((response) => response.blob()) 
      .then((blob) => {
        const imageUrl = URL.createObjectURL(blob); 
        setBackgroundImage(imageUrl); 
        setIsloading(false);
      })
      .catch((error) => {
        console.error('Error loading image:', error);
        setIsloading(false);
      });
  }, []);

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CssBaseline />
        <AppBar
          enableColorOnDark
          position="fixed"
          color="inherit"
          elevation={0}
          sx={{
            transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
          }}
        >
          <Toolbar>
            <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default MainLayout;
