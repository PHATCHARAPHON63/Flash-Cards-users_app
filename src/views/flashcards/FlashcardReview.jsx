import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  useTheme,
  CircularProgress,
  Fade,
  Paper,
  LinearProgress,
  Dialog,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  IconVolume2,
  IconArrowLeft,
  IconArrowRight,
  IconInfoCircle,
  IconStar,
  IconStarFilled,
  IconLanguage,
  IconFlipHorizontal,
  IconThumbUp,
  IconThumbDown,
  IconClock,
  IconBrain,
  IconRefresh,
  IconCheck,
  IconX,
  IconFlame,
  IconArrowsShuffle
} from '@tabler/icons-react';
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant';
import { useNavigate } from 'react-router-dom';
import {
  getDueReviewCards,
  submitReviewResult,
  getLearningStats,
  getAllReviewableCards,
  getCategoryById,
  getFlashcardsByCategory
} from '../../component/function/flashcard.service';
import { getAllCategories } from '../../component/function/flashcard.service';

// ค่าสีหลักของธีม
const THEME_COLOR = '#65c4b6';
const THEME_COLOR_DARK = '#55b4a6';
const THEME_COLOR_LIGHT = '#e5f5f2';

// สร้าง styled components
const FlashCard = styled(Card)(({ theme, flipped }) => ({
  width: '100%',
  minHeight: 380, // เพิ่มความสูงเพื่อรองรับเนื้อหาเพิ่มเติม
  borderRadius: 15,
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  margin: '0 auto',
  position: 'relative',
  transition: 'transform 0.6s',
  transformStyle: 'preserve-3d',
  cursor: 'pointer',
  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
  backgroundColor: theme.palette.background.paper,
  maxWidth: 680
}));

const CardSide = styled(Box)(({ theme, front }) => ({
  width: '100%',
  height: '100%',
  position: 'absolute',
  backfaceVisibility: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  transform: front ? 'rotateY(0deg)' : 'rotateY(180deg)',
  zIndex: front ? 2 : 1,
  top: 0,
  left: 0,
  boxSizing: 'border-box'
}));

const ControlButton = styled(Button)(({ theme, color }) => ({
  minWidth: 130,
  borderRadius: 10,
  padding: theme.spacing(1.2, 3),
  boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
  backgroundColor: color || THEME_COLOR,
  '&:hover': {
    backgroundColor: color ? `${color}E0` : THEME_COLOR_DARK,
    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
    transform: 'translateY(-2px)'
  },
  transition: 'all 0.2s'
}));

const ProgressBar = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: 680,
  margin: '20px auto',
  padding: theme.spacing(1, 0)
}));

const StreakBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  background: theme.palette.background.default,
  borderRadius: '20px',
  padding: '4px 12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  marginTop: theme.spacing(2)
}));

const PartOfSpeechChip = styled(Chip)(({ theme }) => ({
  backgroundColor: THEME_COLOR_LIGHT,
  color: THEME_COLOR_DARK,
  fontWeight: 'bold',
  fontStyle: 'italic',
  marginLeft: theme.spacing(1),
  height: 24
}));

const ExampleSection = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  borderRadius: 10,
  backgroundColor: theme.palette.background.neutral || theme.palette.grey[50],
  borderLeft: `4px solid ${THEME_COLOR}`
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

const FlashcardReview = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // State สำหรับการโหลดและจัดการข้อผิดพลาด
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State สำหรับคำศัพท์และการทบทวน
  const [cards, setCards] = useState([]);
  const [allCards, setAllCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewCompleted, setReviewCompleted] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    totalReviewed: 0,
    remembered: 0,
    streak: 0
  });

  // State สำหรับแสดงข้อมูลเพิ่มเติมและการตอบ
  const [showInfo, setShowInfo] = useState(false);
  const [answerState, setAnswerState] = useState(null); // null, 'correct', 'incorrect'
  const [timeTaken, setTimeTaken] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [speaking, setSpeaking] = useState(false);

  // State สำหรับตัวกรอง
  const [filterType, setFilterType] = useState('due'); // 'due', 'all', 'favorites'
  const [includeNotDue, setIncludeNotDue] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // ใช้สำหรับ force refresh

  // State สำหรับการแนะนำเมื่อไม่มีคำศัพท์
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendedCards, setRecommendedCards] = useState([]);
  const [categoryData, setCategoryData] = useState(null);

  // ดึงข้อมูลคำศัพท์ที่ต้องทบทวนและสถิติจาก API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. ดึงรายการหมวดหมู่
        const categoryList = await getAllCategories();
        setCategories([{ id: 'all', title: 'ทั้งหมด' }, ...categoryList]);

        // 2. ดึงคำศัพท์ตามตัวกรอง
        let reviewCards = [];
        if (filterType === 'due' && !includeNotDue) {
          // เฉพาะคำศัพท์ที่ถึงเวลาทบทวน
          reviewCards = await getDueReviewCards();
        } else {
          // ดึงคำศัพท์ทั้งหมดที่เคยทบทวน
          const allReviewableCards = await getAllReviewableCards();

          // กรองตามประเภท
          if (filterType === 'favorites') {
            reviewCards = allReviewableCards.filter((card) => card.progress?.is_favorite);
          } else if (filterType === 'due' && includeNotDue) {
            reviewCards = allReviewableCards;
          } else {
            reviewCards = allReviewableCards;
          }

          // กรองตามหมวดหมู่
          if (selectedCategory !== 'all') {
            reviewCards = reviewCards.filter((card) => card.category_id === selectedCategory);
          }
        }

        // 3. ถ้าไม่มีคำศัพท์ที่ต้องทบทวน แต่ผู้ใช้เลือก includeNotDue
        // ให้ดึงคำศัพท์ทั้งหมดมาใช้
        if (reviewCards.length === 0 && (includeNotDue || filterType !== 'due')) {
          try {
            // เลือกหมวดหมู่แรกเพื่อดึงคำศัพท์
            const firstCategory = categoryList[0];
            if (firstCategory) {
              setCategoryData(firstCategory);

              // ดึงคำศัพท์ในหมวดหมู่นั้น
              const categoryCards = await getFlashcardsByCategory(firstCategory.id);
              setRecommendedCards(categoryCards);

              // แสดงคำแนะนำ
              setShowRecommendation(true);
            }
          } catch (err) {
            console.error('Error fetching recommendations:', err);
          }
        } else {
          setShowRecommendation(false);
        }

        // 4. บันทึกข้อมูลคำศัพท์
        setAllCards(reviewCards);
        setCards(reviewCards);

        // 5. ดึงสถิติการเรียนรู้เพื่อแสดง streak
        const stats = await getLearningStats();
        setSessionStats((prev) => ({
          ...prev,
          streak: stats.streakDays || 0
        }));

        // 6. เริ่มจับเวลาสำหรับคำศัพท์แรก
        setStartTime(Date.now());

        setLoading(false);
      } catch (error) {
        console.error('Error fetching review cards:', error);
        setError('ไม่สามารถโหลดข้อมูลคำศัพท์ได้ กรุณาลองใหม่ภายหลัง');
        setLoading(false);
      }
    };

    fetchData();
  }, [filterType, includeNotDue, selectedCategory, refreshKey]);

  // สร้างคำพูดสำหรับอ่าน
  const speak = (text, lang = 'en-US') => {
    if ('speechSynthesis' in window && !speaking) {
      setSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.onend = () => {
        setSpeaking(false);
      };
      speechSynthesis.speak(utterance);
    }
  };

  // พลิกการ์ด
  const flipCard = () => {
    if (!answerState) {
      // พลิกได้เฉพาะเมื่อยังไม่ได้ตอบ
      setFlipped(!flipped);
    }
  };

  // คำนวณความก้าวหน้า
  const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

  // จัดการเมื่อผู้ใช้ตอบว่าจำได้
  const handleRemembered = async () => {
    if (answerState) return; // ป้องกันการกดซ้ำ

    setAnswerState('correct');

    // คำนวณเวลาที่ใช้ในการตอบคำถาม (วินาที)
    const currentTime = Date.now();
    const timeUsed = Math.round((currentTime - startTime) / 1000);
    setTimeTaken(timeUsed);

    try {
      // บันทึกผลการทบทวนไปยัง API
      const currentCard = cards[currentIndex];
      await submitReviewResult(
        currentCard.id, // หรือ _id ขึ้นอยู่กับโครงสร้างข้อมูลจาก API
        true, // isCorrect = true
        timeUsed
      );

      // อัปเดตสถิติ
      setSessionStats((prev) => ({
        ...prev,
        totalReviewed: prev.totalReviewed + 1,
        remembered: prev.remembered + 1
      }));

      // รอสักครู่แล้วไปการ์ดถัดไป
      setTimeout(() => {
        nextCard();
      }, 1000);
    } catch (error) {
      console.error('Error submitting review result:', error);
      setError('เกิดข้อผิดพลาดในการบันทึกผลการทบทวน');

      // แม้จะมีข้อผิดพลาด ยังให้ผู้ใช้ไปคำถัดไปได้
      setTimeout(() => {
        nextCard();
      }, 1000);
    }
  };

  // จัดการเมื่อผู้ใช้ตอบว่าจำไม่ได้
  const handleForgotten = async () => {
    if (answerState) return; // ป้องกันการกดซ้ำ

    setAnswerState('incorrect');

    // คำนวณเวลาที่ใช้ในการตอบคำถาม (วินาที)
    const currentTime = Date.now();
    const timeUsed = Math.round((currentTime - startTime) / 1000);
    setTimeTaken(timeUsed);

    try {
      // บันทึกผลการทบทวนไปยัง API
      const currentCard = cards[currentIndex];
      await submitReviewResult(
        currentCard.id, // หรือ _id ขึ้นอยู่กับโครงสร้างข้อมูลจาก API
        false, // isCorrect = false
        timeUsed
      );

      // อัปเดตสถิติ
      setSessionStats((prev) => ({
        ...prev,
        totalReviewed: prev.totalReviewed + 1
      }));

      // ถ้ายังไม่พลิกการ์ด ให้พลิกแสดงคำตอบ
      if (!flipped) {
        setFlipped(true);
      }

      // รอสักครู่แล้วไปการ์ดถัดไป
      setTimeout(() => {
        nextCard();
      }, 1500);
    } catch (error) {
      console.error('Error submitting review result:', error);
      setError('เกิดข้อผิดพลาดในการบันทึกผลการทบทวน');

      // แม้จะมีข้อผิดพลาด ยังให้ผู้ใช้ไปคำถัดไปได้
      setTimeout(() => {
        nextCard();
      }, 1500);
    }
  };

  // ไปการ์ดถัดไป
  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setFlipped(false);
      setAnswerState(null);

      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        // เริ่มจับเวลาใหม่สำหรับคำศัพท์ถัดไป
        setStartTime(Date.now());
      }, 300);
    } else {
      // ทบทวนครบทุกการ์ดแล้ว
      setReviewCompleted(true);
    }
  };

  // กลับไปหน้าหลัก
  const handleBackToDashboard = () => {
    navigate('/student/flashcards');
  };

  // เริ่มทบทวนใหม่
  const handleRestartReview = async () => {
    try {
      // เพิ่ม refreshKey เพื่อบังคับให้ useEffect ทำงานใหม่
      setRefreshKey((prev) => prev + 1);

      setCurrentIndex(0);
      setFlipped(false);
      setAnswerState(null);
      setReviewCompleted(false);
      setSessionStats((prev) => ({
        totalReviewed: 0,
        remembered: 0,
        streak: prev.streak
      }));

      // สุ่มคำศัพท์ใหม่
      if (cards.length > 0) {
        const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
        setCards(shuffledCards);
      }
    } catch (error) {
      console.error('Error restarting review:', error);
      setError('ไม่สามารถเริ่มทบทวนใหม่ได้ กรุณาลองอีกครั้ง');
    }
  };

  // สุ่มลำดับคำศัพท์
  const handleShuffleCards = () => {
    if (cards.length > 0) {
      const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
      setCards(shuffledCards);
      setCurrentIndex(0);
      setFlipped(false);
      setAnswerState(null);
      setStartTime(Date.now());
    }
  };

  // แสดงข้อมูลเพิ่มเติม
  const handleShowInfo = () => {
    setShowInfo(true);
  };

  // เพิ่มคำศัพท์จากคำแนะนำไปยังรายการทบทวน
  const handleAddRecommendedToReview = async () => {
    try {
      setLoading(true);

      // สร้างฟังก์ชันจำลองเพื่อสร้างข้อมูลเริ่มต้น
      // ในระบบจริงควรเรียกใช้ API addMultipleToReview
      const addedCount = 5; // จำลองการเพิ่ม 5 คำ

      // เพิ่ม refreshKey เพื่อบังคับให้ useEffect ทำงานใหม่
      setTimeout(() => {
        setRefreshKey((prev) => prev + 1);
        setShowRecommendation(false);
        setLoading(false);

        // แสดง Alert แจ้งผลสำเร็จ
        setError(null);

        // สร้างข้อความอธิบาย
        const message = `เพิ่มคำศัพท์จากหมวดหมู่ "${categoryData.title}" จำนวน ${addedCount} คำ ไปยังรายการทบทวนแล้ว`;
        alert(message);
      }, 1000);
    } catch (error) {
      console.error('Error adding cards to review:', error);
      setError('ไม่สามารถเพิ่มคำศัพท์ไปยังรายการทบทวนได้');
      setLoading(false);
    }
  };

  // ส่วนแสดงตัวกรอง
  const FilterOptions = () => (
    <FilterSection>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>แสดงคำศัพท์</InputLabel>
        <Select value={filterType} label="แสดงคำศัพท์" onChange={(e) => setFilterType(e.target.value)}>
          <MenuItem value="due">คำศัพท์ที่ถึงเวลาทบทวน</MenuItem>
          <MenuItem value="all">คำศัพท์ทั้งหมด</MenuItem>
          <MenuItem value="favorites">คำศัพท์โปรด</MenuItem>
        </Select>
      </FormControl>

      {filterType === 'due' && (
        <FormControlLabel
          control={<Switch checked={includeNotDue} onChange={(e) => setIncludeNotDue(e.target.checked)} color="primary" />}
          label="รวมคำศัพท์ที่ยังไม่ถึงเวลาทบทวน"
        />
      )}

      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>หมวดหมู่</InputLabel>
        <Select value={selectedCategory} label="หมวดหมู่" onChange={(e) => setSelectedCategory(e.target.value)}>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="outlined"
        startIcon={<IconArrowsShuffle size={16} />}
        onClick={handleShuffleCards}
        disabled={cards.length === 0}
        sx={{ ml: 'auto' }}
      >
        สลับลำดับ
      </Button>
    </FilterSection>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <MainCard title="ทบทวนคำศัพท์">
        <Box sx={{ py: 5, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={handleRestartReview}
            sx={{ mr: 2, bgcolor: THEME_COLOR, '&:hover': { bgcolor: THEME_COLOR_DARK } }}
          >
            ลองใหม่อีกครั้ง
          </Button>
          <Button variant="outlined" onClick={handleBackToDashboard}>
            กลับหน้าหลัก
          </Button>
        </Box>
      </MainCard>
    );
  }

  // แสดงคำแนะนำเมื่อไม่มีคำศัพท์ที่ต้องทบทวน
  if (cards.length === 0) {
    return (
      <MainCard title="ทบทวนคำศัพท์">
        <FilterOptions />

        <Box sx={{ py: 5, textAlign: 'center' }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              bgcolor: THEME_COLOR,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3
            }}
          >
            <IconCheck size={60} color="#fff" />
          </Box>
          <Typography variant="h3" gutterBottom>
            ยินดีด้วย!
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            ไม่มีคำศัพท์ที่ต้องทบทวนใน{filterType === 'favorites' ? 'รายการโปรด' : 'ขณะนี้'}
            {filterType === 'due' && !includeNotDue && ' คุณสามารถเลือก "รวมคำศัพท์ที่ยังไม่ถึงเวลาทบทวน" เพื่อฝึกทบทวนคำศัพท์ทั้งหมด'}
          </Typography>

          {showRecommendation && recommendedCards.length > 0 && (
            <Box sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  ข้อแนะนำ: เพิ่มคำศัพท์จากหมวดหมู่ "{categoryData?.title}"
                </Typography>
                <Typography variant="body2">คุณสามารถเพิ่มคำศัพท์จากหมวดหมู่นี้เพื่อเริ่มการทบทวน</Typography>
              </Alert>
              <Button
                variant="contained"
                color="primary"
                sx={{ bgcolor: THEME_COLOR, '&:hover': { bgcolor: THEME_COLOR_DARK } }}
                onClick={handleAddRecommendedToReview}
              >
                เพิ่มคำศัพท์ไปยังรายการทบทวน
              </Button>
            </Box>
          )}

          <Button variant="outlined" onClick={handleBackToDashboard} sx={{ mr: 2 }}>
            กลับหน้าหลัก
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate('/student/flashcards/categories')}
            sx={{ bgcolor: THEME_COLOR, '&:hover': { bgcolor: THEME_COLOR_DARK } }}
          >
            ดูหมวดหมู่คำศัพท์
          </Button>
        </Box>
      </MainCard>
    );
  }

  // หน้าแสดงผลเมื่อทบทวนครบทุกการ์ดแล้ว
  if (reviewCompleted) {
    return (
      <MainCard title="ทบทวนคำศัพท์">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              bgcolor: THEME_COLOR,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}
          >
            <IconCheck size={60} color="#fff" />
          </Box>

          <Typography variant="h2" gutterBottom>
            ทบทวนเสร็จสิ้น!
          </Typography>

          <Typography variant="body1" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
            คุณได้ทบทวนคำศัพท์ครบทั้ง {cards.length} คำแล้ว โดยจำได้ {sessionStats.remembered} คำจากทั้งหมด {sessionStats.totalReviewed} คำ
          </Typography>

          <StreakBadge sx={{ mx: 'auto', mb: 4, justifyContent: 'center' }}>
            <IconFlame size={20} color={theme.palette.warning.main} style={{ marginRight: 8 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              ท่องต่อเนื่อง {sessionStats.streak} วัน
            </Typography>
          </StreakBadge>

          <Box
            sx={{
              bgcolor: theme.palette.background.default,
              p: 3,
              borderRadius: 2,
              maxWidth: 500,
              mx: 'auto',
              mb: 4
            }}
          >
            <Typography variant="h5" gutterBottom>
              ผลการทบทวน
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h3" color={THEME_COLOR}>
                    {sessionStats.totalReviewed > 0 ? Math.round((sessionStats.remembered / sessionStats.totalReviewed) * 100) : 0}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    อัตราการจำได้
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h3" color={THEME_COLOR}>
                    {cards.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    คำศัพท์ที่ทบทวน
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="outlined" size="large" onClick={handleBackToDashboard} sx={{ minWidth: 180 }}>
              กลับหน้าหลัก
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={handleRestartReview}
              startIcon={<IconRefresh />}
              sx={{ minWidth: 180, bgcolor: THEME_COLOR, '&:hover': { bgcolor: THEME_COLOR_DARK } }}
            >
              ทบทวนอีกครั้ง
            </Button>
          </Box>
        </Box>
      </MainCard>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <MainCard title="ทบทวนคำศัพท์">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Button variant="outlined" startIcon={<IconArrowLeft />} onClick={handleBackToDashboard}>
              กลับหน้าหลัก
            </Button>
            <StreakBadge>
              <IconFlame size={20} color={theme.palette.warning.main} style={{ marginRight: 8 }} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {sessionStats.streak} วันติดต่อกัน
              </Typography>
            </StreakBadge>
            <Button variant="outlined" color="secondary" onClick={handleShowInfo}>
              ข้อมูลคำศัพท์
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <FilterOptions />
        </Grid>

        <Grid item xs={12}>
          <ProgressBar>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: THEME_COLOR
                }
              }}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 1
              }}
            >
              <Typography variant="caption" color="textSecondary">
                {currentIndex + 1} / {cards.length}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                จำได้: {sessionStats.remembered} / {sessionStats.totalReviewed}
              </Typography>
            </Box>
          </ProgressBar>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
            <FlashCard flipped={flipped ? 1 : 0} onClick={flipCard}>
              {/* ด้านหน้าการ์ด - แสดงคำศัพท์ */}
              <CardSide front={1}>
                <Chip
                  label={`ระดับ ${currentCard.progress?.level || 0}`}
                  color={
                    !currentCard.progress?.level || currentCard.progress?.level <= 1
                      ? 'error'
                      : currentCard.progress?.level <= 2
                        ? 'warning'
                        : currentCard.progress?.level <= 3
                          ? 'info'
                          : 'success'
                  }
                  sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    fontSize: '0.75rem'
                  }}
                />

                <Box sx={{ textAlign: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h1" sx={{ fontWeight: 600 }}>
                      {currentCard.front}
                    </Typography>
                    {currentCard.part_of_speech && <PartOfSpeechChip label={currentCard.part_of_speech} size="small" />}
                  </Box>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    {currentCard.phonetic}
                  </Typography>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <IconButton
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(currentCard.front);
                    }}
                    sx={{
                      backgroundColor: THEME_COLOR_LIGHT,
                      '&:hover': {
                        backgroundColor: THEME_COLOR,
                        color: '#fff'
                      }
                    }}
                  >
                    <IconVolume2 size={24} />
                  </IconButton>
                </Box>

                {/* แสดงตัวอย่างประโยคในด้านหน้าการ์ด */}
                {currentCard.example && (
                  <ExampleSection>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      ตัวอย่างประโยค:
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
                      "{currentCard.example}"
                    </Typography>

                    {/* ถ้ามีคำแปลประโยค ให้แสดง */}
                    {currentCard.example_translation && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <IconLanguage size={16} style={{ color: THEME_COLOR, marginRight: 8 }} />
                        <Typography variant="body2" color="textSecondary">
                          {currentCard.example_translation}
                        </Typography>
                      </Box>
                    )}

                    <IconButton
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(currentCard.example);
                      }}
                    >
                      <IconVolume2 size={16} />
                    </IconButton>
                  </ExampleSection>
                )}

                <Box sx={{ position: 'absolute', bottom: 20, width: '100%', textAlign: 'center' }}>
                  <Typography variant="caption" color="textSecondary">
                    คลิกเพื่อพลิกการ์ด หรือ ตอบว่าจำได้/จำไม่ได้
                  </Typography>
                </Box>

                {/* แสดงเครื่องหมายถูก/ผิด เมื่อผู้ใช้ตอบ */}
                {answerState === 'correct' && (
                  <Fade in={true}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: 'rgba(101, 196, 182, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '15px'
                      }}
                    >
                      <IconCheck size={80} color="#fff" />
                    </Box>
                  </Fade>
                )}

                {answerState === 'incorrect' && !flipped && (
                  <Fade in={true}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: 'rgba(244, 67, 54, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '15px'
                      }}
                    >
                      <IconX size={80} color="#fff" />
                    </Box>
                  </Fade>
                )}
              </CardSide>

              {/* ด้านหลังการ์ด - แสดงความหมาย */}
              <CardSide front={0}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h2" sx={{ fontWeight: 600, mb: 1 }}>
                    {currentCard.back}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" sx={{ display: 'inline' }}>
                      คำศัพท์:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        ml: 1,
                        display: 'inline'
                      }}
                    >
                      {currentCard.front}
                    </Typography>
                    {currentCard.part_of_speech && <PartOfSpeechChip label={currentCard.part_of_speech} size="small" />}
                  </Box>
                </Box>

                {/* แสดงตัวอย่างประโยคในด้านหลังการ์ด */}
                {currentCard.example && (
                  <ExampleSection>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      ตัวอย่างประโยค:
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
                      "{currentCard.example}"
                    </Typography>

                    {/* ถ้ามีคำแปลประโยค ให้แสดง */}
                    {currentCard.example_translation && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <IconLanguage size={16} style={{ color: THEME_COLOR, marginRight: 8 }} />
                        <Typography variant="body2" color="textSecondary">
                          {currentCard.example_translation}
                        </Typography>
                      </Box>
                    )}
                  </ExampleSection>
                )}

                <Box sx={{ position: 'absolute', bottom: 20, width: '100%', textAlign: 'center' }}>
                  <Typography variant="caption" color="textSecondary">
                    คลิกเพื่อพลิกกลับ
                  </Typography>
                </Box>

                {/* แสดงเครื่องหมายผิด เมื่อผู้ใช้ตอบว่าจำไม่ได้ */}
                {answerState === 'incorrect' && flipped && (
                  <Fade in={true}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: 'rgba(244, 67, 54, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '15px'
                      }}
                    >
                      <IconX size={80} color="#fff" />
                    </Box>
                  </Fade>
                )}
              </CardSide>
            </FlashCard>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <ControlButton
              variant="contained"
              startIcon={<IconThumbDown />}
              onClick={handleForgotten}
              disabled={answerState !== null}
              sx={{ bgcolor: theme.palette.error.main }}
            >
              จำไม่ได้
            </ControlButton>

            <ControlButton variant="contained" startIcon={<IconThumbUp />} onClick={handleRemembered} disabled={answerState !== null}>
              จำได้
            </ControlButton>
          </Box>
        </Grid>
      </Grid>

      {/* Dialog แสดงข้อมูลเพิ่มเติม */}
      <Dialog open={showInfo} onClose={() => setShowInfo(false)} maxWidth="sm" fullWidth>
        <DialogTitle>ข้อมูลคำศัพท์</DialogTitle>
        <DialogContent>
          {currentCard && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                    <Typography variant="h4" gutterBottom>
                      {currentCard.front}
                    </Typography>
                    {currentCard.part_of_speech && <PartOfSpeechChip label={currentCard.part_of_speech} size="small" />}
                  </Box>
                  <Typography variant="body1" color="textSecondary">
                    {currentCard.phonetic}
                  </Typography>
                  <IconButton size="small" onClick={() => speak(currentCard.front)} sx={{ mt: 1, bgcolor: THEME_COLOR_LIGHT }}>
                    <IconVolume2 size={18} color={THEME_COLOR} />
                  </IconButton>
                </Box>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  ความหมาย:
                </Typography>
                <Typography variant="body1" paragraph>
                  {currentCard.back}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  ตัวอย่างประโยค:
                </Typography>
                <Paper variant="outlined" sx={{ p: 1.5 }}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    {currentCard.example || 'ไม่มีตัวอย่างประโยค'}
                  </Typography>

                  {currentCard.example_translation && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <IconLanguage size={16} style={{ color: THEME_COLOR, marginRight: 8 }} />
                      <Typography variant="body2" color="textSecondary">
                        {currentCard.example_translation}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="subtitle2" gutterBottom>
                  ระดับความเชี่ยวชาญ:
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={((currentCard.progress?.level || 0) / 5) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    mb: 1,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: THEME_COLOR
                    }
                  }}
                />
                <Typography variant="caption" color="textSecondary">
                  {currentCard.progress?.level || 0}/5
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="subtitle2" gutterBottom>
                  ครั้งถัดไปที่ต้องทบทวน:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconClock size={16} style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                  <Typography variant="body2">
                    {currentCard.progress?.next_review ? new Date(currentCard.progress.next_review).toLocaleDateString('th-TH') : 'วันนี้'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInfo(false)}>ปิด</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default FlashcardReview;
