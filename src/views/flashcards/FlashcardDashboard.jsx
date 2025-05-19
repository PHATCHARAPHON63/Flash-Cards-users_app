import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Card, CardContent, Button, Divider, useTheme, CircularProgress, Paper, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  IconBookmarks,
  IconCards,
  IconChartBar,
  IconRepeat,
  IconTrophy,
  IconCalendar,
  IconFlame,
  IconArrowUpRight,
  IconBrain
} from '@tabler/icons-react';
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant';
import { useNavigate } from 'react-router-dom';
import LearningProgressChart from './charts/LearningProgressChart';
import RecentStudiedCards from './components/RecentStudiedCards';
import AchievementCard from './components/AchievementCard';
import { getLearningStats } from '../../component/function/flashcard.service';

// สร้าง styled components
const StyledButton = styled(Button)(({ theme }) => ({
  padding: '12px 15px',
  borderRadius: '10px',
  justifyContent: 'flex-start',
  textAlign: 'left',
  fontWeight: 500,
  fontSize: '15px',
  marginBottom: '12px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
  '&:hover': {
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-2px)'
  },
  transition: 'all 0.2s ease-in-out'
}));

const GreetingCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  borderRadius: '15px',
  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
  marginBottom: theme.spacing(3),
  overflow: 'hidden',
  position: 'relative'
}));

const GreetingContent = styled(CardContent)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(3),
  zIndex: 1,
  position: 'relative'
}));

const CircleDecoration = styled('div')(({ theme, position }) => ({
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  position: 'absolute',
  ...position
}));

const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  height: '100%',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)'
  }
}));

const StreakBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  background: theme.palette.background.default,
  borderRadius: '20px',
  padding: '4px 10px',
  marginTop: '10px',
  width: 'fit-content'
}));

const FlashcardDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCards: 0,
    masteredCards: 0,
    reviewDue: 0,
    streakDays: 0,
    totalStudyTime: 0,
    categoriesLearned: 0
  });
  const [error, setError] = useState(null);

  // แสดงคำทักทายตามช่วงเวลา
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'สวัสดีตอนเช้า';
    if (hour < 17) return 'สวัสดีตอนบ่าย';
    return 'สวัสดีตอนเย็น';
  };

  // ดึงข้อมูลนักเรียนและสถิติ
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // ดึงข้อมูลสถิติการเรียนรู้จาก API
        const statsResponse = await getLearningStats();
        setStats(statsResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // เมนูหลักของ Flash Cards
  const menuItems = [
    {
      title: 'หมวดคำศัพท์',
      icon: <IconBookmarks color={theme.palette.primary.main} size={24} />,
      path: '/student/flashcards/categories',
      color: theme.palette.primary.light,
      description: 'เลือกดูคำศัพท์ตามหมวดหมู่'
    },
    {
      title: 'ทบทวนคำศัพท์',
      icon: <IconRepeat color={theme.palette.success.main} size={24} />,
      path: '/student/flashcards/review',
      color: theme.palette.success.light,
      description: 'ทบทวนคำศัพท์ที่ถึงเวลา'
    },
    {
      title: 'แบบทดสอบคำศัพท์',
      icon: <IconBrain color={theme.palette.error.main} size={24} />,
      path: '/student/flashcards/quiz',
      color: theme.palette.error.light,
      description: 'ทดสอบความรู้คำศัพท์'
    },
    {
      title: 'สร้างชุดคำศัพท์',
      icon: <IconCards color={theme.palette.warning.main} size={24} />,
      path: '/student/flashcards/create',
      color: theme.palette.warning.light,
      description: 'สร้างชุดคำศัพท์ของตนเอง'
    },
    {
      title: 'สถิติการเรียนรู้',
      icon: <IconChartBar color={theme.palette.secondary.main} size={24} />,
      path: '/student/learning-stats',
      color: theme.palette.secondary.light,
      description: 'ดูความก้าวหน้าแบบละเอียด'
    }
  ];

  // แปลงเวลาเป็นชั่วโมงและนาที
  const formatStudyTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} ชั่วโมง ${mins} นาที`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          ลองใหม่
        </Button>
      </Box>
    );
  }

  return (
    <MainCard title="ภาพรวมการเรียนรู้">
      <Grid container spacing={gridSpacing}>
        {/* Greeting Card */}
        <Grid item xs={12}>
          <GreetingCard>
            <CircleDecoration position={{ top: '-50px', right: '10%' }} />
            <CircleDecoration position={{ bottom: '-50px', left: '5%' }} />
            <GreetingContent>
              <Typography variant="h3" color="inherit" gutterBottom>
                {getGreeting()}
              </Typography>
              <Typography variant="h4" color="inherit" gutterBottom>
                {/* Removed student name display */}
              </Typography>
              <Typography variant="body1" color="inherit" sx={{ opacity: 0.9, mt: 1 }}>
                วันนี้คุณมี {stats.reviewDue} คำที่ต้องทบทวน และคุณมีการท่องคำศัพท์ต่อเนื่องมาแล้ว {stats.streakDays} วัน
              </Typography>
              <StreakBadge>
                <IconFlame size={20} color={theme.palette.warning.main} style={{ marginRight: 6 }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                  Streak: {stats.streakDays} วัน
                </Typography>
              </StreakBadge>
            </GreetingContent>
          </GreetingCard>
        </Grid>

        {/* Stats Row */}
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <StatCard>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <IconCards size={28} color={theme.palette.primary.main} />
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 600, mb: 1 }}>
                    {stats.totalCards}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    คำศัพท์ทั้งหมด
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <StatCard>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <IconTrophy size={28} color={theme.palette.success.main} />
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 600, mb: 1 }}>
                    {stats.masteredCards}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    คำศัพท์ที่จำได้
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <StatCard>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <IconRepeat size={28} color={theme.palette.warning.main} />
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 600, mb: 1 }}>
                    {stats.reviewDue}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ต้องทบทวนวันนี้
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <StatCard>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <IconBookmarks size={28} color={theme.palette.error.main} />
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 600, mb: 1 }}>
                    {stats.categoriesLearned}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    หมวดหมู่ที่เรียน
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <StatCard>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <IconCalendar size={28} color={theme.palette.info.main} />
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 600, mb: 1 }}>
                    {stats.streakDays}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    วันต่อเนื่อง
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <StatCard>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <IconChartBar size={28} color={theme.palette.secondary.main} />
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 600, mb: 1 }}>
                    {Math.floor(stats.totalStudyTime / 60)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ชั่วโมงที่เรียน
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
          </Grid>
        </Grid>

        {/* Review Due Cards */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">คำศัพท์ที่ต้องทบทวน</Typography>
                <Box
                  sx={{
                    bgcolor: theme.palette.warning.light,
                    color: theme.palette.warning.dark,
                    fontWeight: 'bold',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '10px'
                  }}
                >
                  {stats.reviewDue} คำ
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {stats.reviewDue > 0 ? (
                <>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    คุณมีคำศัพท์ที่ถึงเวลาต้องทบทวนวันนี้ การทบทวนอย่างสม่ำเสมอจะช่วยให้จำคำศัพท์ได้ดียิ่งขึ้น
                  </Typography>
                  <Button
                    variant="contained"
                    color="warning"
                    fullWidth
                    sx={{ mt: 2 }}
                    endIcon={<IconArrowUpRight size={16} />}
                    onClick={() => navigate('/student/flashcards/review')}
                  >
                    เริ่มทบทวนตอนนี้
                  </Button>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      margin: '0 auto 16px',
                      bgcolor: theme.palette.success.light
                    }}
                  >
                    <IconTrophy size={40} color={theme.palette.success.main} />
                  </Avatar>
                  <Typography variant="h5" gutterBottom>
                    ยอดเยี่ยม!
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    คุณไม่มีคำศัพท์ที่ต้องทบทวนวันนี้
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Menu Buttons */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
              เมนูท่องคำศัพท์
            </Typography>
            <Grid container spacing={2}>
              {menuItems.map((item, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      backgroundColor: item.color,
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                      }
                    }}
                    onClick={() => navigate(item.path)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Box sx={{ mr: 1.5 }}>{item.icon}</Box>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          {item.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>

        {/* Charts and Recent Activities */}
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            {/* Learning Progress Chart */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    ความก้าวหน้าในการเรียนรู้
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ height: 300, pt: 1 }}>
                    <LearningProgressChart />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Achievement Card */}
            <Grid item xs={12} md={4}>
              <AchievementCard />
            </Grid>

            {/* Recent Studied Cards */}
            <Grid item xs={12}>
              <RecentStudiedCards />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default FlashcardDashboard;
