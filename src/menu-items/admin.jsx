import {
  IconDashboard,
  IconKey,
  IconChartLine,
  IconHome,
  IconNews,
  IconCalendarWeek,
  IconReport,
  IconContract,
  IconUserCircle,
  IconSpeakerphone
} from '@tabler/icons-react';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import { IconBellRinging } from '@tabler/icons-react';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import DonutSmallOutlinedIcon from '@mui/icons-material/DonutSmallOutlined';

//คำขอ
import SendIcon from '@mui/icons-material/Send';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BatchPredictionIcon from '@mui/icons-material/BatchPrediction';
import LockIcon from '@mui/icons-material/Lock';
import GroupIcon from '@mui/icons-material/Group';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PersonIcon from '@mui/icons-material/Person';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import CircleIcon from '@mui/icons-material/Circle';

import { IconCalendarTime } from '@tabler/icons-react';

import { BsFileEarmarkBarGraph } from 'react-icons/bs';
import { id } from 'date-fns/locale';
const FileEarmark = () => <BsFileEarmarkBarGraph />;
const iconCalendar = () => <IconCalendarTime />;
// constant
const icons = {
  SendIcon,
  DonutSmallOutlinedIcon,
  IconDashboard,
  IconKey,
  BarChartIcon,
  NotificationsActiveIcon,
  NotificationsActiveOutlinedIcon,
  AccountCircleOutlinedIcon,
  IconChartLine,
  AutoStoriesIcon,
  VolumeUpIcon,
  PersonIcon,
  FileEarmark,
  ContentPasteIcon,
  IconHome,
  IconNews,
  IconCalendarWeek,
  IconReport,
  IconContract,
  IconUserCircle,
  IconSpeakerphone,
  IconCalendarTime
};
// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard/default',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'หน้าหลัก',
      type: 'item',
      url: '/admin/main-menu',
      icon: IconHome,
      breadcrumbs: false
    },
    {
      id: 'agenda',
      title: 'กำหนดการ',
      type: 'item',
      url: '/admin/agenda',
      icon: iconCalendar,
      breadcrumbs: false
    },
    {
      id: 'default2',
      title: 'ระบบทะเบียน',
      type: 'collapse',

      icon: IconNews,
      // breadcrumbs: false
      children: [
        {
          id: 'default2-1',
          title: 'ทะเบียนนักเรียน',
          type: 'item',
          url: '/admin/register/student',
          icon: CircleIcon
        },
        {
          id: 'default2-2',
          title: 'การจัดการระดับชั้น',
          type: 'item',
          url: '/admin/register/class-management',
          icon: CircleIcon
        }
      ]
    },
    {
      id: 'attendance',
      title: 'บันทึกการมาเรียน',
      type: 'item',
      url: '/admin/attendance',
      icon: IconReport,
      breadcrumbs: false
    },
    {
      id: 'leave',
      title: 'ระบบการลา',
      type: 'item',
      url: '/admin/leave',
      icon: IconCalendarWeek,
      breadcrumbs: false
    },
    {
      id: 'default1',
      title: 'ประชาสัมพันธ์',
      type: 'item',
      url: '/admin/press_release',
      icon: IconSpeakerphone,
      breadcrumbs: false
    },
    {
      id: 'notification',
      title: 'การแจ้งเตือน',
      type: 'item',
      url: '/admin/notification/index',
      icon: NotificationsActiveOutlinedIcon,
      breadcrumbs: false
    },
    {
      id: 'account',
      title: 'ข้อมูลส่วนตัว',
      type: 'item',
      url: 'admin/account/index',
      icon: IconUserCircle,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
