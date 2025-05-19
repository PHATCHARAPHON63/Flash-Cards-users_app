import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Card, CardContent, Button, Avatar, Divider } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { IconUserCircle, IconBook, IconCalendarStats, IconClipboardList, IconClock } from '@tabler/icons-react';
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant';
import { useNavigate } from 'react-router-dom';
import { data_profile_student } from '../../component/function/auth';
import StudentAttendanceChart from './charts/StudentAttendanceChart';
import RecentAnnouncements from './charts/RecentAnnouncements';

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

const MainMenu_Student = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  // แสดงคำทักทายตามช่วงเวลา
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'สวัสดีตอนเช้า';
    if (hour < 17) return 'สวัสดีตอนบ่าย';
    return 'สวัสดีตอนเย็น';
  };

  // ดึงข้อมูลนักเรียน
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await data_profile_student();
        setStudentData(response);
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  // สร้างเมนูหลัก
  const menuItems = [
    { 
      title: 'ข้อมูลส่วนตัว', 
      icon: <IconUserCircle color={theme.palette.primary.main} size={24} />, 
      path: '/student/account',
      color: theme.palette.primary.light
    },
    { 
      title: 'การเข้าเรียน', 
      icon: <IconCalendarStats color={theme.palette.success.main} size={24} />, 
      path: '/student/attendance',
      color: theme.palette.success.light
    },
    { 
      title: 'ลางาน/ลาป่วย', 
      icon: <IconClock color={theme.palette.warning.main} size={24} />, 
      path: '/student/leave',
      color: theme.palette.warning.light
    },
    { 
      title: 'คลังความรู้', 
      icon: <IconBook color={theme.palette.secondary.main} size={24} />, 
      path: '/student/knowledge',
      color: theme.palette.secondary.light
    },
    { 
      title: 'ประกาศ', 
      icon: <IconClipboardList color={theme.palette.error.main} size={24} />, 
      path: '/student/announcements',
      color: theme.palette.error.light
    }
  ];

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
                {loading ? 'กำลังโหลด...' : `${studentData?.prefix || ''} ${studentData?.first_name || ''} ${studentData?.last_name || ''}`}
              </Typography>
              <Typography variant="body1" color="inherit" sx={{ opacity: 0.9, mt: 1 }}>
                ยินดีต้อนรับกลับมา! ส่วนตัวของคุณ
              </Typography>
            </GreetingContent>
          </GreetingCard>
        </Grid>

        {/* Menu Buttons */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
              เมนูหลัก
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

        {/* Profile summary */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={gridSpacing}>
            {/* Attendance Summary */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    สรุปการเข้าเรียน
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ height: 250, pt: 1 }}>
                    <StudentAttendanceChart />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Announcements */}
            <Grid item xs={12}>
              <RecentAnnouncements />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default MainMenu_Student;