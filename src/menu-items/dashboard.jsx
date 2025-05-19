import { IconDashboard, IconKey, IconChartLine } from '@tabler/icons-react';
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

import { BsFileEarmarkBarGraph } from 'react-icons/bs';
const FileEarmark = () => <BsFileEarmarkBarGraph />;
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
  ContentPasteIcon
};
// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard/default',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'ยินดีตอนรับ',
      type: 'item',
      url: '/',
      icon: ContentPasteIcon,
      breadcrumbs: false
    }
    //   {
    //     id: 'notification',
    //     title: 'การแจ้งเตือน',
    //     type: 'item',
    //     url: '/notification/index',
    //     icon: NotificationsActiveOutlinedIcon,
    //     breadcrumbs: false
    //   },
    //   {
    //     id: 'request',
    //     title: 'Request',
    //     type: 'collapse',
    //     icon: AssignmentIcon,
    //     children: [
    //       {
    //         id: 'Request1',
    //         title: 'TRequest1',
    //         type: 'item',
    //         url: '/request/tef',
    //         icon: ListAltIcon
    //       },
    //       {
    //         id: 'Request2',
    //         title: 'Request2',
    //         type: 'item',
    //         url: '/request/fei',
    //         icon: ListAltIcon
    //       },
    //       {
    //         id: 'Request3',
    //         title: 'VRequest3',
    //         type: 'item',
    //         url: '/request/veterinarian',
    //         icon: ListAltIcon
    //       }
    //     ]
    //   },

    //   {
    //     id: 'account',
    //     title: 'ข้อมูลส่วนตัว',
    //     type: 'item',
    //     url: '/account/index',
    //     icon: PersonIcon,
    //     breadcrumbs: false
    //   }
  ]
};

export default dashboard;
