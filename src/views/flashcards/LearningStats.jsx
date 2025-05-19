import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Divider,
  useTheme,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant';
import { useNavigate } from 'react-router-dom';
import {
  IconBookmarks,
  IconCards,
  IconChartBar,
  IconRepeat,
  IconTrophy,
  IconClock,
  IconChartPie,
  IconStarFilled
} from '@tabler/icons-react';

// นำเข้าฟังก์ชันเชื่อมต่อ API
import {
  getLearningStats,
  getRecentStudiedCards,
  getHardestCards,
  getCategoryDistribution
} from '../../component/function/flashcard.service';

// สร้าง styled components
const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  '&:last-child': {
    paddingBottom: theme.spacing(3)
  }
}));

const ProgressBarWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2)
}));

const ProgressLabel = styled(Typography)(({ theme }) => ({
  minWidth: 100,
  marginRight: theme.spacing(2)
}));

const ProgressValue = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  fontWeight: 500
}));

const LearningStats = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    totalWords: 0,
    masteredWords: 0,
    needReview: 0,
    inProgress: 0,
    totalStudyTime: '0 นาที',
    averageDailyTime: '0 นาที',
    overallAccuracy: 0,
    streakDays: 0,
    lastStudySession: '-'
  });

  const [learningTrendData, setLearningTrendData] = useState([]);
  const [categoryDistributionData, setCategoryDistributionData] = useState([]);
  const [studyTimeData, setStudyTimeData] = useState([]);
  const [hardestWordsData, setHardestWordsData] = useState([]);

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // ดึงสถิติการเรียนรู้ทั้งหมด
        const statsData = await getLearningStats();

        // แปลงข้อมูลสถิติทั่วไป
        setStats({
          totalWords: statsData.totalCards || 0,
          masteredWords: statsData.masteredCards || 0,
          needReview: statsData.reviewDue || 0,
          inProgress: statsData.totalCards - statsData.masteredCards || 0,
          totalStudyTime: formatStudyTime(statsData.totalStudyTime || 0),
          averageDailyTime:
            statsData.dailyStats?.length > 0 ? `${Math.round(statsData.totalStudyTime / statsData.dailyStats.length)} นาที` : '0 นาที',
          overallAccuracy: calculateOverallAccuracy(statsData.dailyStats),
          streakDays: statsData.streakDays || 0,
          lastStudySession: formatDate(statsData.lastStudyDate) || '-'
        });

        // แปลงข้อมูลกราฟแนวโน้มการเรียนรู้
        if (statsData.dailyStats && statsData.dailyStats.length > 0) {
          // จำกัดจำนวนวันที่แสดงเป็น 7 วันล่าสุด
          const recentStats = statsData.dailyStats.slice(-14).reverse();

          const trendData = recentStats.map((day) => ({
            day: formatDate(day.date, true),
            wordsMastered: day.cards_mastered,
            wordsReviewed: day.cards_studied,
            efficiency: day.accuracy || 0
          }));

          setLearningTrendData(trendData);

          // แปลงข้อมูลเวลาเรียนรายวัน
          const timeData = recentStats.map((day) => ({
            day: formatDate(day.date, true),
            minutes: day.study_time || 0
          }));

          setStudyTimeData(timeData);
        }

        // ดึงข้อมูลการกระจายตัวของหมวดหมู่
        const categoryData = await getCategoryDistribution();
        setCategoryDistributionData(categoryData || []);

        // ดึงข้อมูลคำศัพท์ที่ยากที่สุด
        const hardestCards = await getHardestCards();
        setHardestWordsData(hardestCards || []);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching learning stats:', error);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // แปลงเวลาเป็นชั่วโมงและนาที
  const formatStudyTime = (minutes) => {
    if (!minutes) return '0 นาที';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours} ชั่วโมง ${mins} นาที` : `${mins} นาที`;
  };

  // แปลงวันที่เป็นรูปแบบที่อ่านง่าย
  const formatDate = (dateString, shortFormat = false) => {
    if (!dateString) return '-';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';

    if (shortFormat) {
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }

    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // คำนวณความแม่นยำโดยรวม
  const calculateOverallAccuracy = (dailyStats) => {
    if (!dailyStats || dailyStats.length === 0) return 0;

    const totalAccuracy = dailyStats.reduce((sum, day) => sum + (day.accuracy || 0), 0);
    return Math.round(totalAccuracy / dailyStats.length);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // ฟังก์ชันคำนวณสีตามอัตราความสำเร็จ
  const getSuccessColor = (success, attempts) => {
    if (!attempts) return theme.palette.grey[500];
    const rate = (success / attempts) * 100;
    if (rate < 40) return theme.palette.error.main;
    if (rate < 70) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  // ฟังก์ชันกำหนดธีมสี
  const getThemeColors = () => {
    const mainColor = '#65c4b6'; // สีที่กำหนดโดยผู้ใช้
    return {
      primary: mainColor,
      secondary: theme.palette.secondary.main,
      success: theme.palette.success.main,
      warning: theme.palette.warning.main,
      error: theme.palette.error.main
    };
  };

  const themeColors = getThemeColors();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: themeColors.primary }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()} sx={{ bgcolor: themeColors.primary }}>
          ลองใหม่อีกครั้ง
        </Button>
      </Box>
    );
  }

  return (
    <MainCard title="สถิติการเรียนรู้">
      <Grid container spacing={gridSpacing}>
        {/* ข้อมูลสรุป */}
        <Grid item xs={12}>
          <Card>
            <StyledCardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h3" gutterBottom>
                    ภาพรวมการเรียนรู้
                  </Typography>
                  <Typography variant="body1" color="textSecondary" paragraph>
                    สรุปความก้าวหน้าในการเรียนรู้คำศัพท์ของคุณจนถึงปัจจุบัน
                  </Typography>

                  <Box sx={{ mt: 3 }}>
                    <ProgressBarWrapper>
                      <ProgressLabel variant="body2">จำได้แล้ว</ProgressLabel>
                      <Box sx={{ flex: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(stats.masteredWords / (stats.totalWords || 1)) * 100}
                          color="success"
                          sx={{ height: 8, borderRadius: 5 }}
                        />
                      </Box>
                      <ProgressValue variant="body2">
                        {stats.masteredWords} / {stats.totalWords} คำ
                      </ProgressValue>
                    </ProgressBarWrapper>

                    <ProgressBarWrapper>
                      <ProgressLabel variant="body2">ต้องทบทวน</ProgressLabel>
                      <Box sx={{ flex: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(stats.needReview / (stats.totalWords || 1)) * 100}
                          color="warning"
                          sx={{ height: 8, borderRadius: 5 }}
                        />
                      </Box>
                      <ProgressValue variant="body2">
                        {stats.needReview} / {stats.totalWords} คำ
                      </ProgressValue>
                    </ProgressBarWrapper>

                    <ProgressBarWrapper>
                      <ProgressLabel variant="body2">ยังไม่เรียน</ProgressLabel>
                      <Box sx={{ flex: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(stats.inProgress / (stats.totalWords || 1)) * 100}
                          sx={{ height: 8, borderRadius: 5, '& .MuiLinearProgress-bar': { bgcolor: themeColors.primary } }}
                        />
                      </Box>
                      <ProgressValue variant="body2">
                        {stats.inProgress} / {stats.totalWords} คำ
                      </ProgressValue>
                    </ProgressBarWrapper>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Card sx={{ bgcolor: `${themeColors.primary}20`, height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <IconCards size={32} color={themeColors.primary} />
                          <Typography variant="h3" gutterBottom sx={{ mt: 1 }}>
                            {stats.totalWords}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            คำศัพท์ทั้งหมด
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={6}>
                      <Card sx={{ bgcolor: theme.palette.success.light, height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <IconStarFilled size={32} color={theme.palette.success.main} />
                          <Typography variant="h3" gutterBottom sx={{ mt: 1 }}>
                            {stats.overallAccuracy}%
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            ความแม่นยำโดยรวม
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={6}>
                      <Card sx={{ bgcolor: theme.palette.warning.light, height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <IconClock size={32} color={theme.palette.warning.main} />
                          <Typography variant="h3" gutterBottom sx={{ mt: 1 }}>
                            {stats.averageDailyTime}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            เวลาเฉลี่ยต่อวัน
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={6}>
                      <Card sx={{ bgcolor: `${themeColors.primary}30`, height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <IconTrophy size={32} color={themeColors.primary} />
                          <Typography variant="h3" gutterBottom sx={{ mt: 1 }}>
                            {stats.streakDays}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            วันต่อเนื่อง
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </StyledCardContent>
          </Card>
        </Grid>

        {/* แท็บสำหรับกราฟต่างๆ */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  mb: 3,
                  '& .MuiTabs-indicator': {
                    backgroundColor: themeColors.primary
                  },
                  '& .Mui-selected': {
                    color: `${themeColors.primary} !important`
                  }
                }}
              >
                <Tab label="แนวโน้มการเรียนรู้" icon={<IconChartBar size={20} />} iconPosition="start" />
                <Tab label="การกระจายตัวของหมวดหมู่" icon={<IconChartPie size={20} />} iconPosition="start" />
                <Tab label="เวลาเรียนรายวัน" icon={<IconClock size={20} />} iconPosition="start" />
                <Tab label="คำศัพท์ที่ยากที่สุด" icon={<IconRepeat size={20} />} iconPosition="start" />
              </Tabs>

              {/* แนวโน้มการเรียนรู้ */}
              {tabValue === 0 && (
                <Box sx={{ height: 350 }}>
                  <Typography variant="h4" gutterBottom>
                    แนวโน้มการเรียนรู้ในรอบสัปดาห์
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    แสดงจำนวนคำศัพท์ที่เรียนและประสิทธิภาพการจำในแต่ละวัน
                  </Typography>

                  {learningTrendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="80%">
                      <LineChart data={learningTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="wordsMastered"
                          name="คำที่จำได้"
                          stroke={theme.palette.success.main}
                          activeDot={{ r: 8 }}
                        />
                        <Line yAxisId="left" type="monotone" dataKey="wordsReviewed" name="คำที่ทบทวน" stroke={themeColors.primary} />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="efficiency"
                          name="ประสิทธิภาพ (%)"
                          stroke={theme.palette.error.main}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                      <Typography variant="body1" color="textSecondary">
                        ยังไม่มีข้อมูลเพียงพอสำหรับแสดงกราฟนี้
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* การกระจายตัวของหมวดหมู่ */}
              {tabValue === 1 && (
                <Box sx={{ height: 350 }}>
                  <Typography variant="h4" gutterBottom>
                    การกระจายตัวของหมวดหมู่คำศัพท์
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    แสดงสัดส่วนคำศัพท์แต่ละหมวดหมู่ที่คุณได้เรียนไปแล้ว
                  </Typography>

                  {categoryDistributionData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="80%">
                      <PieChart>
                        <Pie
                          data={categoryDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || `${themeColors.primary}${index * 20 + 40}`} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} คำ`, 'จำนวน']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                      <Typography variant="body1" color="textSecondary">
                        ยังไม่มีข้อมูลการกระจายตัวของหมวดหมู่
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* เวลาเรียนรายวัน */}
              {tabValue === 2 && (
                <Box sx={{ height: 350 }}>
                  <Typography variant="h4" gutterBottom>
                    เวลาเรียนรายวัน
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    แสดงเวลาที่ใช้ในการเรียนรู้คำศัพท์แต่ละวัน (นาที)
                  </Typography>

                  {studyTimeData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="80%">
                      <BarChart data={studyTimeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} นาที`, 'เวลาที่ใช้']} />
                        <Legend />
                        <Bar dataKey="minutes" name="เวลาที่ใช้ (นาที)" fill={themeColors.primary} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                      <Typography variant="body1" color="textSecondary">
                        ยังไม่มีข้อมูลเวลาเรียนรายวันที่บันทึกไว้
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* คำศัพท์ที่ยากที่สุด */}
              {tabValue === 3 && (
                <Box sx={{ height: 350, overflow: 'auto' }}>
                  <Typography variant="h4" gutterBottom>
                    คำศัพท์ที่ยากที่สุดสำหรับคุณ
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    คำศัพท์ที่คุณมีความถี่ในการตอบผิดมากที่สุด
                  </Typography>

                  {hardestWordsData.length > 0 ? (
                    <TableContainer component={Paper} sx={{ maxHeight: 250 }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>คำศัพท์</TableCell>
                            <TableCell>ความหมาย</TableCell>
                            <TableCell align="center">ความพยายาม</TableCell>
                            <TableCell align="center">ความสำเร็จ</TableCell>
                            <TableCell align="center">อัตราความสำเร็จ</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {hardestWordsData.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Typography variant="subtitle2">{row.word}</Typography>
                              </TableCell>
                              <TableCell>{row.meaning}</TableCell>
                              <TableCell align="center">{row.attempts}</TableCell>
                              <TableCell align="center">{row.success}</TableCell>
                              <TableCell align="center">
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: getSuccessColor(row.success, row.attempts),
                                      fontWeight: 500
                                    }}
                                  >
                                    {Math.round((row.success / row.attempts) * 100)}%
                                  </Typography>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                      <Typography variant="body1" color="textSecondary">
                        ยังไม่มีข้อมูลคำศัพท์ที่ยากสำหรับคุณ
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ข้อมูลเพิ่มเติม */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                คำแนะนำสำหรับการเรียนรู้
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: `${themeColors.primary}20`, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      คำศัพท์ที่ควรทบทวน
                    </Typography>
                    <Typography variant="body2">
                      {stats.needReview > 0
                        ? `มีคำศัพท์ ${stats.needReview} คำที่คุณควรทบทวนในวันนี้เพื่อเพิ่มประสิทธิภาพการจำ`
                        : 'ยินดีด้วย! คุณไม่มีคำศัพท์ที่ต้องทบทวนในวันนี้'}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2, bgcolor: themeColors.primary }}
                      onClick={() => navigate('/student/flashcards/review')}
                    >
                      {stats.needReview > 0 ? 'ทบทวนเลย' : 'ไปหน้าทบทวน'}
                    </Button>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: theme.palette.success.light, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      ช่วงเวลาที่เหมาะสม
                    </Typography>
                    <Typography variant="body2">
                      จากข้อมูลการเรียนของคุณ การทบทวนคำศัพท์อย่างสม่ำเสมอทุกวันจะช่วยเพิ่มความจำระยะยาวได้มากกว่า 80%
                      และเพิ่มประสิทธิภาพการเรียนรู้
                    </Typography>
                    <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={() => navigate('/student/flashcards')}>
                      เริ่มฝึกวันนี้
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default LearningStats;
