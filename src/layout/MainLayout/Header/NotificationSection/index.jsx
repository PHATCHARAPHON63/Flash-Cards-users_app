import { Box, IconButton, Typography } from '@mui/material';
import { IconBell } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { get_notifications } from 'component/function/notification';
import { useEffect } from 'react';
import { useState } from 'react';
import { PiUserCircleLight } from 'react-icons/pi';
import { show_date_thai } from '../../../../utils/date';
import { useNavigate } from 'react-router';
import { useRef } from 'react';
import { useAuth } from 'contexts/AuthContext';
import { getNotificationStudent } from 'component/function/notification_student';
import { getOnlyTime } from '../../../../utils/date_time';
import { baseUrlWithTokenImg } from 'component/function/global';
import { sliceText } from '../../../../utils/format_text';

const NotificationButton = () => {
  const [openNotification, setOpenNotification] = useState(false);
  const intervalRef = useRef(null);
  const lastPathname = useRef(window.location.pathname);
  const { getUserRole } = useAuth();
  const navigate = useNavigate();

  const userRole = getUserRole(); // output 'admin' or 'student'

  const { data: allNotifications, refetch } = useQuery({
    queryKey: userRole === 'admin' ? ['get_all_notification'] : ['get_all_notification_student'],
    queryFn: async () => {
      if (userRole === 'admin') {
        return await get_notifications();
      }
      if (userRole === 'student') {
        return await getNotificationStudent();
      }
      return null;
    }
  });

  // ฟังก์ชันเรียก refetch และ reset timer
  const callRefetch = () => {
    refetch();
    resetInterval();
  };

  // reset interval function
  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      callRefetch(); // เมื่อถึงเวลา จะเรียก refetch และ reset timer ใหม่
    }, 60000); // <-- 60,000ms = 1 minute
  };

  useEffect(() => {
    // เริ่มครั้งแรก
    callRefetch();

    // ตั้ง interval
    resetInterval();

    const checkPathChange = () => {
      const currentPath = window.location.pathname;
      if (lastPathname.current !== currentPath) {
        lastPathname.current = currentPath;
        callRefetch(); // path เปลี่ยนก็เรียก refetch และ reset timer
        setOpenNotification(false); // ปิด notification
      }
    };

    const pathCheckInterval = setInterval(checkPathChange, 500); // เช็ค path ทุก 0.5 วินาที

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(pathCheckInterval);
    };
  }, []);

  const unreadCount = allNotifications?.reduce((acc, current) => {
    if (current.readed) {
      return acc;
    }
    return acc + 1;
  }, 0);

  const showNotification = allNotifications?.slice(0, 5);

  const toggleNotification = () => {
    setOpenNotification(!openNotification);
  };

  const handleViewAll = () => {
    navigate('/admin/notification/index');
    setOpenNotification(false);
  };

  const onClickSingleNotification = (item) => {
    if (userRole === 'admin') {
      navigate(`/admin/notification/index?notification_id=${item._id}`);
    }
    if (userRole === 'student') {
      navigate(`/student/student_notification?notification_id=${item._id}`);
    }
    setOpenNotification(false);
  };

  return (
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', zIndex: 100 }}>
      <IconButton sx={{ padding: 0 }} onClick={toggleNotification}>
        <IconBell stroke={1.5} size="30px" />
      </IconButton>
      {unreadCount > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '3px',
            right: '3px',
            backgroundColor: 'red',
            width: '13px',
            height: '13px',
            borderRadius: '50%',
            fontSize: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
            color: 'white'
          }}
        >
          {unreadCount}
        </div>
      )}

      {/* List of notification */}
      {openNotification && (
        <Box
          sx={{
            position: 'absolute',
            top: '40px',
            right: '0',
            backgroundColor: '#fff',
            boxShadow: 3,
            borderRadius: 1,
            width: openNotification ? '331px' : 0,
            zIndex: 100,
            transition: 'width 0.3s ease-in-out'
          }}
        >
          <Box sx={{ paddingBottom: '10px' }}>
            {/* header */}
            <Typography
              variant="h6"
              sx={{ padding: '10px', fontWeight: 700, fontSize: '14px', color: '#343a40', borderBottom: '1px solid #ced4da' }}
            >
              การแจ้งเตือน
            </Typography>

            {/* notification list */}
            {showNotification?.length > 0 ? (
              showNotification?.map((item) => {
                switch (userRole) {
                  case 'admin':
                    return (
                      <Box
                        key={item._id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '10px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #ced4da',
                          backgroundColor: item.readed ? '#fff' : 'rgba(101, 196, 182, 0.195)'
                        }}
                        onClick={() => onClickSingleNotification(item)}
                      >
                        {item?.profile_image ? (
                          <img
                            src={`${baseUrlWithTokenImg.defaults.baseURL}/${item?.profile_image}`}
                            alt="user profile image"
                            style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <PiUserCircleLight size={34} color="#868e96" />
                        )}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ marginLeft: '10px', fontSize: '14px', color: '#495057', fontWeight: 400 }}>
                            {item?.full_name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ marginLeft: '10px', fontSize: '12px', color: '#495057', fontWeight: 400 }}>
                              {item?.leave_type?.startsWith('ลา') ? `ลา: ` : ''}
                              {sliceText(item?.description, 20) || ''}
                            </Typography>
                            <Typography variant="body2" sx={{ marginLeft: '10px', fontSize: '12px', color: '#495057', fontWeight: 500 }}>
                              {show_date_thai(item?.updatedAt)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    );
                  case 'student':
                    const fullName = `${item?.student_id?.prefix}${item?.student_id?.first_name} ${item?.student_id?.last_name}`;

                    const getDescription = () => {
                      let text = '';

                      if (item?.date_time_entry && item?.type === 'การมาเรียน') {
                        text = `เวลาเข้าเรียน: ${getOnlyTime(item?.date_time_entry)} น.`;
                      }

                      if (item?.date_time_exit && item?.type === 'การมาเรียน') {
                        text = `เวลาออก: ${getOnlyTime(item?.date_time_exit)} น.`;
                      }
                      return text;
                    };

                    console.log('item', item);

                    return (
                      <Box
                        key={item._id + userRole}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '10px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #ced4da',
                          backgroundColor: item.readed ? '#fff' : 'rgba(101, 196, 182, 0.195)'
                        }}
                        onClick={() => onClickSingleNotification(item)}
                      >
                        {item?.profile_image ? (
                          <img
                            src={`${baseUrlWithTokenImg.defaults.baseURL}/${item?.profile_image}`}
                            alt="user profile image"
                            style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <PiUserCircleLight size={34} color="#868e96" />
                        )}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ marginLeft: '10px', fontSize: '14px', color: '#495057', fontWeight: 400 }}>
                            {fullName}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ marginLeft: '10px', fontSize: '12px', color: '#495057', fontWeight: 400 }}>
                              {getDescription() || ''}
                            </Typography>
                            <Typography variant="body2" sx={{ marginLeft: '10px', fontSize: '12px', color: '#495057', fontWeight: 500 }}>
                              {show_date_thai(item?.createdAt)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    );
                }
              })
            ) : (
              <Typography
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBlock: '20px',
                  borderBottom: '1px solid #ced4da',
                  fontSize: '14px',
                  color: '#868e96',
                  minHeight: '100px'
                }}
              >
                ไม่พบข้อมูล
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }} onClick={handleViewAll}>
            <Typography
              sx={{
                fontWeight: 700,
                padding: '10px',
                paddingBottom: '20px',
                '&:hover': {
                  color: '#868e96'
                }
              }}
            >
              ดูทั้งหมด
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};
export default NotificationButton;
