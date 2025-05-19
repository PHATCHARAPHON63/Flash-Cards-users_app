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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Chip,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  IconCalendar,
  IconCheck,
  IconX,
  IconArrowLeft,
  IconClockHour4,
  IconBrain,
  IconChartBar,
  IconTarget,
  IconChartPie,
  IconRefresh,
  IconFilter,
  IconBookmarks,
  IconChartDots,
  IconChartLine,
  IconDeviceFloppy,
  IconShare
} from '@tabler/icons-react';
import { styled } from '@mui/material/styles';
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getAllCategories, getQuizStatistics, getRecentQuizzes, getDifficultWords } from '../../component/function/flashcard.service';

// กำหนดค่าสีหลักของธีม
const THEME_COLOR = '#65c4b6';
const THEME_COLOR_DARK = '#55b4a6';
const THEME_COLOR_LIGHT = '#e5f5f2';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 15,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 25px rgba(0,0,0,0.1)'
  }
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  '&:last-child': {
    paddingBottom: theme.spacing(3)
  }
}));

const FilterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.background.neutral || theme.palette.grey[50],
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  alignItems: 'center'
}));

const StatNumber = styled(Typography)(({ theme, color }) => ({
  fontSize: '2.5rem',
  fontWeight: 600,
  color: color || THEME_COLOR,
  marginBottom: theme.spacing(1)
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

const CategoryChip = styled(Chip)(({ theme, active }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: active ? THEME_COLOR : theme.palette.background.default,
  color: active ? '#fff' : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: active ? THEME_COLOR_DARK : theme.palette.grey[300]
  }
}));

const QuizStatistics = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date()
  });

  // สถิติข้อมูล
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    averageScore: 0,
    averageAccuracy: 0,
    averageTimePerQuestion: 0,
    categoryPerformance: [],
    timePerformance: [],
    recentQuizzes: [],
    difficultyDistribution: [],
    difficultWords: []
  });

  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // ดึงข้อมูลหมวดหมู่และสถิติ
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. ดึงข้อมูลหมวดหมู่
        const categoriesData = await getAllCategories();
        setCategories([{ id: 'all', title: 'ทั้งหมด' }, ...categoriesData]);

        // 2. ดึงข้อมูลสถิติทั่วไป
        const statisticsData = await getQuizStatistics({
          categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString()
        });

        // 3. ดึงข้อมูลแบบทดสอบล่าสุด
        const recentQuizzesData = await getRecentQuizzes();

        // 4. ดึงข้อมูลคำศัพท์ที่ตอบยาก
        const difficultWordsData = await getDifficultWords();

        // อัปเดตข้อมูลทั้งหมด
        setStats({
          ...statisticsData,
          recentQuizzes: recentQuizzesData,
          difficultWords: difficultWordsData
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching statistics data:', err);
        setError('ไม่สามารถโหลดข้อมูลสถิติได้ กรุณาลองใหม่ภายหลัง');
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, dateRange, refreshTrigger]);

  // จัดการเปลี่ยนแท็บ
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // จัดการเลือกหมวดหมู่
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // จัดการเลือกวันที่เริ่มต้น
  const handleStartDateChange = (date) => {
    setDateRange({
      ...dateRange,
      startDate: date
    });
  };

  // จัดการเลือกวันที่สิ้นสุด
  const handleEndDateChange = (date) => {
    setDateRange({
      ...dateRange,
      endDate: date
    });
  };

  // รีเฟรชข้อมูล
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // กลับไปหน้าหลัก
  const handleBackToDashboard = () => {
    navigate('/student/flashcards');
  };

  // เริ่มทำแบบทดสอบใหม่
  const handleStartNewQuiz = () => {
    navigate('/student/flashcards/quiz');
  };

  // แสดง tooltip สำหรับกราฟ
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          elevation={3}
          sx={{
            p: 1.5,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper
          }}
        >
          <Typography variant="subtitle2">{label}</Typography>
          {payload.map((entry, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <Box
                component="span"
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: entry.color,
                  mr: 1
                }}
              />
              <Typography variant="body2" color="textSecondary">
                {entry.name}: {entry.value}%
              </Typography>
            </Box>
          ))}
        </Paper>
      );
    }
    return null;
  };

  // แปลงวันที่เป็นรูปแบบที่อ่านง่าย
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // คำนวณความยากง่ายของแบบทดสอบ
  const quizDifficultyLevel = (accuracy) => {
    if (accuracy >= 90) return { text: 'ง่าย', color: theme.palette.success.main };
    if (accuracy >= 70) return { text: 'ปานกลาง', color: theme.palette.warning.main };
    return { text: 'ยาก', color: theme.palette.error.main };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: THEME_COLOR }} />
      </Box>
    );
  }

  // ข้อมูลจำลองสำหรับการทดสอบ (ถ้า API ยังไม่พร้อม)
  const mockTimeData = [
    { date: '1 พ.ค.', accuracy: 65, score: 70 },
    { date: '3 พ.ค.', accuracy: 75, score: 80 },
    { date: '6 พ.ค.', accuracy: 70, score: 75 },
    { date: '10 พ.ค.', accuracy: 80, score: 85 },
    { date: '14 พ.ค.', accuracy: 85, score: 90 },
    { date: '17 พ.ค.', accuracy: 90, score: 95 }
  ];

  const mockCategoryData = [
    { name: 'คำนาม', value: 85 },
    { name: 'คำกริยา', value: 70 },
    { name: 'คำคุณศัพท์', value: 90 },
    { name: 'คำศัพท์ทั่วไป', value: 75 }
  ];

  const mockDifficultyData = [
    { name: 'ง่าย', value: 45 },
    { name: 'ปานกลาง', value: 35 },
    { name: 'ยาก', value: 20 }
  ];

  // ใช้ข้อมูลจริงหรือข้อมูลจำลอง (ขึ้นกับ API)
  const timePerformanceData = stats.timePerformance && stats.timePerformance.length > 0 ? stats.timePerformance : mockTimeData;

  const categoryPerformanceData =
    stats.categoryPerformance && stats.categoryPerformance.length > 0 ? stats.categoryPerformance : mockCategoryData;

  const difficultyDistributionData =
    stats.difficultyDistribution && stats.difficultyDistribution.length > 0 ? stats.difficultyDistribution : mockDifficultyData;

  // สีสำหรับ pie chart
  const COLORS = ['#65c4b6', '#ff9f43', '#ee5253', '#5f27cd', '#10ac84', '#2e86de'];

  return (
    <MainCard title="สถิติการทำแบบทดสอบ">
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<IconArrowLeft />}
          onClick={handleBackToDashboard}
          sx={{ borderColor: THEME_COLOR, color: THEME_COLOR }}
        >
          กลับสู่หน้าหลัก
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <FilterSection>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>หมวดหมู่</InputLabel>
          <Select value={selectedCategory} label="หมวดหมู่" onChange={handleCategoryChange}>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="วันที่เริ่มต้น"
            value={dateRange.startDate}
            onChange={handleStartDateChange}
            slotProps={{ textField: { size: 'small', sx: { width: 180 } } }}
          />

          <DatePicker
            label="วันที่สิ้นสุด"
            value={dateRange.endDate}
            onChange={handleEndDateChange}
            slotProps={{ textField: { size: 'small', sx: { width: 180 } } }}
          />
        </LocalizationProvider>

        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Button
            variant="outlined"
            startIcon={<IconRefresh />}
            onClick={handleRefresh}
            sx={{ borderColor: THEME_COLOR, color: THEME_COLOR }}
          >
            รีเฟรช
          </Button>

          <Button
            variant="contained"
            startIcon={<IconBrain />}
            onClick={handleStartNewQuiz}
            sx={{ bgcolor: THEME_COLOR, '&:hover': { bgcolor: THEME_COLOR_DARK } }}
          >
            เริ่มทำแบบทดสอบใหม่
          </Button>
        </Box>
      </FilterSection>

      {/* สรุปสถิติ */}
      <Grid container spacing={gridSpacing} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <StyledCardContent>
              <Box sx={{ mb: 1 }}>
                <IconChartBar size={30} color={THEME_COLOR} />
              </Box>
              <StatNumber>{stats.totalQuizzes || 0}</StatNumber>
              <Typography variant="subtitle1">แบบทดสอบทั้งหมด</Typography>
            </StyledCardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <StyledCardContent>
              <Box sx={{ mb: 1 }}>
                <IconTarget size={30} color={theme.palette.warning.main} />
              </Box>
              <StatNumber color={theme.palette.warning.main}>{stats.averageAccuracy || 0}%</StatNumber>
              <Typography variant="subtitle1">ความแม่นยำเฉลี่ย</Typography>
            </StyledCardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <StyledCardContent>
              <Box sx={{ mb: 1 }}>
                <IconClockHour4 size={30} color={theme.palette.info.main} />
              </Box>
              <StatNumber color={theme.palette.info.main}>{stats.averageTimePerQuestion || 0}s</StatNumber>
              <Typography variant="subtitle1">เวลาเฉลี่ยต่อข้อ</Typography>
            </StyledCardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <StyledCardContent>
              <Box sx={{ mb: 1 }}>
                <IconCheck size={30} color={theme.palette.success.main} />
              </Box>
              <StatNumber color={theme.palette.success.main}>{stats.averageScore || 0}%</StatNumber>
              <Typography variant="subtitle1">คะแนนเฉลี่ย</Typography>
            </StyledCardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* แท็บสำหรับแสดงกราฟต่างๆ */}
      <Card sx={{ mb: 3 }}>
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
                backgroundColor: THEME_COLOR
              },
              '& .Mui-selected': {
                color: `${THEME_COLOR} !important`
              }
            }}
          >
            <Tab icon={<IconChartLine size={20} />} label="พัฒนาการตามเวลา" iconPosition="start" />
            <Tab icon={<IconChartPie size={20} />} label="ประสิทธิภาพตามหมวดหมู่" iconPosition="start" />
            <Tab icon={<IconBookmarks size={20} />} label="การกระจายตัวตามความยาก" iconPosition="start" />
          </Tabs>

          {/* กราฟพัฒนาการตามเวลา */}
          {tabValue === 0 && (
            <Box sx={{ height: 350 }}>
              <Typography variant="h4" gutterBottom>
                พัฒนาการการทำแบบทดสอบตามช่วงเวลา
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                กราฟแสดงคะแนนและความแม่นยำในการทำแบบทดสอบตามช่วงเวลา
              </Typography>

              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={timePerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="score" name="คะแนน" stroke={THEME_COLOR} strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="accuracy" name="ความแม่นยำ" stroke={theme.palette.warning.main} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}

          {/* กราฟประสิทธิภาพตามหมวดหมู่ */}
          {tabValue === 1 && (
            <Box sx={{ height: 350 }}>
              <Typography variant="h4" gutterBottom>
                ประสิทธิภาพการทำแบบทดสอบตามหมวดหมู่
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                แสดงความแม่นยำในการทำแบบทดสอบแยกตามหมวดหมู่คำศัพท์
              </Typography>

              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={categoryPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="value" name="ความแม่นยำ (%)" fill={THEME_COLOR} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}

          {/* กราฟการกระจายตัวตามความยาก */}
          {tabValue === 2 && (
            <Box sx={{ height: 350 }}>
              <Typography variant="h4" gutterBottom>
                การกระจายตัวตามระดับความยาก
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                แสดงสัดส่วนการทำแบบทดสอบตามระดับความยาก
              </Typography>

              <Grid container>
                <Grid item xs={12} md={8}>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={difficultyDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {difficultyDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      ระดับความยากของแบบทดสอบ
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {difficultyDistributionData.map((item, index) => (
                      <ProgressBarWrapper key={index}>
                        <ProgressLabel variant="body2">{item.name}:</ProgressLabel>
                        <Box sx={{ flex: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={item.value}
                            sx={{
                              height: 8,
                              borderRadius: 5,
                              backgroundColor: theme.palette.grey[200],
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: COLORS[index % COLORS.length]
                              }
                            }}
                          />
                        </Box>
                        <ProgressValue variant="body2">{item.value}%</ProgressValue>
                      </ProgressBarWrapper>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* แสดงตารางแบบทดสอบล่าสุด */}
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} md={7}>
          <StyledCard>
            <StyledCardContent>
              <Typography variant="h4" gutterBottom>
                แบบทดสอบล่าสุด
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {stats.recentQuizzes && stats.recentQuizzes.length > 0 ? (
                <TableContainer component={Paper} sx={{ maxHeight: 350, mb: 2 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>วันที่</TableCell>
                        <TableCell>หมวดหมู่</TableCell>
                        <TableCell align="center">คะแนน</TableCell>
                        <TableCell align="center">ความแม่นยำ</TableCell>
                        <TableCell align="center">เวลาเฉลี่ย</TableCell>
                        <TableCell align="center">ความยาก</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.recentQuizzes.map((quiz, index) => {
                        const difficulty = quizDifficultyLevel(quiz.accuracy);
                        return (
                          <TableRow key={index} hover>
                            <TableCell>{formatDate(quiz.date)}</TableCell>
                            <TableCell>{quiz.category}</TableCell>
                            <TableCell align="center">{quiz.score}%</TableCell>
                            <TableCell align="center">{quiz.accuracy}%</TableCell>
                            <TableCell align="center">{quiz.avgTime}s</TableCell>
                            <TableCell align="center">
                              <Chip
                                label={difficulty.text}
                                size="small"
                                sx={{
                                  bgcolor: `${difficulty.color}20`,
                                  color: difficulty.color,
                                  fontWeight: 500
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="textSecondary">
                    ยังไม่มีประวัติการทำแบบทดสอบ
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2, bgcolor: THEME_COLOR, '&:hover': { bgcolor: THEME_COLOR_DARK } }}
                    onClick={handleStartNewQuiz}
                  >
                    เริ่มทำแบบทดสอบ
                  </Button>
                </Box>
              )}

              {stats.recentQuizzes && stats.recentQuizzes.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button variant="outlined" endIcon={<IconDeviceFloppy />} sx={{ borderColor: THEME_COLOR, color: THEME_COLOR, mr: 1 }}>
                    บันทึกรายงาน
                  </Button>
                  <Button variant="outlined" endIcon={<IconShare />} sx={{ borderColor: THEME_COLOR, color: THEME_COLOR }}>
                    แชร์ผลลัพธ์
                  </Button>
                </Box>
              )}
            </StyledCardContent>
          </StyledCard>
        </Grid>

        {/* แสดงคำศัพท์ที่ตอบผิดบ่อย */}
        <Grid item xs={12} md={5}>
          <StyledCard>
            <StyledCardContent>
              <Typography variant="h4" gutterBottom>
                คำศัพท์ที่ตอบผิดบ่อย
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {stats.difficultWords && stats.difficultWords.length > 0 ? (
                <TableContainer sx={{ maxHeight: 350, mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>คำศัพท์</TableCell>
                        <TableCell>ความหมาย</TableCell>
                        <TableCell align="center">ความถี่ที่ตอบผิด</TableCell>
                        <TableCell align="center">ความแม่นยำ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.difficultWords.map((word, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {word.word}
                              </Typography>
                              <Tooltip title="ฟังเสียง">
                                <IconButton size="small" color="primary">
                                  <IconVolume size={16} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                          <TableCell>{word.meaning}</TableCell>
                          <TableCell align="center">{word.wrongCount}x</TableCell>
                          <TableCell align="center">
                            <LinearProgress
                              variant="determinate"
                              value={word.accuracy}
                              sx={{
                                height: 6,
                                borderRadius: 5,
                                width: 70,
                                mx: 'auto',
                                backgroundColor: theme.palette.grey[200],
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor:
                                    word.accuracy < 30
                                      ? theme.palette.error.main
                                      : word.accuracy < 60
                                        ? theme.palette.warning.main
                                        : theme.palette.success.main
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="textSecondary">
                    ยังไม่มีข้อมูลคำศัพท์ที่ตอบผิดบ่อย
                  </Typography>
                </Box>
              )}

              {stats.difficultWords && stats.difficultWords.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: THEME_COLOR, '&:hover': { bgcolor: THEME_COLOR_DARK } }}
                    onClick={() => navigate('/student/flashcards/review')}
                  >
                    ทบทวนคำศัพท์ยาก
                  </Button>
                </Box>
              )}
            </StyledCardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default QuizStatistics;
