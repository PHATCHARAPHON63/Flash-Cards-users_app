import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  Avatar,
  CardActionArea,
  CircularProgress,
  TextField,
  InputAdornment,
  useTheme,
  Alert
} from '@mui/material';
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { IconSearch, IconStarFilled, IconBookmark, IconArrowRight, IconUsers } from '@tabler/icons-react';
import { getAllCategories } from '../../component/function/flashcard.service';

// สร้าง styled components
const CategoryCard = styled(Card)(({ theme }) => ({
  height: '100%',
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
  }
}));

const CategoryImage = styled('div')(({ theme, bgcolor }) => ({
  height: 140,
  background: bgcolor || theme.palette.primary.light,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative'
}));

const CardBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 10,
  right: 10,
  fontWeight: 500
}));

const FlashcardCategories = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ดึงข้อมูลหมวดหมู่จาก API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getAllCategories();
        setCategories(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('ไม่สามารถโหลดข้อมูลหมวดหมู่ได้ กรุณาลองใหม่อีกครั้ง');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // กรองหมวดหมู่ตามคำค้นหา
  const filteredCategories = categories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // เปิดชุดคำศัพท์
  const handleOpenCategory = (categoryId) => {
    navigate(`/student/flashcards/deck/${categoryId}`);
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
        <Button variant="contained" onClick={() => window.location.reload()}>
          ลองใหม่อีกครั้ง
        </Button>
      </Box>
    );
  }

  return (
    <MainCard title="หมวดหมู่คำศัพท์">
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="ค้นหาหมวดหมู่คำศัพท์..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch size={20} />
              </InputAdornment>
            )
          }}
          sx={{
            maxWidth: 500,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px'
            }
          }}
        />
      </Box>

      <Grid container spacing={gridSpacing}>
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={category._id}>
              <CategoryCard>
                <CardActionArea onClick={() => handleOpenCategory(category._id)}>
                  <CategoryImage bgcolor={category.color}>
                    <Typography variant="h1">{category.icon}</Typography>
                    <CardBadge label={`${category.cardCount || 0} คำ`} size="small" color="primary" icon={<IconBookmark size={14} />} />
                  </CategoryImage>
                  <CardContent>
                    <Typography variant="h4" gutterBottom>
                      {category.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ height: 40, overflow: 'hidden' }}>
                      {category.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Chip
                        icon={<IconUsers size={16} />}
                        label={category.is_public ? 'สาธารณะ' : 'ส่วนตัว'}
                        size="small"
                        variant="outlined"
                      />
                      <Button variant="text" color="primary" endIcon={<IconArrowRight size={16} />} size="small">
                        เริ่มท่อง
                      </Button>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </CategoryCard>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                py: 5
              }}
            >
              <Typography variant="h5" gutterBottom>
                ไม่พบหมวดหมู่ที่ค้นหา
              </Typography>
              <Typography variant="body2" color="textSecondary">
                ลองค้นหาด้วยคำอื่น หรือสร้างหมวดหมู่ใหม่
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/student/flashcards/create')}>
                สร้างหมวดหมู่ใหม่
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </MainCard>
  );
};

export default FlashcardCategories;
