import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';
import { useEffect } from 'react';

// project imports
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import Header from './Header';
import Sidebar from './Sidebar';
import Customization from '../Customization';
import menuItems from 'menu-items'; // เปลี่ยนจาก import navigation เป็น import menuItems
import { drawerWidth } from 'store/constant';
import { SET_MENU } from 'store/actions';
import AuthFooter from '../../ui-component/cards/AuthFooter';
import { useAuth } from '../../contexts/AuthContext'; // เพิ่ม import useAuth

// assets
import { IconChevronRight } from '@tabler/icons-react';

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'theme' })(({ theme, open }) => ({
  ...theme.typography.mainContent,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  transition: theme.transitions.create(
    'margin',
    open
      ? {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen
        }
      : {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }
  ),
  [theme.breakpoints.up('md')]: {
    marginLeft: open ? 0 : -(drawerWidth - 20),
    width: `calc(100% - ${drawerWidth}px)`
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: '20px',
    width: `calc(100% - ${drawerWidth}px)`,
    padding: '16px'
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: '10px',
    width: `calc(100% - ${drawerWidth}px)`,
    padding: '16px',
    marginRight: '10px'
  }
}));

const MainLayout = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  const dispatch = useDispatch();

  // ดึงข้อมูล user จาก AuthContext
  const { user } = useAuth();

  // กำหนดค่า role จากข้อมูล user หรือใช้ค่าเริ่มต้น 'guest'
  const role = user ? user.role : 'guest';

  // เรียกใช้ menuItems function และส่ง role เพื่อรับเมนูตาม role
  // const navigation = menuItems(role);
  const navigation = menuItems();
  useEffect(() => {
    if (isLargeScreen) {
      dispatch({ type: SET_MENU, opened: true });
    }
  }, [isLargeScreen, dispatch]);

  const handleLeftDrawerToggle = () => {
    if (!isLargeScreen) {
      dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
          transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
        }}
      >
        <Toolbar>
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>

      <Sidebar
        drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened}
        drawerToggle={handleLeftDrawerToggle}
        menuItems={navigation} // ส่งเมนูที่ได้จาก menuItems function ไปยัง Sidebar
      />

      <Main theme={theme} open={leftDrawerOpened}>
        <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
        <Outlet />
        <AuthFooter />
      </Main>
    </Box>
  );
};

export default MainLayout;
