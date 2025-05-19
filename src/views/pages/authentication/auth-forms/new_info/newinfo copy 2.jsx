import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Typography, Paper, Box, Button, Grid, Card, CardContent, Avatar, Link, Tooltip } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Scrollbar, A11y } from 'swiper/modules';
import AuthWrapperWithMenu from '../new_info/AuthWrapper1';

import 'swiper/css';
// import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useNavigate } from 'react-router-dom';
import { getAllInformation } from '../../../../../component/function/auth';

const Homepage = () => {
  // const position = [13.776556, 100.513611];
  const navigate = useNavigate();
  // ใช้ตัวแปร BASE_URL ที่มีอยู่แล้ว - ไม่ต้องประกาศซ้ำ
  const BASE_URL = `${import.meta.env.VITE_APP_API_URL_IMG}`;
  const [data, setData] = useState([]);
  const [dataCourse, setDataCourse] = useState('');
  const [data_Program, setData_Program] = useState('');
  const [data_Results, setData_Results] = useState('');
  const [data_Live, setData_Live] = useState('');
  const [data_OBEClive, setData_OBEClive] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);

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
    // console.log('OK');
    navigate(`/News/${id}`); // นำทางไปยังหน้ารายละเอียดโดยส่ง id
  };

  const handleNewsClick = () => {
    // console.log('OK');
    navigate('/News'); // นำทางไปยังหน้ารายละเอียดโดยส่ง id
  };

  const getImageUrl = (pictures) => {
    if (!pictures || !Array.isArray(pictures) || pictures.length === 0) {
      return null; // เปลี่ยนจาก 'default-image.jpg' เป็น null
    }

    try {
      // ใช้รูปภาพแรกในอาร์เรย์ pictures
      const image = pictures[0];

      // ตรวจสอบว่า path มีค่าหรือไม่
      if (!image || !image.path) {
        return null; // เปลี่ยนจาก 'default-image.jpg' เป็น null
      }

      // ลบช่องว่างที่อาจมีใน path
      const cleanPath = image.path.replace(/\s+/g, '');

      // ตรวจสอบว่า BASE_URL มี / ต่อท้ายหรือไม่
      if (BASE_URL.endsWith('/') && cleanPath.startsWith('/')) {
        // ตัด / ออกจากต้น path เพื่อป้องกัน // ซ้ำ
        const trimmedPath = cleanPath.substring(1);
        return `${BASE_URL}${trimmedPath}`;
      } else {
        return `${BASE_URL}${cleanPath}`;
      }
    } catch (error) {
      console.error('Error creating image URL:', error);
      return null; // เปลี่ยนจาก 'default-image.jpg' เป็น null
    }
  };

  return (
    <>
      {/* ปรับ AuthWrapperWithMenu ให้ไม่มี padding ข้าง */}
      <AuthWrapperWithMenu
        customStyles={{
          backgroundColor: '#f5f5f5',
          overflow: 'hidden',
          padding: 0, // ลบ padding ของ Wrapper
          margin: 0 // ลบ margin ของ Wrapper
        }}
      >
        {/* ปรับ Grid ให้มีความกว้างชิดขอบซ้ายและขวามากขึ้น */}
        <Grid
          sx={{
            px: 0,
            mx: 0,
            maxWidth: '100vw',
            width: '100vw',
            margin: 0,
            marginLeft: '-50px', // เพิ่มค่าลบให้มากขึ้นกว่าเดิม
            marginRight: '-50px', // เพิ่มค่าลบให้มากขึ้นกว่าเดิม
            boxSizing: 'border-box',
            overflow: 'hidden',
            position: 'relative',
            left: '-50px', // ย้ายตำแหน่งให้ชิดซ้ายมากขึ้น
            right: '-50px' // ย้ายตำแหน่งให้ชิดขวามากขึ้น
          }}
        >
          {/* ตรวจสอบว่ามีข่าวหรือไม่ */}
          {!Array.isArray(data) || data.length === 0 ? (
            <Paper
              sx={{
                p: 4,
                backgroundColor: 'white',
                boxShadow: 0,
                mb: 4,
                height: '300px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 2
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
            <Swiper
              modules={[Navigation, Pagination, Autoplay, Scrollbar, A11y]}
              centeredSlides={true} // จัดให้ภาพปัจจุบันอยู่ตรงกลาง
              spaceBetween={20} // ลดระยะห่างระหว่างสไลด์ลงมากกว่าเดิม
              autoplay={{ delay: 2000 }}
              navigation={data.length > 1} // แสดงปุ่ม navigation เมื่อมีรูปมากกว่า 1 รูป
              pagination={{
                clickable: true
              }}
              style={{
                overflow: 'hidden',
                width: '110vw', // เพิ่มความกว้างเกินขนาดหน้าจอ
                padding: 0, // ป้องกัน padding เพิ่มเติมใน Swiper
                margin: '0', // ไม่ต้องมี margin
                height: 'auto', // ปล่อยให้ความสูงปรับตามเนื้อหา
                position: 'relative',
                left: '-5vw', // เลื่อนไปทางซ้ายเพื่อให้ชิดขอบมากขึ้น
                right: 0,
                marginLeft: '-30px' // เพิ่มเติมเพื่อให้ชิดซ้ายมากขึ้น
              }}
              breakpoints={{
                640: {
                  // สำหรับหน้าจอขนาด 640px ขึ้นไป (มือถือ)
                  slidesPerView: 1, // แสดง 1 สไลด์
                  spaceBetween: 0 // ลดระยะห่างระหว่างสไลด์
                },
                1024: {
                  // สำหรับหน้าจอขนาด 1024px ขึ้นไป (แท็บเล็ต)
                  slidesPerView: 1, // ลดลงเหลือ 1 เพื่อให้สไลด์ใหญ่ขึ้น
                  spaceBetween: 5 // ลดระยะห่างระหว่างสไลด์
                },
                1200: {
                  // สำหรับหน้าจอขนาด 1200px ขึ้นไป (เดสก์ท็อป)
                  slidesPerView: 1.2, // ลดลงมากเพื่อให้สไลด์ใหญ่ขึ้น
                  spaceBetween: 10 // ลดระยะห่างระหว่างสไลด์
                }
              }}
            >
              {Array.isArray(data) &&
                data.map((news) => (
                  <SwiperSlide key={news.information._id}>
                    <Paper
                      sx={{
                        p: { xs: 2, sm: 2.5, md: 3 }, // ลด padding เล็กน้อย
                        backgroundColor: 'white',
                        boxShadow: 0,
                        mb: 4,
                        height: 'auto',
                        display: 'flex',
                        width: '100%', // เพิ่มความกว้าง
                        maxWidth: '100%', // เพิ่มเป็น 100%
                        mx: 'auto', // จัดให้อยู่ตรงกลาง
                        // เพิ่มความสูงขั้นต่ำ
                        minHeight: {
                          xs: '450px', // เพิ่มจาก 400px
                          sm: '500px', // เพิ่มจาก 450px
                          md: '600px' // เพิ่มจาก 550px
                        }
                      }}
                    >
                      <Box
                        sx={{
                          padding: 1,
                          borderRadius: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          width: '100%'
                        }}
                      >
                        {/* กรอบรูปภาพ responsive - เพิ่มความสูงขึ้น */}
                        <Box
                          sx={{
                            width: '100%',
                            bgcolor: 'white',
                            position: 'relative',
                            overflow: 'hidden',
                            // กำหนดความสูงแบบ responsive
                            height: {
                              xs: '300px',
                              sm: '400px',
                              md: '500px'
                            },
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: '1px solid #eee',
                            borderRadius: 1,
                            '& img': {
                              maxWidth: '100%',
                              maxHeight: '100%',
                              height: 'auto',
                              width: 'auto',
                              objectFit: 'contain'
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
                            {/* นำ logic การแสดงภาพที่ปรับปรุงแล้วมาใช้ */}
                            {news.pictures && news.pictures.length > 0 ? (
                              <>
                                {getImageUrl(news.pictures) ? (
                                  <img
                                    src={getImageUrl(news.pictures)}
                                    alt={news.information.main_headline}
                                    style={{
                                      maxWidth: '100%',
                                      maxHeight: '100%',
                                      width: 'auto',
                                      height: 'auto',
                                      objectFit: 'contain',
                                      objectPosition: 'center',
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => handleNewsClickPage(news.information._id)}
                                    onError={(e) => {
                                      console.error('Image failed to load');
                                      // ป้องกันการลูปโดยการกำหนด onerror เป็น null
                                      e.target.onerror = null;
                                      // แทนที่รูปด้วย div แสดงข้อความ
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

                                        // แทนที่ img ด้วย div
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
                                      color: '#175A95', // สีน้ำเงินเข้ม
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

                        {/* ส่วนเนื้อหาข้อความ */}
                        <Box
                          sx={{
                            width: '100%',
                            height: 'auto',
                            bgcolor: 'white',
                            padding: 0,
                            overflow: 'hidden',
                            boxSizing: 'border-box',
                            mt: 2
                          }}
                        >
                          <Typography
                            variant="h5"
                            component="h2"
                            gutterBottom
                            sx={{
                              color: '#175A95',
                              fontSize: {
                                xs: '18px',
                                sm: '20px',
                                md: '22px'
                              },
                              cursor: 'pointer',
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
                              mb: 1
                            }}
                            onClick={() => handleNewsClickPage(news.information._id)}
                          >
                            {news.information.main_headline}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </SwiperSlide>
                ))}
            </Swiper>
          )}
        </Grid>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 2,
            padding: 3,
            '@media (max-width: 900px)': {
              display: 'none'
            }
          }}
        >
          {/* <Typography
            variant="caption"
            component="span"
            sx={{
              color: 'black',
              fontSize: '14px',
              opacity: 0.7,
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
          </Typography> */}
        </Box>
      </AuthWrapperWithMenu>
    </>
  );
};

export default Homepage;
