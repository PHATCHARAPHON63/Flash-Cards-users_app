import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  useTheme,
  CircularProgress,
  Paper,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
  Fade,
  FormHelperText,
  Alert,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import {
  IconArrowRight,
  IconCheck,
  IconX,
  IconClockHour4,
  IconBrain,
  IconTrophy,
  IconTarget,
  IconVolume2,
  IconAlertCircle,
  IconArrowLeft,
  IconRefresh,
  IconCategory
} from '@tabler/icons-react';
import { styled } from '@mui/material/styles';
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import { createQuiz, submitQuizResult, getAllCategories } from '../../component/function/flashcard.service';

// กำหนดสีธีม
const THEME_COLOR = '#65c4b6';
const THEME_COLOR_DARK = '#55b4a6';
const THEME_COLOR_LIGHT = '#e5f5f2';

// Styled Components
const QuizCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 15,
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  overflow: 'visible'
}));

const OptionButton = styled(FormControlLabel)(({ theme, selected, isCorrect, isWrong, disabled }) => ({
  width: '100%',
  margin: theme.spacing(1, 0),
  padding: theme.spacing(1.5, 2),
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s',
  '& .MuiFormControlLabel-label': {
    width: '100%',
    fontWeight: selected ? 600 : 400
  },
  backgroundColor: isCorrect
    ? `${theme.palette.success.light}80`
    : isWrong
      ? `${theme.palette.error.light}80`
      : selected
        ? THEME_COLOR_LIGHT
        : theme.palette.background.paper,
  boxShadow: selected && !disabled ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
  pointerEvents: disabled ? 'none' : 'auto',
  '&:hover': {
    backgroundColor: disabled
      ? isCorrect
        ? `${theme.palette.success.light}80`
        : isWrong
          ? `${theme.palette.error.light}80`
          : theme.palette.background.paper
      : selected
        ? THEME_COLOR_LIGHT
        : theme.palette.grey[100],
    transform: disabled ? 'none' : 'translateY(-2px)',
    boxShadow: disabled ? 'none' : '0 4px 8px rgba(0,0,0,0.1)'
  }
}));

const TimerBar = styled(LinearProgress)(({ theme, value }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    backgroundColor: value > 66 ? theme.palette.success.main : value > 33 ? theme.palette.warning.main : theme.palette.error.main
  }
}));

const FlashcardQuiz = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [questionCount, setQuestionCount] = useState(5);
  const [quizConfigured, setQuizConfigured] = useState(false);

  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answered, setAnswered] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState([]);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [timer, setTimer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // โหลดข้อมูลหมวดหมู่
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('ไม่สามารถโหลดหมวดหมู่คำศัพท์ได้ กรุณาลองใหม่อีกครั้ง');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // สร้างแบบทดสอบจาก API
  const handleCreateQuiz = async () => {
    try {
      setLoading(true);
      setError(null);

      const quizResponse = await createQuiz({
        categoryId: categoryId || undefined,
        questionCount: questionCount,
        timePerQuestion: 20 // สามารถปรับเวลาได้ตามต้องการ
      });

      setQuizData(quizResponse);
      setTimeLeft(quizResponse.timePerQuestion);
      setQuizConfigured(true);
      setLoading(false);
    } catch (error) {
      console.error('Error creating quiz:', error);
      setError('ไม่สามารถสร้างแบบทดสอบได้ กรุณาลองใหม่อีกครั้ง');
      setLoading(false);
    }
  };

  // ตั้งเวลาเมื่อเริ่มคำถามใหม่
  useEffect(() => {
    if (!quizData || quizCompleted || answered || !quizConfigured) return;

    // ตั้งเวลานับถอยหลัง
    const countdown = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdown);
          // ถ้าเวลาหมดและยังไม่ได้ตอบ ให้บันทึกว่าตอบผิด
          if (!answered) {
            handleTimeout();
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    setTimer(countdown);

    // Cleanup
    return () => {
      clearInterval(countdown);
    };
  }, [quizData, currentQuestionIndex, answered, quizCompleted, quizConfigured]);

  // อ่านคำศัพท์
  const speak = (text) => {
    if ('speechSynthesis' in window && !speaking) {
      setSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.onend = () => {
        setSpeaking(false);
      };
      speechSynthesis.speak(utterance);
    }
  };

  // จัดการเมื่อเลือกคำตอบ
  const handleAnswerSelect = (option) => {
    if (answered) return;
    setSelectedAnswer(option);
  };

  // จัดการเมื่อยืนยันคำตอบ
  const handleAnswerSubmit = () => {
    if (!selectedAnswer || answered) return;

    const currentQuestion = quizData.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    // บันทึกผลลัพธ์
    const result = {
      questionId: currentQuestion.id,
      word: currentQuestion.word,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeUsed: quizData.timePerQuestion - timeLeft
    };

    setResults([...results, result]);

    // อัปเดตคะแนน
    if (isCorrect) {
      setScore(score + 1);
    }

    setAnswered(true);

    // หยุดเวลา
    if (timer) {
      clearInterval(timer);
    }
  };

  // จัดการเมื่อเวลาหมด
  const handleTimeout = () => {
    const currentQuestion = quizData.questions[currentQuestionIndex];

    // บันทึกผลลัพธ์ (ไม่ได้ตอบ)
    const result = {
      questionId: currentQuestion.id,
      word: currentQuestion.word,
      userAnswer: '',
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: false,
      timeUsed: quizData.timePerQuestion
    };

    setResults([...results, result]);
    setAnswered(true);
  };

  // ไปคำถามถัดไป
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setAnswered(false);
      setTimeLeft(quizData.timePerQuestion);
      setShowExplanation(false);
    } else {
      // จบแบบทดสอบ
      setQuizCompleted(true);
      submitResults();
    }
  };

  // ส่งผลการทดสอบไปยัง API
  const submitResults = async () => {
    try {
      setIsSubmitting(true);
      await submitQuizResult({
        results,
        totalTime: results.reduce((sum, result) => sum + result.timeUsed, 0)
      });
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error submitting quiz results:', error);
      setIsSubmitting(false);
    }
  };

  // เริ่มทำแบบทดสอบใหม่
  const handleRestartQuiz = () => {
    setQuizConfigured(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setAnswered(false);
    setQuizCompleted(false);
    setTimeLeft(0);
    setResults([]);
    setScore(0);
    setShowExplanation(false);
    setQuizData(null);
    setCategoryId('');
    setQuestionCount(5);
  };

  // กลับไปหน้าหลัก
  const handleBackToDashboard = () => {
    navigate('/student/flashcards');
  };

  // แสดงคำอธิบาย
  const handleShowExplanation = () => {
    setShowExplanation(true);
  };

  // หน้าเลือกการตั้งค่าแบบทดสอบ
  if (!quizConfigured) {
    return (
      <MainCard title="สร้างแบบทดสอบคำศัพท์">
        {loading && !error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress sx={{ color: THEME_COLOR }} />
          </Box>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                startIcon={<IconArrowLeft />}
                onClick={handleBackToDashboard}
                sx={{ borderColor: THEME_COLOR, color: THEME_COLOR }}
              >
                กลับไปยังหน้าหลัก
              </Button>
            </Box>

            <Paper sx={{ p: 3, mb: 3, maxWidth: 600, mx: 'auto' }}>
              <Typography variant="h4" gutterBottom>
                ตั้งค่าแบบทดสอบ
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>หมวดหมู่คำศัพท์</InputLabel>
                    <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} label="หมวดหมู่คำศัพท์">
                      <MenuItem value="">ทุกหมวดหมู่</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.title}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>เลือกหมวดหมู่คำศัพท์ที่ต้องการทดสอบ หรือเลือก "ทุกหมวดหมู่" เพื่อทดสอบคำศัพท์ทั้งหมด</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>จำนวนคำถาม</InputLabel>
                    <Select value={questionCount} onChange={(e) => setQuestionCount(e.target.value)} label="จำนวนคำถาม">
                      <MenuItem value={5}>5 คำถาม</MenuItem>
                      <MenuItem value={10}>10 คำถาม</MenuItem>
                      <MenuItem value={15}>15 คำถาม</MenuItem>
                      <MenuItem value={20}>20 คำถาม</MenuItem>
                    </Select>
                    <FormHelperText>เลือกจำนวนคำถามในแบบทดสอบ</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleCreateQuiz}
                  disabled={loading}
                  sx={{
                    minWidth: 200,
                    bgcolor: THEME_COLOR,
                    '&:hover': { bgcolor: THEME_COLOR_DARK },
                    '&.Mui-disabled': { bgcolor: theme.palette.grey[300] }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'เริ่มทำแบบทดสอบ'}
                </Button>
              </Box>
            </Paper>

            <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
              <Alert severity="info" icon={<IconCategory size={24} />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  เกี่ยวกับแบบทดสอบ
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  แบบทดสอบนี้จะสุ่มคำศัพท์จากหมวดหมู่ที่คุณเลือก แต่ละคำถามมีเวลาจำกัดในการตอบ
                  โดยคุณต้องเลือกความหมายที่ถูกต้องของคำศัพท์ที่ปรากฏ
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  ผลการทดสอบจะถูกบันทึกเพื่อช่วยในการปรับระดับความยากของคำศัพท์ในการทบทวนครั้งต่อไป
                </Typography>
              </Alert>
            </Box>
          </>
        )}
      </MainCard>
    );
  }

  if (loading && !quizData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: THEME_COLOR }} />
      </Box>
    );
  }

  if (error) {
    return (
      <MainCard title="แบบทดสอบคำศัพท์">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={handleBackToDashboard}>
              กลับหน้าหลัก
            </Button>
            <Button variant="contained" onClick={handleRestartQuiz} sx={{ bgcolor: THEME_COLOR, '&:hover': { bgcolor: THEME_COLOR_DARK } }}>
              เริ่มใหม่
            </Button>
          </Box>
        </Box>
      </MainCard>
    );
  }

  // หน้าแสดงผลคะแนน
  if (quizCompleted) {
    const accuracy = Math.round((score / quizData.questions.length) * 100);
    const avgTimePerQuestion = Math.round(results.reduce((sum, result) => sum + result.timeUsed, 0) / results.length);

    return (
      <MainCard title="ผลการทดสอบ">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Paper
            sx={{
              p: 3,
              maxWidth: 700,
              mx: 'auto',
              mb: 4,
              background: `linear-gradient(135deg, ${THEME_COLOR_LIGHT} 0%, ${THEME_COLOR} 100%)`,
              color: '#fff',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                width: 120,
                height: 120,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                top: -30,
                right: -30
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                bottom: -20,
                left: 30
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h3" gutterBottom>
                {quizData.title}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap', my: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h1" sx={{ fontSize: '3.5rem', fontWeight: 600 }}>
                    {score}/{quizData.questions.length}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    คะแนน
                  </Typography>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h1" sx={{ fontSize: '3.5rem', fontWeight: 600 }}>
                    {accuracy}%
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    ความแม่นยำ
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          <Grid container spacing={3} sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <IconBrain size={32} style={{ color: THEME_COLOR, marginBottom: 8 }} />
                <Typography variant="h4" gutterBottom>
                  {score}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  คำศัพท์ที่ตอบถูก
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <IconClockHour4 size={32} style={{ color: theme.palette.warning.main, marginBottom: 8 }} />
                <Typography variant="h4" gutterBottom>
                  {avgTimePerQuestion}s
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  เวลาเฉลี่ยต่อข้อ
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <IconTarget size={32} style={{ color: theme.palette.success.main, marginBottom: 8 }} />
                <Typography variant="h4" gutterBottom>
                  {accuracy}%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  อัตราความแม่นยำ
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 3 }}>
            สรุปผลการทดสอบ
          </Typography>

          <Paper sx={{ p: 3, maxWidth: 700, mx: 'auto', mb: 4 }}>
            <Grid container spacing={1}>
              {results.map((result, index) => (
                <Grid item xs={12} key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 1.5,
                      backgroundColor: result.isCorrect ? 'rgba(76, 175, 80, 0.08)' : 'rgba(244, 67, 54, 0.08)',
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    <Box
                      sx={{
                        minWidth: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: result.isCorrect ? 'success.light' : 'error.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      {result.isCorrect ? (
                        <IconCheck size={18} color={theme.palette.success.dark} />
                      ) : (
                        <IconX size={18} color={theme.palette.error.dark} />
                      )}
                    </Box>

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {result.word}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {result.isCorrect
                          ? 'ตอบถูก'
                          : `ตอบผิด (คำตอบที่ถูกต้อง: ${quizData.questions.find((q) => q.id === result.questionId).options.find((o) => o.id === result.correctAnswer).text})`}
                      </Typography>
                    </Box>

                    <Chip
                      label={`${result.timeUsed}s`}
                      size="small"
                      sx={{
                        bgcolor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="outlined" size="large" onClick={handleBackToDashboard} sx={{ minWidth: 180 }}>
              กลับหน้าหลัก
            </Button>
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={handleRestartQuiz}
              startIcon={<IconRefresh />}
              sx={{ minWidth: 180, bgcolor: THEME_COLOR, '&:hover': { bgcolor: THEME_COLOR_DARK } }}
            >
              ทำแบบทดสอบอีกครั้ง
            </Button>
          </Box>
        </Box>
      </MainCard>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const timePercentage = (timeLeft / quizData.timePerQuestion) * 100;

  return (
    <MainCard title="แบบทดสอบคำศัพท์">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h4">{quizData.title}</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip label={`${currentQuestionIndex + 1}/${quizData.questions.length}`} color="primary" variant="outlined" sx={{ mr: 1 }} />
              <Chip label={`คะแนน: ${score}`} color="primary" sx={{ fontWeight: 500, bgcolor: THEME_COLOR, color: 'white' }} />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            <TimerBar variant="determinate" value={timePercentage} sx={{ mb: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="textSecondary">
                เวลาที่เหลือ
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {timeLeft} วินาที
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <QuizCard>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                  <Typography variant="h2" sx={{ mb: 1, fontWeight: 600 }}>
                    {currentQuestion.word}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    {currentQuestion.phonetic}
                  </Typography>
                </Box>

                <IconButton
                  color="primary"
                  onClick={() => speak(currentQuestion.word)}
                  disabled={speaking}
                  sx={{
                    backgroundColor: THEME_COLOR_LIGHT,
                    '&:hover': {
                      backgroundColor: THEME_COLOR,
                      color: '#fff'
                    }
                  }}
                >
                  <IconVolume2 size={22} />
                </IconButton>
              </Box>

              <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
                {currentQuestion.question}
              </Typography>

              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup value={selectedAnswer} onChange={(e) => handleAnswerSelect(e.target.value)}>
                  {currentQuestion.options.map((option) => (
                    <OptionButton
                      key={option.id}
                      value={option.id}
                      control={<Radio />}
                      label={option.text}
                      selected={selectedAnswer === option.id}
                      isCorrect={answered && option.id === currentQuestion.correctAnswer}
                      isWrong={answered && selectedAnswer === option.id && option.id !== currentQuestion.correctAnswer}
                      disabled={answered}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              {answered && (
                <Fade in={true}>
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    {selectedAnswer === currentQuestion.correctAnswer ? (
                      <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                        <Typography variant="subtitle1" color="success.dark" sx={{ fontWeight: 600 }}>
                          ถูกต้อง! 🎉
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 2 }}>
                        <Typography variant="subtitle1" color="error.dark" sx={{ fontWeight: 600, mb: 1 }}>
                          ไม่ถูกต้อง
                        </Typography>
                        <Typography variant="body2" color="error.dark">
                          คำตอบที่ถูกต้องคือ: {currentQuestion.options.find((o) => o.id === currentQuestion.correctAnswer).text}
                        </Typography>
                      </Box>
                    )}

                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={handleShowExplanation}
                      sx={{ mt: 2, borderColor: THEME_COLOR, color: THEME_COLOR }}
                      startIcon={<IconAlertCircle size={16} />}
                    >
                      ดูตัวอย่างประโยค
                    </Button>
                  </Box>
                </Fade>
              )}
            </CardContent>
          </QuizCard>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="outlined" onClick={handleBackToDashboard} sx={{ borderColor: THEME_COLOR, color: THEME_COLOR }}>
              ยกเลิกการทดสอบ
            </Button>

            {!answered ? (
              <Button
                variant="contained"
                onClick={handleAnswerSubmit}
                disabled={!selectedAnswer}
                sx={{ bgcolor: THEME_COLOR, '&:hover': { bgcolor: THEME_COLOR_DARK } }}
              >
                ยืนยันคำตอบ
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNextQuestion}
                endIcon={<IconArrowRight size={18} />}
                sx={{ bgcolor: THEME_COLOR, '&:hover': { bgcolor: THEME_COLOR_DARK } }}
              >
                {currentQuestionIndex === quizData.questions.length - 1 ? 'ดูผลคะแนน' : 'ข้อถัดไป'}
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Dialog แสดงตัวอย่างประโยค */}
      <Dialog open={showExplanation} onClose={() => setShowExplanation(false)} maxWidth="sm" fullWidth>
        <DialogTitle>ตัวอย่างประโยค</DialogTitle>
        <DialogContent>
          <Typography variant="h5" gutterBottom>
            {currentQuestion.word} {currentQuestion.phonetic}
          </Typography>
          <Typography variant="body1" gutterBottom>
            ความหมาย: {currentQuestion.options.find((o) => o.id === currentQuestion.correctAnswer).text}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            ตัวอย่างประโยค:
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: theme.palette.background.neutral || theme.palette.grey[50],
              borderRadius: 2
            }}
          >
            <Typography variant="body1">{currentQuestion.example || 'ไม่มีตัวอย่างประโยคสำหรับคำศัพท์นี้'}</Typography>
          </Paper>
          {currentQuestion.example && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                startIcon={<IconVolume2 />}
                variant="outlined"
                onClick={() => speak(currentQuestion.example)}
                disabled={speaking}
                sx={{ borderColor: THEME_COLOR, color: THEME_COLOR }}
              >
                ฟังตัวอย่างประโยค
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExplanation(false)} sx={{ color: THEME_COLOR }}>
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default FlashcardQuiz;
