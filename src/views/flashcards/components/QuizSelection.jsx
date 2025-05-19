import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  Slider,
  Chip,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import {
  IconBrain,
  IconCategory,
  IconClock,
  IconArrowRight,
  IconStar,
  IconAbc,
  IconNumber,
  IconRefresh,
  IconChartBar,
  IconStarFilled
} from '@tabler/icons-react';
import { getAllCategories } from '../../component/function/flashcard.service';

// กำหนดค่าสีธีม
const THEME_COLOR = '#65c4b6';
const THEME_COLOR_DARK = '#55b4a6';
const THEME_COLOR_LIGHT = '#e5f5f2';

// สร้าง Styled Components
const OptionCard = styled(Paper)(({ theme, selected }) => ({
  padding: theme.spacing(2),
  borderRadius: 10,
  cursor: 'pointer',
  border: selected ? `2px solid ${THEME_COLOR}` : '2px solid transparent',
  backgroundColor: selected ? THEME_COLOR_LIGHT : theme.palette.background.paper,
  transition: 'all 0.2s ease',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100%',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transform: 'translateY(-4px)'
  }
}));

const DifficultyChip = styled(Chip)(({ theme, level }) => {
  const getColor = () => {
    switch (level) {
      case 'easy':
        return theme.palette.success;
      case 'medium':
        return theme.palette.warning;
      case 'hard':
        return theme.palette.error;
      default:
        return theme.palette.primary;
    }
  };

  const color = getColor();

  return {
    backgroundColor: color.light,
    color: color.dark,
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: color.main,
      color: '#fff'
    }
  };
});

const QuizSelection = ({ onStartQuiz }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // สถานะสำหรับตัวเลือกแบบทดสอบ
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quizType, setQuizType] = useState('all');
  const [questionCount, setQuestionCount] = useState(10);
  const [timePerQuestion, setTimePerQuestion] = useState(20);
  const [difficulty, setDifficulty] = useState('all');
  const [categories, setCategories] = useState([]);

  // โหลดข้อมูลหมวดหมู่เมื่อเริ่มต้น
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getAllCategories();

        // จัดรูปแบบข้อมูลหมวดหมู่
        const formattedCategories = [
          { id: 'all', title: 'ทุกหมวดหมู่', count: response.reduce((sum, cat) => sum + cat.cardCount, 0), color: THEME_COLOR },
          ...response.map((cat) => ({
            id: cat._id,
            title: cat.title,
            count: cat.cardCount || 0,
            color: cat.color || '#4caf50'
          }))
        ];

        setCategories(formattedCategories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('ไม่สามารถโหลดข้อมูลหมวดหมู่ได้');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ฟังก์ชันเริ่มทำแบบทดสอบ
  const handleStartQuiz = () => {
    setLoading(true);
    setError(null);

    try {
      // สร้างข้อมูลสำหรับส่งไป API
      const quizData = {
        categoryId: selectedCategory,
        questionCount,
        timePerQuestion,
        difficulty,
        quizType
      };

      // ส่งข้อมูลกลับไปยังคอมโพเนนต์หลัก
      if (onStartQuiz) {
        onStartQuiz(quizData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error creating quiz:', error);
      setError('เกิดข้อผิดพลาดในการสร้างแบบทดสอบ กรุณาลองใหม่อีกครั้ง');
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        สร้างแบบทดสอบคำศัพท์
      </Typography>

      <Typography variant="body1" color="textSecondary" paragraph>
        เลือกรูปแบบแบบทดสอบที่คุณต้องการ เพื่อทดสอบความรู้คำศัพท์ของคุณ
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <IconCategory size={24} style={{ color: THEME_COLOR, marginRight: 8 }} />
            เลือกหมวดหมู่คำศัพท์
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress sx={{ color: THEME_COLOR }} />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {categories.map((category) => (
                <Grid item xs={12} sm={6} md={4} key={category.id}>
                  <OptionCard selected={selectedCategory === category.id} onClick={() => setSelectedCategory(category.id)}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        bgcolor: category.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        mb: 2
                      }}
                    >
                      {category.title.charAt(0)}
                    </Box>
                    <Typography variant="h6" align="center" gutterBottom>
                      {category.title}
                    </Typography>
                    <Chip
                      label={`${category.count} คำ`}
                      size="small"
                      sx={{
                        bgcolor: category.color,
                        color: '#fff'
                      }}
                    />
                  </OptionCard>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <IconBrain size={24} style={{ color: THEME_COLOR, marginRight: 8 }} />
                รูปแบบแบบทดสอบ
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup value={quizType} onChange={(e) => setQuizType(e.target.value)}>
                  <FormControlLabel
                    value="all"
                    control={
                      <Radio
                        sx={{
                          '&.Mui-checked': {
                            color: THEME_COLOR
                          }
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconAbc size={20} style={{ marginRight: 8 }} />
                        <Typography variant="body1">คำศัพท์ทั้งหมด</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="studied"
                    control={
                      <Radio
                        sx={{
                          '&.Mui-checked': {
                            color: THEME_COLOR
                          }
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconRefresh size={20} style={{ marginRight: 8 }} />
                        <Typography variant="body1">เฉพาะคำที่ท่องแล้ว</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="favorite"
                    control={
                      <Radio
                        sx={{
                          '&.Mui-checked': {
                            color: THEME_COLOR
                          }
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconStarFilled size={20} style={{ marginRight: 8, color: theme.palette.warning.main }} />
                        <Typography variant="body1">เฉพาะคำโปรด</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="difficult"
                    control={
                      <Radio
                        sx={{
                          '&.Mui-checked': {
                            color: THEME_COLOR
                          }
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconChartBar size={20} style={{ marginRight: 8, color: theme.palette.error.main }} />
                        <Typography variant="body1">คำศัพท์ที่ยากสำหรับคุณ</Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>

              <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                <IconStar size={24} style={{ color: THEME_COLOR, marginRight: 8 }} />
                ระดับความยาก
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <DifficultyChip
                  label="ทุกระดับ"
                  level="all"
                  clickable
                  onClick={() => setDifficulty('all')}
                  variant={difficulty === 'all' ? 'filled' : 'outlined'}
                />
                <DifficultyChip
                  label="ง่าย"
                  level="easy"
                  clickable
                  onClick={() => setDifficulty('easy')}
                  variant={difficulty === 'easy' ? 'filled' : 'outlined'}
                />
                <DifficultyChip
                  label="ปานกลาง"
                  level="medium"
                  clickable
                  onClick={() => setDifficulty('medium')}
                  variant={difficulty === 'medium' ? 'filled' : 'outlined'}
                />
                <DifficultyChip
                  label="ยาก"
                  level="hard"
                  clickable
                  onClick={() => setDifficulty('hard')}
                  variant={difficulty === 'hard' ? 'filled' : 'outlined'}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <IconNumber size={24} style={{ color: THEME_COLOR, marginRight: 8 }} />
                จำนวนคำถาม
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ px: 2, mb: 3 }}>
                <Slider
                  value={questionCount}
                  onChange={(e, newValue) => setQuestionCount(newValue)}
                  min={5}
                  max={30}
                  step={5}
                  marks={[
                    { value: 5, label: '5' },
                    { value: 10, label: '10' },
                    { value: 15, label: '15' },
                    { value: 20, label: '20' },
                    { value: 25, label: '25' },
                    { value: 30, label: '30' }
                  ]}
                  valueLabelDisplay="on"
                  sx={{
                    '& .MuiSlider-rail': { bgcolor: THEME_COLOR_LIGHT },
                    '& .MuiSlider-track': { bgcolor: THEME_COLOR },
                    '& .MuiSlider-thumb': {
                      bgcolor: THEME_COLOR,
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: `0px 0px 0px 8px ${THEME_COLOR}33`
                      }
                    },
                    '& .MuiSlider-valueLabel': { bgcolor: THEME_COLOR }
                  }}
                />
              </Box>

              <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                <IconClock size={24} style={{ color: THEME_COLOR, marginRight: 8 }} />
                เวลาต่อคำถาม (วินาที)
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ px: 2 }}>
                <Slider
                  value={timePerQuestion}
                  onChange={(e, newValue) => setTimePerQuestion(newValue)}
                  min={10}
                  max={60}
                  step={5}
                  marks={[
                    { value: 10, label: '10' },
                    { value: 20, label: '20' },
                    { value: 30, label: '30' },
                    { value: 40, label: '40' },
                    { value: 50, label: '50' },
                    { value: 60, label: '60' }
                  ]}
                  valueLabelDisplay="on"
                  sx={{
                    '& .MuiSlider-rail': { bgcolor: THEME_COLOR_LIGHT },
                    '& .MuiSlider-track': { bgcolor: THEME_COLOR },
                    '& .MuiSlider-thumb': {
                      bgcolor: THEME_COLOR,
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: `0px 0px 0px 8px ${THEME_COLOR}33`
                      }
                    },
                    '& .MuiSlider-valueLabel': { bgcolor: THEME_COLOR }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleStartQuiz}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <IconBrain />}
          endIcon={<IconArrowRight />}
          sx={{
            bgcolor: THEME_COLOR,
            '&:hover': {
              bgcolor: THEME_COLOR_DARK
            },
            px: 4,
            py: 1.5,
            fontSize: '1.1rem'
          }}
        >
          {loading ? 'กำลังสร้างแบบทดสอบ...' : 'เริ่มทำแบบทดสอบ'}
        </Button>
      </Box>
    </Box>
  );
};

export default QuizSelection;
