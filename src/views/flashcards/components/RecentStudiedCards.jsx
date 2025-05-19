import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider, Box, Chip, Avatar } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { IconClock, IconVocabulary } from '@tabler/icons-react';

// Styled components
const RecentItem = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: theme.spacing(1.5, 0),
  borderBottom: `1px dashed ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none'
  }
}));

const DateChip = styled(Chip)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.dark,
  fontWeight: 500,
  fontSize: '0.75rem'
}));

// ข้อมูลตัวอย่างสำหรับคำศัพท์ที่เรียนล่าสุด
const recentCards = [
  {
    id: 1,
    word: 'exquisite',
    translation: 'วิจิตร, ประณีต',
    category: 'คำคุณศัพท์',
    timeAgo: '10 นาทีที่แล้ว',
    color: '#3f51b5'
  },
  {
    id: 2,
    word: 'accommodate',
    translation: 'รองรับ, จัดหาที่พักให้',
    category: 'คำกริยา',
    timeAgo: '30 นาทีที่แล้ว',
    color: '#4caf50'
  },
  {
    id: 3,
    word: 'compromise',
    translation: 'การประนีประนอม',
    category: 'คำนาม',
    timeAgo: '1 ชั่วโมงที่แล้ว',
    color: '#f44336'
  },
  {
    id: 4,
    word: 'distinguish',
    translation: 'แยกแยะ, จำแนก',
    category: 'คำกริยา',
    timeAgo: '2 ชั่วโมงที่แล้ว',
    color: '#4caf50'
  },
  {
    id: 5,
    word: 'magnificent',
    translation: 'ยอดเยี่ยม, สง่างาม',
    category: 'คำคุณศัพท์',
    timeAgo: '3 ชั่วโมงที่แล้ว',
    color: '#3f51b5'
  }
];

const RecentStudiedCards = () => {
  const theme = useTheme();
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconVocabulary size={24} style={{ marginRight: 8 }} />
          <Typography variant="h4">
            คำศัพท์ที่เรียนล่าสุด
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <List sx={{ p: 0 }}>
          {recentCards.map((card) => (
            <RecentItem key={card.id}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 0.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {card.word}
                </Typography>
                <Chip 
                  label={card.category} 
                  size="small" 
                  variant="outlined"
                  sx={{ 
                    height: 20, 
                    fontSize: '0.7rem',
                    bgcolor: `${card.color}20`,
                    color: card.color,
                    borderColor: card.color
                  }}
                />
              </Box>
              <Typography variant="body2" color="textSecondary">
                {card.translation}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <IconClock size={14} style={{ marginRight: 4, color: theme.palette.text.secondary }} />
                <Typography variant="caption" color="textSecondary">
                  {card.timeAgo}
                </Typography>
              </Box>
            </RecentItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecentStudiedCards;