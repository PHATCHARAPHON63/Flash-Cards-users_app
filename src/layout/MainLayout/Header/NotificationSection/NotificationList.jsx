// import React, { useEffect, useState } from 'react';
// import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
// import { List, Grid, Typography, Box, Paper, CircularProgress, Fade, Chip } from '@mui/material';
// import { Notifications as NotificationsIcon, Person as PersonIcon } from '@mui/icons-material';
// import { Noti_Count_GetById, update_ReadStatus_notification } from 'component/function/auth';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { getSocket } from 'services/socket';

// // กำหนดธีมสำหรับ MUI
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#0E2130'
//     }
//   },
//   typography: {
//     h6: {
//       fontSize: '14px'
//     },
//     body1: {
//       fontSize: '14px'
//     }
//   }
// });

// // สร้าง styled component สำหรับกล่องแจ้งเตือน
// const NotificationBox = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(2),
//   marginBottom: theme.spacing(2),
//   minHeight: 60,
//   cursor: 'pointer',
//   transition: 'all 0.3s ease-in-out',
//   '&:hover': {
//     backgroundColor: theme.palette.action.hover,
//     transform: 'translateY(-3px)',
//     boxShadow: theme.shadows[2]
//   }
// }));

// // สร้าง styled component สำหรับกรณีไม่มีการแจ้งเตือน
// const EmptyNotificationBox = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(3),
//   minHeight: 200,
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'center',
//   alignItems: 'center',
//   backgroundColor: theme.palette.background.default,
//   borderRadius: theme.shape.borderRadius * 2
// }));

// // ฟังก์ชันสำหรับแปลงชื่อเดือนภาษาไทย
// const getThaiMonth = (month) => {
//   const thaiMonths = [
//     'มกราคม',
//     'กุมภาพันธ์',
//     'มีนาคม',
//     'เมษายน',
//     'พฤษภาคม',
//     'มิถุนายน',
//     'กรกฎาคม',
//     'สิงหาคม',
//     'กันยายน',
//     'ตุลาคม',
//     'พฤศจิกายน',
//     'ธันวาคม'
//   ];
//   return thaiMonths[month];
// };

// // ฟังก์ชันสำหรับแปลงวันที่เป็นรูปแบบ "วัน ด ปี DD/MM/YYYY"
// const formatThaiDate = (dateString) => {
//   const date = new Date(dateString);
//   const day = date.getDate().toString().padStart(2, '0');
//   const month = (date.getMonth() + 1).toString().padStart(2, '0');
//   const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
//   const hours = date.getHours().toString().padStart(2, '0');
//   const minutes = date.getMinutes().toString().padStart(2, '0');

//   // รูปแบบ "วัน ด ปี DD/MM/YYYY" และ "เวลา HH:MM น."
//   const formattedDate = `${day}/${month}/${year}`;
//   const formattedTime = `${hours}:${minutes} น.`;

//   return {
//     date: formattedDate,
//     time: formattedTime
//   };
// };

// const NotificationList = ({ onUnreadCountChange }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchNotifications = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setError('กรุณาเข้าสู่ระบบ');
//       return;
//     }

//     try {
//       setLoading(true);
//       const base64Url = token.split('.')[1];
//       const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//       const jsonPayload = decodeURIComponent(
//         atob(base64)
//           .split('')
//           .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
//           .join('')
//       );

//       const tokenPayload = JSON.parse(jsonPayload);
//       const userId = tokenPayload.user.type_id;

//       if (!userId) {
//         setError('ไม่พบข้อมูลผู้ใช้');
//         return;
//       }

//       const response = await Noti_Count_GetById(userId);

//       // อัพเดท unread count ทันทีที่ได้รับ response
//       if (response && typeof response.unreadCount === 'number') {
//         onUnreadCountChange(response.unreadCount);
//       }

//       if (response && response.notifications && Array.isArray(response.notifications)) {
//         const formattedData = response.notifications.map((notification) => {
//           const formattedDateTime = formatThaiDate(notification.created_at);

//           return {
//             id: notification._id,
//             title: notification.title,
//             title_minor: notification.title_minor,
//             description: notification.message,
//             status: notification.message,
//             formattedDate: formattedDateTime.date,
//             formattedTime: formattedDateTime.time,
//             unread: !notification.read_status,
//             type: notification.type,
//             report_id: notification.report_id
//           };
//         });

//         setNotifications(formattedData);
//       } else {
//         setNotifications([]);
//         if (onUnreadCountChange) {
//           onUnreadCountChange(0);
//         }
//       }
//     } catch (err) {
//       console.error('Error fetching notifications:', err);
//       setError('เกิดข้อผิดพลาดในการดึงข้อมูล');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();

//     // เชื่อมต่อ socket
//     const socket = getSocket();

//     // รับข้อมูลเมื่อมีการแจ้งเตือนใหม่
//     socket.on('new_notification', (newNotification) => {
//       // แปลงรูปแบบข้อมูลให้ตรงกับที่ใช้ในคอมโพเนนต์
//       const formattedDateTime = formatThaiDate(newNotification.created_at);

//       const formattedNotification = {
//         id: newNotification._id,
//         title: newNotification.title,
//         title_minor: newNotification.title_minor,
//         description: newNotification.message,
//         status: newNotification.message,
//         formattedDate: formattedDateTime.date,
//         formattedTime: formattedDateTime.time,
//         unread: true,
//         type: newNotification.type,
//         report_id: newNotification.report_id
//       };

//       // เพิ่มการแจ้งเตือนใหม่ไว้ด้านบนสุด
//       setNotifications((prev) => [formattedNotification, ...prev]);
//     });

//     // รับการอัพเดทเมื่อมีการอ่านการแจ้งเตือน
//     socket.on('notification_read', (notificationId) => {
//       setNotifications((prev) => prev.map((item) => (item.id === notificationId ? { ...item, unread: false } : item)));
//     });

//     // Cleanup
//     return () => {
//       socket.off('new_notification');
//       socket.off('notification_read');
//     };
//   }, []);

//   const handleNotificationClick = async (notification) => {
//     try {
//       // อัพเดทสถานะการอ่าน
//       await update_ReadStatus_notification(notification.id);

//       // อัพเดท state ของ notifications
//       setNotifications((prevNotifications) =>
//         prevNotifications.map((item) => (item.id === notification.id ? { ...item, unread: false } : item))
//       );

//       // คำนวณจำนวนการแจ้งเตือนที่ยังไม่ได้อ่านใหม่
//       const updatedUnreadCount = notifications.filter((item) => item.id !== notification.id && item.unread).length;

//       // อัพเดท unread count
//       if (onUnreadCountChange) {
//         onUnreadCountChange(updatedUnreadCount);
//       }

//       // นำทางไปยังหน้าที่เกี่ยวข้อง
//       if (notification.type === 'Follow_happines') {
//         navigate(`/incidentType/happy/follow/${notification.report_id}`);
//       } else if (notification.type === 'View_happines') {
//         navigate(`/incidentType/happy/view/${notification.report_id}`);
//       } else if (notification.type === 'View_safeties') {
//         navigate(`/incidentType/security/view/${notification.report_id}`);
//       } else if (notification.type === 'View_happinesss') {
//         navigate(`/incidentType/happy/view/${notification.report_id}`);
//       } else if (notification.type === 'Follow_safeties') {
//         navigate(`/incidentType/security/follow/${notification.report_id}`);
//       }
//     } catch (error) {
//       console.error('Error handling notification click:', error);
//     }
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
//         <Typography color="error">{error}</Typography>
//       </Box>
//     );
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ width: '100%', maxWidth: 600, minWidth: 300, margin: 'auto', padding: '16px' }}>
//         {notifications.length > 0 ? (
//           <List>
//             {notifications.map((notification, index) => (
//               <Fade in={true} key={notification.id || index}>
//                 <NotificationBox onClick={() => handleNotificationClick(notification)}>
//                   <Grid container spacing={2} alignItems="flex-start">
//                     <Grid item>
//                       <PersonIcon sx={{ color: 'action.active' }} />
//                     </Grid>
//                     <Grid item xs>
//                       <Typography variant="h6" component="div">
//                         {notification.title}
//                       </Typography>
//                       <Typography variant="body1" color="text.secondary">
//                         {notification.description || notification.status}
//                       </Typography>
//                     </Grid>
//                     <Grid item>
//                       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
//                         <Typography variant="caption" color="text.secondary">
//                           {notification.formattedDate}
//                         </Typography>
//                         <Typography variant="caption" color="text.secondary">
//                           {notification.formattedTime}
//                         </Typography>
//                         {notification.unread && <Chip size="small" label="ใหม่" color="primary" sx={{ mt: 1 }} />}
//                       </Box>
//                     </Grid>
//                   </Grid>
//                 </NotificationBox>
//               </Fade>
//             ))}
//           </List>
//         ) : (
//           <EmptyNotificationBox>
//             <NotificationsIcon sx={{ fontSize: 40, color: 'action.active', mb: 2 }} />
//             <Typography variant="body1" color="text.secondary">
//               ไม่มีการแจ้งเตือน
//             </Typography>
//           </EmptyNotificationBox>
//         )}
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default NotificationList;
