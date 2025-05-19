import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  Avatar,
  Paper,
  Tooltip,
  CircularProgress,
  Menu,
  MenuItem
} from '@mui/material';
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant';
import { useNavigate } from 'react-router-dom';
import { styled, useTheme, alpha } from '@mui/material/styles';
import {
  IconSearch,
  IconVolume,
  IconStar,
  IconStarFilled,
  IconBookmark,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
  IconFilter,
  IconBook,
  IconBookmarks,
  IconArrowRight,
  IconCategory,
  IconPlus
} from '@tabler/icons-react';

// สร้าง styled components
const SearchBar = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    transition: theme.transitions.create(['box-shadow']),
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
    },
    '&.Mui-focused': {
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    }
  }
}));

const WordItem = styled(ListItem)(({ theme }) => ({
  borderRadius: '8px',
  marginBottom: '8px',
  transition: 'transform 0.2s ease, background-color 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.15),
    transform: 'translateY(-2px)'
  }
}));

const CategoryChip = styled(Chip)(({ theme, customcolor }) => {
  // กำหนดสีเริ่มต้นจากธีมหรือค่าที่ส่งมา
  const getBackgroundColor = () => {
    if (!customcolor) return theme.palette.primary.light;

    // ถ้าเป็นชื่อสีในธีม (เช่น 'primary', 'secondary')
    if (theme.palette[customcolor]) {
      return theme.palette[customcolor].light;
    }

    // ถ้าเป็นค่า HEX color
    if (typeof customcolor === 'string' && customcolor.startsWith('#')) {
      return customcolor;
    }

    return theme.palette.primary.light;
  };

  const backgroundColor = getBackgroundColor();

  // คำนวณสีข้อความที่เหมาะสม
  const getContrastText = () => {
    try {
      return theme.palette.getContrastText(backgroundColor);
    } catch (e) {
      // Fallback สำหรับสีที่ไม่มีในธีม
      if (typeof backgroundColor === 'string' && backgroundColor.startsWith('#')) {
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#FFFFFF';
      }
      return '#000000';
    }
  };

  const contrastText = getContrastText();

  return {
    borderRadius: '4px',
    fontSize: '0.75rem',
    backgroundColor: backgroundColor,
    color: contrastText,
    '&:hover': {
      backgroundColor: customcolor ? theme.palette[customcolor]?.main || alpha(backgroundColor, 0.9) : theme.palette.primary.main,
      color: contrastText
    }
  };
});

const NoWordsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6),
  backgroundColor: alpha(theme.palette.background.default, 0.6),
  borderRadius: '8px',
  border: `1px dashed ${theme.palette.grey[300]}`,
  margin: theme.spacing(3, 0)
}));

// ข้อมูลจำลองสำหรับคำศัพท์
const mockWords = [
  {
    id: '1',
    word: 'apple',
    phonetic: '/ˈæp.əl/',
    translations: [{ language: 'th', text: 'แอปเปิ้ล' }],
    examples: ['I eat an apple every day.'],
    category: 'Food',
    difficulty: 'Easy',
    favorite: true
  },
  {
    id: '2',
    word: 'computer',
    phonetic: '/kəmˈpjuː.tər/',
    translations: [{ language: 'th', text: 'คอมพิวเตอร์' }],
    examples: ['She works on her computer all day long.'],
    category: 'Technology',
    difficulty: 'Medium',
    favorite: false
  },
  {
    id: '3',
    word: 'beautiful',
    phonetic: '/ˈbjuː.tɪ.fəl/',
    translations: [{ language: 'th', text: 'สวยงาม' }],
    examples: ['The sunset was beautiful tonight.'],
    category: 'Adjectives',
    difficulty: 'Easy',
    favorite: true
  },
  {
    id: '4',
    word: 'acknowledge',
    phonetic: '/əkˈnɒl.ɪdʒ/',
    translations: [{ language: 'th', text: 'ยอมรับ, รับทราบ' }],
    examples: ['She acknowledged that she had made a mistake.'],
    category: 'Verbs',
    difficulty: 'Hard',
    favorite: false
  },
  {
    id: '5',
    word: 'opportunity',
    phonetic: '/ˌɒp.əˈtjuː.nɪ.ti/',
    translations: [{ language: 'th', text: 'โอกาส' }],
    examples: ['This job is a great opportunity for you.'],
    category: 'Nouns',
    difficulty: 'Medium',
    favorite: false
  },
  {
    id: '6',
    word: 'illuminate',
    phonetic: '/ɪˈluː.mɪ.neɪt/',
    translations: [{ language: 'th', text: 'ให้แสงสว่าง, ทำให้กระจ่าง' }],
    examples: ['The new evidence illuminated the case.'],
    category: 'Verbs',
    difficulty: 'Hard',
    favorite: false
  },
  {
    id: '7',
    word: 'banana',
    phonetic: '/bəˈnɑː.nə/',
    translations: [{ language: 'th', text: 'กล้วย' }],
    examples: ['My sister likes to eat a banana for breakfast.'],
    category: 'Food',
    difficulty: 'Easy',
    favorite: true
  },
  {
    id: '8',
    word: 'difficult',
    phonetic: '/ˈdɪf.ɪ.kəlt/',
    translations: [{ language: 'th', text: 'ยาก, ลำบาก' }],
    examples: ['Learning a new language can be difficult.'],
    category: 'Adjectives',
    difficulty: 'Easy',
    favorite: false
  }
];

// ข้อมูลจำลองสำหรับหมวดหมู่ (ใช้ชื่อสีจากธีมหรือ HEX color)
const mockCategories = [
  { name: 'All', count: 8, color: 'primary' },
  { name: 'Food', count: 2, color: '#4CAF50' },
  { name: 'Technology', count: 1, color: '#9C27B0' },
  { name: 'Adjectives', count: 2, color: '#FF9800' },
  { name: 'Verbs', count: 2, color: '#F44336' },
  { name: 'Nouns', count: 1, color: '#673AB7' }
];

const Dictionary = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [words, setWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedWord, setSelectedWord] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [categories, setCategories] = useState([]);

  // จำลองการดึงข้อมูลจาก API
  useEffect(() => {
    // จำลองการโหลดข้อมูล
    setTimeout(() => {
      setWords(mockWords);
      setFilteredWords(mockWords);
      setCategories(mockCategories);
      setLoading(false);
    }, 1000);
  }, []);

  // กรองคำศัพท์ตามการค้นหาและหมวดหมู่
  useEffect(() => {
    if (words.length > 0) {
      let filtered = [...words];

      // กรองตามคำค้นหา
      if (searchTerm) {
        filtered = filtered.filter(
          (word) =>
            word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
            word.translations.some((t) => t.text.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      // กรองตามหมวดหมู่
      if (selectedCategory !== 'All') {
        filtered = filtered.filter((word) => word.category === selectedCategory);
      }

      // กรองตาม tab
      if (currentTab === 1) {
        // Favorites
        filtered = filtered.filter((word) => word.favorite);
      }

      // เรียงลำดับตาม sortOrder
      filtered.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.word.localeCompare(b.word);
        } else {
          return b.word.localeCompare(a.word);
        }
      });

      setFilteredWords(filtered);
    }
  }, [words, searchTerm, selectedCategory, currentTab, sortOrder]);

  // เปลี่ยน tab
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // แสดงเมนูตัวกรอง
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  // ปิดเมนูตัวกรอง
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // เลือกหมวดหมู่
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    handleFilterClose();
  };

  // สลับการเรียงลำดับ
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // เลือกคำศัพท์เพื่อดูรายละเอียด
  const handleWordSelect = (word) => {
    setSelectedWord(word);
  };

  // สลับสถานะรายการโปรด
  const toggleFavorite = (wordId) => {
    setWords(words.map((word) => (word.id === wordId ? { ...word, favorite: !word.favorite } : word)));
  };

  // อ่านออกเสียงคำศัพท์
  const speakWord = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <MainCard title="พจนานุกรมคำศัพท์">
      <Grid container spacing={gridSpacing}>
        {/* Header with search and filter */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <SearchBar
              placeholder="ค้นหาคำศัพท์..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ maxWidth: { xs: '100%', sm: 400 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size={20} />
                  </InputAdornment>
                )
              }}
            />

            <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
              <Tooltip title={sortOrder === 'asc' ? 'เรียงจาก A-Z' : 'เรียงจาก Z-A'}>
                <IconButton
                  onClick={toggleSortOrder}
                  sx={{
                    bgcolor: theme.palette.background.neutral || theme.palette.grey[100],
                    '&:hover': { bgcolor: theme.palette.grey[200] }
                  }}
                >
                  {sortOrder === 'asc' ? <IconSortAscendingLetters size={20} /> : <IconSortDescendingLetters size={20} />}
                </IconButton>
              </Tooltip>

              <Tooltip title="กรองตามหมวดหมู่">
                <IconButton
                  onClick={handleFilterClick}
                  sx={{
                    bgcolor: theme.palette.background.neutral || theme.palette.grey[100],
                    '&:hover': { bgcolor: theme.palette.grey[200] }
                  }}
                >
                  <IconFilter size={20} />
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleFilterClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category.name}
                    onClick={() => handleCategorySelect(category.name)}
                    selected={selectedCategory === category.name}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: category.color.startsWith('#') ? category.color : theme.palette[category.color]?.main || category.color,
                          mr: 1
                        }}
                      />
                      <Typography variant="body2">{category.name}</Typography>
                      <Typography variant="caption" sx={{ ml: 'auto' }}>
                        {category.count}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
        </Grid>

        {/* Main content */}
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            {/* Word list */}
            <Grid item xs={12} md={5} lg={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs value={currentTab} onChange={handleTabChange} variant="fullWidth">
                      <Tab icon={<IconBook size={18} />} label="ทั้งหมด" iconPosition="start" />
                      <Tab icon={<IconStarFilled size={18} />} label="รายการโปรด" iconPosition="start" />
                    </Tabs>
                  </Box>

                  {selectedCategory !== 'All' && (
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        หมวดหมู่:
                      </Typography>
                      <CategoryChip
                        label={selectedCategory}
                        size="small"
                        customcolor={categories.find((c) => c.name === selectedCategory)?.color}
                        onDelete={() => setSelectedCategory('All')}
                      />
                    </Box>
                  )}

                  {filteredWords.length > 0 ? (
                    <List sx={{ height: { xs: 400, md: 500 }, overflow: 'auto', py: 0 }}>
                      {filteredWords.map((word) => (
                        <WordItem
                          key={word.id}
                          button
                          onClick={() => handleWordSelect(word)}
                          selected={selectedWord?.id === word.id}
                          sx={{
                            bgcolor: selectedWord?.id === word.id ? alpha(theme.palette.primary.light, 0.2) : 'transparent'
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="subtitle1" fontWeight={500}>
                                  {word.word}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(word.id);
                                  }}
                                  sx={{ ml: 'auto' }}
                                >
                                  {word.favorite ? <IconStarFilled size={16} color={theme.palette.warning.main} /> : <IconStar size={16} />}
                                </IconButton>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
                                  {word.translations[0].text}
                                </Typography>
                                <CategoryChip
                                  label={word.category}
                                  size="small"
                                  customcolor={categories.find((c) => c.name === word.category)?.color}
                                  sx={{ ml: 'auto' }}
                                />
                              </Box>
                            }
                          />
                        </WordItem>
                      ))}
                    </List>
                  ) : (
                    <NoWordsBox>
                      <Typography variant="subtitle1" color="textSecondary" align="center" gutterBottom>
                        ไม่พบคำศัพท์
                      </Typography>
                      <Typography variant="body2" color="textSecondary" align="center">
                        ลองค้นหาด้วยคำอื่น หรือเปลี่ยนตัวกรอง
                      </Typography>
                    </NoWordsBox>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Word details */}
            <Grid item xs={12} md={7} lg={8}>
              <Card sx={{ height: '100%' }}>
                {selectedWord ? (
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="h2" gutterBottom>
                          {selectedWord.word}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                          {selectedWord.phonetic}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="อ่านออกเสียง">
                          <IconButton
                            onClick={() => speakWord(selectedWord.word)}
                            sx={{
                              bgcolor: theme.palette.primary.light,
                              color: theme.palette.primary.main,
                              '&:hover': {
                                bgcolor: theme.palette.primary.main,
                                color: theme.palette.common.white
                              }
                            }}
                          >
                            <IconVolume size={20} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={selectedWord.favorite ? 'เอาออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}>
                          <IconButton
                            onClick={() => toggleFavorite(selectedWord.id)}
                            sx={{
                              bgcolor: selectedWord.favorite ? theme.palette.warning.light : theme.palette.grey[100],
                              color: selectedWord.favorite ? theme.palette.warning.main : theme.palette.text.secondary,
                              '&:hover': {
                                bgcolor: selectedWord.favorite ? theme.palette.warning.main : theme.palette.grey[200],
                                color: selectedWord.favorite ? theme.palette.common.white : theme.palette.text.primary
                              }
                            }}
                          >
                            {selectedWord.favorite ? <IconStarFilled size={20} /> : <IconStar size={20} />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            ความหมาย:
                          </Typography>
                          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                            {selectedWord.translations.map((translation, index) => (
                              <Typography key={index} variant="body1">
                                {translation.text}
                              </Typography>
                            ))}
                          </Paper>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" gutterBottom>
                          หมวดหมู่:
                        </Typography>
                        <CategoryChip
                          label={selectedWord.category}
                          customcolor={categories.find((c) => c.name === selectedWord.category)?.color}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" gutterBottom>
                          ระดับความยาก:
                        </Typography>
                        <Chip
                          label={selectedWord.difficulty}
                          color={
                            selectedWord.difficulty === 'Easy' ? 'success' : selectedWord.difficulty === 'Medium' ? 'warning' : 'error'
                          }
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          ตัวอย่างประโยค:
                        </Typography>
                        <List
                          sx={{
                            bgcolor: theme.palette.background.neutral || theme.palette.grey[100],
                            borderRadius: 2,
                            p: 2
                          }}
                        >
                          {selectedWord.examples.map((example, index) => (
                            <React.Fragment key={index}>
                              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                <Avatar
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    mr: 2,
                                    bgcolor: theme.palette.primary.main,
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  {index + 1}
                                </Avatar>
                                <ListItemText primary={example} />
                              </ListItem>
                              {index < selectedWord.examples.length - 1 && <Divider component="li" sx={{ my: 1 }} />}
                            </React.Fragment>
                          ))}
                        </List>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<IconBookmarks />}
                        onClick={() => navigate(`/student/flashcards/categories`)}
                      >
                        ดูหมวดหมู่คำศัพท์
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<IconArrowRight />}
                        onClick={() => navigate(`/student/flashcards/deck/${selectedWord.category.toLowerCase()}`)}
                      >
                        ฝึกท่องคำศัพท์
                      </Button>
                    </Box>
                  </CardContent>
                ) : (
                  <CardContent
                    sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <IconBook size={80} color={theme.palette.grey[300]} />
                    <Typography variant="h5" color="textSecondary" sx={{ mt: 2 }}>
                      เลือกคำศัพท์เพื่อดูรายละเอียด
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 3, textAlign: 'center' }}>
                      เลือกคำศัพท์จากรายการทางด้านซ้ายเพื่อดูความหมายและตัวอย่างประโยค
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<IconPlus />}
                      onClick={() => navigate(`/student/flashcards/create`)}
                    >
                      สร้างชุดคำศัพท์ใหม่
                    </Button>
                  </CardContent>
                )}
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Category quick filter */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {categories.map((category) => (
              <CategoryChip
                key={category.name}
                label={`${category.name} (${category.count})`}
                customcolor={category.color}
                clickable
                onClick={() => setSelectedCategory(category.name)}
                variant={selectedCategory === category.name ? 'filled' : 'outlined'}
                icon={category.name === 'All' ? <IconCategory size={14} /> : undefined}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Dictionary;
