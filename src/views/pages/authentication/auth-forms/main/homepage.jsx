import React from 'react';
import { Typography, Paper, Box, Button } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import AuthWrapper1 from '../AuthWrapper1';
// Import Swiper styles
import 'swiper/css';

const newsData = [
  {
    id: 1,
    title: 'เปิดรับสมัครนักกีฬาอีสปอร์ตในการแข่งขันเกมส์ ROV ระดับ มัธยมศึกษาทั่วประเทศ',
    content: 'การแข่งขันรอบ Audition ประจำภาค',
    image: './MainKV.jpg'
  },
  {
    id: 2,
    title:
      'เปิดรับสมัครแล้ว❗กับการแข่งขัน Pro League Qualifier เฟ้นหา 10 ทีมหน้าใหม่สู่หนทางแห่ง Pro League SS1 ✨ รายการ eSports ที่ใหญ่ที่สุดในประเทศไทย',
    content: '▶เปิดรับสมัคแล้ววันนี้ - 5 พฤศจิกายนนี้‼',
    image: './proreage.jpg'
  },
  {
    id: 3,
    title:
      'จบลงไปแล้วสำหรับรอบเก็บคะแนนการแข่งขันเกม E-Sport อย่าง RoV (ชื่อสากล Arena of Valor: AOV) ศึก RoV Pro League 2022 Summer หลังผ่านการฟาดฟันของบรรดา 9 ทีมชั้นนำของเมืองไทย ตลอดระยะเวลา 2 เดือนที่ผ่านมา',
    content: 'เนื้อหาข่าวที่ 3...',
    image: './4-team_last.jpg'
  }
];

const Homepage = () => {
  return (
    <AuthWrapper1 sx={{ bgcolor: 'transparent' }}>
      <Paper sx={{ bgcolor: 'transparent' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0
          }}
        >
          <Box sx={{ maxWidth: '100%', width: '90%', padding: 0, marginBottom: 0 }}>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={100}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 7000 }}
            >
              {newsData.map((news) => (
                <SwiperSlide key={news.id} style={{ overflow: 'hidden' }}>
                  <Box
                    sx={{
                      padding: 1,
                      backgroundColor: 'rgba(252, 210, 102, 1)',
                      borderRadius: 2,
                      height: { xs: 300, sm: 400, md: 450, lg: 600 },
                      display: 'flex',
                      justifyContent: 'center',
                      flexDirection: { xs: 'column', md: 'row' },
                      gap: { xs: 2, md: 4 }
                    }}
                  >
                    {/* Image Box */}
                    <Box
                      sx={{
                        width: { xs: '100%', md: '60%' },
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '8px'
                      }}
                    >
                      <img
                        src={news.image}
                        alt={news.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>

                    {/* Text Box */}
                    <Box
                      sx={{
                        width: { xs: '90%', md: '40%' },
                        bgcolor: 'black',
                        padding: '16px 8px', // Set equal left and right padding, and add top/bottom padding for vertical space
                        overflowY: 'auto', // Enable vertical scrolling
                        maxHeight: { xs: '150px', sm: '200px', md: '300px' }, // Set a max height for scrolling
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center', // Center content vertically
                        alignItems: 'center', // Center content horizontally
                        textAlign: 'center', // Center text
                        mt: { xs: 2, sm: 0 }, // Add top margin for separation
                        ml: { xs: 0, md: 2 }, // Add left margin for larger screens
                        height: '100%' // Make sure the box takes the full height of its parent
                      }}
                    >
                      <Box
                        sx={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          overflowY: 'auto'
                        }}
                      >
                        <Typography
                          variant="h5"
                          component="h2"
                          gutterBottom
                          sx={{
                            color: 'white',
                            fontSize: {
                              xs: '16px', // Font size for xs screens
                              sm: '18px', // Font size for sm screens
                              md: '20px', // Font size for md screens
                              lg: '24px' // Font size for lg screens
                            }
                          }}
                        >
                          {news.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          paragraph
                          sx={{
                            color: 'white',
                            fontSize: {
                              xs: '14px', // Font size for xs screens
                              sm: '16px', // Font size for sm screens
                              md: '18px', // Font size for md screens
                              lg: '20px' // Font size for lg screens
                            }
                          }}
                        >
                          {news.content}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        sx={{
                          mt: 2,
                          backgroundColor: 'rgba(252, 210, 102, 1)',
                          color: 'black',
                          '&:hover': {
                            backgroundColor: '#FFD700'
                          }
                        }}
                      >
                        ข่าวทั้งหมด
                      </Button>
                    </Box>
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </div>
      </Paper>
    </AuthWrapper1>
  );
};

export default Homepage;
