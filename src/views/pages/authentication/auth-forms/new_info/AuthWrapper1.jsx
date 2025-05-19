import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImage from '../../../../../assets/images/TTE.png';

// Styled wrapper component
const StyledWrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  width: '100%',
  minHeight: '85vh',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    minHeight: '85vh'
  },
  [theme.breakpoints.up('lg')]: {
    minHeight: '85vh'
  },
  [theme.breakpoints.up('xl')]: {
    minHeight: '85vh'
  }
}));

// Content container - แก้ไขให้ชิดขอบ
const ContentContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '100%', // เปลี่ยนจาก theme.breakpoints.values.xl เป็น 100%
  margin: 0, // ลบ margin ออกทั้งหมด
  padding: 0, // ลบ padding ออกทั้งหมด
  flex: 1,
  display: 'flex',
  flexDirection: 'column'
}));

// Menu items configuration
const menuItems = [
  { label: 'หน้าหลัก', path: '/' },
  { label: 'สมัครสมาชิก', path: '/register' },
  // { label: 'แจ้งเหตุการณ์', path: '/Login' },
  { label: 'เข้าสู่ระบบ', path: '/Login' }
];

// Menu component
const TopMenu = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleMenuItemClick = useCallback(
    (path) => {
      handleClose();
      navigate(path);
    },
    [navigate]
  );

  const isActive = useCallback(
    (path) => {
      return location.pathname === path;
    },
    [location]
  );

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#fcfcfc',
        boxShadow: 2
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{
              mr: 2,
              color: '#05255B'
            }}
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          <Box
            component="img"
            src={logoImage}
            alt="สพฐ"
            sx={{
              height: {
                xs: '35px',
                sm: '40px',
                md: '55px'
              },
              width: 'auto',
              objectFit: 'contain'
            }}
          />
          {/* <Typography
            variant="h6"
            sx={{
              ml: 4,
              mt: 2,
              fontSize: {
                xs: '16px',
                sm: '18px',
                md: '22px'
              },
              fontWeight: 900, // เพิ่มความหนาของตัวอักษร
              color: '#05255B', // เปลี่ยนสีตามที่กำหนด
              whiteSpace: 'nowrap'
            }}
          >
            THANATHAM EDUCATION CO.,LTD.
          </Typography> */}
        </Box>

        {/* Mobile Menu */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          open={open}
          onClose={handleClose}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1,
              minWidth: '200px'
            }
          }}
        >
          {menuItems.map((item) => (
            <MenuItem
              key={item.path}
              onClick={() => handleMenuItemClick(item.path)}
              sx={{
                py: 1.5,
                color: isActive(item.path) ? '#FFFFFF' : '#05255B', // เปลี่ยนเป็นสีขาวเฉพาะเมนูที่เลือก
                backgroundColor: isActive(item.path) ? '#65C4B6' : 'transparent', // เปลี่ยนพื้นหลังเป็น #65C4B6 เฉพาะเมนูที่เลือก
                '&:hover': {
                  backgroundColor: isActive(item.path) ? '#65C4B6' : 'rgba(5, 37, 91, 0.04)' // ถ้ากำลังเลือกอยู่ ให้คงเป็นสี #65C4B6
                }
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>

        {/* Desktop Menu */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            gap: 1
          }}
        >
          {menuItems.map((item) => (
            <Button
              key={item.path}
              sx={{
                px: 2,
                py: 1,
                color: isActive(item.path) ? '#FFFFFF' : '#05255B', // เปลี่ยนเป็นสีขาวเฉพาะเมนูที่เลือก
                backgroundColor: isActive(item.path) ? '#65C4B6' : 'transparent', // เปลี่ยนพื้นหลังเป็น #65C4B6 เฉพาะเมนูที่เลือก
                '&:hover': {
                  backgroundColor: isActive(item.path) ? '#65C4B6' : 'rgba(5, 37, 91, 0.04)' // ถ้ากำลังเลือกอยู่ ให้คงเป็นสี #65C4B6
                }
              }}
              onClick={() => handleMenuItemClick(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Main wrapper component
const AuthWrapperWithMenu = ({ children, customStyles = {} }) => {
  return (
    <>
      <TopMenu />
      <StyledWrapper style={customStyles}>
        <ContentContainer>{children}</ContentContainer>
      </StyledWrapper>
    </>
  );
};

export default AuthWrapperWithMenu;
