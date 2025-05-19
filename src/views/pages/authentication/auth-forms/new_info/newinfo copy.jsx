import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Typography, Paper, Box, Button, Grid, Card, CardContent, Avatar, Link, Tooltip } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Scrollbar, A11y } from 'swiper/modules';
import AuthWrapperWithMenu from '../new_info/AuthWrapper1';
import { IconClockHour4 } from '@tabler/icons-react';

import 'swiper/css';
// import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useNavigate } from 'react-router-dom';
import { getAllInformation } from '../../../../../component/function/auth';

const Homepage = () => {
  const navigate = useNavigate();
  const BASE_URL = `${import.meta.env.VITE_APP_API_URL_IMG}`;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await getAllInformation();

        if (response && response.data) {
          // กรองข่าวที่ไม่ได้อยู่ในสถานะ offline
          const currentDate = new Date();
          const filteredData = response.data.filter((item) => {
            // ถ้าไม่มี day_offline หรือ day_offline ยังไม่ถึง ให้แสดงข่าว
            if (!item.information.day_offline) return true;

            const offlineDate = new Date(item.information.day_offline);
            return currentDate < offlineDate;
          });

          setData(filteredData);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleNewsClickPage = (id) => {
    navigate(`/News/${id}`);
  };

  const handleNewsClick = () => {
    navigate('/News');
  };

  const getImageUrl = (pictures) => {
    if (!pictures || !Array.isArray(pictures) || pictures.length === 0) {
      return null;
    }

    try {
      const image = pictures[0];
      if (!image || !image.path) {
        return null;
      }
      const cleanPath = image.path.replace(/\s+/g, '');

      if (BASE_URL.endsWith('/') && cleanPath.startsWith('/')) {
        const trimmedPath = cleanPath.substring(1);
        return `${BASE_URL}${trimmedPath}`;
      } else {
        return `${BASE_URL}${cleanPath}`;
      }
    } catch (error) {
      console.error('Error creating image URL:', error);
      return null;
    }
  };

  return (
    <AuthWrapperWithMenu
      customStyles={{
        backgroundColor: '#f5f5f5',
        padding: 0, // ลบ padding เพื่อให้เต็มจอ
        margin: 0, // ลบ margin เพื่อให้เต็มจอ
        width: '100vw', // ใช้ viewport width เต็มจอ
        minHeight: '100vh', // ใช้ viewport height เต็มจอ
        overflow: 'hidden' // ป้องกัน scrollbar ที่ไม่จำเป็น
      }}
    >
      {/* ปรับขนาด Grid หลักให้เต็มจอ */}
      <Grid
        container
        sx={{
          width: '100%',
          height: '100%',
          padding: 0,
          margin: 0,
          boxSizing: 'border-box'
        }}
      >
        {/* ตรวจสอบว่ามีข่าวหรือไม่ */}
        {!Array.isArray(data) || data.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              backgroundColor: 'white',
              boxShadow: 0,
              width: '100%', // เต็มจอ
              height: '100vh', // เต็มความสูงจอ
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 0 // ลบ border radius เพื่อให้เต็มจอ
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  color: '#175A95',
                  mb: 2,
                  fontSize: {
                    xs: '24px',
                    sm: '28px',
                    md: '32px'
                  }
                }}
              >
                ยินดีต้อนรับ
              </Typography>
              <Typography
                sx={{
                  color: '#666',
                  fontSize: {
                    xs: '16px',
                    sm: '18px',
                    md: '20px'
                  }
                }}
              >
                ขณะนี้ยังไม่มีข่าวประชาสัมพันธ์
              </Typography>
            </Box>
          </Paper>
        ) : (
          <Box
            sx={{
              width: '100%',
              height: 'calc(100vh - 64px)', // คำนวณความสูงโดยหักส่วนของ footer
              overflow: 'hidden',
              margin: 0,
              padding: 0
            }}
          >
            <Swiper
              modules={[Navigation, Pagination, Autoplay, Scrollbar, A11y]}
              centeredSlides={true}
              spaceBetween={0} // ลดระยะห่างระหว่างสไลด์ลงเป็น 0
              autoplay={{ delay: 5000 }}
              navigation={data.length > 1}
              pagination={{
                clickable: true
              }}
              style={{
                overflow: 'hidden',
                width: '100%',
                height: '100%', // ตั้งค่าความสูงเป็น 100%
                padding: 0,
                margin: 0
              }}
              breakpoints={{
                0: {
                  // เริ่มจาก 0px
                  slidesPerView: 1,
                  spaceBetween: 0
                },
                640: {
                  slidesPerView: 1,
                  spaceBetween: 0
                },
                1024: {
                  slidesPerView: 1, // ปรับให้แสดง 1 สไลด์เพื่อให้เต็มจอ
                  spaceBetween: 0
                },
                1200: {
                  slidesPerView: 1, // ปรับให้แสดง 1 สไลด์เพื่อให้เต็มจอ
                  spaceBetween: 0
                }
              }}
            >
              {Array.isArray(data) &&
                data.map((news) => (
                  <SwiperSlide
                    key={news.information._id}
                    style={{
                      width: '100%',
                      height: '100%',
                      padding: 0,
                      margin: 0
                    }}
                  >
                    <Paper
                      sx={{
                        p: 0, // ลบ padding
                        backgroundColor: 'white',
                        boxShadow: 0,
                        mb: 0,
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        borderRadius: 0 // ลบ border radius
                      }}
                    >
                      <Box
                        sx={{
                          padding: 0,
                          borderRadius: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          width: '100%',
                          height: '100%'
                        }}
                      >
                        {/* กรอบรูปภาพ responsive */}
                        <Box
                          sx={{
                            width: '100%',
                            bgcolor: 'white',
                            position: 'relative',
                            overflow: 'hidden',
                            height: '90%', // ใช้ 90% ของความสูงเพื่อเหลือที่ให้กับหัวข้อ
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: 'none', // ลบเส้นขอบ
                            borderRadius: 0,
                            '& img': {
                              width: '100%', // ทำให้ภาพกว้างเต็มพื้นที่
                              height: '100%', // ทำให้ภาพสูงเต็มพื้นที่
                              objectFit: 'cover' // เปลี่ยนเป็น cover เพื่อให้เต็มพื้นที่
                            }
                          }}
                        >
                          {/* container สำหรับรูปภาพ */}
                          <Box
                            sx={{
                              position: 'relative',
                              height: '100%',
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              overflow: 'hidden'
                            }}
                          >
                            {news.pictures && news.pictures.length > 0 ? (
                              <>
                                {getImageUrl(news.pictures) ? (
                                  <img
                                    src={getImageUrl(news.pictures)}
                                    alt={news.information.main_headline}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover', // เปลี่ยนเป็น cover
                                      objectPosition: 'center',
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => handleNewsClickPage(news.information._id)}
                                    onError={(e) => {
                                      console.error('Image failed to load');
                                      e.target.onerror = null;
                                      const parentElement = e.target.parentNode;
                                      if (parentElement) {
                                        const messageBox = document.createElement('div');
                                        messageBox.style.width = '100%';
                                        messageBox.style.height = '100%';
                                        messageBox.style.display = 'flex';
                                        messageBox.style.justifyContent = 'center';
                                        messageBox.style.alignItems = 'center';
                                        messageBox.style.backgroundColor = '#f0f0f0';
                                        messageBox.style.color = '#175A95';
                                        messageBox.style.fontSize = '16px';
                                        messageBox.style.padding = '10px';
                                        messageBox.style.textAlign = 'center';
                                        messageBox.style.overflow = 'hidden';
                                        messageBox.style.textOverflow = 'ellipsis';
                                        messageBox.textContent = news.information.main_headline || 'ไม่พบชื่อข่าว';
                                        parentElement.replaceChild(messageBox, e.target);
                                      }
                                    }}
                                  />
                                ) : (
                                  <Box
                                    sx={{
                                      width: '100%',
                                      height: '100%',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      backgroundColor: '#f0f0f0',
                                      color: '#175A95',
                                      fontSize: '16px',
                                      padding: '10px',
                                      textAlign: 'center',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis'
                                    }}
                                  >
                                    {news.information.main_headline || 'ไม่พบชื่อข่าว'}
                                  </Box>
                                )}
                              </>
                            ) : (
                              <Box
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  backgroundColor: '#f0f0f0',
                                  color: '#aaa',
                                  fontSize: '16px'
                                }}
                              >
                                ไม่มีรูปภาพ
                              </Box>
                            )}
                          </Box>
                        </Box>

                        {/* ส่วนเนื้อหาข้อความแบบ overlay ด้านล่าง - สีดำบนพื้นขาว พร้อมวันที่ด้านขวา */}
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)', // พื้นหลังสีขาวโปร่งใส
                            padding: { xs: 1, sm: 2 },
                            boxSizing: 'border-box',
                            zIndex: 2, // ให้อยู่ด้านหน้าของรูปภาพ
                            borderTop: '1px solid rgba(0, 0, 0, 0.1)' // เส้นขอบด้านบน
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between', // จัดให้อยู่คนละฝั่ง (ซ้าย-ขวา)
                              alignItems: 'center', // จัดให้อยู่กึ่งกลางแนวตั้ง
                              width: '100%'
                            }}
                          >
                            {/* หัวข้อข่าวด้านซ้าย */}
                            <Typography
                              variant="h5"
                              component="h2"
                              sx={{
                                color: 'black',
                                fontSize: {
                                  xs: '16px',
                                  sm: '18px',
                                  md: '20px'
                                },
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                '&:hover': {
                                  textDecoration: 'underline'
                                },
                                display: '-webkit-box',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                lineHeight: '1.5em',
                                maxHeight: '1.5em',
                                mb: 0,
                                flexGrow: 1, // ให้ขยายเต็มพื้นที่ที่เหลือ
                                pr: 2 // เว้นระยะด้านขวาเล็กน้อย
                              }}
                              onClick={() => handleNewsClickPage(news.information._id)}
                            >
                              {news.information.main_headline}
                            </Typography>

                            {/* วันที่ด้านขวาพร้อมไอคอนนาฬิกา */}
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#666', // สีเทา
                                fontSize: {
                                  xs: '12px',
                                  sm: '14px',
                                  md: '16px'
                                },
                                whiteSpace: 'nowrap', // ป้องกันการขึ้นบรรทัดใหม่
                                fontWeight: 'normal',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px' // ระยะห่างระหว่างไอคอนกับข้อความ
                              }}
                            >
                              {/* ไอคอนนาฬิกาจาก Tabler Icons */}
                              <IconClockHour4
                                size={18}
                                stroke={1.5}
                                style={{
                                  verticalAlign: 'middle',
                                  marginRight: '4px'
                                }}
                              />
                              {news.information.day_online
                                ? (() => {
                                    // แปลงวันที่เป็นรูปแบบไทย เช่น "4 พฤศจิกายน 2567"
                                    const date = new Date(news.information.day_online);

                                    // รายการชื่อเดือนภาษาไทย
                                    const thaiMonths = [
                                      'มกราคม',
                                      'กุมภาพันธ์',
                                      'มีนาคม',
                                      'เมษายน',
                                      'พฤษภาคม',
                                      'มิถุนายน',
                                      'กรกฎาคม',
                                      'สิงหาคม',
                                      'กันยายน',
                                      'ตุลาคม',
                                      'พฤศจิกายน',
                                      'ธันวาคม'
                                    ];

                                    // คำนวณปีพุทธศักราช (ค.ศ. + 543)
                                    const buddhistYear = date.getFullYear() + 543;

                                    // สร้างรูปแบบวันที่แบบไทย
                                    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${buddhistYear}`;
                                  })()
                                : ''}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  </SwiperSlide>
                ))}
            </Swiper>
          </Box>
        )}
      </Grid>

      {/* ปรับ footer ให้อยู่ด้านล่างสุดเสมอ */}
      {/* <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 1.5,
          position: 'fixed', // ให้อยู่ติดด้านล่างเสมอ
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.7)', // พื้นหลังโปร่งใส
          backdropFilter: 'blur(5px)', // เพิ่ม blur effect
          '@media (max-width: 900px)': {
            display: 'none'
          }
        }}
      >
        <Typography
          variant="caption"
          component="span"
          sx={{
            color: 'black',
            fontSize: '14px',
            opacity: 0.9,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          &copy; 2025 COPYRIGHT
          <a
            href="https://www.tlogical.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'black',
              textDecoration: 'none'
            }}
          >
            THANATHAM EDUCATION CO.,LTD.
          </a>
        </Typography>
      </Box> */}
    </AuthWrapperWithMenu>
  );
};

export default Homepage;
