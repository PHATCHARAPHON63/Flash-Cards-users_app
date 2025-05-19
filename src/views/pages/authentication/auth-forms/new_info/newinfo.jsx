import React from 'react';
import { Typography, Box, Button, Grid, Card, CardContent, Container, Divider } from '@mui/material';
import AuthWrapperWithMenu from '../new_info/AuthWrapper1';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Particles from 'react-tsparticles';
import { Link } from 'react-router-dom';
import { loadFull } from 'tsparticles';

// Animated gradient background component
const AnimatedGradient = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #65c4b6 0%, #8fd3f4 50%, #b5b6fb 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradient 8s ease infinite',
        zIndex: 0
      }}
    />
  );
};

// Animated feature item component
const FeatureItem = ({ icon, title, description, delay }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
      transition={{ duration: 0.6, delay: delay * 0.2 }}
    >
      <Card
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(101, 196, 182, 0.2)',
          padding: '30px',
          textAlign: 'center',
          height: '100%',
          backdropFilter: 'blur(5px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0 15px 35px rgba(101, 196, 182, 0.3)'
          }
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: delay * 0.3
          }}
        >
          <Typography variant="h2" sx={{ mb: 2, fontSize: '4rem' }}>
            {icon}
          </Typography>
        </motion.div>
        <Typography variant="h5" sx={{ color: '#2d7a6e', fontWeight: 'bold', mb: 2 }}>
          {title}
        </Typography>
        <Typography sx={{ color: '#555', fontSize: '1.1rem' }}>{description}</Typography>
      </Card>
    </motion.div>
  );
};

const Homepage = () => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <>
      <AuthWrapperWithMenu customStyles={{ backgroundColor: 'transparent' }}>
        <Box
          sx={{
            fontFamily: 'Prompt, sans-serif',
            minHeight: '100vh',
            overflowX: 'hidden',
            position: 'relative'
          }}
        >
          {/* Particles background */}
          <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }}>
            <Particles
              id="tsparticles"
              init={particlesInit}
              options={{
                fpsLimit: 60,
                interactivity: {
                  events: {
                    onClick: {
                      enable: true,
                      mode: 'push'
                    },
                    onHover: {
                      enable: true,
                      mode: 'repulse'
                    }
                  },
                  modes: {
                    push: {
                      quantity: 4
                    },
                    repulse: {
                      distance: 100,
                      duration: 0.4
                    }
                  }
                },
                particles: {
                  color: {
                    value: '#ffffff'
                  },
                  links: {
                    color: '#ffffff',
                    distance: 150,
                    enable: true,
                    opacity: 0.3,
                    width: 1
                  },
                  move: {
                    direction: 'none',
                    enable: true,
                    outModes: {
                      default: 'bounce'
                    },
                    random: false,
                    speed: 1,
                    straight: false
                  },
                  number: {
                    density: {
                      enable: true,
                      area: 800
                    },
                    value: 80
                  },
                  opacity: {
                    value: 0.5
                  },
                  shape: {
                    type: 'circle'
                  },
                  size: {
                    value: { min: 1, max: 3 }
                  }
                },
                detectRetina: true
              }}
            />
          </div>

          {/* Hero Section */}
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              pt: { xs: 15, md: 20 },
              pb: { xs: 10, md: 15 },
              px: 2,
              textAlign: 'center',
              color: 'white',
              background: 'linear-gradient(135deg, #65c4b6 0%, #8fd3f4 50%, #b5b6fb 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradient 8s ease infinite'
            }}
          >
            {/* เอา AnimatedGradient ออกเพราะรวมไว้ใน Box แล้ว */}
            <Container maxWidth="md">
              <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                    fontWeight: 'bold',
                    mb: 3,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                    style={{ display: 'inline-block' }}
                  >
                    📖
                  </motion.span>{' '}
                  ท่องศัพท์สนุกทุกวัน!
                </Typography>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
                <Typography
                  variant="h4"
                  component="p"
                  sx={{
                    mb: 4,
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  สร้างคลังคำศัพท์แบบ Flash Cards พร้อมอนิเมชั่นสุดเท่ ✨
                </Typography>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: 'white',
                    color: '#2d7a6e',
                    fontWeight: 'bold',
                    borderRadius: '50px',
                    padding: '15px 40px',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  เริ่มเล่นเลย!
                </Button>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 10, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'loop'
                }}
                style={{ marginTop: '50px' }}
              >
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  เลื่อนลงเพื่อดูเพิ่มเติม 👇
                </Typography>
              </motion.div>
            </Container>
          </Box>

          {/* Feature Section */}
          <Box
            sx={{
              position: 'relative',
              py: { xs: 8, md: 12 },
              px: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Container maxWidth="lg">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                <Typography
                  variant="h2"
                  align="center"
                  sx={{
                    fontWeight: 'bold',
                    mb: 8,
                    color: '#2d7a6e',
                    position: 'relative',
                    display: 'inline-block',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '80px',
                      height: '4px',
                      backgroundColor: '#65c4b6',
                      borderRadius: '2px'
                    }
                  }}
                >
                  🔥 ทำไมต้องเว็บนี้?
                </Typography>
              </motion.div>

              <Grid container spacing={6}>
                {[
                  {
                    icon: '📚',
                    title: 'คลังศัพท์ไม่จำกัด',
                    description: 'เพิ่มคำศัพท์ได้ไม่อั้น ทุกหมวดหมู่ ทุกระดับความยาก'
                  },
                  {
                    icon: '🎨',
                    title: 'Flash Card สวยๆ',
                    description: 'การ์ดสวยด้วยอนิเมชั่นเปลี่ยนหน้าแบบลื่นไหล พร้อมเอฟเฟกต์เสียง'
                  },
                  {
                    icon: '🎮',
                    title: 'ระบบเกมแข่งขัน',
                    description: 'แข่งกับเพื่อนได้เร็วๆนี้! ท้าดวลความจำและความเร็ว'
                  },
                  {
                    icon: '📊',
                    title: 'สถิติการเรียนรู้',
                    description: 'ติดตามความคืบหน้า ดูกราฟพัฒนาการการเรียนรู้ของคุณ'
                  },
                  {
                    icon: '🔔',
                    title: 'การแจ้งเตือน',
                    description: 'ระบบแจ้งเตือนเมื่อถึงเวลาทบทวนคำศัพท์ตามหลักการท่องจำระยะห่าง'
                  },
                  {
                    icon: '🌎',
                    title: 'ใช้งานทุกที่',
                    description: 'รองรับทุกอุปกรณ์ ทั้งมือถือ แท็บเล็ต และคอมพิวเตอร์'
                  }
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <FeatureItem {...item} delay={index} />
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>

          {/* Testimonial Section */}
          <Box
            sx={{
              py: { xs: 8, md: 12 },
              px: 2,
              backgroundColor: '#f9f9f9',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Container maxWidth="lg">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                <Typography
                  variant="h2"
                  align="center"
                  sx={{
                    fontWeight: 'bold',
                    mb: 8,
                    color: '#2d7a6e'
                  }}
                >
                  💬 ความคิดเห็นจากผู้ใช้
                </Typography>
              </motion.div>

              <Grid container spacing={4}>
                {[
                  {
                    name: 'น้องน้ำ',
                    role: 'นักเรียน ม.ปลาย',
                    comment: 'ใช้แอพนี้ท่องศัพท์เตรียมสอบติดแพทย์ค่ะ การ์ดสวยมากกก ทำข้อสอบได้คะแนนดีขึ้นจริงๆ!'
                  },
                  {
                    name: 'พี่โต้ง',
                    role: 'นักศึกษา มหาวิทยาลัย',
                    comment: 'ชอบระบบท่องศัพท์แบบมีเกมส์ ทำให้ไม่เบื่อ ใช้แค่เดือนเดียวรู้ศัพท์เพิ่มขึ้น 300 คำ!'
                  },
                  {
                    name: 'ครูแมว',
                    role: 'ครูสอนภาษาอังกฤษ',
                    comment: 'แนะนำให้นักเรียนใช้ทุกคนครับ มีระบบท่องศัพท์ที่ดีที่สุดที่เคยเจอมา นักเรียนชอบมาก'
                  }
                ].map((item, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <motion.div
                      whileHover={{ y: -10 }}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      viewport={{ once: true }}
                    >
                      <Card
                        sx={{
                          p: 4,
                          borderRadius: '20px',
                          boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                          height: '100%',
                          backgroundColor: 'white',
                          position: 'relative',
                          overflow: 'hidden',
                          '&:before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '5px',
                            backgroundColor: '#65c4b6'
                          }
                        }}
                      >
                        <Typography
                          variant="h3"
                          sx={{
                            fontSize: '4rem',
                            position: 'absolute',
                            top: 20,
                            right: 20,
                            opacity: 0.1,
                            color: '#2d7a6e'
                          }}
                        >
                          ”
                        </Typography>
                        <Typography sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.6 }}>{item.comment}</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: '50%',
                              backgroundColor: '#65c4b6',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                              mr: 2
                            }}
                          >
                            {item.name.charAt(0)}
                          </Box>
                          <Box>
                            <Typography fontWeight="bold">{item.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.role}
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>

          {/* Call to Action */}
          <Box
            sx={{
              py: { xs: 10, md: 15 },
              px: 2,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #65c4b6 0%, #8fd3f4 100%)',
              color: 'white'
            }}
          >
            <Container maxWidth="md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 'bold',
                    mb: 4,
                    fontSize: { xs: '2rem', md: '3rem' },
                    textShadow: '1px 1px 3px rgba(0,0,0,0.2)'
                  }}
                >
                  📌 พร้อมเริ่มท่องศัพท์กันหรือยัง?
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 6,
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    maxWidth: '700px',
                    mx: 'auto'
                  }}
                >
                  สมัครสมาชิกฟรีวันนี้และเริ่มสร้างคลังคำศัพท์ของคุณ!
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      component={Link}
                      to="/register"
                      variant="contained"
                      size="large"
                      sx={{
                        backgroundColor: 'white',
                        color: '#2d7a6e',
                        fontWeight: 'bold',
                        borderRadius: '50px',
                        padding: '15px 40px',
                        fontSize: '1.1rem',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        '&:hover': {
                          backgroundColor: '#f5f5f5'
                        }
                      }}
                    >
                      ลุยเลย!
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '50px',
                        padding: '15px 40px',
                        fontSize: '1.1rem',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          borderColor: 'white'
                        }
                      }}
                    >
                      ดูวิดีโอแนะนำ
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>
            </Container>

            {/* Floating animated elements */}
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  borderRadius: '50%'
                }}
                animate={{
                  y: [0, 100, 0],
                  x: [0, Math.random() * 100 - 50, 0],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 10 + Math.random() * 10,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: Math.random() * 5
                }}
              />
            ))}
          </Box>
        </Box>
      </AuthWrapperWithMenu>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </>
  );
};

export default Homepage;
