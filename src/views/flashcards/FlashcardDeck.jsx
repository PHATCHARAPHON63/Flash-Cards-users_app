import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  Chip,
  Grid,
  useTheme,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Paper,
  Alert,
  Divider,
  Tooltip,
  Fade
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import MainCard from '../../ui-component/cards/MainCard';
import {
  IconVolume,
  IconArrowLeft,
  IconArrowRight,
  IconInfoCircle,
  IconStar,
  IconStarFilled,
  IconLanguage,
  IconFlipHorizontal,
  IconCalendarPlus
} from '@tabler/icons-react';
import { getCategoryById, getFlashcardsByCategory, addToReview } from '../../component/function/flashcard.service';

// กำหนดค่าสีธีม
const THEME_COLOR = '#65c4b6';
const THEME_COLOR_DARK = '#55b4a6';
const THEME_COLOR_LIGHT = '#e5f5f2';

// สร้าง styled components
const FlashCardContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: 380,
  maxWidth: 680,
  margin: '0 auto',
  position: 'relative'
}));

const FlashCard = styled(Card)(({ theme }) => ({
  width: '100%',
  minHeight: 380,
  borderRadius: 15,
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  position: 'relative',
  cursor: 'pointer',
  backgroundColor: theme.palette.background.paper,
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 12px 28px rgba(0,0,0,0.15)'
  }
}));

const CardContent = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  padding: theme.spacing(4),
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 15
}));

const ProgressBar = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: 680,
  margin: '20px auto',
  padding: theme.spacing(1, 0)
}));

const ProgressBarInner = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    backgroundColor: THEME_COLOR
  }
}));

const ProgressText = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  top: -4,
  fontSize: '0.875rem',
  fontWeight: 500
}));

const PartOfSpeechChip = styled(Chip)(({ theme }) => ({
  backgroundColor: THEME_COLOR_LIGHT,
  color: THEME_COLOR_DARK,
  fontWeight: 'bold',
  fontStyle: 'italic',
  height: 24,
  marginLeft: theme.spacing(1)
}));

const ExampleSection = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  borderRadius: 10,
  backgroundColor: theme.palette.background.neutral || theme.palette.grey[50],
  borderLeft: `4px solid ${THEME_COLOR}`
}));

const FlashcardDeck = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToReview, setAddingToReview] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const audioRef = useRef(null);

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // ดึงข้อมูลหมวดหมู่
        const categoryData = await getCategoryById(categoryId);
        setCategory(categoryData);

        // ดึงคำศัพท์ในหมวดหมู่
        const flashcardsData = await getFlashcardsByCategory(categoryId);
        setCards(flashcardsData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
        setError('ไม่สามารถโหลดข้อมูลคำศัพท์ได้ กรุณาลองใหม่อีกครั้ง');
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  // อัปเดตสถานะรายการโปรดเมื่อเปลี่ยนคำศัพท์
  useEffect(() => {
    if (cards.length > 0 && currentIndex >= 0 && currentIndex < cards.length) {
      setIsFavorite(cards[currentIndex].progress?.is_favorite || false);
    }
  }, [currentIndex, cards]);

  // หยุดการพูดเมื่อ component ถูกลบ
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // สร้างคำพูดสำหรับอ่าน
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

  // พลิกการ์ด
  const flipCard = () => {
    setFlipped(!flipped);
  };

  // ไปการ์ดถัดไป
  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setFlipped(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 300);
    }
  };

  // ไปการ์ดก่อนหน้า
  const prevCard = () => {
    if (currentIndex > 0) {
      setFlipped(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
      }, 300);
    }
  };

  // สลับสถานะรายการโปรด
  const toggleFavorite = async (e) => {
    e.stopPropagation(); // ป้องกันการพลิกการ์ด

    try {
      // ฟังก์ชันนี้ควรส่งคำขอไปยัง API เพื่อเปลี่ยนสถานะรายการโปรด
      // ตัวอย่าง: await toggleFavoriteFlashcard(cards[currentIndex].id);

      // อัปเดตสถานะในข้อมูลท้องถิ่น
      const updatedCards = [...cards];
      if (updatedCards[currentIndex].progress) {
        updatedCards[currentIndex].progress.is_favorite = !isFavorite;
      } else {
        updatedCards[currentIndex].progress = { is_favorite: !isFavorite };
      }

      setCards(updatedCards);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // เพิ่มคำศัพท์ไปยังรายการทบทวน
  const handleAddToReview = async () => {
    try {
      setAddingToReview(true);
      await addToReview(cards[currentIndex]._id);

      // อัปเดตสถานะในข้อมูลท้องถิ่น
      const updatedCards = [...cards];
      if (!updatedCards[currentIndex].progress) {
        updatedCards[currentIndex].progress = {};
      }
      updatedCards[currentIndex].progress.next_review = new Date();
      updatedCards[currentIndex].progress.is_due = true;
      setCards(updatedCards);

      // แสดงข้อความสำเร็จ
      setSuccessMessage('เพิ่มคำศัพท์ไปยังรายการทบทวนแล้ว');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error adding to review:', error);
      setErrorMessage('เกิดข้อผิดพลาดในการเพิ่มคำศัพท์');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    } finally {
      setAddingToReview(false);
    }
  };

  // แสดงกล่องข้อมูลเพิ่มเติม
  const handleInfoClick = () => {
    setShowInfo(true);
  };

  // ปิดกล่องข้อมูลเพิ่มเติม
  const handleCloseInfo = () => {
    setShowInfo(false);
  };

  // กลับไปหน้าหมวดหมู่
  const handleBackToCategories = () => {
    navigate('/student/flashcards/categories');
  };

  // คำนวณความก้าวหน้า
  const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: THEME_COLOR }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh'
        }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()} sx={{ bgcolor: THEME_COLOR }}>
          ลองใหม่อีกครั้ง
        </Button>
      </Box>
    );
  }

  if (cards.length === 0) {
    return (
      <MainCard>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<IconArrowLeft />}
            onClick={handleBackToCategories}
            sx={{ mb: 2, borderColor: THEME_COLOR, color: THEME_COLOR }}
          >
            กลับไปยังหมวดหมู่
          </Button>
          <Typography variant="h3" gutterBottom>
            {category?.title || 'หมวดหมู่คำศัพท์'}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh'
          }}
        >
          <Typography variant="h5" gutterBottom>
            ยังไม่มีคำศัพท์ในหมวดหมู่นี้
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2, bgcolor: THEME_COLOR, '&:hover': { bgcolor: THEME_COLOR_DARK } }}
            onClick={() => navigate('/student/flashcards/create')}
          >
            เพิ่มคำศัพท์ใหม่
          </Button>
        </Box>
      </MainCard>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <MainCard>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<IconArrowLeft />}
          onClick={handleBackToCategories}
          sx={{ mb: 2, borderColor: THEME_COLOR, color: THEME_COLOR }}
        >
          กลับไปยังหมวดหมู่
        </Button>
        <Typography variant="h3" gutterBottom>
          {category?.title || 'หมวดหมู่คำศัพท์'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {category?.description || ''}
        </Typography>
      </Box>

      {/* แสดงข้อความแจ้งเตือน */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <ProgressBar>
        <ProgressBarInner variant="determinate" value={progress} />
        <ProgressText variant="caption">
          {currentIndex + 1} / {cards.length}
        </ProgressText>
      </ProgressBar>

      <Box sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
        <FlashCardContainer>
          <FlashCard onClick={flipCard}>
            {!flipped ? (
              /* ด้านหน้าการ์ด */
              <Fade in={!flipped} timeout={300}>
                <CardContent>
                  <Box sx={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 1 }}>
                    <Chip
                      label={currentCard?.difficulty || 'Medium'}
                      color={currentCard?.difficulty === 'Easy' ? 'success' : currentCard?.difficulty === 'Medium' ? 'warning' : 'error'}
                      size="small"
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => toggleFavorite(e)}
                      sx={{
                        bgcolor: isFavorite ? 'warning.light' : 'grey.100',
                        color: isFavorite ? 'warning.main' : 'text.secondary',
                        '&:hover': {
                          bgcolor: isFavorite ? 'warning.main' : 'grey.200',
                          color: isFavorite ? '#fff' : 'text.primary'
                        }
                      }}
                    >
                      {isFavorite ? <IconStarFilled size={18} /> : <IconStar size={18} />}
                    </IconButton>
                  </Box>

                  {/* คำศัพท์ part of speech และคำอ่าน */}
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="h1" sx={{ fontWeight: 600 }}>
                        {currentCard?.front || ''}
                      </Typography>
                      {currentCard?.part_of_speech && <PartOfSpeechChip label={currentCard.part_of_speech} size="small" />}
                    </Box>
                    <Typography variant="body1" color="textSecondary" gutterBottom sx={{ mt: 1 }}>
                      {currentCard?.phonetic || ''}
                    </Typography>
                  </Box>

                  {/* ความหมาย */}
                  <Box sx={{ mt: 2, mb: 3, textAlign: 'center' }}>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="h3" sx={{ fontWeight: 500, color: THEME_COLOR_DARK }}>
                      {currentCard?.back || ''}
                    </Typography>
                  </Box>

                  {/* ปุ่มฟังเสียงคำศัพท์ */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      startIcon={<IconVolume />}
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(currentCard?.front);
                      }}
                      disabled={speaking}
                      sx={{
                        backgroundColor: THEME_COLOR,
                        '&:hover': {
                          backgroundColor: THEME_COLOR_DARK
                        },
                        '&.Mui-disabled': {
                          backgroundColor: theme.palette.grey[300]
                        }
                      }}
                    >
                      ฟังคำศัพท์
                    </Button>
                  </Box>

                  <Box sx={{ position: 'absolute', bottom: 20, width: '100%', textAlign: 'center' }}>
                    <Typography variant="caption" color="textSecondary">
                      คลิกเพื่อพลิกไปดูตัวอย่างประโยค
                    </Typography>
                  </Box>
                </CardContent>
              </Fade>
            ) : (
              /* ด้านหลังการ์ด */
              <Fade in={flipped} timeout={300}>
                <CardContent>
                  <Typography variant="h4" color={THEME_COLOR} sx={{ fontWeight: 600, mb: 3, alignSelf: 'flex-start' }}>
                    ตัวอย่างการใช้คำศัพท์
                  </Typography>

                  {/* แสดงคำศัพท์เล็กๆ เพื่อเตือนความจำ */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, alignSelf: 'flex-start' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {currentCard?.front}
                    </Typography>
                    {currentCard?.part_of_speech && <PartOfSpeechChip label={currentCard.part_of_speech} size="small" />}
                  </Box>

                  {/* แสดงตัวอย่างประโยค */}
                  {currentCard?.example ? (
                    <Box sx={{ width: '100%', mb: 4 }}>
                      <ExampleSection>
                        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                          ตัวอย่างประโยค:
                        </Typography>
                        <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2, fontSize: '1.1rem' }}>
                          "{currentCard.example}"
                        </Typography>

                        {/* คำแปลประโยค */}
                        {currentCard?.example_translation && (
                          <Box sx={{ mt: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <IconLanguage size={18} style={{ color: THEME_COLOR, marginRight: 8 }} />
                              <Typography variant="subtitle2" color={THEME_COLOR}>
                                คำแปล:
                              </Typography>
                            </Box>
                            <Typography variant="body1">{currentCard.example_translation}</Typography>
                          </Box>
                        )}

                        {/* ปุ่มฟังเสียงประโยค */}
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                          <Button
                            variant="outlined"
                            startIcon={<IconVolume />}
                            onClick={(e) => {
                              e.stopPropagation();
                              speak(currentCard.example);
                            }}
                            disabled={speaking}
                            sx={{
                              borderColor: THEME_COLOR,
                              color: THEME_COLOR,
                              '&:hover': {
                                borderColor: THEME_COLOR_DARK,
                                backgroundColor: THEME_COLOR_LIGHT
                              }
                            }}
                          >
                            ฟังประโยคตัวอย่าง
                          </Button>
                        </Box>
                      </ExampleSection>
                    </Box>
                  ) : (
                    <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        ไม่มีตัวอย่างประโยคสำหรับคำศัพท์นี้
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ position: 'absolute', bottom: 20, width: '100%', textAlign: 'center' }}>
                    <Typography variant="caption" color="textSecondary">
                      คลิกเพื่อพลิกกลับ
                    </Typography>
                  </Box>
                </CardContent>
              </Fade>
            )}
          </FlashCard>
        </FlashCardContainer>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2, flexWrap: 'wrap' }}>
        <IconButton
          disabled={currentIndex === 0}
          onClick={prevCard}
          sx={{
            backgroundColor: currentIndex === 0 ? theme.palette.grey[200] : THEME_COLOR_LIGHT,
            color: currentIndex === 0 ? theme.palette.grey[400] : THEME_COLOR,
            '&:hover': {
              backgroundColor: THEME_COLOR,
              color: '#fff'
            },
            '&.Mui-disabled': {
              backgroundColor: theme.palette.grey[200]
            }
          }}
        >
          <IconArrowLeft size={20} />
        </IconButton>

        <Button
          variant="contained"
          startIcon={<IconFlipHorizontal />}
          onClick={flipCard}
          sx={{
            backgroundColor: THEME_COLOR,
            '&:hover': {
              backgroundColor: THEME_COLOR_DARK
            }
          }}
        >
          พลิกการ์ด
        </Button>

        <Button
          variant="contained"
          startIcon={<IconCalendarPlus />}
          onClick={handleAddToReview}
          disabled={addingToReview || (currentCard.progress && currentCard.progress.is_due)}
          sx={{
            backgroundColor: THEME_COLOR,
            '&:hover': {
              backgroundColor: THEME_COLOR_DARK
            },
            '&.Mui-disabled': {
              backgroundColor: theme.palette.grey[300]
            }
          }}
        >
          {currentCard.progress?.is_due ? 'อยู่ในรายการทบทวนแล้ว' : 'เพิ่มไปยังรายการทบทวน'}
        </Button>

        <Button
          variant="contained"
          startIcon={<IconInfoCircle />}
          onClick={handleInfoClick}
          sx={{ bgcolor: theme.palette.warning.main, '&:hover': { bgcolor: theme.palette.warning.dark } }}
        >
          ข้อมูลเพิ่มเติม
        </Button>

        <IconButton
          disabled={currentIndex === cards.length - 1}
          onClick={nextCard}
          sx={{
            backgroundColor: currentIndex === cards.length - 1 ? theme.palette.grey[200] : THEME_COLOR_LIGHT,
            color: currentIndex === cards.length - 1 ? theme.palette.grey[400] : THEME_COLOR,
            '&:hover': {
              backgroundColor: THEME_COLOR,
              color: '#fff'
            },
            '&.Mui-disabled': {
              backgroundColor: theme.palette.grey[200]
            }
          }}
        >
          <IconArrowRight size={20} />
        </IconButton>
      </Box>

      <Dialog open={showInfo} onClose={handleCloseInfo} maxWidth="sm" fullWidth>
        <DialogTitle>รายละเอียดคำศัพท์</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Typography variant="h4" gutterBottom>
                {currentCard?.front || ''}
              </Typography>
              {currentCard?.part_of_speech && <PartOfSpeechChip label={currentCard.part_of_speech} size="small" />}
            </Box>
            <Typography variant="body1" color="textSecondary">
              {currentCard?.phonetic || ''}
            </Typography>
            <IconButton
              size="small"
              onClick={() => speak(currentCard?.front)}
              disabled={speaking}
              sx={{ mt: 1, bgcolor: THEME_COLOR_LIGHT }}
            >
              <IconVolume size={18} color={THEME_COLOR} />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                ความหมาย:
              </Typography>
              <Typography variant="body1" paragraph>
                {currentCard?.back || ''}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                ตัวอย่างประโยค:
              </Typography>
              <Paper variant="outlined" sx={{ p: 1.5 }}>
                <Typography variant="body2" sx={{ fontStyle: 'italic', mb: currentCard?.example_translation ? 1 : 0 }}>
                  {currentCard?.example || 'ไม่มีตัวอย่างประโยค'}
                </Typography>

                {currentCard?.example_translation && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <IconLanguage size={16} style={{ color: THEME_COLOR, marginRight: 8 }} />
                    <Typography variant="body2" color="textSecondary">
                      {currentCard.example_translation}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                หมวดหมู่:
              </Typography>
              <Chip label={category?.title || ''} size="small" sx={{ bgcolor: THEME_COLOR_LIGHT, color: THEME_COLOR }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                ระดับความยาก:
              </Typography>
              <Chip
                label={currentCard?.difficulty || 'Medium'}
                color={currentCard?.difficulty === 'Easy' ? 'success' : currentCard?.difficulty === 'Medium' ? 'warning' : 'error'}
                size="small"
              />
            </Grid>

            {currentCard?.progress && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  ระดับความเชี่ยวชาญ:
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={((currentCard.progress.level || 0) / 5) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    mb: 1,
                    backgroundColor: theme.palette.grey[200],
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: THEME_COLOR
                    }
                  }}
                />
                <Typography variant="caption" color="textSecondary">
                  {currentCard.progress.level || 0}/5
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInfo} sx={{ color: THEME_COLOR }}>
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default FlashcardDeck;
