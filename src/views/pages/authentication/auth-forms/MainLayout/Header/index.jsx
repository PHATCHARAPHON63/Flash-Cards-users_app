import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, useMediaQuery, ListItemButton, ListItemText, Typography } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
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
        <ButtonBase sx={{ overflow: 'hidden', overflow: 'hidden', display: { xs: 'block', md: 'none' } }}>
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
// import PropTypes from 'prop-types';
// import { useTheme } from '@mui/material/styles';
// import { Avatar, Box, ButtonBase, useMediaQuery, ListItemButton, ListItemText, Typography } from '@mui/material';
// import LogoSection from '../LogoSection';
// import { IconMenu2 } from '@tabler/icons-react';
// import { Link } from 'react-router-dom';

// const menuItems = [
//   { text: 'หน้าแรก', to: '#' },
//   { text: 'ข่าวประชาสัมพันธ์', to: '#' },
//   { text: 'สมัครการแข่งขัน', to: 'register' },
//   { text: 'อัปเดตการแข่งขัน', to: '#' },
//   { text: 'คอร์สเรียน', to: '#' }
// ];

// const Header = ({ handleLeftDrawerToggle }) => {
//   const theme = useTheme();
//   const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

//   return (
//     <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
//       <Box
//         sx={{
//           width: 228,
//           display: 'flex',
//           [theme.breakpoints.down('md')]: {
//             width: 'auto'
//           }
//         }}
//       >
//         <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
//           <LogoSection />
//         </Box>
//         <ButtonBase sx={{ display: { xs: 'flex', md: 'none' } }}>
//           <Avatar
//             variant="rounded"
//             onClick={handleLeftDrawerToggle}
//             sx={{
//               backgroundColor: 'white',
//               color: 'inherit'
//             }}
//           >
//             <IconMenu2 stroke={1.5} size="1.3rem" />
//           </Avatar>
//         </ButtonBase>
//       </Box>

//       {!matchDownMd && (
//         <Box
//           sx={{
//             display: 'flex',
//             justifyContent: 'center',
//             flexGrow: 1
//           }}
//         >
//           {menuItems.map((item, index) => (
//             <ListItemButton
//               key={index}
//               component={Link}
//               to={item.to}
//               sx={{
//                 color: 'white',
//                 '&:hover': {
//                   backgroundColor: 'transparent',
//                   '& .MuiTypography-root': {
//                     color: 'gold'
//                   }
//                 },
//                 px: 2
//               }}
//             >
//               <ListItemText
//                 primary={
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       fontSize: '18px',
//                       fontWeight: 'bold',
//                       textAlign: 'center',
//                       whiteSpace: 'nowrap'
//                     }}
//                   >
//                     {item.text}
//                   </Typography>
//                 }
//               />
//             </ListItemButton>
//           ))}
//         </Box>
//       )}
//     </Box>
//   );
// };

// Header.propTypes = {
//   handleLeftDrawerToggle: PropTypes.func
// };

// export default Header;
