import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider, Box, Chip } from '@mui/material';
import { IconBellRinging } from '@tabler/icons-react';
import { styled } from '@mui/material/styles';

// Styled components
const AnnouncementItem = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: theme.spacing(2, 0),
  borderBottom: `1px dashed ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none'
  }
}));

const DateChip = styled(Chip)(({ theme }) => ({
  marginTop: theme.spacing(1),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.dark,
  fontWeight: 500,
  fontSize: '0.75rem'
}));

// ข้อมูลประกาศตัวอย่าง
const announcements = [
  {
    id: 1,
    title: 'กิจกรรมกีฬาสีโรงเรียนประจำปี 2025',
    date: '15 พฤษภาคม 2025',
    preview: 'ขอเชิญนักเรียนทุกคนเข้าร่วมกิจกรรมกีฬาสีประจำปี 2025 ในวันที่ 22-24 พฤษภาคม 2025 ณ สนามกีฬาโรงเรียน'
  },
  {
    id: 2,
    title: 'งดการเรียนการสอนวันที่ 19 พฤษภาคม 2025',
    date: '12 พฤษภาคม 2025',
    preview: 'แจ้งงดการเรียนการสอนในวันที่ 19 พฤษภาคม 2025 เนื่องจากเป็นวันหยุดราชการพิเศษ'
  },
  {
    id: 3,
    title: 'การสอบวัดผลกลางภาคเรียนที่ 1/2025',
    date: '5 พฤษภาคม 2025',
    preview: 'ประกาศตารางสอบวัดผลกลางภาคเรียนที่ 1 ปีการศึกษา 2025 โดยจะจัดสอบในวันที่ 1-5 มิถุนายน 2025'
  }
];

const RecentAnnouncements = () => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconBellRinging size={24} style={{ marginRight: 8 }} />
          <Typography variant="h4">
            ประกาศล่าสุด
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <List sx={{ p: 0 }}>
          {announcements.map((announcement) => (
            <AnnouncementItem key={announcement.id}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {announcement.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 1 }}>
                {announcement.preview}
              </Typography>
              <DateChip 
                size="small" 
                label={announcement.date} 
                icon={<Box component="span" sx={{ fontSize: '8px', mr: 0.5 }}>•</Box>}
              />
            </AnnouncementItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecentAnnouncements;