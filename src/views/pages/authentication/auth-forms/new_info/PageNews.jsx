import React, { useState, useEffect } from 'react';
import { Typography, Paper, Box, Grid, IconButton } from '@mui/material';
import AuthWrapperWithMenu from '../new_info/AuthWrapper1';
// import AuthCardWrapper from '../AuthCardWrapper';
// project imports
import { useParams } from 'react-router-dom';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useNavigate } from 'react-router-dom';
import { getInformationById, informationPicture } from '../../../../../component/function/auth';
import DOMPurify from 'dompurify';

const styles = document.createElement('style');
styles.textContent = `
  .ql-align-center {
    text-align: center !important;
  }
  .ql-align-right {
    text-align: right !important;
  }
  .ql-align-justify {
    text-align: justify !important;
  }
  .ql-indent-1 {
    padding-left: 3em;
  }
  .ql-indent-2 {
    padding-left: 6em;
  }
  /* เพิ่ม styles สำหรับขนาดตัวอักษร */
  .ql-size-huge {
    font-size: 2.5em !important;
  }
  .ql-size-large {
    font-size: 1.5em !important;
  }
  .ql-size-small {
    font-size: 0.75em !important;
  }
`;
document.head.appendChild(styles);

// ปรับ SafeHTML component
const SafeHTML = ({ htmlContent }) => {
  const sanitizedHtml = DOMPurify.sanitize(htmlContent, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'b',
      'i',
      'em',
      'strong',
      'a',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'blockquote',
      'pre',
      'code',
      'div',
      'span'
    ],
    ALLOWED_ATTR: ['href', 'target', 'class', 'style'],
    ALLOWED_CLASSES: {
      p: ['ql-align-center', 'ql-align-justify', 'ql-align-right', 'ql-indent-*'],
      span: [
        'ql-font-*',
        'ql-size-huge', // เพิ่ม class สำหรับขนาดตัวอักษร
        'ql-size-large',
        'ql-size-small',
        'ql-size-*' // รองรับขนาดอื่นๆ
      ],
      li: ['ql-indent-*']
    }
  });
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

const PageNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_URL_IMG;
  // const newsDetail = fetchNewsById(id);
  const [data, setData] = useState('');
  const getData = async () => {
    try {
      const data = await getInformationById(id);
      console.log(data.data);
      const imageData = await informationPicture(data.data.information_num);

      const combinedData = {
        ...data.data,
        images: imageData.data
      };

      console.log('combinedData', combinedData);
      setData(combinedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return 'default-image.jpg';
    // console.log(image.path);
    try {
      // ลบช่องว่างที่อาจมีใน path
      const cleanPath = image.path.replace(/\s+/g, '');
      // console.log(`${BASE_URL}/${cleanPath}`);
      return `${BASE_URL}${cleanPath}`;
    } catch (error) {
      console.error('Error creating image URL:', error);
      return 'default-image.jpg';
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
    const formattedDateStr = `${month} ${paddedDay},${year}`;

    return formattedDateStr;
  };

  return (
    <AuthWrapperWithMenu customStyles={{ backgroundColor: '#f5f5f5' }}>
      <Grid container sx={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
        <Paper
          sx={{
            boxShadow: 0,
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'start',
            width: '90%',
            padding: {
              xs: 2, // 0px เมื่อหน้าจอ >= 0px
              sm: 2, // 8px เมื่อหน้าจอ >= 600px
              md: 2, // 16px เมื่อหน้าจอ >= 900px
              lg: 3, // 24px เมื่อหน้าจอ >= 1200px
              xl: 4 // 32px เมื่อหน้าจอ >= 1536px
            }
          }}
        >
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12}>
              <Box sx={{ display: 'flex' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center', // จัดให้ลูกศรอยู่กึ่งกลางตามแนวตั้ง
                    height: { xs: '17px', sm: '28px', md: '32px' } // กำหนดความสูงเท่ากับความสูงของตัวอักษรบรรทัดแรก
                  }}
                >
                  <IconButton
                    onClick={() => navigate('/News')}
                    sx={{
                      padding: 0,
                      marginRight: 1
                    }}
                  >
                    <KeyboardArrowLeftIcon sx={{ color: '#1976d2' }} fontSize="large" />
                  </IconButton>
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    mb: 2,
                    color: '#000000',
                    fontSize: { xs: '17px', sm: '28px', md: '32px' },
                    fontFamily: 'Inter',
                    fontWeight: '700'
                  }}
                >
                  {data ? data.main_headline : 'Coming soon........'}
                </Typography>
              </Box>
            </Grid>
            <Box
              sx={{
                mt: { xs: 2, md: 3 },
                px: { xs: 1, sm: 3, md: 4 }, // padding ทั้งซ้ายและขวา
                maxWidth: '1200px', // จำกัดความกว้างสูงสุด
                mx: 'auto' // จัดกึ่งกลาง
              }}
            >
              {data && (
                // <Grid container direction="column" spacing={2} alignItems="center">
                <Grid
                  item
                  xs={12}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center' // จัดให้ content ในแต่ละ Grid อยู่กึ่งกลาง
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: {
                        xs: '200px',
                        sm: '300px',
                        md: '400px',
                        lg: '450px',
                        xl: '500px'
                      },
                      overflow: 'hidden',
                      bgcolor: 'white',
                      border: '1px solid #eee',
                      borderRadius: 1,
                      mb: { xs: 2, md: 3 }
                    }}
                  >
                    <Box
                      component="img"
                      src={getImageUrl(data.images[0])}
                      alt={data.sub_headline}
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                        objectPosition: 'center'
                      }}
                    />
                  </Box>
                  <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', mt: 2 }}>
                    <Typography
                      variant="h2"
                      sx={{
                        fontSize: { xs: '13px', sm: '26px', md: '30px' },
                        fontWeight: 'bold',
                        lineHeight: 1.2
                      }}
                    >
                      {data.sub_headline}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                    <Box
                      sx={{
                        mb: { xs: 3, md: 4 },
                        maxWidth: '100%', // จำกัดความกว้างของกล่องข้อความตามขนาดกรอบ
                        overflowWrap: 'break-word', // ตัดคำเมื่อจำเป็น
                        wordBreak: 'break-word' // ตัดคำเมื่อคำยาวเกินกรอบ
                      }}
                    >
                      <Typography
                        // sx={{
                        //   fontSize: { xs: '12px', sm: '24px', md: '38px' },
                        //   lineHeight: 1.6,
                        //   textAlign: 'start'
                        // }}
                        sx={{
                          fontSize: 'inherit', // ใช้ขนาดฟอนต์ที่ตั้งจากฐานข้อมูลหรือ CSS หลัก
                          // fontSize: { xs: 'clamp(12px, 4vw, 24px)', md: '38px' }, // ขนาดฟอนต์จะปรับตาม viewport
                          lineHeight: 1.6,
                          textAlign: 'start',
                          whiteSpace: 'normal', // อนุญาตให้ข้อความตัดบรรทัดอัตโนมัติ
                          '& img': {
                            // ควบคุมขนาดภาพใน SafeHTML
                            maxWidth: '100%', // ทำให้ภาพไม่เกินความกว้างของกรอบ
                            height: 'auto', // ปรับขนาดความสูงอัตโนมัติตามสัดส่วนของภาพ
                            display: 'block' // ป้องกันไม่ให้ภาพล้นขอบ
                          },
                          overflowWrap: 'break-word', // ตัดคำเมื่อจำเป็น
                          wordBreak: 'break-word' // ตัดคำเมื่อจำเป็น
                        }}
                      >
                        <SafeHTML htmlContent={data.new_detail} />
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                    <Typography
                      sx={{
                        fontSize: { xs: '12px', sm: '24px', md: '38px' },
                        fontWeight: 'medium',
                        textAlign: 'start'
                      }}
                    >
                      <SafeHTML htmlContent={data.sub_detail1} />
                    </Typography>
                  </Grid>
                  {data.images[1] && (
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        mb: { xs: 2, md: 3 }
                      }}
                    >
                      <Box
                        component="img"
                        src={getImageUrl(data.images[1])}
                        alt={data.sub_headline}
                        // sx={{
                        //   // width: '70%',
                        //   width: { xs: '80%', sm: '80%', md: '70%' },
                        //   height: 'auto',
                        //   maxWidth: '650px',
                        //   maxHeight: '400px',
                        //   objectFit: 'cover',
                        //   borderRadius: 1,
                        //   boxShadow: 1
                        // }}
                        sx={{
                          width: { xs: '80%', lg: '70%' },
                          height: 'auto',
                          maxHeight: { xs: '150px', sm: '150px', sm: '300px', lg: '300px', xl: '500px' },
                          borderRadius: 1,
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  )}
                  {data.title2 && (
                    <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                      <Typography
                        sx={{
                          fontSize: { xs: '16px', md: '20px' },
                          fontWeight: 'medium'
                        }}
                      >
                        {data.title2}
                      </Typography>
                    </Grid>
                  )}
                  {[2, 3, 4, 5, 6, 7].some((index) => data.images && data.images[index]) &&
                    [2, 3, 4, 5, 6, 7]
                      .filter((index) => data.images && data.images[index])
                      .map((index) => (
                        <Box
                          key={index}
                          sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            mb: { xs: 2, md: 3 }
                          }}
                        >
                          <Box
                            component="img"
                            src={getImageUrl(data.images[index])}
                            alt={`รูปภาพที่ ${index + 1}`}
                            sx={{
                              // maxWidth: '650px',
                              width: { xs: '80%', lg: '70%' },
                              height: 'auto',
                              maxHeight: { xs: '150px', sm: '150px', sm: '300px', lg: '300px', xl: '500px' },
                              objectFit: 'cover',
                              borderRadius: 1,
                              boxShadow: 1
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              // e.target.src = 'default-image.jpg';
                            }}
                          />
                        </Box>
                      ))}
                </Grid>
              )}
            </Box>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: '14px', md: '16px' },
                    color: 'text.secondary'
                  }}
                >
                  Posted by {data.createdBy}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: '14px', md: '16px' },
                    color: 'text.secondary',
                    mt: 0.5
                  }}
                >
                  {formatThaiDate(data.createdAt)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
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

export default PageNews;
