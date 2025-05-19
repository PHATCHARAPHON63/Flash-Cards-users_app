import React, { useState, useEffect } from 'react';
import { Typography, Paper, Box, Grid, TextField, Tooltip, TableCell, TableContainer, TablePagination } from '@mui/material';
//import AuthWrapper1 from '../AuthWrapper1';
import AuthWrapperWithMenu from '../new_info/AuthWrapper1';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@mui/material';
import { getAllInformation } from '../../../../../component/function/auth';

const getTextFromHTML = (html) => {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html; // ตั้งค่าข้อมูล HTML
  return tempElement.innerText || tempElement.textContent; // คืนค่าข้อความที่ไม่มีแท็ก HTML
};

const SanitizeHTML = ({ htmlString }) => {
  const getTextFromHTML = (html) => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html; // ตั้งค่าข้อมูล HTML
    return tempElement.innerText || tempElement.textContent; // คืนค่าข้อความ
  };

  const text = getTextFromHTML(htmlString); // แปลง HTML เป็นข้อความธรรมดา

  return <div>{text}</div>; // แสดงข้อความ
};

const News = () => {
  const navigate = useNavigate();
  const BASE_URL = `${import.meta.env.VITE_APP_API_URL_IMG}`; // แก้ไขให้ตรงกับ Homepage
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await getAllInformation();
        console.log('API response:', response);

        if (response && response.data) {
          // กรองข่าวที่ไม่ได้อยู่ในสถานะ offline
          const currentDate = new Date();
          const filteredData = response.data.filter((item) => {
            // ถ้าไม่มี day_offline หรือ day_offline ยังไม่ถึง ให้แสดงข่าว
            if (!item.information.day_offline) return true;

            const offlineDate = new Date(item.information.day_offline);
            // ถ้าไม่มี day_online หรือ day_online ถึงแล้ว ให้แสดงข่าว
            if (!item.information.day_online) return currentDate < offlineDate;

            const onlineDate = new Date(item.information.day_online);
            return currentDate >= onlineDate && currentDate < offlineDate;
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

  const handleNewsClick = (id) => {
    navigate(`/News/${id}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const formatThaiDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'Asia/Bangkok'
    };

    const formattedDate = date.toLocaleDateString('en-US', options).replace(/,/g, '').split(' ');

    const [month, day, year] = formattedDate;
    const paddedDay = day.padStart(2, '0');
    const formattedDateStr = `${paddedDay} ${month} ${year}`;

    return formattedDateStr;
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // แก้ไขการกรองข้อมูลให้ใช้โครงสร้างข้อมูลที่ถูกต้อง
  const filteredNews = Array.isArray(data)
    ? data.filter((news) => news.information.main_headline.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  // ฟังก์ชันสำหรับการจัดการกรณีรูปภาพโหลดไม่สำเร็จ
  const handleImageError = (e, headline) => {
    console.error('Image failed to load');
    e.target.onerror = null; // ป้องกันการลูป

    // สร้าง div แสดงข้อความแทนที่รูปภาพ
    const parent = e.target.parentNode;
    if (parent) {
      const messageBox = document.createElement('div');
      messageBox.style.width = '100%';
      messageBox.style.height = '100%';
      messageBox.style.display = 'flex';
      messageBox.style.justifyContent = 'center';
      messageBox.style.alignItems = 'center';
      messageBox.style.backgroundColor = '#f0f0f0';
      messageBox.style.color = '#175A95'; // สีน้ำเงินเข้ม เหมือนกับสีของหัวข้อ
      messageBox.style.fontSize = '16px';
      messageBox.style.padding = '10px';
      messageBox.style.textAlign = 'center';
      messageBox.style.overflow = 'hidden';
      messageBox.style.textOverflow = 'ellipsis';
      messageBox.textContent = headline || 'ไม่พบชื่อข่าว';

      // แทนที่รูปภาพด้วย div
      parent.replaceChild(messageBox, e.target);
    }
  };

  return (
    <AuthWrapperWithMenu customStyles={{ backgroundColor: '#f5f5f5' }}>
      <Grid container sx={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
        <Paper
          sx={{
            display: 'flex',
            justifyContent: 'start',
            boxShadow: 0,
            p: 2,
            width: '100%',
            paddingX: {
              xs: 1,
              sm: 3,
              md: 3,
              lg: 3,
              xl: 4
            },
            ml: { xs: '20px' }
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={8}>
                <Typography
                  variant="h4"
                  sx={{
                    mb: 2,
                    color: '#0e2130',
                    fontFamily: 'Inter',
                    fontWeight: '700',
                    wordWrap: 'break-word',
                    fontSize: { xs: '18px', sm: '20px', md: '24px' },
                    mt: 2
                  }}
                >
                  ข่าวประชาสัมพันธ์
                </Typography>
              </Grid>
            </Grid>
            <Box
              sx={{
                overflowY: 'auto',
                mt: 2,
                pr: 1
              }}
            >
              <Grid item xs={8} md={3}>
                <TextField
                  fullWidth
                  placeholder="ค้นหา..."
                  variant="outlined"
                  size="small"
                  sx={{ color: 'black' }}
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </Grid>
              <Grid item xs={12}>
                <TableContainer>
                  {loading ? (
                    <Typography>กำลังโหลดข้อมูล...</Typography>
                  ) : filteredNews.length === 0 ? (
                    <Typography sx={{ mt: 2 }}>ไม่พบข่าวประชาสัมพันธ์</Typography>
                  ) : (
                    <>
                      {filteredNews.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((news) => (
                        <Paper
                          key={news.information._id}
                          sx={{
                            padding: 1,
                            backgroundColor: 'white',
                            boxShadow: 0.5,
                            height: 'auto',
                            display: 'flex',
                            width: 'auto',
                            mb: 4
                          }}
                        >
                          <Box
                            sx={{
                              display: { xs: 'block', lg: 'flex' },
                              mt: 2,
                              mb: 2,
                              width: '100%'
                            }}
                          >
                            {/* ส่วนรูปภาพ */}
                            <Grid
                              sx={{
                                width: { xs: '100%' },
                                maxWidth: {
                                  xs: '400px',
                                  sm: '600px',
                                  md: '650px',
                                  lg: '700px'
                                },
                                display: 'flex',
                                justifyContent: 'flex-start', // เปลี่ยนจาก center เป็น flex-start ทุกขนาดหน้าจอ
                                marginRight: { lg: '20px' } // เพิ่มระยะห่างจากข้อความด้านขวา
                              }}
                            >
                              <Box
                                sx={{
                                  width: '100%',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  height: {
                                    xs: '150px', // ลดจาก 200px
                                    sm: '180px', // ลดจาก 300px
                                    md: '220px', // ลดจาก 350px
                                    lg: '250px', // ลดจาก 400px
                                    xl: '280px' // ลดจาก 450px
                                  },
                                  overflow: 'hidden',
                                  bgcolor: 'white',
                                  borderRadius: 1,
                                  mb: { xs: 2, md: 3 }
                                }}
                              >
                                {getImageUrl(news.pictures) ? (
                                  <Box
                                    component="img"
                                    src={getImageUrl(news.pictures)}
                                    alt={news.information.main_headline}
                                    sx={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'contain',
                                      objectPosition: 'center',
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => handleNewsClick(news.information._id)}
                                    onError={(e) => handleImageError(e, news.information.main_headline)}
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
                              </Box>
                            </Grid>

                            {/* ส่วนเนื้อหา */}
                            <Grid
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                flex: { lg: 1 },
                                width: { xs: '100%', lg: '200px' },
                                mt: { xs: 2, lg: 0 },
                                mt: 2
                              }}
                            >
                              {/* หัวข้อหลัก */}
                              <Tooltip title={news.information.main_headline}>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'normal',
                                    fontWeight: 'bold',
                                    fontSize: { xs: '16px', sm: '20px', md: '25px' },
                                    cursor: 'pointer',
                                    '&:hover': {
                                      textDecoration: 'underline',
                                      color: 'primary.main'
                                    },
                                    lineHeight: 1.2
                                  }}
                                  onClick={() => handleNewsClick(news.information._id)}
                                >
                                  {news.information.main_headline}
                                </Typography>
                              </Tooltip>

                              {/* หัวข้อรองและวันที่ */}
                              <Tooltip title={news.information.sub_headline}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '60%',
                                    lineHeight: 1.8,
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 1,
                                    whiteSpace: 'normal',
                                    fontSize: { xs: '14px', sm: '16px', md: '18px' }
                                  }}
                                >
                                  {news.information.sub_headline}
                                </Typography>
                              </Tooltip>

                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'text.secondary',
                                  fontSize: { xs: '12px', sm: '12px', md: '14px' }
                                }}
                              >
                                {formatThaiDate(news.information.day_online)}
                              </Typography>

                              {/* รายละเอียด */}
                              <Tooltip>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 2,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'normal',
                                    color: 'text.secondary',
                                    mt: 1,
                                    lineHeight: 1.8,
                                    fontSize: { xs: '14px', sm: '14px', md: '16px' }
                                  }}
                                >
                                  <SanitizeHTML htmlString={news.information.new_detail || ''} />
                                </Typography>
                              </Tooltip>
                            </Grid>
                          </Box>
                        </Paper>
                      ))}
                      <TablePagination
                        component="div"
                        count={filteredNews.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10]}
                        labelRowsPerPage="แสดงแถวละ"
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} จาก ${count}`}
                      />
                    </>
                  )}
                </TableContainer>
              </Grid>
            </Box>
          </Box>
        </Paper>
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
  );
};

export default News;
