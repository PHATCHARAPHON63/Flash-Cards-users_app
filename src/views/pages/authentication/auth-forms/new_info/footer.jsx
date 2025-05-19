import React from 'react';
import { Box, Typography, Grid, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import lcon_line from '../../../../../assets/images/line.png';
import lcon_facebook from '../../../../../assets/images/facebook.png';
//facebook.png
const Footer = () => {
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#F8F8F8',
        padding: { xs: '20px', md: '30px' }

        //borderTop: '1px solid #f0f0f0',
        //boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.05)'
      }}
    >
      <Grid container spacing={3} justifyContent="space-between">
        {/* ADDRESS */}
        <Grid item xs={12} sm={4}>
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: '24px',
              mb: 2,
              color: '#333333'
            }}
          >
            ADDRESS
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#555555',
              lineHeight: 1.6,
              fontSize: '16px'
            }}
          >
            บริษัท ธนธรรมเอ็ดดูเคชั่น จำกัด
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#555555',
              lineHeight: 1.6,
              fontSize: '16px'
            }}
          >
            898 ถนนนวมินทร์ แขวงคลองกุ่ม
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#555555',
              lineHeight: 1.6,
              fontSize: '16px'
            }}
          >
            เขตบึงกุ่ม กรุงเทพฯ 10240
          </Typography>
        </Grid>

        {/* CONTACT */}
        <Grid item xs={12} sm={4}>
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: '24px',
              mb: 2,
              color: '#333333'
            }}
          >
            CONTACT
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#555555',
              lineHeight: 1.6,
              fontSize: '16px'
            }}
          >
            โทร : 086-304-0582,02-510-8868
          </Typography>
          <Box sx={{ height: '16px' }} />
          <Typography
            variant="body2"
            sx={{
              color: '#555555',
              lineHeight: 1.6,
              fontSize: '16px'
            }}
          >
            Facebook :{' '}
            <Link
              href="https://www.facebook.com/thanathameducation"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: '#175A95', textDecoration: 'none', fontSize: '16px' }}
            >
              www.facebook.com/thanathameducation
            </Link>
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#555555',
              lineHeight: 1.6,
              fontSize: '16px'
            }}
          >
            Email : sc@tham.co.th
          </Typography>
        </Grid>

        {/* FOLLOW US */}
        <Grid item xs={12} sm={4}>
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: '24px',

              mb: 2,
              color: '#333333'
            }}
          >
            FOLLOW US
          </Typography>

          <Box display="flex" gap={1}>
            <IconButton
              component="a"
              href="https://www.facebook.com/thanathameducation"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                backgroundColor: '#F8F8F8',
                color: '#F8F8F8',
                padding: '8px',
                '&:hover': {
                  backgroundColor: '#F8F8F8'
                }
              }}
            >
              <img
                src={lcon_facebook}
                alt="Main Logo"
                style={{
                  width: '35px',
                  height: 'auto',
                  objectFit: 'contain',
                  cursor: 'pointer'
                }}
              />
            </IconButton>

            <IconButton
              component="a"
              href="https://line.me/yourlineaccount"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                backgroundColor: '#F8F8F8',
                color: '#F8F8F8',
                padding: '8px',
                '&:hover': {
                  backgroundColor: '#F8F8F8'
                }
              }}
            >
              {/* เนื่องจาก Material-UI ไม่มีไอคอน Line มาให้ ใช้ข้อความแทน */}
              <img
                src={lcon_line}
                alt="Main Logo"
                style={{
                  width: '35px',
                  height: 'auto',
                  objectFit: 'contain',
                  cursor: 'pointer'
                }}
              />
              {/* <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                LINE
              </Typography> */}
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* COPYRIGHT */}
      <Box
        sx={{
          textAlign: 'center',
          marginTop: 10,
          paddingTop: 0,
          marginBottom: 0
          //borderTop: '1px solid #f0f0f0'
        }}
      >
        {/* <Typography
          variant="caption"
          sx={{
            color: '#555555'
          }}
        >
          © 2025 COPYRIGHT THANATHAM EDUCATION CO.,LTD
        </Typography> */}
      </Box>
    </Box>
  );
};

export default Footer;
