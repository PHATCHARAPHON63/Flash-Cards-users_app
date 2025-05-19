import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Box, Chip, Drawer, Stack, useMediaQuery } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { BrowserView, MobileView } from 'react-device-detect';
import MenuList from './MenuList';
import LogoSection from '../LogoSection';
import { drawerWidth } from 'store/constant';
import { useEffect } from 'react';

const Sidebar = ({ drawerOpen, drawerToggle, window, menuItems }) => {
  // เพิ่ม menuItems ใน props
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  // useEffect(() => {
  //   // Navigate to the first menu item URL after login
  //   const firstMenuItem = document.querySelector('.MuiListItemButton-root');
  //   if (firstMenuItem) {
  //     firstMenuItem.click();
  //   }
  // }, []);

  const drawer = (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Box sx={{ display: 'flex', p: 2, mx: 'auto' }}>
          <LogoSection />
        </Box>
      </Box>
      <BrowserView>
        <PerfectScrollbar
          component="div"
          style={{
            height: !matchUpMd ? 'calc(100vh - 56px)' : 'calc(100vh - 88px)',
            paddingLeft: '16px',
            paddingRight: '16px'
          }}
        >
          <MenuList menuItems={menuItems} /> {/* ส่ง menuItems ไปยัง MenuList */}
        </PerfectScrollbar>
      </BrowserView>
      <MobileView>
        <Box sx={{ px: 2 }}>
          <MenuList menuItems={menuItems} /> {/* ส่ง menuItems ไปยัง MenuList */}
        </Box>
      </MobileView>
    </>
  );

  const container = window !== undefined ? () => window.document.body : undefined;

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : 'auto' }} aria-label="mailbox folders">
      <Drawer
        container={container}
        variant={isLargeScreen ? 'permanent' : 'temporary'}
        anchor="left"
        open={isLargeScreen ? true : drawerOpen}
        onClose={drawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderRight: 'none',
            [theme.breakpoints.up('md')]: {
              top: '88px'
            },
            '& .Mui-selected': {
              backgroundColor: '#65C4B6',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#65C4B6'
              },
              '& .MuiListItemIcon-root': {
                // backgroundColor: 'rgba(255, 255, 255, 1)',
                color: '#fff',
                borderRadius: '50%',
                padding: '8px',
                width: '35px',
                height: '35px',
                minWidth: '35px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                '& svg': {
                  fontSize: '20px',
                  color: 'white'
                }
              },
              '& .MuiListItemText-root': {
                marginLeft: '15px'
              }
            },

            '& .MuiListItemIcon-root': {
              borderRadius: '50%',
              padding: '8px',
              width: '35px',
              height: '35px',
              minWidth: '35px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              '& svg': {
                fontSize: '20px'
              }
            },
            '& .MuiListItemText-root': {
              marginLeft: '10px',
              '& .MuiTypography-root': {
                fontSize: '15px',
                fontWeight: 500,
                lineHeight: '1.5'
              }
            },
            '& .MuiListItem-root::before': {
              display: 'none'
            },
            '& .MuiListItemButton-root::before': {
              display: 'none'
            },
            '& .MuiListItemButton-root': {
              borderLeft: 'none !important' // Ensure no left border
            },
            '& .MuiCollapse-root': {
              '& .MuiList-root': {
                '& .MuiListItemButton-root': {
                  paddingLeft: '25px',
                  borderLeft: 'none',
                  '& .MuiListItemIcon-root': {
                    backgroundColor: 'transparent', // ไม่มีพื้นหลัง
                    '& svg': {
                      color: 'inherit', // สีเดียวกับข้อความ
                      fontSize: '10px'
                    }
                  },
                  '&.Mui-selected': {
                    '& .MuiListItemIcon-root': {
                      '& svg': {
                        color: '#65C4B6', // สีเมื่อถูกเลือก
                        fontSize: '10px'
                        // paddingLeft: '-5px'
                      }
                    },
                    fontWeight: 'bold !important',
                    color: '#65C4B6 !important',
                    fontSize: '15px',
                    '&:hover': {
                      backgroundColor: '#65C4B6'
                    }
                  }
                },
                '&::before, &::after': {
                  display: 'none'
                },
                '& .MuiListItemText-root': {
                  margin: 1,
                  '& .MuiTypography-root': {
                    fontSize: '15px'
                  }
                }
              }
            }
          }
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

Sidebar.propTypes = {
  drawerOpen: PropTypes.bool,
  drawerToggle: PropTypes.func,
  window: PropTypes.object,
  menuItems: PropTypes.object // เพิ่ม prop-type สำหรับ menuItems
};

export default Sidebar;
