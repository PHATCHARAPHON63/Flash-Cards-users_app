import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, useMediaQuery, ListItemButton, ListItemText, Typography } from '@mui/material';

// project imports
import LogoSection from '../LogoSection/index';
// // import SearchSection from './SearchSection';
// import ProfileSection from './ProfileSection';
// import NotificationSection from './NotificationSection';
// assets
import { IconMenu2 } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <ButtonBase sx={{ overflow: 'hidden', display: { xs: 'block', md: 'none' } }}>
          <Avatar variant="rounded" onClick={handleLeftDrawerToggle} sx={{ bgcolor: 'transparent', color: 'inherit' }}>
            <IconMenu2 stroke={1.5} size="1.3rem" color="black" />
          </Avatar>
        </ButtonBase>
      </Box>
      <Box sx={{ flexGrow: 10 }} />
      {!matchDownMd && (
        <Box
          sx={{
            display: 'flex',
            pt: 3,
            fontSize: {
              xs: '14px',
              sm: '16px', // 8px เมื่อหน้าจอ >= 600px
              md: '18px', // 16px เมื่อหน้าจอ >= 900px
              lg: '20px', // 24px เมื่อหน้าจอ >= 1200px
              xl: '25px'
            }
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            {/* <News /> */}
            <ListItemButton
              sx={{
                '&:hover': {
                  backgroundColor: 'transparent',
                  '& .MuiTypography-root': {
                    color: '#1976d2'
                  }
                },
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' // Adding shadow to the text
              }}
              component={Link}
              //ตำแหน่งที่ต้องไป
              to="/"
            >
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontSize: {
                        xs: '14px',
                        sm: '16px', // 8px when the screen width is >= 600px
                        md: '18px', // 16px when the screen width is >= 900px
                        lg: '20px', // 24px when the screen width is >= 1200px
                        xl: '24px'
                      },
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' // Adding shadow to the text
                    }}
                  >
                    หน้าแรก
                  </Typography>
                }
              />
            </ListItemButton>
          </Box>
        </Box>
      )}

      {/* <NotificationSection />
      <ProfileSection /> */}
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;