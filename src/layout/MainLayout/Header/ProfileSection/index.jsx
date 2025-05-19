import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Typography
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';

// assets
import { IconLogout, IconSettings } from '@tabler/icons-react';
import { logout } from 'component/function/auth';

// ==============================|| PROFILE MENU ||============================== //
const ProfileSection = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const navigate = useNavigate();
  const location = useLocation(); // เพิ่ม useLocation เพื่อติดตามการเปลี่ยนแปลง path

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const anchorRef = useRef(null);

  // ใช้ค่าจากสภาพแวดล้อมหรือค่าเริ่มต้น
  const IMAGE_BASE_URL = import.meta.env.VITE_APP_API_URL_IMG?.replace(/\/$/, '');

  // ฟังก์ชันสำหรับโหลดข้อมูลผู้ใช้
  const loadUserData = () => {
    // ดึงชื่อจาก localStorage
    const firstName = localStorage.getItem('name');
    const email = localStorage.getItem('email') || '';

    // ดึง path รูปภาพจาก localStorage
    const profileImage = localStorage.getItem('img') || '';

    // สร้าง URL สำหรับรูปภาพ
    if (profileImage) {
      setImageUrl(`${IMAGE_BASE_URL}/public/profiles/${profileImage}`);
    } else {
      setImageUrl('/default-avatar.jpg');
    }

    // อัปเดต state ด้วยข้อมูลที่ดึงมา
    setFormData({
      name: firstName,
      email: email,
      profile_image: profileImage
    });
  };

  // โหลดข้อมูลเมื่อคอมโพเนนต์ถูกโหลดครั้งแรก
  useEffect(() => {
    loadUserData();
  }, [IMAGE_BASE_URL]);

  // โหลดข้อมูลใหม่เมื่อ path เปลี่ยน
  useEffect(() => {
    loadUserData();
  }, [location.pathname]);

  // ฟังก์ชันจัดการกรณีที่โหลดรูปภาพไม่สำเร็จ
  const handleImageError = () => {
    setImageUrl('/default-avatar.jpg'); // ใส่ path ของรูป fallback ที่คุณต้องการ
  };

  // ฟังก์ชันสำหรับออกจากระบบ
  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // ฟังก์ชันจัดการการปิด Popper
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  // ฟังก์ชันจัดการการคลิกรายการใน List
  const handleListItemClick = (event, index, route = '') => {
    setSelectedIndex(index);
    handleClose(event);

    if (route && route !== '') {
      navigate(route);
    }
  };

  // ฟังก์ชันเปิด/ปิด Popper
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  // จัดการ focus เมื่อ Popper ปิด
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            '& svg': {
              stroke: theme.palette.primary.light
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
            src={imageUrl}
            alt={`${formData.first_name || ''} ${formData.last_name || ''}`}
            onError={handleImageError}
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer'
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Box sx={{ p: 2 }}>
                    <Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="h4">Profile</Typography>
                      </Stack>
                    </Stack>

                    <Grid item xs={4} sm={4} md={4} lg={4} mt={2}>
                      <Box sx={{ display: 'flex' }}>
                        <Avatar src={imageUrl} alt="Profile Image" onError={handleImageError} />
                        <Grid sx={{ pl: 4 }}>
                          <Grid sx={{ display: 'flex' }}>
                            <Typography variant="body2">Name</Typography>
                            <Typography sx={{ pl: 2 }} variant="body2">
                              {formData.name || ''}
                            </Typography>
                          </Grid>
                          {/* <Grid sx={{ display: 'flex' }}>
                            <Typography variant="body2">E-mail</Typography>
                            <Typography sx={{ pl: 2 }} variant="body2">
                              {formData.email || ''}
                            </Typography>
                          </Grid> */}
                        </Grid>
                      </Box>
                    </Grid>
                  </Box>
                  <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                    <Box sx={{ p: 2 }}>
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: '10px',
                          [theme.breakpoints.down('md')]: {
                            minWidth: '100%'
                          },
                          '& .MuiListItemButton-root': {
                            mt: 0.5
                          }
                        }}
                      >
                        {/* <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          selected={selectedIndex === 0}
                          onClick={(event) => handleListItemClick(event, 0, '/profile')}
                        >
                          <ListItemIcon>
                            <IconSettings stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Account Settings</Typography>} />
                        </ListItemButton> */}

                        <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          selected={selectedIndex === 4}
                          onClick={handleLogout}
                        >
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </PerfectScrollbar>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
