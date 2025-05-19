import React from 'react';
import { Card, CardContent, Typography, Box, Divider, LinearProgress, List, ListItem, Chip, Avatar } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { IconTrophy, IconMedal, IconStar, IconAward } from '@tabler/icons-react';

// Styled components
const AchievementItem = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5, 0),
  borderBottom: `1px dashed ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none'
  }
}));

const AchievementAvatar = styled(Avatar)(({ theme, bgcolor }) => ({
  backgroundColor: bgcolor || theme.palette.primary.light,
  width: 40,
  height: 40,
  marginRight: theme.spacing(2)
}));

const ProgressWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(0.5)
}));

// ข้อมูลตัวอย่างสำหรับความสำเร็จต่างๆ
const achievements = [
  {
    id: 1,
    title: 'นักท่องคำศัพท์',
    description: 'ท่องคำศัพท์ครบ 100 คำ',
    progress: 85,
    maxProgress: 100,
    icon: <IconTrophy size={24} />,
    color: '#FFD700',
    achieved: false
  },
  {
    id: 2,
    title: 'มืออาชีพ',
    description: 'จำคำศัพท์ได้ 50 คำ',
    progress: 50,
    maxProgress: 50,
    icon: <IconMedal size={24} />,
    color: '#C0C0C0',
    achieved: true
  },
  {
    id: 3,
    title: 'สายฟ้าแลบ',
    description: 'ท่องคำศัพท์ 10 วันติดต่อกัน',
    progress: 7,
    maxProgress: 10,
    icon: <IconStar size={24} />,
    color: '#4CAF50',
    achieved: false
  },
  {
    id: 4,
    title: 'ผู้เชี่ยวชาญ',
    description: 'ท่องคำศัพท์ครบทุกหมวดหมู่',
    progress: 6,
    maxProgress: 8,
    icon: <IconAward size={24} />,
    color: '#9C27B0',
    achieved: false
  }
];

const AchievementCard = () => {
  const theme = useTheme();

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconTrophy size={24} style={{ marginRight: 8, color: '#FFD700' }} />
          <Typography variant="h4">ความสำเร็จของคุณ</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <List sx={{ p: 0 }}>
          {achievements.map((achievement) => (
            <AchievementItem key={achievement.id}>
              <AchievementAvatar bgcolor={achievement.color}>{achievement.icon}</AchievementAvatar>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {achievement.title}
                  </Typography>
                  {achievement.achieved && <Chip label="สำเร็จแล้ว" size="small" color="success" sx={{ height: 20, fontSize: '0.7rem' }} />}
                </Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {achievement.description}
                </Typography>
                <ProgressWrapper>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="textSecondary">
                      ความก้าวหน้า
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {achievement.progress}/{achievement.maxProgress}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(achievement.progress / achievement.maxProgress) * 100}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: theme.palette.background.neutral || theme.palette.grey[100],
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: achievement.color
                      }
                    }}
                  />
                </ProgressWrapper>
              </Box>
            </AchievementItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default AchievementCard;
