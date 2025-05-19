import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Card, CardContent, Button, Divider, useTheme, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { IconBookmarks, IconCards, IconChartBar, IconRepeat, IconTrophy } from '@tabler/icons-react';
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant';
import { useNavigate } from 'react-router-dom';
import { data_profile_student } from '../../component/function/auth';
import LearningProgressChart from './charts/LearningProgressChart';
import RecentStudiedCards from './components/RecentStudiedCards';
import AchievementCard from './components/AchievementCard';

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
  }
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
  height: '100%'
}));

const FlashcardStats = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCards: 0,
    masteredCards: 0,
    reviewDue: 0,
    streakDays: 0
  });

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
        // ดึงข้อมูลนักเรียน
        const response = await data_profile_student();
        setStudentData(response);
        
        // ดึงข้อมูลสถิติ - จำลองข้อมูล (ในอนาคตดึงจาก API จริง)
        setStats({
          totalCards: 240,
          masteredCards: 85,
          reviewDue: 24,
          streakDays: 7
        });
      } catch (error) {
        console.error('Error fetching data:', error);
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
      color: theme.palette.primary.light
    },
    { 
      title: 'ทบทวนคำศัพท์', 
      icon: <IconRepeat color={theme.palette.success.main} size={24} />, 
      path: '/student/flashcards/review',
      color: theme.palette.success.light
    },
    { 
      title: 'สร้างชุดคำศัพท์', 
      icon: <IconCards color={theme.palette.warning.main} size={24} />, 
      path: '/student/flashcards/create',
      color: theme.palette.warning.light
    },
    { 
      title: 'สถิติการเรียนรู้', 
      icon: <IconChartBar color={theme.palette.secondary.main} size={24} />, 
      path: '/student/flashcards/statistics',
      color: theme.palette.secondary.light
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <MainCard title="">
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
                {`${studentData?.prefix || ''} ${studentData?.first_name || ''} ${studentData?.last_name || ''}`}
              </Typography>
              <Typography variant="body1" color="inherit" sx={{ opacity: 0.9, mt: 1 }}>
                พร้อมท่องคำศัพท์วันนี้หรือยัง? คุณมี {stats.reviewDue} คำที่ต้องทบทวนวันนี้
              </Typography>
            </GreetingContent>
          </GreetingCard>
        </Grid>

        {/* Stats Row */}
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <IconCards size={28} color={theme.palette.primary.main} />
                  </Box>
                  <Typography variant="h2" sx={{ fontWeight: 600, mb: 1 }}>
                    {stats.totalCards}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    คำศัพท์ทั้งหมด
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <IconTrophy size={28} color={theme.palette.success.main} />
                  </Box>
                  <Typography variant="h2" sx={{ fontWeight: 600, mb: 1 }}>
                    {stats.masteredCards}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    คำศัพท์ที่จำได้
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <IconRepeat size={28} color={theme.palette.warning.main} />
                  </Box>
                  <Typography variant="h2" sx={{ fontWeight: 600, mb: 1 }}>
                    {stats.reviewDue}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ต้องทบทวนวันนี้
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <IconChartBar size={28} color={theme.palette.error.main} />
                  </Box>
                  <Typography variant="h2" sx={{ fontWeight: 600, mb: 1 }}>
                    {stats.streakDays}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    วันต่อเนื่อง
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
          </Grid>
        </Grid>

        {/* Menu Buttons */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
              Flash Cards
            </Typography>
            {menuItems.map((item, index) => (
              <StyledButton
                key={index}
                fullWidth
                variant="contained"
                startIcon={item.icon}
                sx={{ 
                  backgroundColor: item.color,
                  color: theme.palette.getContrastText(item.color),
                  '&:hover': {
                    backgroundColor: item.color,
                    filter: 'brightness(0.95)'
                  }
                }}
                onClick={() => navigate(item.path)}
              >
                {item.title}
              </StyledButton>
            ))}
          </Card>
        </Grid>

        {/* Charts and Recent Activities */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={gridSpacing}>
            {/* Learning Progress Chart */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    ความก้าวหน้าในการเรียนรู้
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ height: 250, pt: 1 }}>
                    <LearningProgressChart />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Studied Cards */}
            <Grid item xs={12} md={6}>
              <RecentStudiedCards />
            </Grid>

            {/* Achievement */}
            <Grid item xs={12} md={6}>
              <AchievementCard />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default FlashcardStats;